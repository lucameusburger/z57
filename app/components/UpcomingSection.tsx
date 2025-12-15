import { Badge, CornerRightUp } from "lucide-react";
import { Event, getEventsByStatus } from "@/app/types/events";

import Image from "next/image";
import Link from "next/link";

/**
 * Format event date range for display
 * Returns a simple date range string (e.g., "06.12. Wien, 18.–20.12. Feldkirch")
 * For more detailed date/time info, use event.details
 */
function formatDateRange(event: Event): string {
  const startDate = new Date(event.date.start);
  const endDate = event.date.end ? new Date(event.date.end) : null;

  // Format: DD.MM.
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}.${month}.`;
  };

  if (endDate && startDate.getTime() !== endDate.getTime()) {
    const endDay = endDate.getDate().toString().padStart(2, "0");
    const endMonth = (endDate.getMonth() + 1).toString().padStart(2, "0");
    return `${formatDate(startDate)} ${endDay}.${endMonth}.`;
  }

  return formatDate(startDate);
}

export default function UpcomingSection() {
  const activeEvents = getEventsByStatus("active");

  return (
    <div className="flex flex-col gap-8 px-4 md:px-8">
      <div className=" flex items-start flex-col gap-4 md:col-span-2 justify-start relative ">
        <div className="flex justify-between items-center w-full border-t border-foreground pt-4">
          <span className="text-2xl md:text-5xl">Upcoming</span>
          <a href="#top">
            <CornerRightUp className="w-6 h-6 " />
          </a>
          {/* <div className="flex gap-2">
                  <MailButton />
                </div> */}
        </div>
        {activeEvents.map((event) => {
          const eventUrl = event.href || `/events/${event.slug}`;
          return (
            <Link
              key={event.id}
              href={eventUrl}
              className="flex gap-8 w-full flex-col md:flex-row group"
            >
              <div
                className="group order-2 md:order-1 flex-1 border-foreground w-full flex flex-col gap-4 justify-between text-woit bg-foreground border overflow-hidden relative rounded-3xl p-4 hover:opacity-90 transition-opacity"
              >
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
                ) : (
                  <Badge className="w-12 h-12 group-hover:text-foreground transition-colors" />
                )}
                <div className="flex flex-col gap-2">
                  {event.details && (
                    <span className="self-end text-right text-xl">
                      {event.details.split("\n").map((line, i, lines) => (
                        <span key={i}>
                          {line}
                          {i < lines.length - 1 && <br />}
                        </span>
                      ))}
                    </span>
                  )}
                  <hr className="border-current" />
                  <div className="flex justify-between items-center">
                    <span className="self-end text-xl font-bold">{event.title}</span>
                    <span className="text-xl">{formatDateRange(event)}</span>
                  </div>
                </div>
              </div>
              <div
                className="flex-1 h-auto relative group"
              >
                {/* <SliderCard images={[adventImage, adventImage2]} /> */}
                {event.thumbnail ? (
                  <Image src={event.thumbnail.src} alt={event.thumbnail.alt} className="object-cover rounded-3xl" />
                ) : event.color ? (
                  <div className="w-full min-h-[400px] rounded-3xl relative" style={{ backgroundColor: event.color }}>
                    {event.svg && (
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <div
                          className="w-full h-full"
                          style={{ maxWidth: 'calc(100% - 4rem)', maxHeight: 'calc(100% - 4rem)' }}
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
