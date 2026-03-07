import "server-only";

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import rawPosts from "@/app/content/posts.json";

export type PostKind = "event" | "space" | "project";

interface PostRecord {
  id: string;
  slug: string;
  title: string;
  kind: PostKind;
  pinned: boolean;
  publishedAt: string;
  summary: string;
  content: string;
  dateLabels?: string[];
  dateLabel?: string;
  locationLabel?: string;
  galleryDir: string;
  tags?: string[];
}

export interface PostImage {
  src: string;
  alt: string;
}

export interface Post extends Omit<PostRecord, "dateLabel"> {
  href: string;
  galleryImages: PostImage[];
  coverImage?: PostImage;
}

const posts = rawPosts as PostRecord[];

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function encodePathSegments(input: string) {
  return input
    .split(path.sep)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function readGalleryFiles(directory: string, nestedPath = ""): string[] {
  const targetDirectory = path.join(directory, nestedPath);

  return fs
    .readdirSync(targetDirectory, { withFileTypes: true })
    .flatMap((entry) => {
      const relativePath = path.join(nestedPath, entry.name);

      if (entry.isDirectory()) {
        return readGalleryFiles(directory, relativePath);
      }

      if (!IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        return [];
      }

      return [relativePath];
    })
    .sort((left, right) => left.localeCompare(right, "de", { numeric: true }));
}

function getGalleryImages(galleryDir: string, title: string): PostImage[] {
  const directory = path.join(process.cwd(), "public", "images", "events", galleryDir);

  if (!fs.existsSync(directory)) {
    return [];
  }

  return readGalleryFiles(directory).map((relativeFile, index) => ({
    src: `/images/events/${encodeURIComponent(galleryDir)}/${encodePathSegments(relativeFile)}`,
    alt: `${title} ${index + 1}`,
  }));
}

function byNewest(left: PostRecord, right: PostRecord) {
  return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
}

export const getAllPosts = cache((): Post[] => {
  return [...posts]
    .sort((left, right) => {
      if (left.pinned === right.pinned) {
        return byNewest(left, right);
      }

      return left.pinned ? -1 : 1;
    })
    .map((post) => {
      const { dateLabel, ...rest } = post;
      const galleryImages = getGalleryImages(post.galleryDir, post.title);
      const dateLabels = rest.dateLabels ?? (dateLabel ? [dateLabel] : undefined);

      return {
        ...rest,
        dateLabels,
        href: `/post/${post.slug}`,
        galleryImages,
        coverImage: galleryImages[0],
      };
    });
});

export function getHomepagePosts(): Post[] {
  const allPosts = getAllPosts();
  const pinnedPosts = allPosts.filter((post) => post.pinned);
  const latestPosts = allPosts.filter((post) => !post.pinned).slice(0, 3);

  return [...pinnedPosts, ...latestPosts];
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function formatPublishedDate(date: string): string {
  return new Intl.DateTimeFormat("de-AT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
