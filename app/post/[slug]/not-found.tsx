import Badge from "@/app/components/Badge";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-4xl font-semibold md:text-6xl">Post nicht gefunden</h1>
      <p className="mb-8 max-w-xl text-lg text-foreground/70 md:text-xl">
        Der gesuchte Beitrag existiert nicht oder wurde verschoben.
      </p>
      <Badge href="/">
        Zur Startseite
      </Badge>
    </div>
  );
}
