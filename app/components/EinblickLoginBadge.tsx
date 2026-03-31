"use client";

import { MoveRight } from "lucide-react";

import { EinblickLoginButton } from "@einblick/sdk/react";
import { cn } from "@/lib/utils";

const badgeClasses = cn(
  "inline-flex w-fit items-center gap-1.5 rounded-full border border-foreground px-3 py-1 text-base leading-tight whitespace-nowrap",
  "bg-background text-foreground transition-colors hover:bg-foreground hover:text-background",
);

export default function EinblickLoginBadge() {
  if (!process.env.NEXT_PUBLIC_EINBLICK_SITE_KEY) {
    return null;
  }

  return (
    <EinblickLoginButton
      className={badgeClasses}
      activeChildren={
        <>
          <span>Edit Mode Beenden</span>
          <MoveRight className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
        </>
      }
    >
      <span>Einblick Login</span>
      <MoveRight className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
    </EinblickLoginButton>
  );
}
