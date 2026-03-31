import { ArrowLeft } from "lucide-react";

import Link from "next/link";
import { EditableText } from "@einblick/sdk/react";
import { getSiteInfos } from "@/app/types/infos";

export default async function ApplicationPage() {
  const siteInfos = await getSiteInfos();

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

        <div className="mx-auto mt-12 flex w-full max-w-3xl flex-col gap-6 rounded-[2rem] border border-foreground/10 bg-foreground px-6 py-8 text-background md:px-8 md:py-10">
          <span className="text-sm uppercase tracking-[0.16em] text-background/60">
            legacy
          </span>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Bewerbung derzeit pausiert
          </h1>
          <p className="text-lg leading-relaxed text-background/80 md:text-xl">
            Das Bewerbungsformular bleibt vorerst nur als Archivseite bestehen und ist aktuell
            nicht aktiv. Wenn ihr mit z57 in Kontakt treten möchtet, schreibt direkt an{" "}
            {siteInfos.emailHref && siteInfos.email ? (
              <a className="underline underline-offset-4" href={siteInfos.emailHref}>
                <EditableText as="span" binding={siteInfos.bindings.email}>
                  {siteInfos.email}
                </EditableText>
              </a>
            ) : null}
            .
          </p>
        </div>
      </main>
    </div>
  );
}
