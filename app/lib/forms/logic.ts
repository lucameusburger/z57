/**
 * The contract of a public Einblick form and the pure rules around it: reading
 * a definition, checking answers and building what `forms.submit` takes.
 *
 * The rules mirror Einblick's `lib/forms/answerValidation.ts`, so a visitor
 * reads a problem at the field instead of a failed submission. Einblick still
 * decides on every submission. Pure and free of path aliases, so the browser,
 * the route handlers and the tests all run exactly this.
 */

/** The only forms this site submits to. The API key stays with these. */
export const WINTERMARKT_FORM_SLUG = "wintermarkt-2026-bewerbungsformular";
export const PUBLIC_FORM_SLUGS: readonly string[] = [WINTERMARKT_FORM_SLUG];

/** Einblick's own ceiling for a file answer (`MAX_FILE_SIZE_SHARE_BYTES`). */
export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;
const PATTERN_MAX_INPUT_LENGTH = 5_000;
const MAX_TEXT_ANSWER_LENGTH = 20_000;
const MAX_ANSWERS = 200;
const MAX_TICKETS = 100;

const QUESTION_TYPES = [
  "short_text",
  "long_text",
  "email",
  "phone",
  "number",
  "single_choice",
  "multiple_choice",
  "dropdown",
  "date",
  "time",
  "datetime",
  "rating",
  "linear_scale",
  "boolean",
  "consent",
  "file_upload",
  "statement",
  "divider",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface FormQuestion {
  id: string;
  type: QuestionType;
  label: string;
  description: string | null;
  placeholder: string | null;
  required: boolean;
  displayOrder: number;
  options: QuestionOption[];
  min: number | null;
  max: number | null;
  /** Einblick enforces it; the API does not list it yet, so it may stay null. */
  step: number | null;
  minLength: number | null;
  maxLength: number | null;
  scaleMin: number | null;
  scaleMax: number | null;
  scaleMinLabel: string | null;
  scaleMaxLabel: string | null;
  ratingMax: number | null;
  dateMin: string | null;
  dateMax: string | null;
  acceptedFileTypes: string[] | null;
  maxFileCount: number | null;
  maxFileSizeBytes: number | null;
  content: string | null;
  validationRegex: string | null;
  validationMessage: string | null;
  /** A long text answered in Markdown. Stored as plain text either way. */
  richText: boolean;
}

export interface PublicForm {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  acceptingResponses: boolean;
  collectName: boolean;
  collectEmail: boolean;
  collectPhone: boolean;
  thankYouTitle: string | null;
  thankYouMessage: string | null;
  redirectUrl: string | null;
  questions: FormQuestion[];
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function count(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeQuestion(raw: unknown): FormQuestion | null {
  if (!isRecord(raw)) return null;
  const type = raw.type;
  if (typeof raw.id !== "string" || !QUESTION_TYPES.includes(type as QuestionType)) {
    return null;
  }
  return {
    id: raw.id,
    type: type as QuestionType,
    label: typeof raw.label === "string" ? raw.label : "",
    description: text(raw.description),
    placeholder: text(raw.placeholder),
    required: raw.required === true,
    displayOrder: count(raw.displayOrder) ?? 0,
    options: (Array.isArray(raw.options) ? raw.options : []).flatMap((option) =>
      isRecord(option) &&
      typeof option.value === "string" &&
      // A select item cannot carry an empty value.
      option.value.length > 0
        ? [
            {
              id: String(option.id ?? option.value),
              label: String(option.label ?? option.value),
              value: option.value,
            },
          ]
        : [],
    ),
    min: count(raw.min),
    max: count(raw.max),
    step: count(raw.step),
    minLength: count(raw.minLength),
    maxLength: count(raw.maxLength),
    scaleMin: count(raw.scaleMin),
    scaleMax: count(raw.scaleMax),
    scaleMinLabel: text(raw.scaleMinLabel),
    scaleMaxLabel: text(raw.scaleMaxLabel),
    ratingMax: count(raw.ratingMax),
    dateMin: text(raw.dateMin),
    dateMax: text(raw.dateMax),
    acceptedFileTypes: Array.isArray(raw.acceptedFileTypes)
      ? raw.acceptedFileTypes.filter(
          (entry): entry is string => typeof entry === "string" && entry.length > 0,
        )
      : null,
    maxFileCount: count(raw.maxFileCount),
    maxFileSizeBytes: count(raw.maxFileSizeBytes),
    content: text(raw.content),
    validationRegex: text(raw.validationRegex),
    validationMessage: text(raw.validationMessage),
    richText: raw.richText === true,
  };
}

/**
 * A form record of the `forms` resource, or null when it cannot be answered
 * here: no question list (the key may not read it), or a required question of a
 * type this site does not know, which Einblick would refuse to go without.
 */
export function normalizePublicForm(record: {
  id: string;
  slug?: string;
  fields: Record<string, unknown>;
}): PublicForm | null {
  const { fields } = record;
  if (!Array.isArray(fields.questions)) return null;

  const questions: FormQuestion[] = [];
  for (const raw of fields.questions) {
    const question = normalizeQuestion(raw);
    if (question) questions.push(question);
    else if (isRecord(raw) && raw.required === true) return null;
  }

  return {
    id: record.id,
    slug: record.slug ?? text(fields.slug) ?? "",
    title: text(fields.title) ?? "",
    description: text(fields.description),
    acceptingResponses: fields.acceptingResponses === true,
    collectName: fields.collectName === true,
    collectEmail: fields.collectEmail === true,
    collectPhone: fields.collectPhone === true,
    thankYouTitle: text(fields.thankYouTitle),
    thankYouMessage: text(fields.thankYouMessage),
    redirectUrl: text(fields.redirectUrl),
    questions: questions.sort((a, b) => a.displayOrder - b.displayOrder),
  };
}

export interface UploadedFile {
  ticket: string;
  /** When Einblick stops accepting the ticket, in epoch milliseconds. */
  expiresAt: number | null;
}

/** What a field holds while the form is being filled in. */
export type Draft = string | string[] | number | boolean | UploadedFile[] | null;

export type AnswerValue =
  | { kind: "empty" }
  | { kind: "text"; value: string }
  | { kind: "number"; value: number }
  | { kind: "boolean"; value: boolean }
  | { kind: "choice"; value: string }
  | { kind: "choices"; value: string[] }
  | { kind: "files"; value: string[] };

export interface ContactDraft {
  name: string;
  email: string;
  phone: string;
}

export function isAnswerable(question: Pick<FormQuestion, "type">): boolean {
  return question.type !== "statement" && question.type !== "divider";
}

function asString(draft: Draft | undefined): string {
  return typeof draft === "string" ? draft : "";
}

/** A number as typed; a decimal comma is how people here write one. */
function parseNumberDraft(raw: string): number | null {
  const normalized = raw.trim().replace(",", ".");
  if (normalized === "") return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function uploadedFiles(draft: Draft | undefined): UploadedFile[] {
  return Array.isArray(draft) ? (draft as unknown[]).filter(isUploadedFile) : [];
}

function isUploadedFile(entry: unknown): entry is UploadedFile {
  return isRecord(entry) && typeof entry.ticket === "string";
}

/** The answer a draft stands for, in the shape `forms.submit` takes. */
export function toAnswerValue(
  question: FormQuestion,
  draft: Draft | undefined,
): AnswerValue {
  switch (question.type) {
    case "short_text":
    case "long_text":
    case "email":
    case "phone":
    case "date":
    case "time":
    case "datetime": {
      const value = asString(draft).trim();
      return value ? { kind: "text", value } : { kind: "empty" };
    }
    case "number": {
      const value = parseNumberDraft(asString(draft));
      return value === null ? { kind: "empty" } : { kind: "number", value };
    }
    case "rating":
    case "linear_scale":
      return typeof draft === "number"
        ? { kind: "number", value: draft }
        : { kind: "empty" };
    case "single_choice":
    case "dropdown": {
      const value = asString(draft);
      return value ? { kind: "choice", value } : { kind: "empty" };
    }
    case "multiple_choice": {
      const value = Array.isArray(draft)
        ? (draft as unknown[]).filter((entry): entry is string => typeof entry === "string")
        : [];
      return value.length > 0 ? { kind: "choices", value } : { kind: "empty" };
    }
    case "boolean":
      return typeof draft === "boolean"
        ? { kind: "boolean", value: draft }
        : { kind: "empty" };
    // Consent is stored as text, and Einblick reads "true" as ticked.
    case "consent":
      return draft === true ? { kind: "text", value: "true" } : { kind: "empty" };
    case "file_upload": {
      const value = uploadedFiles(draft).map((file) => file.ticket);
      return value.length > 0 ? { kind: "files", value } : { kind: "empty" };
    }
    case "statement":
    case "divider":
      return { kind: "empty" };
  }
}

const EMAIL_PATTERN = new RegExp(
  [
    "^",
    "[\\p{L}\\p{M}\\p{N}!#$%&'*+/=?^_`{|}~-]+",
    "(?:\\.[\\p{L}\\p{M}\\p{N}!#$%&'*+/=?^_`{|}~-]+)*",
    "@",
    "(?:[\\p{L}\\p{M}\\p{N}](?:[\\p{L}\\p{M}\\p{N}-]*[\\p{L}\\p{M}\\p{N}])?\\.)+",
    "(?:[\\p{L}\\p{M}]{2,}|xn--[a-z0-9-]+)",
    "$",
  ].join(""),
  "iu",
);
const PHONE_PATTERN = /^\+?[\d\s()./-]{5,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return PHONE_PATTERN.test(value.trim());
}

/** Characters as a person counts them, so an emoji is one. */
export function textLength(value: string): number {
  return Array.from(value.trim()).length;
}

function matchesPattern(pattern: string, answer: string): boolean {
  let compiled: RegExp;
  try {
    compiled = new RegExp(`^(?:${pattern})$`, "u");
  } catch {
    // Einblick cannot read it either, so it does not hold the answer against it.
    return true;
  }
  return answer.length <= PATTERN_MAX_INPUT_LENGTH && compiled.test(answer);
}

function formatBound(value: string): string {
  const date = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const time = /(?:^|T)(\d{2}:\d{2})/.exec(value)?.[1];
  const parts = [date ? `${date[3]}.${date[2]}.${date[1]}` : null, time ?? null];
  return parts.filter(Boolean).join(", ") || value;
}

function requiredMessage(type: QuestionType): string {
  switch (type) {
    case "single_choice":
    case "multiple_choice":
    case "dropdown":
    case "rating":
    case "linear_scale":
      return "Bitte wähle eine Antwort aus.";
    case "consent":
    case "boolean":
      return "Bitte bestätige das, um fortzufahren.";
    case "file_upload":
      return "Bitte lade mindestens eine Datei hoch.";
    default:
      return "Bitte fülle dieses Feld aus.";
  }
}

/** What is wrong with one field, in words for the person filling it in. */
export function getQuestionError(
  question: FormQuestion,
  draft: Draft | undefined,
  now: number = Date.now(),
): string | null {
  if (!isAnswerable(question)) return null;

  if (
    question.type === "number" &&
    asString(draft).trim() !== "" &&
    parseNumberDraft(asString(draft)) === null
  ) {
    return "Bitte gib eine gültige Zahl ein.";
  }

  const answer = toAnswerValue(question, draft);
  if (answer.kind === "empty") {
    return question.required ? requiredMessage(question.type) : null;
  }
  // A required switch has to be on, the way a required consent has to be ticked.
  if (question.type === "boolean" && question.required && draft !== true) {
    return requiredMessage(question.type);
  }

  switch (question.type) {
    case "email":
      return isValidEmail(asString(draft))
        ? null
        : "Bitte gib eine gültige E-Mail-Adresse ein.";
    case "phone":
      return isValidPhone(asString(draft))
        ? null
        : "Bitte gib eine gültige Telefonnummer ein.";
    case "short_text":
    case "long_text": {
      const value = asString(draft).trim();
      const length = textLength(value);
      if (question.minLength !== null && length < question.minLength) {
        return `Bitte schreib mindestens ${question.minLength} Zeichen.`;
      }
      if (question.maxLength !== null && length > question.maxLength) {
        return `Bitte schreib höchstens ${question.maxLength} Zeichen.`;
      }
      if (question.validationRegex && !matchesPattern(question.validationRegex, value)) {
        return question.validationMessage ?? "Das Format passt nicht.";
      }
      return null;
    }
    case "date":
    case "time":
    case "datetime": {
      const value = asString(draft).trim();
      if (question.dateMin && value < question.dateMin) {
        return `Der früheste mögliche Wert ist ${formatBound(question.dateMin)}.`;
      }
      if (question.dateMax && value > question.dateMax) {
        return `Der späteste mögliche Wert ist ${formatBound(question.dateMax)}.`;
      }
      return null;
    }
    case "number":
    case "rating":
    case "linear_scale": {
      if (answer.kind !== "number") return null;
      if (question.min !== null && answer.value < question.min) {
        return `Der Wert muss mindestens ${question.min} sein.`;
      }
      if (question.max !== null && answer.value > question.max) {
        return `Der Wert darf höchstens ${question.max} sein.`;
      }
      if (question.type === "number" && question.step && question.step > 0) {
        const steps = (answer.value - (question.min ?? 0)) / question.step;
        if (Math.abs(steps - Math.round(steps)) >= 1e-9) {
          return `Der Wert muss in Schritten von ${question.step} liegen.`;
        }
      }
      return null;
    }
    case "single_choice":
    case "dropdown": {
      const value = asString(draft);
      return question.options.some((option) => option.value === value)
        ? null
        : "Bitte wähle eine der Antworten aus.";
    }
    case "multiple_choice": {
      const allowed = new Set(question.options.map((option) => option.value));
      return answer.kind === "choices" && answer.value.every((value) => allowed.has(value))
        ? null
        : "Bitte wähle nur Antworten aus der Liste aus.";
    }
    case "file_upload": {
      const files = uploadedFiles(draft);
      const limit = question.maxFileCount ?? 1;
      if (files.length > limit) {
        return `Du kannst höchstens ${limit} ${limit === 1 ? "Datei" : "Dateien"} hochladen.`;
      }
      if (files.some((file) => file.expiresAt !== null && file.expiresAt <= now)) {
        return "Dein Upload ist abgelaufen. Bitte entferne die Dateien und lade sie erneut hoch.";
      }
      return null;
    }
    default:
      return null;
  }
}

export const CONTACT_KEYS = {
  name: "contact-name",
  email: "contact-email",
  phone: "contact-phone",
} as const;

/** Every problem in the form, in reading order, keyed by field. */
export function validateForm(
  form: Pick<PublicForm, "collectName" | "collectEmail" | "collectPhone" | "questions">,
  drafts: Record<string, Draft>,
  contact: ContactDraft,
  now: number = Date.now(),
): Map<string, string> {
  const errors = new Map<string, string>();

  if (form.collectName && !contact.name.trim()) {
    errors.set(CONTACT_KEYS.name, "Bitte gib deinen Namen an.");
  }
  if (form.collectEmail) {
    if (!contact.email.trim()) {
      errors.set(CONTACT_KEYS.email, "Bitte gib deine E-Mail-Adresse an.");
    } else if (!isValidEmail(contact.email)) {
      errors.set(CONTACT_KEYS.email, "Bitte gib eine gültige E-Mail-Adresse ein.");
    }
  }
  if (form.collectPhone) {
    if (!contact.phone.trim()) {
      errors.set(CONTACT_KEYS.phone, "Bitte gib deine Telefonnummer an.");
    } else if (!isValidPhone(contact.phone)) {
      errors.set(CONTACT_KEYS.phone, "Bitte gib eine gültige Telefonnummer ein.");
    }
  }

  for (const question of form.questions) {
    const error = getQuestionError(question, drafts[question.id], now);
    if (error) errors.set(question.id, error);
  }
  return errors;
}

export interface SubmitPayload {
  answers: Array<{ questionId: string; value: AnswerValue }>;
  submitterName?: string;
  submitterEmail?: string;
  submitterPhone?: string;
  honeypot?: string;
}

/** The body the browser sends. Empty answers are left out, as Einblick would. */
export function buildSubmitPayload(
  form: Pick<PublicForm, "collectName" | "collectEmail" | "collectPhone" | "questions">,
  drafts: Record<string, Draft>,
  contact: ContactDraft,
  honeypot = "",
): SubmitPayload {
  const answers = form.questions.flatMap((question) => {
    const value = toAnswerValue(question, drafts[question.id]);
    return value.kind === "empty" ? [] : [{ questionId: question.id, value }];
  });

  return {
    answers,
    ...(form.collectName ? { submitterName: contact.name.trim() } : {}),
    ...(form.collectEmail ? { submitterEmail: contact.email.trim() } : {}),
    ...(form.collectPhone ? { submitterPhone: contact.phone.trim() } : {}),
    ...(honeypot ? { honeypot } : {}),
  };
}

function isCleanString(value: unknown, max: number): value is string {
  return typeof value === "string" && value.length <= max;
}

function parseAnswerValue(value: unknown): AnswerValue | null {
  if (!isRecord(value)) return null;
  switch (value.kind) {
    case "text":
      return isCleanString(value.value, MAX_TEXT_ANSWER_LENGTH)
        ? { kind: "text", value: value.value }
        : null;
    case "number":
      return typeof value.value === "number" && Number.isFinite(value.value)
        ? { kind: "number", value: value.value }
        : null;
    case "boolean":
      return typeof value.value === "boolean"
        ? { kind: "boolean", value: value.value }
        : null;
    case "choice":
      return isCleanString(value.value, 1_000)
        ? { kind: "choice", value: value.value }
        : null;
    case "choices":
    case "files": {
      const entries = value.value;
      if (
        !Array.isArray(entries) ||
        entries.length > MAX_TICKETS ||
        !entries.every((entry) => isCleanString(entry, 1_000))
      ) {
        return null;
      }
      return { kind: value.kind, value: entries as string[] };
    }
    default:
      return null;
  }
}

function optionalString(value: unknown, max: number): string | undefined | null {
  if (value === undefined) return undefined;
  return isCleanString(value, max) ? value : null;
}

/** A body from the browser, reduced to what may reach Einblick. Null if invalid. */
export function parseSubmitBody(body: unknown): SubmitPayload | null {
  if (!isRecord(body) || !Array.isArray(body.answers) || body.answers.length > MAX_ANSWERS) {
    return null;
  }

  const answers: SubmitPayload["answers"] = [];
  for (const answer of body.answers) {
    if (!isRecord(answer) || !isCleanString(answer.questionId, 200)) return null;
    const value = parseAnswerValue(answer.value);
    if (!value) return null;
    answers.push({ questionId: answer.questionId, value });
  }

  const submitterName = optionalString(body.submitterName, 200);
  const submitterEmail = optionalString(body.submitterEmail, 320);
  const submitterPhone = optionalString(body.submitterPhone, 50);
  const honeypot = optionalString(body.honeypot, 2_048);
  if (
    submitterName === null ||
    submitterEmail === null ||
    submitterPhone === null ||
    honeypot === null
  ) {
    return null;
  }

  return {
    answers,
    ...(submitterName ? { submitterName } : {}),
    ...(submitterEmail ? { submitterEmail } : {}),
    ...(submitterPhone ? { submitterPhone } : {}),
    ...(honeypot ? { honeypot } : {}),
  };
}

/** The input of `forms.prepareFileUpload`, as far as the browser supplies it. */
export function parseUploadBody(body: unknown): {
  questionId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
} | null {
  if (!isRecord(body)) return null;
  const { questionId, fileName, mimeType, fileSize } = body;
  if (
    !isCleanString(questionId, 200) ||
    questionId.length === 0 ||
    !isCleanString(fileName, 255) ||
    fileName.trim().length === 0 ||
    !isCleanString(mimeType, 255) ||
    mimeType.trim().length === 0 ||
    typeof fileSize !== "number" ||
    !Number.isInteger(fileSize) ||
    fileSize <= 0 ||
    fileSize > MAX_FILE_SIZE_BYTES
  ) {
    return null;
  }
  return { questionId, fileName: fileName.trim(), mimeType: mimeType.trim(), fileSize };
}

/**
 * Whether the browser may be sent to a form's redirect target: this site only.
 * The value comes from an editor, and a stray link would carry people away
 * right after they trusted the site with their data.
 */
export function getSafeRedirectUrl(
  redirectUrl: string | null | undefined,
  siteOrigin: string,
): string | null {
  if (!redirectUrl) return null;
  if (redirectUrl.startsWith("/") && !/^\/[/\\]/.test(redirectUrl)) {
    return redirectUrl;
  }
  try {
    const target = new URL(redirectUrl);
    const site = new URL(siteOrigin);
    const allowedHosts = new Set([site.hostname, "z57.at", "www.z57.at"]);
    const allowedProtocol =
      target.protocol === "https:" || target.origin === site.origin;
    return allowedProtocol && allowedHosts.has(target.hostname) ? target.href : null;
  } catch {
    return null;
  }
}

/** Einblick's own matching of a file against a question's accepted types. */
export function isAcceptedFileType(
  accepted: readonly string[] | null,
  file: { name: string; type: string },
): boolean {
  if (!accepted || accepted.length === 0) return true;
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.trim().toLowerCase().split(";")[0]?.trim() ?? "";

  return accepted.some((entry) => {
    const type = entry.trim().toLowerCase();
    if (!type) return false;
    if (type.startsWith(".")) return fileName.endsWith(type);
    if (!type.includes("/")) return fileName.endsWith(`.${type}`);
    if (type.endsWith("/*")) return mimeType.startsWith(type.slice(0, -1));
    return mimeType === type;
  });
}

/** Accepted types the way a person reads them. */
export function describeAcceptedTypes(accepted: readonly string[]): string {
  const labels: Record<string, string> = {
    "image/*": "Bilder",
    "video/*": "Videos",
    "audio/*": "Audio",
    "application/pdf": "PDF",
  };
  return accepted
    .map((entry) => {
      const type = entry.trim().toLowerCase();
      if (labels[type]) return labels[type];
      if (type.startsWith(".")) return type.slice(1).toUpperCase();
      if (!type.includes("/")) return type.toUpperCase();
      return type.split("/")[1]?.toUpperCase() ?? type;
    })
    .join(", ");
}

/** In binary units, as Einblick's form builder sets the limit: 10 MB is 10 × 1024². */
export function formatFileSize(bytes: number): string {
  const format = (value: number) =>
    new Intl.NumberFormat("de-AT", { maximumFractionDigits: 1 }).format(value);
  if (bytes >= 1024 * 1024) return `${format(bytes / (1024 * 1024))} MB`;
  if (bytes >= 1024) return `${format(bytes / 1024)} KB`;
  return `${bytes} B`;
}

/** The per-file ceiling a question really has. */
export function getMaxFileSize(question: Pick<FormQuestion, "maxFileSizeBytes">): number {
  return Math.min(question.maxFileSizeBytes ?? MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_BYTES);
}

export type MarkdownFormat = "bold" | "italic" | "list" | "link";

/** One toolbar action on a Markdown text: the new text and what to select. */
export function applyMarkdownFormat(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  format: MarkdownFormat,
): { value: string; selectionStart: number; selectionEnd: number } {
  const before = value.slice(0, selectionStart);
  const selected = value.slice(selectionStart, selectionEnd);
  const after = value.slice(selectionEnd);

  if (format === "bold" || format === "italic") {
    const mark = format === "bold" ? "**" : "*";
    const inner = selected || (format === "bold" ? "fett" : "kursiv");
    const start = before.length + mark.length;
    return {
      value: `${before}${mark}${inner}${mark}${after}`,
      selectionStart: start,
      selectionEnd: start + inner.length,
    };
  }

  if (format === "link") {
    const label = selected || "Linktext";
    const url = "https://";
    const start = before.length + label.length + 3;
    return {
      value: `${before}[${label}](${url})${after}`,
      selectionStart: start,
      selectionEnd: start + url.length,
    };
  }

  // A list starts on its own line and marks every selected line.
  const lineStart = before.lastIndexOf("\n") + 1;
  const head = value.slice(0, lineStart);
  const lines = value.slice(lineStart, selectionEnd).split("\n");
  const listed = lines
    .map((line) => (line.startsWith("- ") ? line : `- ${line}`))
    .join("\n");
  const end = head.length + listed.length;
  return { value: `${head}${listed}${after}`, selectionStart: end, selectionEnd: end };
}
