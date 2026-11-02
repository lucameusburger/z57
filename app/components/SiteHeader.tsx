import type { ReactNode } from "react";

import { MoveRight } from "lucide-react";
import Link from "next/link";

import { getContent } from "@/app/lib/content";
import { LEGAL_LINKS } from "@/app/lib/site-links";

import { CloverGlyph } from "./Shapes";
import SiteMenu, { MenuButton } from "./SiteMenu";

/**
 * `back` fills the middle cell on sub-pages. The home page has none and shows
 * its menu shortcut in the hero, so the menu button is mobile-only there.
 */
export default async function SiteHeader({ back }: { back?: ReactNode }) {
  const { content } = await getContent();

  return (
    <header className="cells grid-cols-[auto_minmax(0,1fr)_auto] bg-background max-md:sticky max-md:border-t max-md:top-0 max-md:z-40 md:grid-cols-[14%_minmax(0,1fr)_26.4%]">
      <Link
        href="/"
        className="flex h-14 items-center gap-2 px-4 font-medium transition-colors hover:bg-foreground hover:text-background md:h-[4.4rem] md:px-7"
      >
        <CloverGlyph className="h-4 w-4 md:h-5 md:w-5" />
        z57
      </Link>

      <div className="flex items-center justify-between gap-2 px-3 md:gap-4 md:px-7">
        <div>{back}</div>
        <MenuButton
          className={`transition-opacity hover:opacity-60 ${back ? "" : "md:hidden"}`}
        >
          Menü
        </MenuButton>
      </div>

      <Link
        href="/#kontakt"
        className="flex items-center justify-center gap-2.5 whitespace-nowrap px-4 transition-colors hover:bg-foreground hover:text-background"
      >
        {content.home.contact.heading}
        <MoveRight className="h-4 w-4 flex-none" aria-hidden="true" />
      </Link>

      <SiteMenu
        items={[
          { href: "/wintermarkt-2026", label: content.home.wintermarkt.heading },
          { href: "/#aktuelles", label: content.home.posts.heading },
          { href: "/#raum", label: content.home.model.heading },
          { href: "/#wer-wir-sind", label: content.home.members.heading },
          { href: "/#kontakt", label: content.home.contact.heading },
          { href: "/posts", label: content.archive.intro.heading },
        ]}
        legalItems={LEGAL_LINKS}
      />
    </header>
  );
}
