import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Event nicht gefunden</h1>
            <p className="text-xl mb-8 text-center">
                Das gesuchte Event existiert nicht oder wurde entfernt.
            </p>
            <Link
                href="/"
                className="border-foreground border-2 rounded-full px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
            >
                Zur Startseite
            </Link>
        </div>
    );
}

