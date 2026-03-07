import type { Metadata } from "next";

import PostPageHeader from "@/app/components/PostPageHeader";
import PostsSection from "@/app/components/PostsSection";
import SiteFooter from "@/app/components/SiteFooter";
import { getAllPosts } from "@/app/types/posts";

export const metadata: Metadata = {
  title: "Alle Posts | z57",
  description: "Alle Posts, Rückblicke und Einblicke aus dem Atelier z57.",
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]">
      <div className="flex min-full-viewport-height w-full flex-col">
        <main className="flex w-full flex-1 flex-col" id="top">
          <PostPageHeader />

          <section className="px-4 py-8 md:px-8">
            <div className="max-w-4xl space-y-4">
              <p className="text-sm uppercase tracking-[0.16em] text-foreground/60">
                Archiv
              </p>
              <h1 className="text-4xl md:text-6xl">Alle Posts</h1>
              <p className="max-w-3xl text-lg leading-relaxed text-foreground/80 md:text-xl">
                Alle Beiträge, Rückblicke und Einblicke aus dem Atelier z57 an
                einem Ort.
              </p>
            </div>
          </section>

          <PostsSection posts={posts} />
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
