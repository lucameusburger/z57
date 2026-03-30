import "server-only";

import { cache } from "react";

import {
  getCmsPost,
  getCmsPosts,
  type CmsPostFields,
} from "@/app/lib/cms";

export type PostKind = string;

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
  locationLabel?: string;
  galleryImages?: PostImage[];
  tags?: string[];
}

export interface PostImage {
  src: string;
  alt: string;
}

export interface Post extends Omit<PostRecord, "galleryImages"> {
  href: string;
  galleryImages: PostImage[];
  coverImage?: PostImage;
}

function byNewest(left: PostRecord, right: PostRecord) {
  return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
}

function toPost(record: PostRecord): Post {
  const { galleryImages = [], ...rest } = record;

  return {
    ...rest,
    href: `/post/${record.slug}`,
    galleryImages,
    coverImage: galleryImages[0],
  };
}

function getCmsGalleryImages(
  images: CmsPostFields["images"] | undefined,
  title: string,
): PostImage[] {
  return (images ?? []).map((image, index) => ({
    src: image.url,
    alt: image.fileName || `${title} ${index + 1}`,
  }));
}

function cmsRecordToPostRecord(cmsRecord: {
  id: string;
  slug?: string;
  fields: CmsPostFields;
}): PostRecord {
  return {
    id: cmsRecord.id,
    slug: cmsRecord.slug ?? "",
    title: cmsRecord.fields.title ?? "Untitled",
    kind: cmsRecord.fields.kind ?? "post",
    pinned: cmsRecord.fields.pinned ?? false,
    publishedAt: cmsRecord.fields.published_at ?? "",
    summary: cmsRecord.fields.description ?? "",
    content: cmsRecord.fields.content ?? "",
    dateLabels: cmsRecord.fields.date_labels,
    locationLabel: cmsRecord.fields.location_label,
    galleryImages: getCmsGalleryImages(
      cmsRecord.fields.images,
      cmsRecord.fields.title ?? "Post",
    ),
    tags: cmsRecord.fields.tags,
  };
}

function sortPosts(records: PostRecord[]): PostRecord[] {
  return [...records].sort((left, right) => {
    if (left.pinned === right.pinned) return byNewest(left, right);
    return left.pinned ? -1 : 1;
  });
}

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const cmsData = await getCmsPosts();
  if (!cmsData) {
    return [];
  }

  const records = cmsData.records.map(cmsRecordToPostRecord);
  return sortPosts(records).map(toPost);
});

export async function getHomepagePosts(): Promise<Post[]> {
  const allPosts = await getAllPosts();
  const pinnedPosts = allPosts.filter((post) => post.pinned);
  const latestPosts = allPosts.filter((post) => !post.pinned).slice(0, 3);
  return [...pinnedPosts, ...latestPosts];
}

export async function getPostBySlug(
  slug: string,
): Promise<Post | undefined> {
  const cmsData = await getCmsPost(slug);
  if (!cmsData) {
    return undefined;
  }

  return toPost(cmsRecordToPostRecord(cmsData.record));
}

export async function getPostSlugs(): Promise<string[]> {
  const allPosts = await getAllPosts();
  return allPosts.map((post) => post.slug);
}

export function formatPublishedDate(date: string): string {
  return new Intl.DateTimeFormat("de-AT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
