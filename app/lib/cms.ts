import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";

import type {
  InfosFields,
  MembersFields,
  PostsFields,
} from "@/app/lib/einblick.generated";
import { einblickTags, getEinblickCmsTags } from "@/app/lib/einblick-cache";
import {
  createGeneratedEinblickClient,
  EINBLICK_WEBSITE,
} from "@/app/lib/einblick.generated";
import { collectCmsPages } from "@/app/lib/cms-pagination";
import {
  EinblickApiError,
  type EinblickListResponse,
  type EinblickSingleRecordResponse,
} from "@einblick/sdk";
import { isEinblickDraftMode } from "@einblick/sdk/next";

export type CmsCollectionResponse<T extends Record<string, unknown>> =
  EinblickListResponse<T>;
export type CmsSingleRecordResponse<T extends Record<string, unknown>> =
  EinblickSingleRecordResponse<T>;

export type CmsMemberFields = MembersFields;
export type CmsInfosFields = InfosFields;
export type CmsPostFields = PostsFields;

const REVALIDATE_SECONDS = 60;

const POSTS_FIELDS = [
  "title",
  "description",
  "content",
  "kind",
  "pinned",
  "published_at",
  "date_labels",
  "location_label",
  "image",
  "images",
  "tags",
] as const;

const MEMBERS_FIELDS = [
  "name",
  "title",
  "description",
  "email",
  "website",
  "instagram",
  "image",
  "projects",
] as const;

const INFOS_FIELDS = ["email", "website", "instagram"] as const;

function getClient() {
  return createGeneratedEinblickClient({
    preview: isEinblickDraftMode,
    cacheTags: einblickTags,
    requestInit: { next: { revalidate: REVALIDATE_SECONDS } },
  });
}

function logCmsError(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[einblick-sdk] ${scope} failed: ${message}`);
}

export function isCmsConfigured(): boolean {
  return Boolean(
    process.env.EINBLICK_API_KEY || process.env.EINBLICK_API_TOKEN,
  );
}

export const getCmsPosts = cache(
  async (): Promise<CmsCollectionResponse<CmsPostFields> | null> => {
    if (!isCmsConfigured()) {
      return null;
    }

    try {
      const client = getClient();
      return await collectCmsPages((cursor) =>
        client.request("posts", {
          cursor,
          limit: 100,
          fields: POSTS_FIELDS,
        }),
      );
    } catch (error) {
      logCmsError("getCmsPosts", error);
      throw error;
    }
  },
);

export const getCmsMembers = cache(
  async (): Promise<CmsCollectionResponse<CmsMemberFields> | null> => {
    if (!isCmsConfigured()) {
      return null;
    }

    try {
      const client = getClient();
      return await collectCmsPages((cursor) =>
        client.request("members", {
          cursor,
          limit: 100,
          fields: MEMBERS_FIELDS,
        }),
      );
    } catch (error) {
      logCmsError("getCmsMembers", error);
      throw error;
    }
  },
);

const getPersistedCmsInfos = unstable_cache(
  async (): Promise<CmsSingleRecordResponse<CmsInfosFields> | null> => {
    if (!isCmsConfigured()) {
      return null;
    }

    try {
      return await getClient().request("infos", {
        fields: INFOS_FIELDS,
      });
    } catch (error) {
      if (error instanceof EinblickApiError && error.status === 404)
        return null;
      logCmsError("getCmsInfos", error);
      throw error;
    }
  },
  ["einblick-cms-infos", EINBLICK_WEBSITE],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: getEinblickCmsTags("infos"),
  },
);

export const getCmsInfos = cache(async () => {
  if (!isCmsConfigured()) return null;
  if (!(await isEinblickDraftMode())) return getPersistedCmsInfos();
  try {
    return await getClient().request("infos", { fields: INFOS_FIELDS });
  } catch (error) {
    if (error instanceof EinblickApiError && error.status === 404) return null;
    throw error;
  }
});

export const getCmsPost = cache(
  async (
    slug: string,
  ): Promise<CmsSingleRecordResponse<CmsPostFields> | null> => {
    if (!isCmsConfigured()) {
      return null;
    }

    try {
      return await getClient().request("posts", {
        slug,
        fields: POSTS_FIELDS,
      });
    } catch (error) {
      if (error instanceof EinblickApiError && error.status === 404)
        return null;
      logCmsError(`getCmsPost(${slug})`, error);
      throw error;
    }
  },
);
