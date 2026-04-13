"use client";

import { EinblickEditProvider } from "@einblick/sdk/react";

export default function EinblickEditBoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleSave = (event: {
    binding: {
      resourceSlug: string;
    };
  }) => {
    void fetch("/api/einblick/revalidate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        resourceSlug: event.binding.resourceSlug,
      }),
      cache: "no-store",
      keepalive: true,
    }).catch(() => {
      // Keep the optimistic edit state even if background revalidation fails.
    });
  };

  return (
    <EinblickEditProvider
      siteKey={process.env.NEXT_PUBLIC_EINBLICK_SITE_KEY}
      onSave={handleSave}
    >
      {children}
    </EinblickEditProvider>
  );
}
