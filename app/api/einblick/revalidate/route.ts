import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { getEinblickCmsTags } from "@/app/lib/einblick-cache";

export async function POST(request: Request) {
  let resourceSlug: string | undefined;

  try {
    const body = (await request.json()) as {
      resourceSlug?: string;
    };
    resourceSlug = body.resourceSlug;
  } catch {}

  const tags = getEinblickCmsTags(resourceSlug);
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({
    ok: true,
    tags,
  });
}
