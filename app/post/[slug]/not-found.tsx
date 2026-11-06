import BackButton from "@/app/components/BackButton";
import Badge from "@/app/components/Badge";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader back={<BackButton />} />
      <main className="flex flex-1 flex-col justify-end gap-6 border-b px-4 py-8 md:px-7 md:py-10">
        <h1 className="text-heading">Post nicht gefunden</h1>
        <p className="max-w-xl">
          Der gesuchte Beitrag existiert nicht oder wurde verschoben.
        </p>
        <Badge href="/" variant="black">
          Zur Startseite
        </Badge>
      </main>
      <SiteFooter />
    </div>
  );
}
