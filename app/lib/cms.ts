import "server-only";

import { cache } from "react";

import type {
  MembersFields,
  PostsFields,
} from "@/app/lib/einblick.generated";
import { createGeneratedEinblickClient } from "@/app/lib/einblick.generated";
import type {
  EinblickListResponse,
  EinblickSingleRecordResponse,
} from "@einblick/sdk";

export type CmsCollectionResponse<T extends Record<string, unknown>> =
  EinblickListResponse<T>;
export type CmsSingleRecordResponse<T extends Record<string, unknown>> =
  EinblickSingleRecordResponse<T>;

export type CmsMemberFields = MembersFields;
export type CmsPostFields = PostsFields;

const REVALIDATE_FETCH = {
  next: {
    revalidate: 60,
  },
};

function getClient() {
  return createGeneratedEinblickClient();
}

function logCmsError(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[einblick-sdk] ${scope} failed: ${message}`);
}

export function isCmsConfigured(): boolean {
  return Boolean(process.env.EINBLICK_API_KEY || process.env.EINBLICK_API_TOKEN);
}

export const getCmsPosts = cache(
  async (): Promise<CmsCollectionResponse<CmsPostFields> | null> => {
    if (!isCmsConfigured()) {
      return null;
    }

    try {
      return await getClient().request("posts", {
        limit: 100,
        fetch: REVALIDATE_FETCH,
      });
    } catch (error) {
      logCmsError("getCmsPosts", error);
      return null;
    }
  }
);

export const getCmsMembers = cache(
  async (): Promise<CmsCollectionResponse<CmsMemberFields> | null> => {
    if (!isCmsConfigured()) {
      return null;
    }

    try {
      return await getClient().request("members", {
        limit: 100,
        fetch: REVALIDATE_FETCH,
      });
    } catch (error) {
      logCmsError("getCmsMembers", error);
      return null;
    }
  }
);

export const getCmsPost = cache(
  async (slug: string): Promise<CmsSingleRecordResponse<CmsPostFields> | null> => {
    if (!isCmsConfigured()) {
      return null;
    }

    try {
      return await getClient().request("posts", {
        slug,
        fetch: REVALIDATE_FETCH,
      });
    } catch (error) {
      logCmsError(`getCmsPost(${slug})`, error);
      return null;
    }
  }
);
