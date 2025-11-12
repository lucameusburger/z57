import { ArrowRight, Badge, CornerRightUp } from "lucide-react";
import Image, { StaticImageData } from "next/image";

import adventImage from "@/app/images/events/advent.jpg";
import imgBg from "@/app/images/house/20241114_Z57_NikoHavranek_web-8289.jpg";

type EventStatus = "active" | "past";

interface UpcomingEvent {
  id: string;
  status: EventStatus;
  href: string;
  title: string;
  dateRange: string;
  details?: string;
  image?: {
    src: StaticImageData;
    alt: string;
  };
  color?: string;
  svg?: string;
}

const NEWSVG = `<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 445.54 441.24">
  <defs>
    <style>
      .cls-1 {
        fill: #fff;
      }
    </style>
  </defs>
  <polygon class="cls-1" points="204.34 0 195.79 116.33 0 183.04 22.73 407.19 96.51 407.19 109.26 269.57 177.36 280.93 197.22 438.43 261.07 441.24 282.37 279.5 337.72 258.2 383.13 387.33 445.54 387.33 445.54 12.75 204.34 0"/>
</svg>`;

const events: UpcomingEvent[] = [
  {
    id: "vienna-design-week",
    status: "past",
    href: "https://www.viennadesignweek.at/programm/cmd-shift-d-esign/",
    title: "Vienna Design Week",
    dateRange: "27.9.–4.10.2025, 13–19 Uhr",
    details: "Opening Drinks & Concert: 27.9.2025, 16-20 Uhr\nCocktail: 4.10.2025, 16–20 Uhr",
    image: {
      src: imgBg,
      alt: "Vienna Design Week",
    },
  },
  {
    id: "weihnachtsmarkt",
    status: "active",
    href: "/application",
    title: "z57 Wintermarkt",
    dateRange: "06.12. Wien, 18.–20.12. Feldkirch",
    details: "Aussteller:innen gesucht!\nOpen Call für Designer:innen und Künstler:innen\nWien @z57.at & Feldkirch, Vorarlberg",
    // image: {
    //   src: adventImage,
    //   alt: "z57 Wintermarkt",
    // },
    color: "#C04021",
    svg: NEWSVG,
  },
];

export default function UpcomingSection() {
  const activeEvents = events.filter((event) => event.status === "active");

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
        {activeEvents.map((event) => (
          <div key={event.id} className="flex gap-8 w-full flex-col md:flex-row">
            <a
              href={event.href}
              className="order-2 md:order-1 flex-1 border-foreground hover:bg-background hover:text-foreground transition-colors w-full flex flex-col gap-4 justify-between text-woit bg-foreground border overflow-hidden relative rounded-3xl p-4"
            >
              {event.svg ? (
                <div
                  className="w-12 h-12"
                  dangerouslySetInnerHTML={{
                    __html: event.svg.replace(/id="[^"]*"/, `id="badge-svg-${event.id}"`).replace(
                      /<svg([^>]*)>/,
                      '<svg$1 style="width: 100%; height: 100%;" preserveAspectRatio="xMidYMid meet">'
                    ),
                  }}
                />
              ) : (
                <Badge className=" w-12 h-12" />
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
                  <span className="text-xl">{event.dateRange}</span>
                </div>
              </div>
            </a>
            <a
              href={event.href}
              className="flex-1 h-auto relative group cursor-pointer"
            >
              {/* <SliderCard images={[adventImage, adventImage2]} /> */}
              {event.image ? (
                <Image src={event.image.src} alt={event.image.alt} className="object-cover rounded-3xl" />
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
              {event.href && (
                <div className="absolute bottom-4 right-4 z-20 bg-foreground text-background p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
