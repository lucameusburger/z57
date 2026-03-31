"use client";

import { startTransition, useEffectEvent } from "react";

import { EinblickEditProvider } from "@einblick/sdk/react";
import { useRouter } from "next/navigation";

export default function EinblickEditBoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const handleSave = useEffectEvent(() => {
    startTransition(() => {
      router.refresh();
    });
  });

  return (
    <EinblickEditProvider
      siteKey={process.env.NEXT_PUBLIC_EINBLICK_SITE_KEY}
      // appOrigin={
      //   process.env.NEXT_PUBLIC_EINBLICK_APP_URL || "https://app.einblick.xyz"
      // }
      onSave={handleSave}
    >
      {children}
    </EinblickEditProvider>
  );
}
