import { EinblickApiError } from "@einblick/sdk";

import {
  getPublicFormState,
  logFormError,
  submitForm,
} from "@/app/lib/forms/einblick";
import {
  isPublicFormSlug,
  isSameOrigin,
  json,
  readJsonBody,
} from "@/app/lib/forms/http";
import { parseSubmitBody } from "@/app/lib/forms/logic";

const MAX_REQUEST_BYTES = 256 * 1024;
const IDEMPOTENCY_KEY_PATTERN = /^[\w-]{8,128}$/;

/**
 * Submits a form on behalf of the browser, so the API key stays on the server.
 * Einblick decides whether the answers hold; this only keeps out what is not
 * shaped like an answer and puts a refusal into words.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (!isPublicFormSlug(slug)) {
    return json({ error: "Dieses Formular gibt es nicht." }, 404);
  }
  if (!isSameOrigin(request)) {
    return json({ error: "Diese Anfrage ist nicht erlaubt." }, 403);
  }

  const read = await readJsonBody(request, MAX_REQUEST_BYTES);
  if ("response" in read) return read.response;

  const payload = parseSubmitBody(read.body);
  if (!payload) {
    return json({ error: "Bitte überprüfe deine Eingaben." }, 400);
  }

  const headerKey = request.headers.get("idempotency-key");
  const idempotencyKey =
    headerKey && IDEMPOTENCY_KEY_PATTERN.test(headerKey) ? headerKey : undefined;

  try {
    const result = await submitForm(slug, payload, idempotencyKey);
    return json({
      success: true,
      thankYouTitle: result.thankYouTitle ?? null,
      thankYouMessage: result.thankYouMessage ?? null,
      redirectUrl: result.redirectUrl ?? null,
    });
  } catch (error) {
    logFormError("submitting", slug, error);
    if (!(error instanceof EinblickApiError)) {
      return json({ error: "Die Einsendung ist derzeit nicht möglich." }, 502);
    }
    if (error.status === 429) {
      return json({ error: "Zu viele Anfragen. Bitte versuche es später erneut." }, 429);
    }
    if (error.status === 401 || error.status === 403 || error.status >= 500) {
      return json({ error: "Die Einsendung ist derzeit nicht möglich." }, 502);
    }
    // The refusal does not say why in words a visitor could use: the form may
    // have closed since the page loaded, or the answers did not hold.
    const state = await getPublicFormState(slug);
    if (state.status !== "open") {
      return json({ error: "Dieses Formular nimmt derzeit keine Einsendungen an." }, 409);
    }
    return json(
      {
        error:
          "Deine Einsendung konnte nicht gespeichert werden. Bitte überprüfe deine Eingaben. Falls du Dateien hochgeladen hast, lade sie bitte erneut hoch.",
      },
      400,
    );
  }
}

export const dynamic = "force-dynamic";
