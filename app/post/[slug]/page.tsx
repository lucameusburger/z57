import {
  formatPublishedDate,
  getPostBySlug,
  getPostSlugs,
} from "@/app/types/posts";

import Badge from "@/app/components/Badge";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import PostGallery from "@/app/components/PostGallery";
import PostPageHeader from "@/app/components/PostPageHeader";
import ReactMarkdown from "react-markdown";
import SiteFooter from "@/app/components/SiteFooter";
import { EditableRegion, EditableText } from "@einblick/editor/react";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";

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
      title: "Post nicht gefunden | z57",
    };
  }

  return {
    title: `${post.title} | z57`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      images: post.coverImage ? [post.coverImage.ogSrc] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const renderableContent = getRenderablePostContent(post.content, post.title);
  const standaloneImage = post.image;
  const hasGallery = post.galleryImages.length > 0;

  return (
    <div className="items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]">
      <div className="flex min-full-viewport-height w-full flex-col">
        <main className="flex w-full flex-1 flex-col" id="top">
          <PostPageHeader fallbackHref="/posts" />

          <EditableRegion
            as="div"
            binding={post.bindings.region}
            className="flex flex-col gap-6 px-4 py-8 md:px-8"
          >
            <EditableRegion
              as="section"
              binding={undefined}
              className="rounded-3xl border border-foreground bg-background p-4 md:p-6"
            >
              <div className="mb-6 flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge>
                      <EditableRegion
                        as="span"
                        binding={post.bindings.kind}
                        className="inline-block"
                      >
                        {post.kind}
                      </EditableRegion>
                    </Badge>
                    <Badge>
                      <EditableRegion
                        as="span"
                        binding={post.bindings.publishedAt}
                        className="inline-block"
                      >
                        {formatPublishedDate(post.publishedAt)}
                      </EditableRegion>
                    </Badge>
                    {post.locationLabel && (
                      <Badge>
                        <EditableText
                          editInline
                          as="span"
                          binding={post.bindings.locationLabel}
                        >
                          {post.locationLabel}
                        </EditableText>
                      </Badge>
                    )}
                  </div>

                  {post.dateLabels?.length ? (
                    <EditableRegion
                      as="div"
                      binding={post.bindings.dateLabels}
                      className="flex flex-wrap justify-end gap-2 text-sm md:max-w-[45%]"
                    >
                      {post.dateLabels.map((dateLabel) => (
                        <Badge key={dateLabel}>{dateLabel}</Badge>
                      ))}
                    </EditableRegion>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <EditableText
                    editInline
                    as="h1"
                    binding={post.bindings.title}
                    placeholder="Titel ergänzen"
                    className="text-4xl md:text-6xl"
                  >
                    {post.title}
                  </EditableText>
                  <EditableText
                    editInline
                    as="p"
                    binding={post.bindings.summary}
                    placeholder="Beschreibung ergänzen"
                    className="max-w-5xl text-lg leading-relaxed md:text-xl"
                  >
                    {post.summary}
                  </EditableText>
                </div>
              </div>

              {standaloneImage || hasGallery ? (
                <div className="space-y-6">
                  {standaloneImage ? (
                    <EditableRegion
                      as="div"
                      binding={post.bindings.image}
                      className="w-full overflow-hidden rounded-3xl border border-foreground bg-background md:w-1/3"
                    >
                      <Image
                        src={standaloneImage.src}
                        alt={standaloneImage.alt || post.title}
                        width={standaloneImage.width ?? 1600}
                        height={standaloneImage.height ?? 2000}
                        priority
                        sizes="(max-width: 768px) calc(100vw - 3rem), 32vw"
                        className="block h-auto w-full"
                      />
                    </EditableRegion>
                  ) : null}

                  {hasGallery ? (
                    <EditableRegion as="div" binding={post.bindings.gallery}>
                      <PostGallery
                        images={post.galleryImages}
                        initialImageLimit={12}
                        title={post.title}
                        priorityFirstImage={!standaloneImage}
                      />
                    </EditableRegion>
                  ) : null}
                </div>
              ) : null}
            </EditableRegion>

            <EditableRegion
              as="section"
              binding={undefined}
              className="rounded-3xl border border-foreground bg-background px-5 py-6 md:px-8 md:py-8"
            >
              {post.tags && post.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2 text-sm text-foreground/65">
                  <EditableRegion
                    as="div"
                    binding={post.bindings.tags}
                    className="flex flex-wrap gap-2"
                  >
                    {post.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </EditableRegion>
                </div>
              )}

              <EditableRegion
                as="div"
                binding={post.bindings.content}
                className="max-w-5xl"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="mb-6 text-3xl font-semibold tracking-tight md:text-4xl">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-tight md:text-3xl">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mb-3 mt-6 text-xl font-semibold tracking-tight md:text-2xl">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 max-w-3xl text-lg leading-relaxed text-foreground/80 md:text-xl">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-4 list-disc space-y-2 pl-5 text-lg text-foreground/80 md:text-xl">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-4 list-decimal space-y-2 pl-5 text-lg text-foreground/80 md:text-xl">
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
            </EditableRegion>
          </EditableRegion>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
