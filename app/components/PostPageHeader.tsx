"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PostPageHeaderProps {
  fallbackHref?: string;
}

export default function PostPageHeader({
  fallbackHref = "/",
}: PostPageHeaderProps) {
  function handleBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.assign(fallbackHref);
  }

  return (
    <header className="px-4 pt-8 md:px-8">
      <div className="flex items-center justify-between border-t border-foreground pt-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xl transition-opacity hover:opacity-65 md:text-2xl"
        >
          <ArrowLeft className="h-5 w-5" />
          Zurück
        </button>

        <Link
          href="/"
          className="text-xl tracking-[0.12em] transition-opacity hover:opacity-65 md:text-2xl"
        >
          z57
        </Link>
      </div>
    </header>
  );
}
