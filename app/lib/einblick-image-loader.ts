"use client";

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

  if (!url.searchParams.has("w") && !url.searchParams.has("h")) {
    url.searchParams.set("w", String(Math.round(width)));
  }

  if (quality !== undefined && !url.searchParams.has("q")) {
    url.searchParams.set("q", String(Math.round(quality)));
  }

  if (!url.searchParams.has("fmt")) {
    url.searchParams.set("fmt", "auto");
  }

  return url.toString();
}
