import "server-only";

import { cache } from "react";

import { getCmsInfos, type CmsInfosFields } from "@/app/lib/cms";
import {
  createEditableBinding,
  type EinblickEditableBinding,
} from "@einblick/sdk/react";

const DEFAULT_SITE_INFOS = {
  email: "atelier@z57.at",
  instagram: "https://www.instagram.com/z57.at/",
  website: "https://z57.at",
} as const;

export type SiteInfos = {
  email?: string;
  emailHref?: string;
  instagram?: string;
  instagramHref?: string;
  instagramLabel?: string;
  website?: string;
  websiteHref?: string;
  websiteLabel?: string;
  bindings: {
    email?: EinblickEditableBinding<string>;
    instagram?: EinblickEditableBinding<string>;
    website?: EinblickEditableBinding<string>;
  };
};

function createInfoBinding(
  recordId: string | undefined,
  fieldKey: "email" | "instagram" | "website",
  label: string,
  value: string | undefined,
): EinblickEditableBinding<string> | undefined {
  if (!recordId || value === undefined) {
    return undefined;
  }

  return createEditableBinding({
    resourceSlug: "infos",
    recordId,
    fieldKey,
    fieldType: "string",
    label,
    value,
  });
}

function normalizeEmail(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function normalizeUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("#")
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function normalizeInstagramUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith("@")) {
    return `https://www.instagram.com/${trimmed.slice(1)}/`;
  }

  if (trimmed.includes("instagram.com")) {
    return normalizeUrl(trimmed);
  }

  return `https://www.instagram.com/${trimmed.replace(/^\/+/, "").replace(/\/+$/, "")}/`;
}

function getHostLabel(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);
    return url.host.replace(/^www\./, "");
  } catch {
    return value;
  }
}

function getInstagramLabel(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);
    const handle = url.pathname.split("/").filter(Boolean)[0];
    return handle || "Instagram";
  } catch {
    return value.replace(/^@/, "") || "Instagram";
  }
}

function mapCmsInfos(record?: {
  id: string;
  fields: CmsInfosFields;
}): SiteInfos {
  const fields = record?.fields;
  const email = normalizeEmail(fields?.email ?? DEFAULT_SITE_INFOS.email);
  const website = fields?.website ?? DEFAULT_SITE_INFOS.website;
  const instagram = fields?.instagram ?? DEFAULT_SITE_INFOS.instagram;
  const websiteHref = normalizeUrl(website);
  const instagramHref = normalizeInstagramUrl(
    instagram
  );

  return {
    email,
    emailHref: email ? `mailto:${email}` : undefined,
    website,
    websiteHref,
    websiteLabel: getHostLabel(websiteHref),
    instagram,
    instagramHref,
    instagramLabel: getInstagramLabel(instagramHref),
    bindings: {
      email: createInfoBinding(record?.id, "email", "Contact email", email),
      instagram: createInfoBinding(
        record?.id,
        "instagram",
        "Instagram",
        instagram,
      ),
      website: createInfoBinding(record?.id, "website", "Website", website),
    },
  };
}

export const getSiteInfos = cache(async (): Promise<SiteInfos> => {
  const response = await getCmsInfos();
  return mapCmsInfos(response?.record);
});
