import { getContent } from "@/app/lib/content";
import { EditableText } from "@einblick/editor/react";
import type { Metadata } from "next";

import LegalPage from "@/app/components/LegalPage";
import { EditableRegion } from "@einblick/editor/react";
import { getSiteInfos } from "@/app/types/infos";

export const metadata: Metadata = {
  title: "Impressum | z57",
  description: "Impressum der Website von z57.",
};

export default async function ImpressumPage() {
  const { content, pages } = await getContent();
  const siteInfos = await getSiteInfos();

  return (
    <LegalPage
      title={
        <EditableText
          editInline
          as="span"
          className="inline-block"
          binding={pages.impressum.binding("intro.title")}
        >
          {content.impressum.intro.title}
        </EditableText>
      }
      updatedAt={
        <EditableText
          editInline
          as="span"
          className="inline-block"
          binding={pages.impressum.binding("intro.updatedAt")}
        >
          {content.impressum.intro.updatedAt}
        </EditableText>
      }
      intro={
        <EditableText
          editInline
          as="p"
          binding={pages.impressum.binding("intro.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.impressum.intro.paragraph1}
        </EditableText>
      }
    >
      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.impressum.binding("publisher.heading")}
          placeholder="Text ergänzen"
        >
          {content.impressum.publisher.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.impressum.binding("publisher.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.impressum.publisher.paragraph1}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.impressum.binding("publisher.paragraph2")}
          placeholder="Text ergänzen"
        >
          {content.impressum.publisher.paragraph2}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.impressum.binding("publisher.paragraph3")}
          placeholder="Text ergänzen"
        >
          {content.impressum.publisher.paragraph3}
        </EditableText>
        <p>
          E-Mail:{" "}
          {siteInfos.emailHref && siteInfos.email ? (
            <a
              className="underline underline-offset-4"
              href={siteInfos.emailHref}
            >
              <EditableRegion
                as="span"
                className="inline-block"
                binding={siteInfos.bindings.email}
              >
                {siteInfos.email}
              </EditableRegion>
            </a>
          ) : null}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.impressum.binding("purpose.heading")}
          placeholder="Text ergänzen"
        >
          {content.impressum.purpose.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.impressum.binding("purpose.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.impressum.purpose.paragraph1}
        </EditableText>
      </section>

      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.impressum.binding("responsibility.heading")}
          placeholder="Text ergänzen"
        >
          {content.impressum.responsibility.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.impressum.binding("responsibility.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.impressum.responsibility.paragraph1}
        </EditableText>
      </section>

      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.impressum.binding("liability.heading")}
          placeholder="Text ergänzen"
        >
          {content.impressum.liability.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.impressum.binding("liability.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.impressum.liability.paragraph1}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.impressum.binding("liability.paragraph2")}
          placeholder="Text ergänzen"
        >
          {content.impressum.liability.paragraph2}
        </EditableText>
      </section>

      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.impressum.binding("copyright.heading")}
          placeholder="Text ergänzen"
        >
          {content.impressum.copyright.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.impressum.binding("copyright.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.impressum.copyright.paragraph1}
        </EditableText>
      </section>
    </LegalPage>
  );
}
