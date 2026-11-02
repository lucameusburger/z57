/**
 * The browser's half of a file answer: our route prepares a single-use URL with
 * the server-only key, then the bytes go straight to Einblick as a raw PUT with
 * the prepared content type and no credentials.
 *
 * XMLHttpRequest rather than fetch because fetch cannot report upload progress.
 */

export interface PreparedUpload {
  ticket: string;
  uploadUrl: string;
  expiresAt: number | null;
}

export function fileMimeType(file: File): string {
  return file.type || "application/octet-stream";
}

export async function prepareUpload(
  slug: string,
  questionId: string,
  file: File,
  signal: AbortSignal,
): Promise<PreparedUpload> {
  const response = await fetch(`/api/forms/${encodeURIComponent(slug)}/uploads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionId,
      fileName: file.name,
      mimeType: fileMimeType(file),
      fileSize: file.size,
    }),
    signal,
  });
  const body = (await response.json().catch(() => null)) as {
    ticket?: string;
    uploadUrl?: string;
    expiresAt?: number;
    error?: string;
  } | null;
  if (!response.ok || !body?.ticket || !body.uploadUrl) {
    throw new Error(body?.error || "Der Upload ist fehlgeschlagen.");
  }
  return {
    ticket: body.ticket,
    uploadUrl: body.uploadUrl,
    expiresAt: body.expiresAt ?? null,
  };
}

export function putFile(
  uploadUrl: string,
  file: File,
  onProgress: (fraction: number) => void,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const abort = () => request.abort();

    request.open("PUT", uploadUrl);
    request.withCredentials = false;
    request.setRequestHeader("Content-Type", fileMimeType(file));
    request.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress(event.loaded / event.total);
      }
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
      } else if (request.status === 413 || request.status === 415) {
        reject(new Error("Die Datei ist zu groß oder hat einen nicht erlaubten Dateityp."));
      } else {
        reject(new Error("Der Upload ist fehlgeschlagen."));
      }
    };
    request.onerror = () => reject(new Error("Der Upload ist fehlgeschlagen."));
    request.onabort = () => reject(new DOMException("Aborted", "AbortError"));

    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    signal.addEventListener("abort", abort, { once: true });
    request.send(file);
  });
}
