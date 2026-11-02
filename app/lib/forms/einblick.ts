import "server-only";

import { createEinblickClient, type EinblickApiError } from "@einblick/sdk";

import {
  normalizePublicForm,
  type PublicForm,
  type SubmitPayload,
} from "./logic";

/**
 * Einblick forms on the server. The API key never leaves this side: the browser
 * talks to `/api/forms/<slug>`, and only the bytes of an upload go straight to
 * Einblick, to a single-use URL.
 *
 * The client is the plain one rather than the generated one: forms are read by
 * a slug only known at runtime and through the native endpoint, not as a CMS
 * collection of the generated schema.
 * `forms` is declared native so the client does not address it as a CMS page.
 */
function getClient() {
  return createEinblickClient({ resourceSourceTypes: { forms: "native" } });
}

const FORM_FIELDS = [
  "title",
  "slug",
  "description",
  "acceptingResponses",
  "collectName",
  "collectEmail",
  "collectPhone",
  "thankYouTitle",
  "thankYouMessage",
  "redirectUrl",
  "questions",
];

export type PublicFormState =
  | { status: "open"; form: PublicForm }
  | { status: "closed" }
  | { status: "unavailable" };

function describeError(error: unknown) {
  const apiError = error as Partial<EinblickApiError>;
  return {
    status: apiError?.status,
    code: apiError?.code,
    message: error instanceof Error ? error.message : String(error),
  };
}

export function logFormError(scope: string, slug: string, error: unknown) {
  console.error(`[forms] ${scope} failed`, { slug, ...describeError(error) });
}

/**
 * The form as it is right now. Questions and the response window change without
 * a deploy, and a stale copy would submit against questions that are gone, so it
 * is never cached. A form that cannot be read (no grant yet, Einblick down) is a
 * state of the page, not an error of it.
 */
export async function getPublicFormState(slug: string): Promise<PublicFormState> {
  try {
    // Without a generated schema the client cannot know `forms` is a collection.
    const response = await getClient().getRecord("forms", slug as never, {
      fields: FORM_FIELDS,
      fetch: { cache: "no-store" },
    });
    const form = normalizePublicForm(
      response.record as {
        id: string;
        slug?: string;
        fields: Record<string, unknown>;
      },
    );
    if (!form) {
      console.error("[forms] definition cannot be answered", { slug });
      return { status: "unavailable" };
    }
    return form.acceptingResponses ? { status: "open", form } : { status: "closed" };
  } catch (error) {
    logFormError("reading the form", slug, error);
    return { status: "unavailable" };
  }
}

export interface PreparedUpload {
  ticket: string;
  uploadUrl: string;
  expiresAt: number;
}

export async function prepareFormUpload(
  slug: string,
  input: { questionId: string; fileName: string; mimeType: string; fileSize: number },
): Promise<PreparedUpload> {
  return getClient().command<Record<string, unknown>, PreparedUpload>(
    "forms.prepareFileUpload",
    { form: slug, ...input },
  );
}

export async function submitForm(
  slug: string,
  payload: SubmitPayload,
  idempotencyKey?: string,
): Promise<{
  submissionId: string;
  thankYouTitle?: string | null;
  thankYouMessage?: string | null;
  redirectUrl?: string | null;
}> {
  return getClient().command(
    "forms.submit",
    { form: slug, language: "de", ...payload },
    idempotencyKey ? { idempotencyKey } : undefined,
  );
}
