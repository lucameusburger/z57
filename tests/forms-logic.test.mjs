import assert from "node:assert/strict";
import { test } from "node:test";

import {
  applyMarkdownFormat,
  buildSubmitPayload,
  describeAcceptedTypes,
  formatFileSize,
  getQuestionError,
  getSafeRedirectUrl,
  isAcceptedFileType,
  normalizePublicForm,
  parseSubmitBody,
  parseUploadBody,
  toAnswerValue,
  validateForm,
} from "../app/lib/forms/logic.ts";

function question(type, overrides = {}) {
  const [normalized] = normalizePublicForm({
    id: "form",
    fields: {
      questions: [{ id: "q1", type, label: "Frage", ...overrides }],
    },
  }).questions;
  return normalized;
}

const EMPTY_CONTACT = { name: "", email: "", phone: "" };

test("reads a definition in display order and keeps its settings", () => {
  const form = normalizePublicForm({
    id: "form",
    slug: "slug",
    fields: {
      title: "Titel",
      acceptingResponses: true,
      collectName: true,
      questions: [
        { id: "b", type: "long_text", label: "B", displayOrder: 1, richText: true },
        {
          id: "a",
          type: "file_upload",
          label: "A",
          displayOrder: 0,
          required: true,
          maxFileCount: 3,
          maxFileSizeBytes: 10_000_000,
          options: [],
        },
      ],
    },
  });

  assert.deepEqual(
    form.questions.map(({ id }) => id),
    ["a", "b"],
  );
  assert.equal(form.questions[0].maxFileCount, 3);
  assert.equal(form.questions[1].richText, true);
  assert.equal(form.collectName, true);
  assert.equal(form.collectEmail, false);
});

test("a definition this site cannot answer is not a form", () => {
  assert.equal(normalizePublicForm({ id: "form", fields: {} }), null);
  assert.equal(
    normalizePublicForm({
      id: "form",
      fields: { questions: [{ id: "x", type: "hologram", required: true }] },
    }),
    null,
  );
  const optionalUnknown = normalizePublicForm({
    id: "form",
    fields: { questions: [{ id: "x", type: "hologram", required: false }] },
  });
  assert.deepEqual(optionalUnknown.questions, []);
});

test("turns each draft into the answer shape Einblick takes", () => {
  assert.deepEqual(toAnswerValue(question("short_text"), "  Ada "), {
    kind: "text",
    value: "Ada",
  });
  assert.deepEqual(toAnswerValue(question("number"), "1,5"), {
    kind: "number",
    value: 1.5,
  });
  assert.deepEqual(toAnswerValue(question("rating"), 4), { kind: "number", value: 4 });
  assert.deepEqual(toAnswerValue(question("dropdown"), "x"), {
    kind: "choice",
    value: "x",
  });
  assert.deepEqual(toAnswerValue(question("multiple_choice"), ["x", "y"]), {
    kind: "choices",
    value: ["x", "y"],
  });
  assert.deepEqual(toAnswerValue(question("boolean"), false), {
    kind: "boolean",
    value: false,
  });
  assert.deepEqual(toAnswerValue(question("consent"), true), {
    kind: "text",
    value: "true",
  });
  assert.deepEqual(toAnswerValue(question("consent"), false), { kind: "empty" });
  assert.deepEqual(
    toAnswerValue(question("file_upload"), [
      { ticket: "t1", expiresAt: null },
      { ticket: "t2", expiresAt: null },
    ]),
    { kind: "files", value: ["t1", "t2"] },
  );
  assert.deepEqual(toAnswerValue(question("statement"), "x"), { kind: "empty" });
});

test("required questions say so in the words of their type", () => {
  assert.match(
    getQuestionError(question("short_text", { required: true }), ""),
    /fülle/,
  );
  assert.match(
    getQuestionError(question("single_choice", { required: true }), ""),
    /wähle/,
  );
  assert.match(
    getQuestionError(question("file_upload", { required: true }), []),
    /Datei/,
  );
  assert.match(getQuestionError(question("consent", { required: true }), false), /bestätige/);
  // A required switch has to be on, as Einblick insists.
  assert.match(getQuestionError(question("boolean", { required: true }), false), /bestätige/);
  assert.equal(getQuestionError(question("boolean"), false), null);
  assert.equal(getQuestionError(question("short_text"), ""), null);
  assert.equal(getQuestionError(question("statement", { required: true }), ""), null);
});

test("holds answers to the author's rules", () => {
  const text = question("short_text", { minLength: 3, maxLength: 5 });
  assert.match(getQuestionError(text, "ab"), /mindestens 3/);
  assert.match(getQuestionError(text, "abcdef"), /höchstens 5/);
  assert.equal(getQuestionError(text, "abcd"), null);
  // An emoji is one character, the way Einblick counts.
  assert.equal(getQuestionError(question("short_text", { maxLength: 1 }), "😀"), null);

  const pattern = question("short_text", {
    validationRegex: "\\d{4}",
    validationMessage: "Vier Ziffern",
  });
  assert.equal(getQuestionError(pattern, "12345"), "Vier Ziffern");
  assert.equal(getQuestionError(pattern, "1234"), null);
  assert.equal(getQuestionError(question("short_text", { validationRegex: "(" }), "x"), null);

  assert.match(getQuestionError(question("email"), "nope"), /E-Mail/);
  assert.equal(getQuestionError(question("email"), "ada@z57.at"), null);
  assert.match(getQuestionError(question("phone"), "abc"), /Telefon/);
  assert.equal(getQuestionError(question("phone"), "+43 664 1234567"), null);

  const number = question("number", { min: 1, max: 10, step: 2 });
  assert.match(getQuestionError(number, "abc"), /Zahl/);
  assert.match(getQuestionError(number, "0"), /mindestens 1/);
  assert.match(getQuestionError(number, "11"), /höchstens 10/);
  assert.match(getQuestionError(number, "2"), /Schritten/);
  assert.equal(getQuestionError(number, "3"), null);

  const date = question("date", { dateMin: "2026-12-01", dateMax: "2026-12-24" });
  assert.match(getQuestionError(date, "2026-11-30"), /01\.12\.2026/);
  assert.match(getQuestionError(date, "2026-12-25"), /24\.12\.2026/);
  assert.equal(getQuestionError(date, "2026-12-10"), null);

  const choice = question("single_choice", {
    options: [{ id: "o", label: "O", value: "o" }],
  });
  assert.match(getQuestionError(choice, "x"), /wähle/);
  assert.equal(getQuestionError(choice, "o"), null);
});

test("files stay within the limit and the life of their ticket", () => {
  const files = (count, expiresAt = null) =>
    Array.from({ length: count }, (_, index) => ({ ticket: `t${index}`, expiresAt }));

  // Einblick's own default is one file.
  assert.match(getQuestionError(question("file_upload"), files(2)), /höchstens 1 Datei/);
  assert.match(
    getQuestionError(question("file_upload", { maxFileCount: 2 }), files(3)),
    /höchstens 2 Dateien/,
  );
  assert.equal(getQuestionError(question("file_upload", { maxFileCount: 2 }), files(2)), null);

  const q = question("file_upload", { maxFileCount: 2 });
  assert.match(getQuestionError(q, files(1, 1_000), 2_000), /abgelaufen/);
  assert.equal(getQuestionError(q, files(1, 3_000), 2_000), null);
});

test("validates the native contact fields the form asks for", () => {
  const form = {
    collectName: true,
    collectEmail: true,
    collectPhone: true,
    questions: [question("short_text", { required: true })],
  };
  assert.deepEqual(
    [...validateForm(form, {}, EMPTY_CONTACT).keys()],
    ["contact-name", "contact-email", "contact-phone", "q1"],
  );
  assert.deepEqual(
    [
      ...validateForm(
        form,
        { q1: "x" },
        { name: "Ada", email: "nope", phone: "12" },
      ).keys(),
    ],
    ["contact-email", "contact-phone"],
  );
  assert.equal(
    validateForm(
      form,
      { q1: "x" },
      { name: "Ada", email: "ada@z57.at", phone: "+43 664 1234567" },
    ).size,
    0,
  );
  assert.equal(
    validateForm({ ...form, collectName: false, collectEmail: false, collectPhone: false, questions: [] }, {}, EMPTY_CONTACT)
      .size,
    0,
  );
});

test("builds the payload without empty answers or fields the form does not collect", () => {
  const form = {
    collectName: true,
    collectEmail: false,
    collectPhone: false,
    questions: [
      question("short_text"),
      { ...question("long_text"), id: "q2" },
      { ...question("statement"), id: "q3" },
    ],
  };
  assert.deepEqual(
    buildSubmitPayload(form, { q1: "Ada", q2: "  " }, { name: " Ada ", email: "x", phone: "y" }),
    {
      answers: [{ questionId: "q1", value: { kind: "text", value: "Ada" } }],
      submitterName: "Ada",
    },
  );
  assert.equal(buildSubmitPayload(form, {}, EMPTY_CONTACT, "spam").honeypot, "spam");
});

test("the server lets through only what is shaped like an answer", () => {
  const answer = { questionId: "q", value: { kind: "text", value: "x" } };
  assert.deepEqual(parseSubmitBody({ answers: [answer], extra: "dropped", form: "other" }), {
    answers: [answer],
  });
  assert.equal(parseSubmitBody({}), null);
  assert.equal(parseSubmitBody({ answers: "x" }), null);
  assert.equal(parseSubmitBody({ answers: [{ questionId: "q", value: { kind: "json", value: "{}" } }] }), null);
  assert.equal(parseSubmitBody({ answers: [{ questionId: "q", value: { kind: "number", value: "1" } }] }), null);
  assert.equal(
    parseSubmitBody({ answers: [{ questionId: "q", value: { kind: "text", value: "x".repeat(20_001) } }] }),
    null,
  );
  assert.equal(parseSubmitBody({ answers: [], submitterEmail: 5 }), null);
  assert.equal(parseSubmitBody({ answers: [], honeypot: "bot" }).honeypot, "bot");

  const upload = { questionId: "q", fileName: "a.jpg", mimeType: "image/jpeg", fileSize: 10 };
  assert.deepEqual(parseUploadBody(upload), upload);
  assert.equal(parseUploadBody({ ...upload, fileSize: 0 }), null);
  assert.equal(parseUploadBody({ ...upload, fileSize: 1.5 }), null);
  assert.equal(parseUploadBody({ ...upload, fileSize: 101 * 1024 * 1024 }), null);
  assert.equal(parseUploadBody({ ...upload, fileName: " " }), null);
});

test("redirects only within the site", () => {
  const site = "https://www.z57.at";
  assert.equal(getSafeRedirectUrl(null, site), null);
  assert.equal(getSafeRedirectUrl("/danke", site), "/danke");
  assert.equal(getSafeRedirectUrl("https://z57.at/danke", site), "https://z57.at/danke");
  assert.equal(getSafeRedirectUrl("//evil.example", site), null);
  assert.equal(getSafeRedirectUrl("/\\evil.example", site), null);
  assert.equal(getSafeRedirectUrl("https://evil.example/z57.at", site), null);
  assert.equal(getSafeRedirectUrl("javascript:alert(1)", site), null);
  assert.equal(getSafeRedirectUrl("http://z57.at/danke", site), null);
  assert.equal(
    getSafeRedirectUrl("http://localhost:3000/danke", "http://localhost:3000"),
    "http://localhost:3000/danke",
  );
});

test("matches files against accepted types the way Einblick does", () => {
  const image = { name: "Bild.JPG", type: "image/jpeg" };
  assert.equal(isAcceptedFileType(null, image), true);
  assert.equal(isAcceptedFileType([], image), true);
  assert.equal(isAcceptedFileType(["image/*"], image), true);
  assert.equal(isAcceptedFileType(["image/jpeg"], image), true);
  assert.equal(isAcceptedFileType([".jpg"], image), true);
  assert.equal(isAcceptedFileType(["jpg"], image), true);
  assert.equal(isAcceptedFileType(["application/pdf", ".png"], image), false);
  assert.equal(describeAcceptedTypes(["image/*", "application/pdf", ".zip"]), "Bilder, PDF, ZIP");
});

test("writes Markdown around the selection and selects what to edit next", () => {
  assert.deepEqual(applyMarkdownFormat("ein Wort hier", 4, 8, "bold"), {
    value: "ein **Wort** hier",
    selectionStart: 6,
    selectionEnd: 10,
  });
  assert.deepEqual(applyMarkdownFormat("", 0, 0, "italic"), {
    value: "*kursiv*",
    selectionStart: 1,
    selectionEnd: 7,
  });
  const link = applyMarkdownFormat("Wort", 0, 4, "link");
  assert.equal(link.value, "[Wort](https://)");
  assert.equal(link.value.slice(link.selectionStart, link.selectionEnd), "https://");
  assert.equal(applyMarkdownFormat("eins\nzwei\ndrei", 0, 9, "list").value, "- eins\n- zwei\ndrei");
  assert.equal(applyMarkdownFormat("- eins", 0, 6, "list").value, "- eins");
  assert.equal(applyMarkdownFormat("eins\nzwei", 7, 7, "list").value, "eins\n- zwei");
});

test("formatFileSize shows a limit the way the form builder sets it", () => {
  assert.equal(formatFileSize(10 * 1024 * 1024), "10 MB");
  assert.equal(formatFileSize(1536 * 1024), "1,5 MB");
  assert.equal(formatFileSize(40 * 1024), "40 KB");
  assert.equal(formatFileSize(512), "512 B");
});
