import Badge from "./Badge";
import EinblickLoginBadge from "./EinblickLoginBadge";
import PrivacySettingsBadge from "./PrivacySettingsBadge";
import { EditableRegion } from "@einblick/editor/react";
import { Instagram, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getSiteInfos } from "@/app/types/infos";
import { LEGAL_LINKS } from "@/app/lib/site-links";

const cellClasses = "flex flex-col items-start gap-2 px-4 py-6 md:px-7 md:py-8";

export default async function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const siteInfos = await getSiteInfos();

  return (
    <>
      {/* Marks the end of the page content. The "#kontakt" links land here
          (the footer itself is always on screen, so it can't be scrolled to). */}
      <div id="kontakt" aria-hidden="true" />

      {/* Pinned to the bottom of the screen behind the content, which slides
          up to reveal it. It keeps its own height, so the page ends as soon as
          the whole footer has come into view. */}
      <footer className="sticky bottom-0 flex flex-col">
        <div className="cells h-48 grid-cols-2 md:h-64">
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
              className="bg-foreground text-background hover:bg-lime hover:text-foreground"
            >
              <EditableRegion as="span" binding={siteInfos.bindings.instagram}>
                {siteInfos.instagramLabel ?? "Instagram"}
              </EditableRegion>
            </ContactTile>
          ) : null}
        </div>

        <div className="cells grid-cols-2 text-sm md:grid-cols-4 md:text-base">
          <div className={cellClasses}>
            <span>Copyright Z57 © {currentYear}</span>
            <span>ZVR 1169564571</span>
            <span>Zieglergasse 57, 1070 Wien</span>
          </div>

          <div className={cellClasses}>
            {siteInfos.emailHref && siteInfos.email ? (
              <Badge href={siteInfos.emailHref} variant="link">
                <EditableRegion
                  as="span"
                  className="inline-block"
                  binding={siteInfos.bindings.email}
                >
                  {siteInfos.email}
                </EditableRegion>
              </Badge>
            ) : null}
            {siteInfos.instagramHref && siteInfos.instagramLabel ? (
              <Badge
                href={siteInfos.instagramHref}
                variant="link"
                target="_blank"
                rel="noreferrer"
              >
                <EditableRegion
                  as="span"
                  className="inline-block"
                  binding={siteInfos.bindings.instagram}
                >
                  Instagram: {siteInfos.instagramLabel}
                </EditableRegion>
              </Badge>
            ) : null}
          </div>

          <nav aria-label="Rechtliches" className={cellClasses}>
            {LEGAL_LINKS.map((link) => (
              <Badge key={link.href} href={link.href} variant="link">
                {link.label}
              </Badge>
            ))}
            <PrivacySettingsBadge />
          </nav>

          <div className={cellClasses}>
            <Badge
              href="https://www.lucameusburger.com"
              variant="link"
              target="_blank"
              rel="noreferrer"
            >
              Website by Luca Meusburger
            </Badge>
            <EinblickLoginBadge />
          </div>
        </div>
      </footer>
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
  icon: ReactNode;
  label: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "flex flex-col justify-between p-4 transition-colors hover:bg-foreground hover:text-background md:p-7",
        className,
      )}
    >
      {icon}
      <span className="flex flex-col gap-1">
        <span>{label}</span>
        <span className="text-sub break-words">{children}</span>
      </span>
    </a>
  );
}
