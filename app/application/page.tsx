import { getContent } from "@/app/lib/content";
import { EditableRegion, EditableText } from "@einblick/editor/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import SectionHead from "@/app/components/SectionHead";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { getSiteInfos } from "@/app/types/infos";

export default async function ApplicationPage() {
  const { content, pages } = await getContent();
  const siteInfos = await getSiteInfos();

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
          title={
            <EditableText
              editInline
              as="h1"
              className="text-display"
              binding={pages.application.binding("intro.heading")}
              placeholder="Text ergänzen"
            >
              {content.application.intro.heading}
            </EditableText>
          }
        />

        <p className="text-lead border-b bg-lime px-4 py-8 md:px-7 md:py-10">
          <EditableText
            editInline
            as="span"
            className="inline"
            binding={pages.application.binding("intro.intro")}
          >
            {content.application.intro.intro}
          </EditableText>{" "}
          {siteInfos.emailHref && siteInfos.email ? (
            <a className="underline underline-offset-4" href={siteInfos.emailHref}>
              <EditableRegion
                as="span"
                className="inline-block"
                binding={siteInfos.bindings.email}
              >
                {siteInfos.email}
              </EditableRegion>
            </a>
          ) : null}
          .
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
