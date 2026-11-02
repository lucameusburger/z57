import type { ReactNode } from "react";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import SectionHead from "./SectionHead";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

type LegalPageProps = {
  title: ReactNode;
  intro: ReactNode;
  updatedAt: ReactNode;
  children: ReactNode;
};

export default function LegalPage({
  title,
  intro,
  updatedAt,
  children,
}: LegalPageProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader
        back={
          <Link
            href="/"
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-60"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Zurück
          </Link>
        }
      />

      <main className="flex-1">
        <SectionHead
          title={<h1 className="text-display break-words">{title}</h1>}
          aside={<p>Stand: {updatedAt}</p>}
        />

        <div className="border-b px-4 py-8 md:px-7 md:py-10">
          <div className="text-lead max-w-[75%] max-md:max-w-none">{intro}</div>
        </div>

        <article className="legal-body flex flex-col">
          {children}
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
