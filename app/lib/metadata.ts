import type { Metadata } from "next";

import ogImage from "@/app/og.png";

/** The canonical host: z57.at redirects here. */
export const SITE_URL = "https://www.z57.at";
export const SITE_NAME = "z57";
export const SITE_TITLE = "z57 – Atelier & Studio Space in Wien";
export const SITE_DESCRIPTION =
  "z57 ist ein Atelier und Studio Space in Wien für Grafik, Nailart, Architektur, Webentwicklung, Fotografie und Design, mit Ausstellungen, Workshops und Co-Working.";

const MAX_DESCRIPTION_LENGTH = 160;

export const DEFAULT_OG_IMAGE = {
  url: ogImage.src,
  width: ogImage.width,
  height: ogImage.height,
  type: "image/png",
  alt: "z57 – Atelier & Studio Space Vienna",
};

interface PageMetadataOptions {
  /** Left out on the home page, which uses the site title as it is. */
  title?: string;
  description?: string;
  path: string;
  image?: { url: string; width: number; height: number; alt: string };
  article?: { publishedTime?: string; modifiedTime?: string; tags?: string[] };
  noIndex?: boolean;
}

export function absoluteUrl(path: string) {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

export function toIsoDate(value: string | number | undefined) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** CMS text can span lines and run long; result snippets want one short line. */
function toDescription(text: string | undefined) {
  const clean = text?.replace(/\s+/g, " ").trim();
  if (!clean) return SITE_DESCRIPTION;
  if (clean.length <= MAX_DESCRIPTION_LENGTH) return clean;
  return `${clean.slice(0, MAX_DESCRIPTION_LENGTH - 1).replace(/\s+\S*$/, "")}…`;
}

/**
 * Next replaces a parent's `openGraph` as a whole instead of merging it, so
 * every page states all of it here. Twitter tags are filled in from these.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  article,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const resolvedDescription = toDescription(description);

  return {
    ...(title ? { title } : {}),
    description: resolvedDescription,
    alternates: { canonical: path },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: title ?? SITE_TITLE,
      description: resolvedDescription,
      url: path,
      siteName: SITE_NAME,
      locale: "de_AT",
      images: [image],
      ...(article ? { type: "article", ...article } : { type: "website" }),
    },
  };
}
