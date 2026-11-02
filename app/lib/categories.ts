import "server-only";

import { cache } from "react";

import { GLYPHS } from "@/app/components/Shapes";
import { getContent } from "@/app/lib/content";
import { getMembers } from "@/app/types/members";
import { getAllPosts } from "@/app/types/posts";

/** `hero.text` is "<tagline> . <discipline> . <discipline> . …" */
export function parseHeroText(text: string) {
  const [tagline = "", ...disciplines] = text
    .split(/\s\.(?:\s|$)/)
    .map((part) => part.trim())
    .filter(Boolean);

  return { tagline, disciplines };
}

const keyOf = (label: string) => label.trim().toLocaleLowerCase("de");

/**
 * Every category on the site, each with its own symbol: the disciplines from
 * `hero.text` first, then any member role or post kind not listed there.
 */
export const getCategories = cache(async () => {
  const [{ content }, members, posts] = await Promise.all([
    getContent(),
    getMembers(),
    getAllPosts(),
  ]);

  const labels = new Map<string, string>();
  for (const label of [
    ...parseHeroText(content.home.hero.text).disciplines,
    ...members.map((member) => member.title),
    ...posts.map((post) => post.kind),
  ]) {
    const key = keyOf(label);
    if (key && !labels.has(key)) labels.set(key, label);
  }

  return [...labels].map(([key, label], index) => ({
    key,
    label,
    Glyph: GLYPHS[index % GLYPHS.length],
  }));
});

export async function getCategoryGlyph(label: string) {
  const categories = await getCategories();
  return (
    categories.find((category) => category.key === keyOf(label))?.Glyph ??
    GLYPHS[0]
  );
}
