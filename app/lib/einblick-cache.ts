import { createEinblickCmsTags } from "@einblick/sdk/next/cache";

export const einblickTags = createEinblickCmsTags();

export const EINBLICK_CMS_TAGS = {
  all: einblickTags.base,
  infos: einblickTags.forResource("infos"),
  members: einblickTags.forResource("members"),
  posts: einblickTags.forResource("posts"),
} as const;

export const getEinblickCmsTags = (resourceSlug?: string | null): string[] =>
  einblickTags.for(resourceSlug);
