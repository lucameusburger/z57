import { getEinblickAssetUrl } from "@/app/lib/assets";
import { getCategories, parseHeroText } from "@/app/lib/categories";
import { getContent } from "@/app/lib/content";
import {
  EditableCollection,
  EditableImage,
  EditableRegion,
  EditableText,
  createEditableCollectionBinding,
} from "@einblick/editor/react";
import { Globe, Instagram, Mail, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Badge from "./components/Badge";
import JsonLd from "./components/JsonLd";
import MemberItem from "./components/MemberItem";
import PostGallery from "./components/PostGallery";
import PostsSection from "./components/PostsSection";
import SectionHead from "./components/SectionHead";
import { LargeShape, ShapeMask } from "./components/Shapes";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { MenuButton } from "./components/SiteMenu";
import Wireframe from "./components/Wireframe";
import { cn } from "@/lib/utils";
import {
  absoluteUrl,
  pageMetadata,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/app/lib/metadata";
import { getSiteInfos } from "@/app/types/infos";
import { getMembers } from "@/app/types/members";
import { getHomepagePosts } from "@/app/types/posts";
import groupImage from "@/app/images/group.jpg";

const HERO_TILES = [
  { shape: "sideBySidePills", field: "image1", className: "bg-lime" },
  { shape: "stackedPills", field: "image2", className: "bg-foreground" },
  { shape: "clover", field: "image3", className: "bg-leaf" },
  { shape: "cup", field: "image4", className: "bg-lime" },
] as const;

const FILLER_TILES = [
  { shape: "stackedPills", className: "bg-lime text-foreground" },
  { shape: "cup", className: "bg-leaf text-lime" },
  { shape: "sideBySidePills", className: "bg-foreground text-lime" },
] as const;

export const metadata = pageMetadata({ path: "/" });

function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    // Random member order is an intentional server-rendered presentation choice.
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default async function Home() {
  const { content, pages } = await getContent();
  const homepagePosts = await getHomepagePosts();
  const members = await getMembers();
  const siteInfos = await getSiteInfos();

  const { tagline } = parseHeroText(content.home.hero.text);
  const categories = await getCategories();
  // Four columns on desktop, two on mobile: colour tiles close the last row.
  const desktopFillers = (4 - (categories.length % 4)) % 4;
  const mobileFillers = categories.length % 2;

  // The pinned "space" post is the studio's self-description: it becomes the
  // statement under the hero instead of an entry in the list of news.
  const studioPost = homepagePosts.find(
    (post) => post.pinned && post.kind === "space",
  );
  const newsPosts = homepagePosts.filter((post) => post !== studioPost);

  const memberFields = [...new Set(members.map((member) => member.title))].sort(
    (left, right) => left.localeCompare(right, "de"),
  );

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
            {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              description: SITE_DESCRIPTION,
              logo: absoluteUrl("/icon-512.png"),
              email: siteInfos.email,
              sameAs: siteInfos.instagramHref
                ? [siteInfos.instagramHref]
                : undefined,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Zieglergasse 57",
                postalCode: "1070",
                addressLocality: "Wien",
                addressCountry: "AT",
              },
            },
          ],
        }}
      />
      <SiteHeader />
      <main id="top">
        <h1 className="sr-only">
          {content.home.hero.line1} {content.home.hero.line2}{" "}
          {content.home.hero.line3}
        </h1>

        <div className="cells grid-cols-1 md:grid-cols-[minmax(0,1fr)_26.4%]">
          <div aria-hidden="true" className="px-4 py-3 md:px-7 md:py-[1.2vw]">
            <EditableText
              editInline
              as="span"
              className="text-display block"
              binding={pages.home.binding("hero.line1")}
              placeholder="Text ergänzen"
            >
              {content.home.hero.line1}
            </EditableText>
          </div>
          <div aria-hidden="true" className="hidden md:block" />
        </div>

        <div className="cells grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_auto_5.5vw]">
          <div aria-hidden="true" className="relative overflow-hidden bg-lime">
            <Wireframe
              src="/model/wireframe-detail.bin"
              closeUp
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <div
            aria-hidden="true"
            className="px-4 py-3 md:px-[2.6vw] md:py-[1.2vw]"
          >
            <EditableText
              editInline
              as="span"
              className="text-display block whitespace-nowrap"
              binding={pages.home.binding("hero.line2")}
              placeholder="Text ergänzen"
            >
              {content.home.hero.line2}
            </EditableText>
          </div>
          <MenuButton className="hidden items-center justify-center transition-colors hover:bg-foreground hover:text-background md:flex">
            <span className="rotate-180 whitespace-nowrap text-xs [writing-mode:vertical-rl]">
              cmd/ctrl + k für Menü
            </span>
          </MenuButton>
        </div>

        <div
          aria-hidden="true"
          className="border-b px-4 py-3 md:px-7 md:py-[1.2vw]"
        >
          <EditableText
            editInline
            as="span"
            className="text-display block"
            binding={pages.home.binding("hero.line3")}
            placeholder="Text ergänzen"
          >
            {content.home.hero.line3}
          </EditableText>
        </div>

        <div aria-hidden="true" className="grid grid-cols-2 md:grid-cols-4">
          {HERO_TILES.map(({ shape, field, className }) => {
            const image = content.home.hero[field];
            // The code defaults are local files, which the CDN can't resize.
            const isLocal = image.url.startsWith("/");

            return (
              <EditableImage
                key={shape}
                as="div"
                binding={pages.home.binding(`hero.${field}`)}
                placeholder="Bild hinzufügen"
                className={`group overflow-hidden ${className}`}
              >
                {/* Shrinking while turning keeps square corners inside the tile.
                    The photo undoes that transform, so only the mask moves. */}
                <ShapeMask
                  name={shape}
                  className="relative aspect-square transition-transform duration-700 ease-out group-hover:rotate-90 group-hover:scale-[0.82]"
                >
                  <Image
                    src={isLocal ? image.url : (getEinblickAssetUrl(image) ?? image.url)}
                    unoptimized={isLocal}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:-rotate-90 group-hover:scale-[1.22]"
                  />
                </ShapeMask>
              </EditableImage>
            );
          })}
        </div>

        <section aria-labelledby="wintermarkt-heading" className="border-t">
          <Link
            href="/wintermarkt-2026"
            className="form-focus cells group md:grid-cols-4"
          >
            <div className="flex flex-col gap-3 bg-lime px-4 py-6 md:col-span-3 md:px-7 md:py-7">
              <EditableText
                editInline
                as="h2"
                id="wintermarkt-heading"
                className="text-lead"
                binding={pages.home.binding("wintermarkt.heading")}
                placeholder="Überschrift ergänzen"
              >
                {content.home.wintermarkt.heading}
              </EditableText>
              <EditableText
                editInline
                as="p"
                binding={pages.home.binding("wintermarkt.text")}
                placeholder="Text ergänzen"
              >
                {content.home.wintermarkt.text}
              </EditableText>
            </div>
            <div className="flex items-center justify-between gap-4 bg-foreground px-4 py-5 text-background transition-colors group-hover:bg-leaf group-hover:text-foreground md:items-end md:px-7 md:py-7">
              <EditableText
                editInline
                as="span"
                className="text-sub"
                binding={pages.home.binding("wintermarkt.linkLabel")}
                placeholder="Text ergänzen"
              >
                {content.home.wintermarkt.linkLabel}
              </EditableText>
              <MoveRight className="h-6 w-6 flex-none" aria-hidden="true" />
            </div>
          </Link>
        </section>

        {studioPost ? (
          <EditableRegion
            as="section"
            binding={studioPost.bindings.region}
            className="cells md:grid-cols-4"
          >
            <div className="px-4 pb-6 pt-16 md:col-span-3 md:px-7 md:pb-7 md:pt-[11vw]">
              <EditableText
                editInline
                as="p"
                binding={studioPost.bindings.summary}
                placeholder="Beschreibung ergänzen"
                className="text-lead"
              >
                {studioPost.summary}
              </EditableText>
            </div>
            <div className="flex flex-col justify-end gap-3 px-4 py-5 md:px-7 md:py-7">
              <p>{tagline}</p>
              <Badge href={studioPost.href} variant="link">
                <EditableText
                  editInline
                  as="span"
                  binding={studioPost.bindings.title}
                  placeholder="Titel ergänzen"
                >
                  {studioPost.title}
                </EditableText>
              </Badge>
            </div>
          </EditableRegion>
        ) : null}

        <EditableRegion
          as="div"
          binding={pages.home.binding("hero.text")}
          className="cells grid-cols-2 md:grid-cols-4"
        >
          {categories.map(({ key, label, Glyph }) => (
            <div
              key={key}
              className="flex min-h-44 flex-col gap-6 px-4 py-5 md:min-h-[15vw] md:px-7 md:py-7"
            >
              <Glyph className="h-9 w-9 flex-none md:h-11 md:w-11" />
              <span className="text-sub first-letter:uppercase">{label}</span>
            </div>
          ))}
          {FILLER_TILES.slice(0, desktopFillers).map(
            ({ shape, className }, index) => (
              <div
                key={shape}
                aria-hidden="true"
                className={`${index < mobileFillers ? "flex" : "hidden md:flex"} items-center justify-center overflow-hidden ${className}`}
              >
                <LargeShape name={shape} className="h-full max-h-44 md:max-h-[15vw]" />
              </div>
            ),
          )}
        </EditableRegion>

        {studioPost?.galleryImages.length ? (
          <EditableRegion
            as="div"
            binding={studioPost.bindings.gallery}
            className="border-b"
          >
            <PostGallery
              images={studioPost.galleryImages}
              title={studioPost.title}
            />
          </EditableRegion>
        ) : null}

        <section id="aktuelles">
          <SectionHead
            title={
              <EditableText
                editInline
                as="h2"
                className="text-display"
                binding={pages.home.binding("posts.heading")}
                placeholder="Überschrift ergänzen"
              >
                {content.home.posts.heading}
              </EditableText>
            }
            aside={
              <EditableText
                editInline
                as="p"
                binding={pages.archive.binding("intro.intro")}
                placeholder="Text ergänzen"
              >
                {content.archive.intro.intro}
              </EditableText>
            }
          />
          <PostsSection posts={newsPosts} showAllPostsLink />
        </section>

        <section id="raum">
          <SectionHead
            title={
              <EditableText
                editInline
                as="h2"
                className="text-display"
                binding={pages.home.binding("model.heading")}
                placeholder="Überschrift ergänzen"
              >
                {content.home.model.heading}
              </EditableText>
            }
          />
          <div className="border-b bg-lime">
            <Wireframe
              src="/model/wireframe.bin"
              className="aspect-[4/3] max-h-[85vh] w-full md:aspect-[2/1]"
            />
          </div>
        </section>

        <section id="wer-wir-sind">
          <SectionHead
            title={
              <EditableText
                editInline
                as="h2"
                className="text-display"
                binding={pages.home.binding("members.heading")}
                placeholder="Überschrift ergänzen"
              >
                {content.home.members.heading}
              </EditableText>
            }
            aside={<p>{memberFields.join(", ")}</p>}
          />
          <EditableCollection
            as="div"
            binding={createEditableCollectionBinding({
              resourceSlug: "members",
              label: "Members",
            })}
            showCreateButton
            createButtonWrapperClassName="p-4 md:px-7"
            className="cells grid-cols-2 xl:grid-cols-4"
          >
            {shuffled(members).map((member) => (
              <MemberItem key={member.name} member={member} />
            ))}
          </EditableCollection>
        </section>

        <section id="kontakt">
          <SectionHead
            title={
              <EditableText
                editInline
                as="h2"
                className="text-display"
                binding={pages.home.binding("contact.heading")}
                placeholder="Überschrift ergänzen"
              >
                {content.home.contact.heading}
              </EditableText>
            }
            aside={<p>Zieglergasse 57, 1070 Wien</p>}
          />
          <div className="cells grid-cols-2 md:grid-cols-4">
            {siteInfos.emailHref && siteInfos.email ? (
              <ContactTile
                href={siteInfos.emailHref}
                icon={<Mail className="h-8 w-8 md:h-11 md:w-11" strokeWidth={1.5} />}
                label="E-Mail"
                className="bg-lime"
              >
                <EditableRegion as="span" binding={siteInfos.bindings.email}>
                  {siteInfos.email}
                </EditableRegion>
              </ContactTile>
            ) : null}
            {siteInfos.instagramHref ? (
              <ContactTile
                href={siteInfos.instagramHref}
                external
                icon={<Instagram className="h-8 w-8 md:h-11 md:w-11" strokeWidth={1.5} />}
                label="Instagram"
                className="bg-leaf"
              >
                <EditableRegion as="span" binding={siteInfos.bindings.instagram}>
                  {siteInfos.instagramLabel ?? "Instagram"}
                </EditableRegion>
              </ContactTile>
            ) : null}
            {siteInfos.websiteHref ? (
              <ContactTile
                href={siteInfos.websiteHref}
                external
                icon={<Globe className="h-8 w-8 md:h-11 md:w-11" strokeWidth={1.5} />}
                label="Website"
                className="bg-foreground text-background hover:bg-lime hover:text-foreground"
              >
                <EditableRegion as="span" binding={siteInfos.bindings.website}>
                  {siteInfos.websiteLabel ?? "Website"}
                </EditableRegion>
              </ContactTile>
            ) : null}
            <div className="relative aspect-square overflow-hidden">
              <Image
                unoptimized
                src={groupImage}
                alt="Gruppenfoto"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function ContactTile({
  href,
  external = false,
  icon,
  label,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  icon: React.ReactNode;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "flex aspect-square flex-col justify-between p-4 transition-colors hover:bg-foreground hover:text-background md:p-7",
        className,
      )}
    >
      {icon}
      <span className="flex flex-col gap-1">
        <span>{label}</span>
        <span className="text-sub break-words">
          {children}
        </span>
      </span>
    </a>
  );
}
