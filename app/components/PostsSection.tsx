import {
  type Post,
  formatPublishedDate,
} from "@/app/types/posts";

import Badge from "@/app/components/Badge";
import PostGallery from "@/app/components/PostGallery";
import {
  EditableRegion,
  EditableText,
} from "@einblick/sdk/react";

interface PostsSectionProps {
  posts: Post[];
  showAllPostsLink?: boolean;
}

export default function PostsSection({
  posts,
  showAllPostsLink = false,
}: PostsSectionProps) {
  return (
    <section className="flex flex-col gap-8 px-4 md:px-8">
      <div className="flex items-start flex-col gap-4 justify-start relative">
        <div className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-8">
          {posts.map((post) => (
            <EditableRegion
              as="article"
              key={post.id}
              binding={post.bindings.region}
              className="w-full rounded-3xl border border-foreground bg-background p-4 md:p-6"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge>
                      <EditableText as="span" binding={post.bindings.kind}>
                        {post.kind}
                      </EditableText>
                    </Badge>
                    {post.dateLabels?.map((dateLabel) => (
                      <Badge key={dateLabel}>
                        <EditableText as="span" binding={post.bindings.dateLabels}>
                          {dateLabel}
                        </EditableText>
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <EditableText
                      as="h2"
                      binding={post.bindings.title}
                      className="text-3xl md:text-5xl"
                    >
                      {post.title}
                    </EditableText>
                    <EditableText
                      as="p"
                      binding={post.bindings.summary}
                      className="max-w-4xl text-lg leading-relaxed md:text-xl h-48"
                    >
                      {post.summary}
                    </EditableText>
                  </div>
                </div>

                <EditableText
                  as="span"
                  binding={post.bindings.publishedAt}
                  className="hidden text-sm tracking-[0.04em] text-foreground/60 md:block"
                >
                  {formatPublishedDate(post.publishedAt)}
                </EditableText>
              </div>

              <EditableRegion as="div" binding={post.bindings.gallery}>
                <PostGallery
                  images={post.galleryImages}
                  title={post.title}
                  priorityFirstImage={post === posts[0]}
                />
              </EditableRegion>

              <div className="mt-5 flex items-center justify-between gap-4">
                <EditableText
                  as="span"
                  binding={post.bindings.publishedAt}
                  className="text-sm tracking-[0.04em] text-foreground/60 md:hidden"
                >
                  {formatPublishedDate(post.publishedAt)}
                </EditableText>
                <Badge href={post.href} variant="black" className="ml-auto">
                  Zum Post
                </Badge>
              </div>
            </EditableRegion>
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
