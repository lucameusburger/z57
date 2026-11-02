"use client";

import { MoveRight } from "lucide-react";

import { EinblickLoginButton } from "@einblick/editor/react";

const badgeClasses =
  "inline-flex w-fit items-center gap-2 leading-tight transition-opacity hover:opacity-60";

export default function EinblickLoginBadge() {
  if (!process.env.NEXT_PUBLIC_EINBLICK_SITE_KEY) {
    return null;
  }

  return (
    <EinblickLoginButton
      data-einblick-chrome
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
