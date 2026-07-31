"use client";

import { getEinblickAssetUrl } from "@einblick/sdk";

type LoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function einblickImageLoader({
  src,
  width,
  quality,
}: LoaderProps): string {
  if (!/^https?:\/\//.test(src)) {
    return src;
  }

  const url = new URL(src);

  // Build the URL through the SDK rather than setting the parameters by hand,
  // so requested sizes are snapped onto the dimensions Einblick actually
  // delivers. Two nearby widths then resolve to one URL and bill one
  // transformation instead of two.
  const transformed = getEinblickAssetUrl(
    { url: url.toString() },
    {
      ...(!url.searchParams.has("w") && !url.searchParams.has("h")
        ? { width }
        : {}),
      ...(quality !== undefined && !url.searchParams.has("q")
        ? { quality }
        : {}),
      ...(!url.searchParams.has("fmt") ? { format: "auto" as const } : {}),
    },
  );

  return transformed ?? src;
}
