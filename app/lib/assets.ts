import type { EinblickAsset } from "@einblick/sdk";

type EinblickImageTransform = {
  width?: number;
  height?: number;
  fit?: "contain" | "cover" | "fill" | "scale-down" | "crop" | "pad";
  quality?: number;
  format?: "auto" | "webp" | "avif" | "jpeg" | "png";
};

type AssetWithTransforms = EinblickAsset & {
  transforms?: Record<string, EinblickImageTransform>;
};

export function getEinblickAssetUrl(
  asset: EinblickAsset | null | undefined,
  preset = "default"
): string | null {
  if (!asset?.url) {
    return null;
  }

  const transform = (asset as AssetWithTransforms).transforms?.[preset];
  if (!transform) {
    return asset.url;
  }

  const url = new URL(asset.url);
  if (transform.width !== undefined) {
    url.searchParams.set("w", String(Math.round(transform.width)));
  }
  if (transform.height !== undefined) {
    url.searchParams.set("h", String(Math.round(transform.height)));
  }
  if (transform.fit) {
    url.searchParams.set("fit", transform.fit);
  }
  if (transform.quality !== undefined) {
    url.searchParams.set("q", String(Math.round(transform.quality)));
  }
  if (transform.format) {
    url.searchParams.set("fmt", transform.format);
  }

  return url.toString();
}
