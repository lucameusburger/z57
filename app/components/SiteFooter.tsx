import Badge from "./Badge";
import EinblickLoginBadge from "./EinblickLoginBadge";
import PrivacySettingsBadge from "./PrivacySettingsBadge";
import { EditableRegion } from "@einblick/editor/react";
import { getSiteInfos } from "@/app/types/infos";
import { LEGAL_LINKS } from "@/app/lib/site-links";

const cellClasses = "flex flex-col items-start gap-2 px-4 py-6 md:px-7 md:py-8";

export default async function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const siteInfos = await getSiteInfos();

  return (
    <footer className="cells grid-cols-2 text-sm md:grid-cols-4 md:text-base">
      <div className={cellClasses}>
        <span>Copyright z57 © {currentYear}</span>
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
        {siteInfos.websiteHref && siteInfos.websiteLabel ? (
          <Badge
            href={siteInfos.websiteHref}
            variant="link"
            target="_blank"
            rel="noreferrer"
          >
            <EditableRegion
              as="span"
              className="inline-block"
              binding={siteInfos.bindings.website}
            >
              {siteInfos.websiteLabel}
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
    </footer>
  );
}
