import { permanentRedirect } from "next/navigation";

interface EventRedirectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventRedirectPage({ params }: EventRedirectPageProps) {
  const { slug } = await params;

  permanentRedirect(`/post/${slug}`);
}
