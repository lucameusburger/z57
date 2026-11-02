import type { MetadataRoute } from "next";

import { absoluteUrl, toIsoDate } from "@/app/lib/metadata";
import { getAllPosts } from "@/app/types/posts";

const STATIC_PATHS = [
  "/",
  "/posts",
  "/wintermarkt-2026",
  "/impressum",
  "/datenschutz",
  "/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  return [
    ...STATIC_PATHS.map((path) => ({ url: absoluteUrl(path) })),
    ...posts
      .filter((post) => post.slug)
      .map((post) => ({
        url: absoluteUrl(post.href),
        lastModified: toIsoDate(post.updatedAt ?? post.publishedAt),
      })),
  ];
}
