import { EditableRegion, EditableText } from "@einblick/editor/react";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import EinblickForm from "@/app/components/forms/EinblickForm";
import SectionHead from "@/app/components/SectionHead";
import { LargeShape } from "@/app/components/Shapes";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { getContent } from "@/app/lib/content";
import { getPublicFormState } from "@/app/lib/forms/einblick";
import { WINTERMARKT_FORM_SLUG } from "@/app/lib/forms/logic";
import { pageMetadata } from "@/app/lib/metadata";
import { getSiteInfos } from "@/app/types/infos";

// One row of four on mobile, a 2×2 grid from md up: the bottom row swaps
// colours there so the tiles alternate as a checkerboard.
const SHAPE_TILES = [
  { shape: "stackedPills", className: "bg-lime text-foreground" },
  { shape: "clover", className: "bg-foreground text-lime" },
  {
    shape: "cup",
    className: "bg-lime text-foreground md:bg-foreground md:text-lime",
  },
  {
    shape: "sideBySidePills",
    className: "bg-foreground text-lime md:bg-lime md:text-foreground",
  },
] as const;

// Key facts and notes shown above the form, as field names of the
// `details` section.
const FACTS = [
  { label: "dateLabel", value: "date" },
  { label: "placeLabel", value: "place" },
  { label: "feeLabel", value: "fee" },
  { label: "deadlineLabel", value: "deadline" },
] as const;

const NOTES = [
  { title: "marketingTitle", text: "marketingText" },
  { title: "presenceTitle", text: "presenceText" },
] as const;

// The question list and the response window change without a deploy.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getContent();
  const { heading, lead } = content.wintermarkt.intro;

  return pageMetadata({
    title: `${heading} – Bewerbung`,
    description: lead,
    path: "/wintermarkt-2026",
  });
}

export default async function WintermarktPage() {
  const { content, pages } = await getContent();
  const siteInfos = await getSiteInfos();
  const formState = await getPublicFormState(WINTERMARKT_FORM_SLUG);
  const copy = content.wintermarkt;
  const details = copy.details;

  return (
    <div data-theme="wintermarkt" className="flex min-h-dvh flex-col">
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
              className="text-heading"
              binding={pages.wintermarkt.binding("intro.heading")}
              placeholder="Überschrift ergänzen"
            >
              {copy.intro.heading}
            </EditableText>
          }
          aside={
            <EditableText
              editInline
              as="p"
              binding={pages.wintermarkt.binding("intro.aside")}
              placeholder="Text ergänzen"
            >
              {copy.intro.aside}
            </EditableText>
          }
        />

        <div className="cells md:grid-cols-4">
          <div className="bg-lime px-4 py-6 md:col-span-3 md:px-7 md:py-10">
            <EditableText
              editInline
              as="p"
              className="text-lead"
              binding={pages.wintermarkt.binding("intro.lead")}
              placeholder="Text ergänzen"
            >
              {copy.intro.lead}
            </EditableText>
          </div>
          <div
            aria-hidden="true"
            className="grid grid-cols-4 md:grid-cols-2"
          >
            {SHAPE_TILES.map(({ shape, className }) => (
              <div
                key={shape}
                className={`flex aspect-square items-center justify-center overflow-hidden ${className}`}
              >
                <LargeShape name={shape} className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>

        <dl className="cells grid-cols-2 md:grid-cols-4">
          {FACTS.map(({ label, value }) => (
            <div
              key={value}
              className="flex flex-col gap-3 px-4 py-5 md:px-7 md:py-7"
            >
              <EditableText
                editInline
                as="dt"
                className="text-sm"
                binding={pages.wintermarkt.binding(`details.${label}`)}
                placeholder="Bezeichnung ergänzen"
              >
                {details[label]}
              </EditableText>
              <EditableText
                editInline
                as="dd"
                className="text-sub whitespace-pre-line"
                binding={pages.wintermarkt.binding(`details.${value}`)}
                placeholder="Text ergänzen"
              >
                {details[value]}
              </EditableText>
            </div>
          ))}
        </dl>

        <div className="cells md:grid-cols-2">
          {NOTES.map(({ title, text }) => (
            <div
              key={title}
              className="flex flex-col gap-3 px-4 py-6 md:px-7 md:py-8"
            >
              <EditableText
                editInline
                as="h2"
                className="text-sub"
                binding={pages.wintermarkt.binding(`details.${title}`)}
                placeholder="Überschrift ergänzen"
              >
                {details[title]}
              </EditableText>
              <EditableText
                editInline
                as="p"
                className="max-w-xl"
                binding={pages.wintermarkt.binding(`details.${text}`)}
                placeholder="Text ergänzen"
              >
                {details[text]}
              </EditableText>
            </div>
          ))}
        </div>

        <EditableText
          editInline
          as="p"
          className="border-b px-4 py-5 md:px-7 md:py-7"
          binding={pages.wintermarkt.binding("details.nextSteps")}
          placeholder="Text ergänzen"
        >
          {details.nextSteps}
        </EditableText>

        {formState.status === "open" ? (
          <EinblickForm
            form={formState.form}
            copy={{
              requiredHint: copy.form.requiredHint,
              submitLabel: copy.form.submitLabel,
              privacyNote: copy.form.privacyNote,
              thankYouTitle: copy.form.thankYouTitle,
              thankYouMessage: copy.form.thankYouMessage,
            }}
          />
        ) : (
          <section className="border-b px-4 py-10 md:px-7 md:py-16">
            <EditableText
              editInline
              as="h2"
              className="text-lead"
              binding={pages.wintermarkt.binding(
                formState.status === "closed"
                  ? "closed.closedTitle"
                  : "closed.unavailableTitle",
              )}
              placeholder="Überschrift ergänzen"
            >
              {formState.status === "closed"
                ? copy.closed.closedTitle
                : copy.closed.unavailableTitle}
            </EditableText>
            <p className="mt-4 max-w-2xl">
              <EditableText
                editInline
                as="span"
                className="inline"
                binding={pages.wintermarkt.binding("closed.text")}
                placeholder="Text ergänzen"
              >
                {copy.closed.text}
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
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
