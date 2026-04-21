import "server-only";

import { cache } from "react";

import { getEinblickAssetUrl } from "@/app/lib/assets";
import {
  getCmsPost,
  getCmsPosts,
  type CmsPostFields,
} from "@/app/lib/cms";
import {
  createEditableBinding,
  type EinblickEditableBinding,
} from "@einblick/sdk/react";

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
  image?: PostImage;
  galleryImages?: PostImage[];
  tags?: string[];
  bindings: {
    region?: EinblickEditableBinding;
    title?: EinblickEditableBinding<string>;
    kind?: EinblickEditableBinding<string>;
    publishedAt?: EinblickEditableBinding<string>;
    summary?: EinblickEditableBinding<string>;
    content?: EinblickEditableBinding<string>;
    dateLabels?: EinblickEditableBinding<string[]>;
    locationLabel?: EinblickEditableBinding<string>;
    image?: EinblickEditableBinding<CmsPostFields["image"]>;
    gallery?: EinblickEditableBinding<CmsPostFields["images"]>;
    tags?: EinblickEditableBinding<string[]>;
  };
}

export interface PostImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
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
  const { galleryImages = [], image, ...rest } = record;

  return {
    ...rest,
    image,
    href: `/post/${record.slug}`,
    galleryImages,
    coverImage: image ?? galleryImages[0],
  };
}

function getCmsImage(
  image: CmsPostFields["image"] | undefined,
  title: string,
): PostImage | undefined {
  const src = getEinblickAssetUrl(image);
  if (!src) {
    return undefined;
  }

  return {
    src,
    alt: image?.fileName || title,
    width: image?.width,
    height: image?.height,
  };
}

function getCmsGalleryImages(
  images: CmsPostFields["images"] | undefined,
  title: string,
): PostImage[] {
  return (images ?? []).flatMap((image, index) => {
    const src = getEinblickAssetUrl(image);
    if (!src) {
      return [];
    }

    return [
      {
        src,
        alt: image.fileName || `${title} ${index + 1}`,
        width: image.width,
        height: image.height,
      },
    ];
  });
}

function cmsRecordToPostRecord(cmsRecord: {
  id: string;
  slug?: string;
  fields: CmsPostFields;
}): PostRecord {
  const { fields } = cmsRecord;

  return {
    id: cmsRecord.id,
    slug: cmsRecord.slug ?? "",
    title: fields.title ?? "Untitled",
    kind: fields.kind ?? "post",
    pinned: fields.pinned ?? false,
    publishedAt: fields.published_at ?? "",
    summary: fields.description ?? "",
    content: fields.content ?? "",
    dateLabels: fields.date_labels,
    locationLabel: fields.location_label,
    image: getCmsImage(fields.image, fields.title ?? "Post"),
    galleryImages: getCmsGalleryImages(
      fields.images,
      fields.title ?? "Post",
    ),
    tags: fields.tags,
    bindings: {
      region: createEditableBinding({
        resourceSlug: "posts",
        recordId: cmsRecord.id,
        label: fields.title ?? "Post",
        displayMode: "drawer",
      }),
      title: createEditableBinding({
        resourceSlug: "posts",
        recordId: cmsRecord.id,
        fieldKey: "title",
        fieldType: "string",
        label: "Title",
        value: fields.title ?? "Untitled",
      }),
      kind: fields.kind
        ? createEditableBinding({
            resourceSlug: "posts",
            recordId: cmsRecord.id,
            fieldKey: "kind",
            fieldType: "select",
            label: "Kind",
            value: fields.kind,
          })
        : undefined,
      publishedAt: fields.published_at
        ? createEditableBinding({
            resourceSlug: "posts",
            recordId: cmsRecord.id,
            fieldKey: "published_at",
            fieldType: "date",
            displayMode: "drawer",
            label: "Published at",
          })
        : undefined,
      summary: fields.description
        ? createEditableBinding({
            resourceSlug: "posts",
            recordId: cmsRecord.id,
            fieldKey: "description",
            fieldType: "text",
            label: "Summary",
            value: fields.description,
          })
        : undefined,
      content: fields.content
        ? createEditableBinding({
            resourceSlug: "posts",
            recordId: cmsRecord.id,
            fieldKey: "content",
            fieldType: "markdown",
            displayMode: "drawer",
            label: "Content",
          })
        : undefined,
      dateLabels: fields.date_labels
        ? createEditableBinding({
            resourceSlug: "posts",
            recordId: cmsRecord.id,
            fieldKey: "date_labels",
            fieldType: "tags",
            displayMode: "drawer",
            label: "Date labels",
          })
        : undefined,
      locationLabel: fields.location_label
        ? createEditableBinding({
            resourceSlug: "posts",
            recordId: cmsRecord.id,
            fieldKey: "location_label",
            fieldType: "string",
            label: "Location",
            value: fields.location_label,
          })
        : undefined,
      image: fields.image
        ? createEditableBinding({
            resourceSlug: "posts",
            recordId: cmsRecord.id,
            fieldKey: "image",
            fieldType: "image",
            label: "Image",
            displayMode: "drawer",
          })
        : undefined,
      gallery: fields.images
        ? createEditableBinding({
            resourceSlug: "posts",
            recordId: cmsRecord.id,
            fieldKey: "images",
            fieldType: "files",
            displayMode: "drawer",
            label: "Gallery",
          })
        : undefined,
      tags: fields.tags
        ? createEditableBinding({
            resourceSlug: "posts",
            recordId: cmsRecord.id,
            fieldKey: "tags",
            fieldType: "tags",
            displayMode: "drawer",
            label: "Tags",
          })
        : undefined,
    },
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
