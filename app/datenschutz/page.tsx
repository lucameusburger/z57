import { getContent } from "@/app/lib/content";
import { EditableText } from "@einblick/editor/react";
import type { Metadata } from "next";

import LegalPage from "@/app/components/LegalPage";
import { EditableRegion } from "@einblick/editor/react";
import { getSiteInfos } from "@/app/types/infos";

export const metadata: Metadata = {
  title: "Datenschutz | z57",
  description: "Datenschutzhinweise der Website von z57.",
};

export default async function DatenschutzPage() {
  const { content, pages } = await getContent();
  const siteInfos = await getSiteInfos();

  return (
    <LegalPage
      title={
        <EditableText
          editInline
          as="span"
          className="inline-block"
          binding={pages.datenschutz.binding("intro.title")}
        >
          {content.datenschutz.intro.title}
        </EditableText>
      }
      updatedAt={
        <EditableText
          editInline
          as="span"
          className="inline-block"
          binding={pages.datenschutz.binding("intro.updatedAt")}
        >
          {content.datenschutz.intro.updatedAt}
        </EditableText>
      }
      intro={
        <EditableText
          editInline
          as="p"
          binding={pages.datenschutz.binding("intro.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.intro.paragraph1}
        </EditableText>
      }
    >
      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.datenschutz.binding("controller.heading")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.controller.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.datenschutz.binding("controller.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.controller.paragraph1}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.datenschutz.binding("controller.paragraph2")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.controller.paragraph2}
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
          binding={pages.datenschutz.binding("access.heading")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.access.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.datenschutz.binding("access.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.access.paragraph1}
        </EditableText>
      </section>

      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.datenschutz.binding("contact.heading")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.contact.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.datenschutz.binding("contact.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.contact.paragraph1}
        </EditableText>
      </section>

      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.datenschutz.binding("forms.heading")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.forms.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.datenschutz.binding("forms.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.forms.paragraph1}
        </EditableText>
      </section>

      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.datenschutz.binding("legalBasis.heading")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.legalBasis.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.datenschutz.binding("legalBasis.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.legalBasis.paragraph1}
        </EditableText>
      </section>

      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.datenschutz.binding("analytics.heading")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.analytics.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.datenschutz.binding("analytics.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.analytics.paragraph1}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.datenschutz.binding("analytics.paragraph2")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.analytics.paragraph2}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.datenschutz.binding("analytics.paragraph3")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.analytics.paragraph3}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.datenschutz.binding("analytics.paragraph4")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.analytics.paragraph4}
        </EditableText>
      </section>

      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.datenschutz.binding("recipients.heading")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.recipients.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.datenschutz.binding("recipients.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.recipients.paragraph1}
        </EditableText>
      </section>

      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.datenschutz.binding("rights.heading")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.rights.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.datenschutz.binding("rights.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.rights.paragraph1}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.datenschutz.binding("rights.paragraph2")}
          placeholder="Text ergänzen"
        >
          {content.datenschutz.rights.paragraph2}
        </EditableText>
      </section>
    </LegalPage>
  );
}
