"use client";

import { EinblickEditProvider } from "@einblick/sdk/react";
import { useRouter } from "next/navigation";

export default function EinblickEditBoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteKey = process.env.NEXT_PUBLIC_EINBLICK_SITE_KEY;
  const router = useRouter();

  const handleSave = async (event: {
    binding: {
      resourceSlug: string;
    };
  }) => {
    try {
      await fetch("/api/einblick/revalidate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          resourceSlug: event.binding.resourceSlug,
        }),
        cache: "no-store",
      });
    } catch {
      // Keep the optimistic edit state even if background revalidation fails.
    }
    router.refresh();
  };

  if (!siteKey) {
    return children;
  }

  return (
    <EinblickEditProvider siteKey={siteKey} onSave={handleSave}>
      {children}
    </EinblickEditProvider>
  );
}
