export const EINBLICK_CMS_TAGS = {
  all: "einblick-cms",
  infos: "einblick-cms:infos",
  members: "einblick-cms:members",
  posts: "einblick-cms:posts",
} as const;

export function getEinblickCmsTags(resourceSlug?: string | null): string[] {
  switch (resourceSlug) {
    case "infos":
      return [EINBLICK_CMS_TAGS.all, EINBLICK_CMS_TAGS.infos];
    case "members":
      return [EINBLICK_CMS_TAGS.all, EINBLICK_CMS_TAGS.members];
    case "posts":
      return [EINBLICK_CMS_TAGS.all, EINBLICK_CMS_TAGS.posts];
    default:
      return [EINBLICK_CMS_TAGS.all];
  }
}
