import type { ReactNode } from "react";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import SiteFooter from "./SiteFooter";

type LegalPageProps = {
  title: string;
  intro: ReactNode;
  updatedAt: string;
  children: ReactNode;
};

export default function LegalPage({
  title,
  intro,
  updatedAt,
  children,
}: LegalPageProps) {
  return (
    <div className="items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex min-h-screen w-full flex-col px-4 py-8 md:px-8">
        <div className="flex items-center justify-between border-t border-foreground pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl transition-opacity hover:opacity-65 md:text-2xl"
          >
            <ArrowLeft className="h-5 w-5" />
            Zurück
          </Link>
        </div>

        <article className="mx-auto mt-12 flex w-full max-w-4xl flex-col gap-10 rounded-[2rem] border border-foreground bg-background px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-4">
            <span className="text-sm uppercase tracking-[0.16em] text-foreground/60">
              Rechtliches
            </span>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              {title}
            </h1>
            <div className="max-w-3xl text-lg leading-relaxed text-foreground/80 md:text-xl">
              {intro}
            </div>
            <p className="text-sm uppercase tracking-[0.16em] text-foreground/50">
              Stand: {updatedAt}
            </p>
          </div>

          <div className="flex flex-col gap-10 text-base leading-relaxed md:text-lg">
            {children}
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
