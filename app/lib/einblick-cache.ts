import { createEinblickCmsTags } from "@einblick/sdk/next/cache";

// A notification names only the resource that changed. Asset URLs and file
// metadata (alt text, dimensions, copyright, focal point) change under the
// `files` slug, so reads that render assets must expire together with it.
export const einblickTags = createEinblickCmsTags({
  fanOut: { files: ["posts", "members"] },
});

export const getEinblickCmsTags = (resourceSlug?: string | null): string[] =>
  einblickTags.forFetch(resourceSlug);
