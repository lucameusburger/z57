import {
  formatPublishedDate,
  getPostBySlug,
  getPostSlugs,
} from "@/app/types/posts";

import BackButton from "@/app/components/BackButton";
import CategoryBadge from "@/app/components/CategoryBadge";
import Image from "next/image";
import JsonLd from "@/app/components/JsonLd";
import Link from "next/link";
import type { Metadata } from "next";
import PostGallery from "@/app/components/PostGallery";
import ReactMarkdown from "react-markdown";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { EditableRegion, EditableText } from "@einblick/editor/react";
import { redirectIfEinblickRecordMoved } from "@einblick/sdk/next";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  pageMetadata,
  SITE_NAME,
  SITE_URL,
  toIsoDate,
} from "@/app/lib/metadata";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function normalizeHeadingText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function getRenderablePostContent(content: string, title: string) {
  const headingMatch = content.match(/^#\s+(.+?)\s*(?:\n+|$)/);

  if (!headingMatch) {
    return content;
  }

  if (normalizeHeadingText(headingMatch[1]) !== normalizeHeadingText(title)) {
    return content;
  }

  return content.slice(headingMatch[0].length).replace(/^\s+/, "");
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post nicht gefunden",
    };
  }

  return pageMetadata({
    title: post.title,
    description: post.summary,
    path: post.href,
    image: post.coverImage
      ? {
          url: post.coverImage.ogSrc,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      : undefined,
    article: {
      publishedTime: toIsoDate(post.publishedAt),
      modifiedTime: toIsoDate(post.updatedAt),
      tags: post.tags,
    },
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  await redirectIfEinblickRecordMoved(post, (next) => `/post/${next}`);

  const renderableContent = getRenderablePostContent(post.content, post.title);
  const standaloneImage = post.image;
  const hasGallery = post.galleryImages.length > 0;

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.summary || undefined,
          url: absoluteUrl(post.href),
          image: new URL(
            post.coverImage?.ogSrc ?? DEFAULT_OG_IMAGE.url,
            SITE_URL,
          ).href,
          datePublished: toIsoDate(post.publishedAt),
          dateModified: toIsoDate(post.updatedAt),
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        }}
      />
      <SiteHeader back={<BackButton fallbackHref="/posts" />} />
      <main className="flex-1" id="top">
        <EditableRegion as="div" binding={post.bindings.region}>
          <section className="border-b px-4 pb-6 pt-14 md:px-7 md:pb-8 md:pt-[7vw]">
            <EditableText
              editInline
              as="h1"
              binding={post.bindings.title}
              placeholder="Titel ergänzen"
              className="text-display break-words"
            >
              {post.title}
            </EditableText>
          </section>

          <div className="cells grid-cols-2 md:grid-cols-4">
            <MetaCell label="Art" plain>
              <CategoryBadge label={post.kind}>
                <EditableRegion
                  editInline
                  as="span"
                  binding={post.bindings.kind}
                  className="inline-block first-letter:uppercase"
                >
                  {post.kind}
                </EditableRegion>
              </CategoryBadge>
            </MetaCell>
            <MetaCell label="Veröffentlicht">
              <EditableRegion
                editInline
                as="span"
                binding={post.bindings.publishedAt}
                className="inline-block"
              >
                {formatPublishedDate(post.publishedAt)}
              </EditableRegion>
            </MetaCell>
            <MetaCell label="Ort">
              {post.locationLabel ? (
                <EditableText
                  editInline
                  as="span"
                  binding={post.bindings.locationLabel}
                >
                  {post.locationLabel}
                </EditableText>
              ) : (
                "z57"
              )}
            </MetaCell>
            <MetaCell label="Termine">
              {post.dateLabels?.length ? (
                <EditableRegion
                  editInline
                  as="div"
                  binding={post.bindings.dateLabels}
                  className="flex flex-col"
                >
                  {post.dateLabels.map((dateLabel) => (
                    <span key={dateLabel}>{dateLabel}</span>
                  ))}
                </EditableRegion>
              ) : (
                "–"
              )}
            </MetaCell>
          </div>

          <div className="cells md:grid-cols-4">
            <div
              className={`px-4 pb-6 pt-12 md:px-7 md:pb-7 md:pt-[6vw] ${standaloneImage ? "md:col-span-3" : "md:col-span-4"}`}
            >
              <EditableText
                editInline
                as="p"
                binding={post.bindings.summary}
                placeholder="Beschreibung ergänzen"
                className="text-lead whitespace-pre-line"
              >
                {post.summary}
              </EditableText>
            </div>

            {standaloneImage ? (
              <EditableRegion
                as="div"
                binding={post.bindings.image}
                className="overflow-hidden"
              >
                <Image
                  src={standaloneImage.src}
                  alt={standaloneImage.alt || post.title}
                  width={standaloneImage.width ?? 1600}
                  height={standaloneImage.height ?? 2000}
                  priority
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="block h-auto w-full"
                />
              </EditableRegion>
            ) : null}
          </div>

          {hasGallery ? (
            <EditableRegion
              as="div"
              binding={post.bindings.gallery}
              className="border-b"
            >
              <PostGallery
                images={post.galleryImages}
                title={post.title}
                priorityFirstImage={!standaloneImage}
              />
            </EditableRegion>
          ) : null}

          <section className="cells md:grid-cols-4">
            <div className="px-4 py-5 md:px-7 md:py-7">
              {post.tags && post.tags.length > 0 ? (
                <EditableRegion
                  editInline
                  as="div"
                  binding={post.bindings.tags}
                >
                  {post.tags.join(", ")}
                </EditableRegion>
              ) : null}
            </div>

            <EditableRegion
              as="div"
              binding={post.bindings.content}
              className="px-4 py-5 md:col-span-3 md:px-7 md:py-7"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-lead mb-6">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lead mb-4 mt-8">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sub mb-3 mt-6">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 max-w-3xl">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 list-disc space-y-2 pl-5">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 list-decimal space-y-2 pl-5">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li>{children}</li>,
                  a: ({ href, children }) => (
                    <Link
                      href={href || "#"}
                      className="underline underline-offset-4"
                    >
                      {children}
                    </Link>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                }}
              >
                {renderableContent}
              </ReactMarkdown>
            </EditableRegion>
          </section>
        </EditableRegion>
      </main>

      <SiteFooter />
    </div>
  );
}

function MetaCell({
  label,
  plain = false,
  children,
}: {
  label: string;
  plain?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-28 flex-col justify-between gap-4 px-4 py-4 md:min-h-40 md:px-7 md:py-6">
      <span>{label}</span>
      <div className={plain ? undefined : "text-sub first-letter:uppercase"}>
        {children}
      </div>
    </div>
  );
}
