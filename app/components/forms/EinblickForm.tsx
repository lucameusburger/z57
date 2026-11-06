"use client";

import { AlertCircle, MoveRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  buildSubmitPayload,
  CONTACT_KEYS,
  getQuestionError,
  getSafeRedirectUrl,
  isValidEmail,
  isValidPhone,
  validateForm,
  type ContactDraft,
  type Draft,
  type FormQuestion,
  type PublicForm,
  type UploadedFile,
} from "@/app/lib/forms/logic";
import { cn } from "@/lib/utils";

import QuestionControl from "./QuestionControl";

export interface EinblickFormCopy {
  requiredHint: string;
  submitLabel: string;
  privacyNote: string;
  thankYouTitle: string;
  thankYouMessage: string;
}

const GENERIC_ERROR =
  "Das hat leider nicht geklappt. Bitte versuche es gleich noch einmal.";

/** A dropdown's focus moves into its popup, which is not leaving the field. */
function validatesOnBlur(question: FormQuestion) {
  return question.type !== "dropdown" && question.type !== "file_upload";
}

/** Has a group label rather than a single control to point `htmlFor` at. */
function isGroupQuestion(question: FormQuestion) {
  return (
    question.type === "single_choice" ||
    question.type === "multiple_choice" ||
    question.type === "rating" ||
    question.type === "linear_scale"
  );
}

function focusField(key: string) {
  const row = document.getElementById(`field-${key}`);
  const control = row?.querySelector<HTMLElement>(
    '[role="radio"],[role="checkbox"],[role="switch"],[role="combobox"],input:not([aria-hidden="true"]):not([tabindex="-1"]),textarea',
  );
  control?.focus();
}

/** One line of the form: its label beside its control, stacked on a phone. */
function FieldRow({
  fieldKey,
  label,
  labelId,
  htmlFor,
  required,
  description,
  descriptionId,
  error,
  errorId,
  onBlur,
  children,
}: {
  fieldKey: string;
  label: string;
  labelId: string;
  htmlFor?: string;
  required: boolean;
  description?: string | null;
  descriptionId: string;
  error?: string;
  errorId: string;
  onBlur?: () => void;
  children: ReactNode;
}) {
  const labelContent = (
    <>
      {label}
      {required ? (
        <>
          <span aria-hidden="true"> *</span>
          <span className="sr-only"> (Pflichtfeld)</span>
        </>
      ) : null}
    </>
  );

  return (
    <div
      id={`field-${fieldKey}`}
      className="-mr-px grid md:grid-cols-4"
      onBlur={(event) => {
        // Moving between the options of one question is not leaving it.
        if (onBlur && !event.currentTarget.contains(event.relatedTarget)) onBlur();
      }}
    >
      <div className="min-w-0 px-4 pt-5 md:px-7 md:py-7">
        {htmlFor ? (
          <Label id={labelId} htmlFor={htmlFor}>
            {labelContent}
          </Label>
        ) : (
          <span id={labelId} className="text-sub block">
            {labelContent}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-col px-4 pb-6 pt-3 md:col-span-3 md:px-7 md:py-7">
        <div className="flex max-w-2xl flex-col gap-2">
          {description ? (
            <p id={descriptionId} className="whitespace-pre-line">
              {description}
            </p>
          ) : null}
          <div>{children}</div>
          {error ? (
            <p id={errorId} className="flex items-start gap-1.5 text-error">
              <AlertCircle className="mt-1 h-4 w-4 flex-none" aria-hidden="true" />
              <span>{error}</span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function describedBy(...ids: Array<string | false | null | undefined>) {
  return ids.filter(Boolean).join(" ") || undefined;
}

/**
 * A form rendered from its live definition, so a question added in Einblick
 * shows up here without a deploy. Answers go to this site's route handler, which
 * holds the key; only upload bytes go straight to Einblick.
 */
export default function EinblickForm({
  form,
  copy,
}: {
  form: PublicForm;
  copy: EinblickFormCopy;
}) {
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [contact, setContact] = useState<ContactDraft>({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [summary, setSummary] = useState<string[]>([]);
  const [busyUploads, setBusyUploads] = useState<ReadonlySet<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [done, setDone] = useState<{ title: string; message: string } | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const attemptRef = useRef<{ body: string; key?: string } | null>(null);
  const doneHeadingRef = useRef<HTMLHeadingElement>(null);

  const uploading = busyUploads.size > 0;
  const blocked = uploading || submitting;

  const announce = useCallback((message: string) => setStatus(message), []);

  useEffect(() => {
    if (done) doneHeadingRef.current?.focus();
  }, [done]);

  const setFieldError = (key: string, error: string | null) => {
    setErrors((current) => {
      if ((current.get(key) ?? null) === error) return current;
      const next = new Map(current);
      if (error) next.set(key, error);
      else next.delete(key);
      return next;
    });
  };

  const updateDraft = (question: FormQuestion, draft: Draft) => {
    setDrafts((current) => ({ ...current, [question.id]: draft }));
    setSubmitError(null);
    // Once flagged, a field clears as soon as it is right. A dropdown has no
    // blur worth waiting for, so it answers straight away.
    if (errors.has(question.id) || question.type === "dropdown") {
      setFieldError(question.id, getQuestionError(question, draft));
    }
  };

  const updateContact = (field: keyof ContactDraft, value: string) => {
    const next = { ...contact, [field]: value };
    setContact(next);
    setSubmitError(null);
    const key = CONTACT_KEYS[field];
    if (errors.has(key)) {
      setFieldError(key, validateForm(form, drafts, next).get(key) ?? null);
    }
  };

  const fieldLabel = (key: string) => {
    if (key === CONTACT_KEYS.name) return "Name";
    if (key === CONTACT_KEYS.email) return "E-Mail";
    if (key === CONTACT_KEYS.phone) return "Telefon";
    return form.questions.find((question) => question.id === key)?.label ?? key;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    if (uploading) {
      setStatus("Bitte warte, bis deine Dateien hochgeladen sind.");
      return;
    }

    const nextErrors = validateForm(form, drafts, contact);
    setErrors(nextErrors);
    setSubmitError(null);
    if (nextErrors.size > 0) {
      const keys = [...nextErrors.keys()];
      setSummary(keys);
      setStatus("");
      focusField(keys[0]);
      return;
    }
    setSummary([]);

    const body = JSON.stringify(
      buildSubmitPayload(form, drafts, contact, honeypotRef.current?.value ?? ""),
    );
    // A retry of the same answers keeps its key, so a lost response cannot store
    // an application twice. Changed answers are a new attempt.
    if (attemptRef.current?.body !== body) {
      attemptRef.current = { body, key: globalThis.crypto?.randomUUID?.() };
    }
    const idempotencyKey = attemptRef.current.key;

    setSubmitting(true);
    setStatus("Deine Bewerbung wird gesendet …");
    try {
      const response = await fetch(`/api/forms/${encodeURIComponent(form.slug)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
        },
        body,
      });
      const result = (await response.json().catch(() => null)) as {
        success?: boolean;
        thankYouTitle?: string | null;
        thankYouMessage?: string | null;
        redirectUrl?: string | null;
        error?: string;
      } | null;

      if (!response.ok || !result?.success) {
        setSubmitError(result?.error || GENERIC_ERROR);
        setStatus("");
        return;
      }

      const redirect = getSafeRedirectUrl(result.redirectUrl, window.location.origin);
      if (redirect) {
        window.location.assign(redirect);
        return;
      }
      setStatus("");
      setDone({
        title: result.thankYouTitle || form.thankYouTitle || copy.thankYouTitle,
        message: result.thankYouMessage || form.thankYouMessage || copy.thankYouMessage,
      });
    } catch {
      setSubmitError(GENERIC_ERROR);
      setStatus("");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="border-b bg-lime px-4 py-10 md:px-7 md:py-16">
        <h2 ref={doneHeadingRef} tabIndex={-1} className="text-lead outline-none">
          {done.title}
        </h2>
        <p className="mt-4 max-w-2xl whitespace-pre-line">{done.message}</p>
      </div>
    );
  }

  const contactField = (
    field: keyof ContactDraft,
    label: string,
    inputProps: { type: string; autoComplete: string; inputMode?: "email" | "tel" },
  ) => {
    const key = CONTACT_KEYS[field];
    const error = errors.get(key);
    return (
      <FieldRow
        fieldKey={key}
        label={label}
        labelId={`${key}-label`}
        htmlFor={key}
        required
        descriptionId={`${key}-description`}
        error={error}
        errorId={`${key}-error`}
        onBlur={() => {
          const value = contact[field].trim();
          if (!value) return;
          if (field === "email" && !isValidEmail(value)) {
            setFieldError(key, "Bitte gib eine gültige E-Mail-Adresse ein.");
          } else if (field === "phone" && !isValidPhone(value)) {
            setFieldError(key, "Bitte gib eine gültige Telefonnummer ein.");
          }
        }}
      >
        <Input
          id={key}
          name={field}
          value={contact[field]}
          required
          aria-required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${key}-error` : undefined}
          onChange={(event) => updateContact(field, event.target.value)}
          {...inputProps}
        />
      </FieldRow>
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label={form.title || undefined}>
      {form.description ? (
        <p className="whitespace-pre-line border-b px-4 py-5 md:px-7 md:py-7">
          {form.description}
        </p>
      ) : null}

      <p className="px-4 py-3 text-sm md:px-7">{copy.requiredHint}</p>

      {form.collectName ? contactField("name", "Name", { type: "text", autoComplete: "name" }) : null}
      {form.collectEmail
        ? contactField("email", "E-Mail", { type: "email", autoComplete: "email", inputMode: "email" })
        : null}
      {form.collectPhone
        ? contactField("phone", "Telefon", { type: "tel", autoComplete: "tel", inputMode: "tel" })
        : null}

      {form.questions.map((question) => {
        if (question.type === "divider") {
          return (
            <div
              key={question.id}
              role="separator"
              className="h-4 border-y bg-lime md:h-6"
            />
          );
        }
        if (question.type === "statement") {
          return (
            <div key={question.id} className="border-y bg-lime/30 px-4 py-6 md:px-7 md:py-8">
              {question.label ? <h2 className="text-sub">{question.label}</h2> : null}
              {question.content || question.description ? (
                <p className="mt-2 max-w-3xl whitespace-pre-line">
                  {question.content ?? question.description}
                </p>
              ) : null}
            </div>
          );
        }

        const error = errors.get(question.id);
        const control = `q-${question.id}`;
        const labelId = `${control}-label`;
        const descriptionId = `${control}-description`;
        const errorId = `${control}-error`;

        return (
          <FieldRow
            key={question.id}
            fieldKey={question.id}
            label={question.label}
            labelId={labelId}
            htmlFor={isGroupQuestion(question) ? undefined : control}
            required={question.required}
            description={question.description}
            descriptionId={descriptionId}
            error={error}
            errorId={errorId}
            onBlur={
              validatesOnBlur(question)
                ? () => {
                    // An untouched field is not wrong yet; submitting says so.
                    const draft = drafts[question.id];
                    if (draft === undefined || draft === "") return;
                    setFieldError(question.id, getQuestionError(question, draft));
                  }
                : undefined
            }
          >
            <QuestionControl
              slug={form.slug}
              question={question}
              ids={{
                control,
                label: labelId,
                describedBy: describedBy(
                  question.description && descriptionId,
                  error && errorId,
                ),
              }}
              draft={drafts[question.id]}
              invalid={Boolean(error)}
              onChange={(draft) => updateDraft(question, draft)}
              onFilesChange={(files: UploadedFile[]) => updateDraft(question, files)}
              onBusyChange={(busy) => {
                // "Please upload a file" is wrong while one is on its way.
                if (busy) setFieldError(question.id, null);
                setBusyUploads((current) => {
                  if (current.has(question.id) === busy) return current;
                  const next = new Set(current);
                  if (busy) next.add(question.id);
                  else next.delete(question.id);
                  return next;
                });
              }}
              announce={announce}
            />
          </FieldRow>
        );
      })}

      {/* Empty for people; a value means a bot filled every input it could find. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="z57-leave-empty">Dieses Feld bitte leer lassen</label>
        <input
          ref={honeypotRef}
          id="z57-leave-empty"
          name="z57_leave_empty"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="cells border-t md:grid-cols-4">
        <div className="flex flex-col gap-2 px-4 py-5 text-sm md:px-7 md:py-7">
          <p>{copy.privacyNote}</p>
          <Link href="/datenschutz" className="form-focus underline underline-offset-4">
            Datenschutz
          </Link>
        </div>
        <div className="flex flex-col gap-4 bg-lime px-4 py-5 md:col-span-3 md:px-7 md:py-7">
          {summary.length > 0 && errors.size > 0 ? (
            <div role="alert" className="max-w-2xl border border-error bg-background p-4">
              <p className="flex items-center gap-1.5 font-medium text-error">
                <AlertCircle className="h-4 w-4 flex-none" aria-hidden="true" />
                {errors.size === 1
                  ? "Bitte prüfe dieses Feld:"
                  : `Bitte prüfe diese ${errors.size} Felder:`}
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {summary
                  .filter((key) => errors.has(key))
                  .map((key) => (
                    <li key={key}>
                      <a
                        href={`#field-${key}`}
                        className="form-focus underline underline-offset-4"
                        onClick={(event) => {
                          event.preventDefault();
                          focusField(key);
                        }}
                      >
                        {fieldLabel(key)}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}

          {submitError ? (
            <p role="alert" className="flex max-w-2xl items-start gap-1.5 border border-error bg-background p-4 text-error">
              <AlertCircle className="mt-1 h-4 w-4 flex-none" aria-hidden="true" />
              <span>{submitError}</span>
            </p>
          ) : null}

          <button
            type="submit"
            aria-disabled={blocked || undefined}
            aria-describedby={uploading ? "form-busy-hint" : undefined}
            className={cn(
              "form-focus text-sub flex min-h-14 w-full items-center justify-between gap-4 border border-foreground bg-foreground px-4 py-3 text-left text-background transition-colors md:max-w-md md:px-5",
              blocked ? "cursor-not-allowed opacity-60" : "hover:bg-lime hover:text-foreground",
            )}
          >
            <span>{submitting ? "Wird gesendet …" : copy.submitLabel}</span>
            <MoveRight className="h-5 w-5 flex-none" aria-hidden="true" />
          </button>

          {uploading ? (
            <p id="form-busy-hint">Bitte warte, bis deine Dateien hochgeladen sind.</p>
          ) : null}
        </div>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>
    </form>
  );
}
