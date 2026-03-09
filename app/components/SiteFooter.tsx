import Badge from "./Badge";

const legalLinks = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/cookies", label: "Cookies" },
];

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full px-4 md:px-8">
      <hr className="border-foreground" />
      <div className="flex flex-col items-start justify-between gap-6 py-8 md:flex-row">
        <div className="flex flex-wrap gap-2">
          <Badge variant="black">Copyright z57 © {currentYear}</Badge>
          <Badge variant="black">ZVR 1169564571</Badge>
          <Badge href="mailto:atelier@z57.at" variant="black">
            atelier@z57.at
          </Badge>
          <Badge className="whitespace-normal">Zieglergasse 57, 1070 Wien</Badge>
          <Badge
            href="https://lucameusburger.xyz"
            target="_blank"
            rel="noreferrer"
            className="whitespace-normal"
          >
            Website by Luca Meusburger
          </Badge>
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
