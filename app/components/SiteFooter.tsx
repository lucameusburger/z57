import Badge from "./Badge";
import EinblickLoginBadge from "./EinblickLoginBadge";
import { EditableText } from "@einblick/sdk/react";
import { getSiteInfos } from "@/app/types/infos";

const legalLinks = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/cookies", label: "Cookies" },
];

export default async function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const siteInfos = await getSiteInfos();

  return (
    <footer className="w-full px-4 md:px-8">
      <hr className="border-foreground" />
      <div className="flex flex-col items-start justify-between gap-6 py-8 md:flex-row">
        <div className="flex flex-wrap gap-2">
          <Badge variant="black">Copyright z57 © {currentYear}</Badge>
          <Badge variant="black">ZVR 1169564571</Badge>
          {siteInfos.emailHref && siteInfos.email ? (
            <Badge href={siteInfos.emailHref} variant="black">
              <EditableText as="span" binding={siteInfos.bindings.email}>
                {siteInfos.email}
              </EditableText>
            </Badge>
          ) : null}
          {siteInfos.instagramHref && siteInfos.instagramLabel ? (
            <Badge
              href={siteInfos.instagramHref}
              variant="black"
              target="_blank"
              rel="noreferrer"
            >
              <EditableText as="span" binding={siteInfos.bindings.instagram}>
                Instagram: {siteInfos.instagramLabel}
              </EditableText>
            </Badge>
          ) : null}
          {siteInfos.websiteHref && siteInfos.websiteLabel ? (
            <Badge
              href={siteInfos.websiteHref}
              variant="black"
              target="_blank"
              rel="noreferrer"
            >
              <EditableText as="span" binding={siteInfos.bindings.website}>
                {siteInfos.websiteLabel}
              </EditableText>
            </Badge>
          ) : null}
          <Badge className="whitespace-normal">Zieglergasse 57, 1070 Wien</Badge>
          <Badge
            href="https://lucameusburger.xyz"
            target="_blank"
            rel="noreferrer"
            className="whitespace-normal"
          >
            Website by Luca Meusburger
          </Badge>
          <EinblickLoginBadge />
        </div>

        <nav aria-label="Rechtliches" className="flex flex-wrap items-start gap-2">
          {legalLinks.map((link) => (
            <Badge key={link.href} href={link.href}>
              {link.label}
            </Badge>
          ))}
        </nav>
      </div>
    </footer>
  );
}
