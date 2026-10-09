import { getContent } from "@/app/lib/content";
import { EditableText } from "@einblick/editor/react";
import type { Metadata } from "next";
import PostPageHeader from "@/app/components/PostPageHeader";
import PostsSection from "@/app/components/PostsSection";
import SiteFooter from "@/app/components/SiteFooter";
import { getAllPosts } from "@/app/types/posts";

export const metadata: Metadata = {
  title: "Alle Posts | z57",
  description: "Alle Posts, Rückblicke und Einblicke aus dem Atelier z57.",
};

export default async function PostsPage() {
  const { content, pages } = await getContent();
  const posts = await getAllPosts();

  return (
    <div className="items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]">
      <div className="flex min-full-viewport-height w-full flex-col">
        <main className="flex w-full flex-1 flex-col" id="top">
          <PostPageHeader />

          <section className="px-4 py-8 md:px-8">
            <div className="max-w-4xl space-y-4">
              <EditableText
                editInline
                as="p"
                className="text-sm uppercase tracking-[0.16em] text-foreground/60"
                binding={pages.archive.binding("intro.eyebrow")}
                placeholder="Text ergänzen"
              >
                {content.archive.intro.eyebrow}
              </EditableText>
              <EditableText
                editInline
                as="h1"
                className="text-4xl md:text-6xl"
                binding={pages.archive.binding("intro.heading")}
                placeholder="Text ergänzen"
              >
                {content.archive.intro.heading}
              </EditableText>
              <EditableText
                editInline
                as="p"
                className="max-w-3xl text-lg leading-relaxed text-foreground/80 md:text-xl"
                binding={pages.archive.binding("intro.intro")}
                placeholder="Text ergänzen"
              >
                {content.archive.intro.intro}
              </EditableText>
            </div>
          </section>

          <PostsSection posts={posts} />
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
