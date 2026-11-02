import { EinblickApiError } from "@einblick/sdk";

import { logFormError, prepareFormUpload } from "@/app/lib/forms/einblick";
import {
  isPublicFormSlug,
  isSameOrigin,
  json,
  readJsonBody,
} from "@/app/lib/forms/http";
import { parseUploadBody } from "@/app/lib/forms/logic";

const MAX_REQUEST_BYTES = 4 * 1024;

/**
 * Prepares one file answer: a single-use URL the browser PUTs the file to, so
 * the bytes never pass through this function and its request size limit, and the
 * ticket to send as the question's `files` answer. Einblick checks the question,
 * the size and the type, and that the form is still open.
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

  const input = parseUploadBody(read.body);
  if (!input) {
    return json({ error: "Diese Datei kann nicht hochgeladen werden." }, 400);
  }

  try {
    const prepared = await prepareFormUpload(slug, input);
    return json({
      ticket: prepared.ticket,
      uploadUrl: prepared.uploadUrl,
      expiresAt: prepared.expiresAt,
    });
  } catch (error) {
    logFormError("preparing an upload", slug, error);
    if (!(error instanceof EinblickApiError)) {
      return json({ error: "Der Upload ist derzeit nicht möglich." }, 502);
    }
    if (error.status === 429) {
      return json({ error: "Zu viele Anfragen. Bitte versuche es später erneut." }, 429);
    }
    if (error.status === 401 || error.status === 403 || error.status >= 500) {
      return json({ error: "Der Upload ist derzeit nicht möglich." }, 502);
    }
    return json(
      { error: "Diese Datei kann nicht hochgeladen werden (Dateityp oder Größe)." },
      400,
    );
  }
}

export const dynamic = "force-dynamic";
