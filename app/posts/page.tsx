import { getContent } from "@/app/lib/content";
import { EditableText } from "@einblick/editor/react";
import BackButton from "@/app/components/BackButton";
import PostsSection from "@/app/components/PostsSection";
import SectionHead from "@/app/components/SectionHead";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { pageMetadata } from "@/app/lib/metadata";
import { getAllPosts } from "@/app/types/posts";

export const metadata = pageMetadata({
  title: "Alle Posts",
  description: "Alle Posts, Rückblicke und Einblicke aus dem Atelier Z57.",
  path: "/posts",
});

export default async function PostsPage() {
  const { content, pages } = await getContent();
  const posts = await getAllPosts();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader back={<BackButton />} />
      <main className="flex-1" id="top">
        <SectionHead
          title={
            <EditableText
              editInline
              as="h1"
              className="text-heading"
              binding={pages.archive.binding("intro.heading")}
              placeholder="Text ergänzen"
            >
              {content.archive.intro.heading}
            </EditableText>
          }
          aside={
            <EditableText
              editInline
              as="p"
              binding={pages.archive.binding("intro.intro")}
              placeholder="Text ergänzen"
            >
              {content.archive.intro.intro}
            </EditableText>
          }
        />

        <PostsSection posts={posts} />
      </main>

      <SiteFooter />
    </div>
  );
}
