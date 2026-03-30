import {
  formatPublishedDate,
  getPostBySlug,
  getPostSlugs,
} from "@/app/types/posts";

import Badge from "@/app/components/Badge";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import PostGallery from "@/app/components/PostGallery";
import PostPageHeader from "@/app/components/PostPageHeader";
import ReactMarkdown from "react-markdown";
import SiteFooter from "@/app/components/SiteFooter";
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

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
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
      images: post.coverImage ? [post.coverImage.src] : undefined,
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

  return (
    <div className="items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]">
      <div className="flex min-full-viewport-height w-full flex-col">
        <main className="flex w-full flex-1 flex-col" id="top">
          <PostPageHeader fallbackHref="/posts" />

          <div className="flex flex-col gap-6 px-4 py-8 md:px-8">
            <section className="rounded-3xl border border-foreground bg-background p-4 md:p-6">
              <div className="mb-6 flex flex-col gap-4">
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge>{post.kind}</Badge>
                  <Badge>{formatPublishedDate(post.publishedAt)}</Badge>
                  {post.dateLabels?.map((dateLabel) => (
                    <Badge key={dateLabel}>{dateLabel}</Badge>
                  ))}
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl md:text-6xl">{post.title}</h1>
                  <p className="max-w-5xl text-lg leading-relaxed md:text-xl">
                    {post.summary}
                  </p>
                </div>

                {post.locationLabel && (
                  <div className="flex items-start gap-3 text-base md:text-lg">
                    <MapPin className="mt-0.5 h-5 w-5 flex-none" />
                    <span>{post.locationLabel}</span>
                  </div>
                )}
              </div>

              <PostGallery
                images={post.galleryImages}
                title={post.title}
                priorityFirstImage
              />
            </section>

            <section className="rounded-3xl border border-foreground bg-background px-5 py-6 md:px-8 md:py-8">
              {post.tags && post.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2 text-sm text-foreground/65">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="max-w-5xl">
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
                      <Link href={href || "#"} className="underline underline-offset-4">
                        {children}
                      </Link>
                    ),
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  }}
                >
                  {renderableContent}
                </ReactMarkdown>
              </div>
            </section>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
