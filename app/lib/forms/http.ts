import "server-only";

import { NextResponse } from "next/server";

import { PUBLIC_FORM_SLUGS } from "./logic";

export function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function isPublicFormSlug(slug: string): boolean {
  return PUBLIC_FORM_SLUGS.includes(slug);
}

/** Only this site's own pages may post on the key's behalf. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

/** The JSON body within `maxBytes`, or what to answer instead. */
export async function readJsonBody(
  request: Request,
  maxBytes: number,
): Promise<{ body: unknown } | { response: NextResponse }> {
  const tooLarge = () => ({
    response: json({ error: "Die Anfrage ist zu groß." }, 413),
  });
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) return tooLarge();

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maxBytes) return tooLarge();

  try {
    return { body: JSON.parse(raw) as unknown };
  } catch {
    return { response: json({ error: "Ungültige Anfrage." }, 400) };
  }
}
