import { type Post } from "@/app/types/posts";

import Badge from "@/app/components/Badge";
import Image from "next/image";
import {
  EditableCollection,
  EditableRegion,
  EditableText,
  createEditableCollectionBinding,
} from "@einblick/editor/react";

interface PostsSectionProps {
  posts: Post[];
  showAllPostsLink?: boolean;
}

export default function PostsSection({
  posts,
  showAllPostsLink = false,
}: PostsSectionProps) {
  return (
    <section>
      <EditableCollection
        as="div"
        binding={createEditableCollectionBinding({
          resourceSlug: "posts",
          label: "Posts",
        })}
        showCreateButton
        createButtonWrapperClassName="p-4 md:px-7"
      >
        {posts.map((post) => (
          <EditableRegion
            as="article"
            key={post.id}
            binding={post.bindings.region}
          >
            <div className="cells md:grid-cols-4">
              {/* The cover keeps its own aspect ratio so posters show whole; only
                  very tall images are capped (and cropped) to stay on screen.
                  Posts without a cover image use their first gallery image. */}
              {post.coverImage ? (
                <EditableRegion
                  as="div"
                  binding={
                    post.image ? post.bindings.image : post.bindings.gallery
                  }
                >
                  <Image
                    src={post.coverImage.src}
                    alt={post.coverImage.alt || post.title}
                    width={post.coverImage.width ?? 1200}
                    height={post.coverImage.height ?? 1500}
                    preload={post === posts[0]}
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="block h-auto max-h-[80svh] w-full object-cover"
                  />
                </EditableRegion>
              ) : (
                <div aria-hidden="true" className="hidden bg-lime md:block" />
              )}

              <div className="flex flex-col justify-between gap-8 px-4 py-5 md:col-span-3 md:px-7 md:py-7">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Badge className="rounded-full">
                      <EditableRegion
                        editInline
                        as="span"
                        binding={post.bindings.kind}
                        className="inline-block first-letter:uppercase"
                      >
                        {post.kind}
                      </EditableRegion>
                    </Badge>
                    {post.dateLabels?.length ? (
                      <EditableRegion
                        editInline
                        as="div"
                        binding={post.bindings.dateLabels}
                        className="flex flex-wrap gap-x-3"
                      >
                        {post.dateLabels.map((dateLabel) => (
                          <p key={dateLabel}>{dateLabel}</p>
                        ))}
                      </EditableRegion>
                    ) : null}
                  </div>
                  <EditableText
                    editInline
                    as="h3"
                    binding={post.bindings.title}
                    placeholder="Titel ergänzen"
                    className="text-lead"
                  >
                    {post.title}
                  </EditableText>
                  <EditableText
                    editInline
                    as="p"
                    binding={post.bindings.summary}
                    placeholder="Beschreibung ergänzen"
                    className="max-w-3xl whitespace-pre-line"
                  >
                    {post.summary}
                  </EditableText>
                </div>

                <Badge href={post.href} variant="black" className="self-end">
                  Zum Post
                </Badge>
              </div>
            </div>

          </EditableRegion>
        ))}
      </EditableCollection>

      {showAllPostsLink ? (
        <div className="flex justify-end border-b px-4 py-5 md:px-7">
          <Badge href="/posts">Alle Posts ansehen</Badge>
        </div>
      ) : null}
    </section>
  );
}
