import { permanentRedirect } from "next/navigation";

interface PostsRedirectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostsRedirectPage({ params }: PostsRedirectPageProps) {
  const { slug } = await params;

  permanentRedirect(`/post/${slug}`);
}
