"use client";

import { Box, LoaderCircle } from "lucide-react";
import { useState, type ComponentType } from "react";

export default function Model3D() {
  const [Scene, setScene] = useState<ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const loadModel = async () => {
    if (Scene || isLoading) return;

    setIsLoading(true);
    setLoadError(false);

    try {
      const sceneModule = await import("./Model3DScene");
      setScene(() => sceneModule.default);
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (Scene) {
    return <Scene />;
  }

  return (
    <div className="relative flex h-[60vh] max-h-[680px] min-h-[420px] w-full items-center justify-center overflow-hidden rounded-3xl border border-foreground bg-background p-6 md:h-[70vh]">
      <div
        aria-hidden
        className="absolute inset-6 rounded-[2rem] border border-dashed border-foreground/25"
      />
      <div className="relative flex max-w-lg flex-col items-center text-center">
        <Box className="h-14 w-14" strokeWidth={1.25} />
        <h3 className="mt-5 text-2xl font-semibold md:text-3xl">
          z57 in drei Dimensionen
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground/70 md:text-base">
          Das interaktive Architekturmodell ist optional und wird erst auf
          Wunsch geladen. Der Download ist etwa 34 MB groß.
        </p>
        {loadError ? (
          <p className="mt-3 text-sm font-medium" role="alert">
            Das Modell konnte nicht geladen werden. Bitte versuche es erneut.
          </p>
        ) : null}
        <button
          type="button"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-foreground bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-75 disabled:cursor-wait disabled:opacity-50"
          disabled={isLoading}
          onClick={() => void loadModel()}
        >
          {isLoading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Box className="h-4 w-4" />
          )}
          {isLoading ? "3D-Ansicht wird vorbereitet" : "3D-Modell laden"}
        </button>
      </div>
    </div>
  );
}
