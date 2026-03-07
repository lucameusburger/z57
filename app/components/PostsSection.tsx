import {
  type Post,
  formatPublishedDate,
  getHomepagePosts,
} from "@/app/types/posts";

import Badge from "@/app/components/Badge";
import PostGallery from "@/app/components/PostGallery";

interface PostsSectionProps {
  posts?: Post[];
  showAllPostsLink?: boolean;
}

export default function PostsSection({
  posts = getHomepagePosts(),
  showAllPostsLink = false,
}: PostsSectionProps) {
  return (
    <section className="flex flex-col gap-8 px-4 md:px-8">
      <div className="flex items-start flex-col gap-4 justify-start relative">
        <div className="flex w-full flex-col gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="w-full rounded-3xl border border-foreground bg-background p-4 md:p-6"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge>{post.kind}</Badge>
                    {post.dateLabels?.map((dateLabel) => (
                      <Badge key={dateLabel}>{dateLabel}</Badge>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl md:text-5xl">{post.title}</h2>
                    <p className="max-w-4xl text-lg leading-relaxed md:text-xl">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <span className="hidden text-sm tracking-[0.04em] text-foreground/60 md:block">
                  {formatPublishedDate(post.publishedAt)}
                </span>
              </div>

              <PostGallery
                images={post.galleryImages}
                title={post.title}
                priorityFirstImage={post === posts[0]}
              />

              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-sm tracking-[0.04em] text-foreground/60 md:hidden">
                  {formatPublishedDate(post.publishedAt)}
                </span>
                <Badge href={post.href} variant="black" className="ml-auto">
                  Zum Post
                </Badge>
              </div>
            </article>
          ))}
        </div>

        {showAllPostsLink && (
          <div className="flex w-full justify-end">
            <Badge href="/posts">Alle Posts ansehen</Badge>
          </div>
        )}
      </div>
    </section>
  );
}
