## Small Page for our Studio Space in Vienna

![Z57 - Atelier and Studio Space](https://github.com/user-attachments/assets/cdc317fd-3492-4b3e-ab61-4bc0cfaecee7)

## Einblick content

Use pnpm (the version is pinned in `package.json`). Page headings and prose live
in `content/einblick.content.ts`; read them through the server-only
`app/lib/content.ts` and use the returned locale-aware bindings for editing.
`archive` is the page at `/posts`, while `posts` and `members` remain repeatable
CMS collections. The site-wide `infos` singleton keeps its existing fallback
when no record exists.

`pnpm build` syncs the manifest only when `VERCEL_ENV=production`. Local,
development, and preview builds never sync; a failed production sync stops the
build. The production key needs `cms.syncSiteContent`. Never sync a feature
branch against production: syncing removes fields omitted from its manifest.
Existing editorial values are retained during subsequent syncs.

Content uses the shared website-scoped cache tags and a 60-second revalidation
interval. Configure `EINBLICK_REVALIDATE_SECRET` on the production host to match
the Einblick website webhook. Draft preview uses the existing API key and
`/api/einblick/draft-mode`; drafts bypass the published content cache.

Plain text markers contain one complete source value. Arrays, Markdown,
formatted values, and the repeated SVG hero text use one region per field.
The editor boots at the root and consent controls remain usable above its bar.

The migration is additive: the original domain records were retained, and
reverting the website commit restores the old rendering without deleting the
new content pages.
