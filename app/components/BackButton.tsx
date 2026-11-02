"use client";

import { ArrowLeft } from "lucide-react";

export default function BackButton({
  fallbackHref = "/",
}: {
  fallbackHref?: string;
}) {
  function handleBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.assign(fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 transition-opacity hover:opacity-60"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Zurück
    </button>
  );
}
