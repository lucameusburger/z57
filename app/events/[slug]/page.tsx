import { Calendar, Clock, CornerRightUp, MapPin } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { getEventBySlug } from "@/app/types/events";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";

interface EventPageProps {
    params: Promise<{
        slug: string;
    }>;
}

/**
 * Generate metadata for the event page
 */
export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
    const { slug } = await params;
    const event = getEventBySlug(slug);

    if (!event) {
        return {
            title: "Event nicht gefunden",
        };
    }

    return {
        title: `${event.title} | z57`,
        description: event.excerpt || event.details || `Informationen zum Event ${event.title}`,
        openGraph: {
            title: event.title,
            description: event.excerpt || event.details,
            type: "website",
        },
    };
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

/**
 * Format date range for display
 */
function formatDateRange(start: string, end?: string): string {
    const startDate = formatDate(start);
    if (!end) return startDate;

    const endDate = formatDate(end);
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    // If same year, only show year once
    if (startDateObj.getFullYear() === endDateObj.getFullYear()) {
        const startDay = startDateObj.getDate().toString().padStart(2, "0");
        const startMonth = (startDateObj.getMonth() + 1).toString().padStart(2, "0");
        const endDay = endDateObj.getDate().toString().padStart(2, "0");
        const endMonth = (endDateObj.getMonth() + 1).toString().padStart(2, "0");
        return `${startDay}.${startMonth}.–${endDay}.${endMonth}.${startDateObj.getFullYear()}`;
    }

    return `${startDate}–${endDate}`;
}

export default async function EventPage({ params }: EventPageProps) {
    const { slug } = await params;
    const event = getEventBySlug(slug);

    if (!event) {
        notFound();
    }

    return (
        <div className="items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col w-full">
                {/* Header */}
                <div className="flex flex-col gap-8 px-4 md:px-8 pt-8">
                    <div className="flex justify-between items-center w-full border-t border-foreground pt-4">
                        <Link href="/" className="text-2xl md:text-5xl hover:opacity-70 transition-opacity">
                            ← Zurück
                        </Link>
                        <a href="#top">
                            <CornerRightUp className="w-6 h-6" />
                        </a>
                    </div>

                    {/* Event Header */}
                    <div className="flex flex-col md:flex-row gap-8 w-full">
                        {/* Left side - Event info card */}
                        <div className="flex-1 border-foreground w-full flex flex-col gap-4 justify-between text-woit bg-foreground border overflow-hidden relative rounded-3xl p-4 md:p-8">
                            {event.svg ? (
                                <div
                                    className="w-12 h-12 [&_svg]:fill-current [&_svg]:transition-colors"
                                    dangerouslySetInnerHTML={{
                                        __html: event.svg.replace(/id="[^"]*"/, `id="badge-svg-${event.id}"`).replace(
                                            /<svg([^>]*)>/,
                                            '<svg$1 style="width: 100%; height: 100%;" preserveAspectRatio="xMidYMid meet">'
                                        ),
                                    }}
                                />
                            ) : null}

                            <div className="flex flex-col gap-6">
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-bold mb-4">{event.title}</h1>
                                    {event.excerpt && (
                                        <p className="text-xl opacity-90">{event.excerpt}</p>
                                    )}
                                </div>

                                <hr className="border-current" />

                                {/* Date and Location Info */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 mt-1 flex-shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="text-sm opacity-75">Datum</span>
                                            <span className="text-xl font-semibold">
                                                {formatDateRange(event.date.start, event.date.end)}
                                            </span>
                                            {event.date.openingHours && (
                                                <span className="text-lg opacity-90 mt-1">
                                                    <Clock className="w-4 h-4 inline mr-1" />
                                                    {event.date.openingHours}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="text-sm opacity-75">Ort</span>
                                            <span className="text-xl font-semibold">{event.location.name}</span>
                                            <span className="text-lg opacity-90">
                                                {event.location.address}
                                                {event.location.postalCode && `, ${event.location.postalCode}`} {event.location.city}
                                                {event.location.country && `, ${event.location.country}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                {event.applicationUrl && (
                                    <>
                                        <hr className="border-current" />
                                        <Link
                                            href={event.applicationUrl}
                                            className="border-background border-2 rounded-full px-6 py-3 text-center hover:bg-background hover:text-foreground transition-colors font-semibold"
                                        >
                                            {event.cta || "Jetzt bewerben"}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right side - Image or colored background */}
                        <div className="flex-1 h-auto relative min-h-[400px] md:min-h-[600px]">
                            {event.thumbnail ? (
                                <Image
                                    src={event.thumbnail.src}
                                    alt={event.thumbnail.alt}
                                    className="object-cover rounded-3xl w-full h-full"
                                    fill
                                />
                            ) : event.color ? (
                                <div
                                    className="w-full h-full rounded-3xl relative"
                                    style={{ backgroundColor: event.color }}
                                >
                                    {event.svg && (
                                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-16">
                                            <div
                                                className="w-full h-full [&_svg]:fill-white [&_svg]:opacity-20"
                                                dangerouslySetInnerHTML={{
                                                    __html: event.svg.replace(/id="[^"]*"/, `id="svg-${event.id}"`).replace(
                                                        /<svg([^>]*)>/,
                                                        '<svg$1 style="width: 100%; height: 100%; max-width: 100%; max-height: 100%;" preserveAspectRatio="xMidYMid meet">'
                                                    ),
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-4 md:px-8 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ children }) => (
                                        <h1 className="text-4xl md:text-5xl font-bold mb-6 mt-8 first:mt-0">{children}</h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-3xl md:text-4xl font-bold mb-4 mt-8">{children}</h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-2xl md:text-3xl font-semibold mb-3 mt-6">{children}</h3>
                                    ),
                                    p: ({ children }) => (
                                        <p className="text-xl mb-4 leading-relaxed">{children}</p>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc list-inside mb-4 space-y-2 text-xl">{children}</ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal list-inside mb-4 space-y-2 text-xl">{children}</ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="ml-4">{children}</li>
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="font-bold">{children}</strong>
                                    ),
                                    em: ({ children }) => (
                                        <em className="italic">{children}</em>
                                    ),
                                    a: ({ href, children }) => (
                                        <Link
                                            href={href || "#"}
                                            className="underline hover:opacity-70 transition-opacity"
                                        >
                                            {children}
                                        </Link>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-foreground pl-4 my-4 italic text-xl opacity-90">
                                            {children}
                                        </blockquote>
                                    ),
                                    code: ({ children }) => (
                                        <code className="bg-foreground/10 px-2 py-1 rounded text-lg font-mono">
                                            {children}
                                        </code>
                                    ),
                                    hr: () => (
                                        <hr className="border-foreground my-8" />
                                    ),
                                }}
                            >
                                {event.description}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                {/* Additional Images */}
                {event.images && event.images.length > 0 && (
                    <div className="px-4 md:px-8 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {event.images.map((image, index) => (
                                <div key={index} className="relative aspect-video rounded-3xl overflow-hidden">
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        className="object-cover w-full h-full"
                                        fill
                                    />
                                    {image.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-foreground/80 text-background p-4">
                                            <p className="text-sm">{image.caption}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer spacing */}
                <div className="h-16" />
            </main>
        </div>
    );
}

