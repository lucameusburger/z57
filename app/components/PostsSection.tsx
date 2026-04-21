import {
  type Post,
} from "@/app/types/posts";

import Badge from "@/app/components/Badge";
import Image from "next/image";
import PostGallery from "@/app/components/PostGallery";
import {
  EditableRegion,
  EditableText,
} from "@einblick/sdk/react";

interface PostsSectionProps {
  posts: Post[];
  showAllPostsLink?: boolean;
}

const enableInlinePostFieldEditing = false;

export default function PostsSection({
  posts,
  showAllPostsLink = false,
}: PostsSectionProps) {
  return (
    <section className="flex flex-col gap-8 px-4 md:px-8">
      <div className="flex items-start flex-col gap-4 justify-start relative">
        <div className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-8">
          {posts.map((post) => {
            const standaloneImage = post.image;
            const hasGallery = post.galleryImages.length > 0;

            if (standaloneImage) {
              return (
                <EditableRegion
                  as="article"
                  key={post.id}
                  binding={post.bindings.region}
                  className="grid w-full grid-cols-1 gap-5 rounded-3xl border border-foreground bg-background p-4 md:grid-cols-3 md:gap-8 md:p-6"
                >
                  <EditableRegion
                    as="div"
                    binding={enableInlinePostFieldEditing ? post.bindings.image : undefined}
                    className="overflow-hidden self-start rounded-3xl border border-foreground bg-background"
                  >
                    <Image
                      src={standaloneImage.src}
                      alt={standaloneImage.alt || post.title}
                      width={standaloneImage.width ?? 1200}
                      height={standaloneImage.height ?? 1500}
                      priority={post === posts[0]}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="block h-auto w-full"
                    />
                  </EditableRegion>

                  <div className="relative flex flex-col justify-between gap-5 md:col-span-2">
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2 text-sm">
                            <Badge>
                              <EditableText
                                as="span"
                                binding={enableInlinePostFieldEditing ? post.bindings.kind : undefined}
                              >
                                {post.kind}
                              </EditableText>
                            </Badge>
                          </div>

                          <EditableText
                            as="h2"
                            binding={enableInlinePostFieldEditing ? post.bindings.title : undefined}
                            className="text-3xl md:text-5xl"
                          >
                            {post.title}
                          </EditableText>
                        </div>

                        {post.dateLabels?.length ? (
                          <div className="flex flex-wrap justify-end gap-2 text-sm md:max-w-[45%]">
                            {post.dateLabels.map((dateLabel) => (
                              <Badge key={dateLabel}>
                                <EditableText
                                  as="span"
                                  binding={enableInlinePostFieldEditing ? post.bindings.dateLabels : undefined}
                                >
                                  {dateLabel}
                                </EditableText>
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <EditableText
                        as="p"
                        binding={enableInlinePostFieldEditing ? post.bindings.summary : undefined}
                        className="max-w-4xl text-lg leading-relaxed md:text-xl"
                      >
                        {post.summary}
                      </EditableText>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                      <Badge href={post.href} variant="black" className="ml-auto">
                        Zum Post
                      </Badge>
                    </div>
                  </div>

                  {hasGallery ? (
                    <EditableRegion
                      as="div"
                      binding={enableInlinePostFieldEditing ? post.bindings.gallery : undefined}
                      className="md:col-span-3"
                    >
                      <PostGallery
                        images={post.galleryImages}
                        title={post.title}
                        priorityFirstImage={post === posts[0]}
                      />
                    </EditableRegion>
                  ) : null}
                </EditableRegion>
              );
            }

            return (
              <EditableRegion
                as="article"
                key={post.id}
                binding={post.bindings.region}
                className="w-full rounded-3xl border border-foreground bg-background p-4 md:p-6"
              >
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 text-sm">
                      <Badge>
                        <EditableText
                          as="span"
                          binding={enableInlinePostFieldEditing ? post.bindings.kind : undefined}
                        >
                          {post.kind}
                        </EditableText>
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <EditableText
                        as="h2"
                        binding={enableInlinePostFieldEditing ? post.bindings.title : undefined}
                        className="text-3xl md:text-5xl"
                      >
                        {post.title}
                      </EditableText>
                      <EditableText
                        as="p"
                        binding={enableInlinePostFieldEditing ? post.bindings.summary : undefined}
                        className="max-w-4xl text-lg leading-relaxed md:text-xl h-48"
                      >
                        {post.summary}
                      </EditableText>
                    </div>
                  </div>

                  {post.dateLabels?.length ? (
                    <div className="flex flex-wrap justify-end gap-2 text-sm md:max-w-[45%]">
                      {post.dateLabels.map((dateLabel) => (
                        <Badge key={dateLabel}>
                          <EditableText
                            as="span"
                            binding={enableInlinePostFieldEditing ? post.bindings.dateLabels : undefined}
                          >
                            {dateLabel}
                          </EditableText>
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>

                {hasGallery ? (
                  <EditableRegion
                    as="div"
                    binding={enableInlinePostFieldEditing ? post.bindings.gallery : undefined}
                  >
                    <PostGallery
                      images={post.galleryImages}
                      title={post.title}
                      priorityFirstImage={post === posts[0]}
                    />
                  </EditableRegion>
                ) : null}

                <div className="mt-5 flex items-center justify-end gap-4">
                  <Badge href={post.href} variant="black" className="ml-auto">
                    Zum Post
                  </Badge>
                </div>
              </EditableRegion>
            );
          })}
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
