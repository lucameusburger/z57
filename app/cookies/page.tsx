import { getContent } from "@/app/lib/content";
import { EditableText } from "@einblick/editor/react";
import type { Metadata } from "next";

import LegalPage from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookies | z57",
  description: "Informationen zu Cookies auf der Website von z57.",
};

export default async function CookiesPage() {
  const { content, pages } = await getContent();
  return (
    <LegalPage
      title={
        <EditableText
          editInline
          as="span"
          className="inline-block"
          binding={pages.cookies.binding("intro.title")}
        >
          {content.cookies.intro.title}
        </EditableText>
      }
      updatedAt={
        <EditableText
          editInline
          as="span"
          className="inline-block"
          binding={pages.cookies.binding("intro.updatedAt")}
        >
          {content.cookies.intro.updatedAt}
        </EditableText>
      }
      intro={
        <EditableText
          editInline
          as="p"
          binding={pages.cookies.binding("intro.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.cookies.intro.paragraph1}
        </EditableText>
      }
    >
      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.cookies.binding("current.heading")}
          placeholder="Text ergänzen"
        >
          {content.cookies.current.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.cookies.binding("current.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.cookies.current.paragraph1}
        </EditableText>
      </section>

      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.cookies.binding("choice.heading")}
          placeholder="Text ergänzen"
        >
          {content.cookies.choice.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.cookies.binding("choice.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.cookies.choice.paragraph1}
        </EditableText>
      </section>

      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.cookies.binding("necessary.heading")}
          placeholder="Text ergänzen"
        >
          {content.cookies.necessary.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.cookies.binding("necessary.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.cookies.necessary.paragraph1}
        </EditableText>
      </section>

      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.cookies.binding("browser.heading")}
          placeholder="Text ergänzen"
        >
          {content.cookies.browser.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.cookies.binding("browser.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.cookies.browser.paragraph1}
        </EditableText>
      </section>

      <section className="flex flex-col gap-3">
        <EditableText
          editInline
          as="h2"
          className="text-2xl font-semibold md:text-3xl"
          binding={pages.cookies.binding("changes.heading")}
          placeholder="Text ergänzen"
        >
          {content.cookies.changes.heading}
        </EditableText>
        <EditableText
          editInline
          as="p"
          binding={pages.cookies.binding("changes.paragraph1")}
          placeholder="Text ergänzen"
        >
          {content.cookies.changes.paragraph1}
        </EditableText>
      </section>
    </LegalPage>
  );
}
