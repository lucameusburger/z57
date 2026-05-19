import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { getEinblickCmsTags } from "@/app/lib/einblick-cache";

const revalidateTagImmediately = revalidateTag as (
  tag: string,
  profile: { expire: 0 }
) => void;

export async function POST(request: Request) {
  const secret = process.env.EINBLICK_REVALIDATE_SECRET;
  const providedSecret =
    request.headers.get("x-einblick-revalidate-secret") ??
    new URL(request.url).searchParams.get("secret");

  if (secret && providedSecret !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let resourceSlug: string | undefined;

  try {
    const body = (await request.json()) as {
      resourceSlug?: string;
    };
    resourceSlug = body.resourceSlug;
  } catch {}

  const tags = getEinblickCmsTags(resourceSlug);
  for (const tag of tags) {
    revalidateTagImmediately(tag, { expire: 0 });
  }

  return NextResponse.json({
    ok: true,
    tags,
  });
}
