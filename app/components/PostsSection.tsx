import { type Post } from "@/app/types/posts";

import Badge from "@/app/components/Badge";
import CategoryBadge from "@/app/components/CategoryBadge";
import Image from "next/image";
import PostGallery from "@/app/components/PostGallery";
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
              <div className="flex flex-col gap-4 px-4 py-5 md:px-7 md:py-7">
                <div className="flex flex-col items-start gap-3">
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
                  {post.dateLabels?.length ? (
                    <EditableRegion
                      editInline
                      as="div"
                      binding={post.bindings.dateLabels}
                    >
                      {post.dateLabels.map((dateLabel) => (
                        <p key={dateLabel}>{dateLabel}</p>
                      ))}
                    </EditableRegion>
                  ) : null}
                </div>

                {post.image ? (
                  <EditableRegion
                    as="div"
                    binding={post.bindings.image}
                    className="overflow-hidden"
                  >
                    <Image
                      src={post.image.src}
                      alt={post.image.alt || post.title}
                      width={post.image.width ?? 1200}
                      height={post.image.height ?? 1500}
                      priority={post === posts[0]}
                      sizes="(max-width: 768px) calc(100vw - 2rem), 22vw"
                      className="block h-auto w-full"
                    />
                  </EditableRegion>
                ) : null}
              </div>

              <div className="flex flex-col justify-between gap-8 px-4 py-5 md:col-span-3 md:px-7 md:py-7">
                <div className="flex flex-col gap-4">
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

            {post.galleryImages.length > 0 ? (
              <EditableRegion
                as="div"
                binding={post.bindings.gallery}
                className="border-b"
              >
                <PostGallery
                  images={post.galleryImages}
                  title={post.title}
                  priorityFirstImage={post === posts[0] && !post.image}
                />
              </EditableRegion>
            ) : null}
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
