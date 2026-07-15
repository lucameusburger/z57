import {
  getEinblickAssetCdnUrl,
  getEinblickAssetOgUrl,
  type EinblickAsset,
} from "@einblick/sdk";

export function getEinblickAssetUrl(
  asset: EinblickAsset | null | undefined,
): string | null {
  const url = getEinblickAssetCdnUrl(asset, {
    format: "auto",
    quality: 78,
  });
  return url || null;
}

export function getEinblickOpenGraphImageUrl(
  asset: EinblickAsset | null | undefined,
): string | null {
  const url = getEinblickAssetOgUrl(asset);
  return url || null;
}
