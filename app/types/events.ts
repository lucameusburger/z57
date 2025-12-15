import { StaticImageData } from "next/image";

/**
 * Event status types
 */
export type EventStatus = "upcoming" | "active" | "past" | "cancelled";

/**
 * Location information for an event
 */
export interface EventLocation {
  name: string;
  address: string;
  city: string;
  postalCode?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Date and time information for an event
 */
export interface EventDate {
  start: string; // ISO 8601 date string
  end?: string; // ISO 8601 date string (optional for single-day events)
  timezone?: string; // e.g., "Europe/Vienna"
  allDay?: boolean;
  openingHours?: string; // e.g., "12-20 Uhr"
}

/**
 * Image information for an event
 */
export interface EventImage {
  src: StaticImageData | string;
  alt: string;
  caption?: string;
}

/**
 * Complete event structure
 * Designed to be easily migrated to an API backend
 */
export interface Event {
  id: string;
  slug: string; // URL-friendly identifier
  title: string;
  shortTitle?: string; // Shorter version for cards/thumbnails
  status: EventStatus;
  
  // Dates and location
  date: EventDate;
  location: EventLocation;
  
  // Content
  description: string; // Full markdown description
  excerpt?: string; // Short summary for previews
  details?: string; // Additional details (plain text, for quick display)
  
  // Media
  images?: EventImage[];
  thumbnail?: EventImage;
  color?: string; // Brand color for the event
  svg?: string; // SVG icon/badge
  
  // Links and actions
  href?: string; // Link to event page or external URL
  cta?: string; // Call-to-action text
  applicationUrl?: string; // Link to application form
  
  // Metadata
  tags?: string[];
  category?: string;
  featured?: boolean;
  
  // Timestamps (for API compatibility)
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Hardcoded events array
 * This will be replaced with API calls in the future
 */
export const events: Event[] = [
  {
    id: "wintermarkt-2025",
    slug: "wintermarkt-2025",
    title: "z57 Wintermarkt",
    shortTitle: "Wintermarkt",
    status: "active",
    date: {
      start: "2025-12-06",
      end: "2025-12-20",
      timezone: "Europe/Vienna",
      openingHours: "12-20 Uhr",
    },
    location: {
      name: "Zieglergasse 57",
      address: "Zieglergasse 57",
      city: "Wien",
      postalCode: "1070",
      country: "Österreich",
    },
    description: `# z57 Wintermarkt 2025

Der z57 Wintermarkt geht in die **dritte Runde** und dieses Jahr nicht nur in Wien, sondern auch in Feldkirch, Vorarlberg. Viele kleine Labels, Künstler:innen und Designer:innen gibt es dieses Jahr wieder bei uns zu entdecken und wir freuen uns auf gemütliche Wintertage mit Punsch und Musik bei uns auf der Dachterrasse im Herzen des 7. Bezirks und im Innenhof der Kreuzgasse 16 in Feldkirch, Vorarlberg, nur wenige Schritte entfernt vom jährlichen Christkindlmarkt im Zentrum der Innenstadt.

## Wann & Wo

**06.12.** Zieglergasse 57, 1070 Wien, 12-20 Uhr  
**18.-20.12.** Kreuzgasse 16, 6800 Feldkirch  
Do + Fr 12-20 Uhr, Sa 10-17 Uhr

## Wien

Wie jedes Jahr haben wir kleine Labels, Designer\*innen und Künstler\*innen eingeladen, ihre Werke auszustellen und zu verkaufen – auf unserer Dachterrasse im Herzen des 7. Bezirks in Wien am 06.12.

**Künstler\*innen und Designer\*innen:** Anna Heinrich, Celine Radlof, Cristiano Picaopereira, David Hopp, Emanuel Scheib, Emma Johann, Florian Schuclenz, JUSZCIUS+JÚLIA SADLOÑOVÁ, Lena Mikolasek, Paul Schubert, Rosa Sturm, sambucabags, Sophie Olivia Taleja Schmidt

## Feldkirch

Von 18.-20.12. findet der Wintermarkt im Innenhof der Kreuzgasse 16 in Feldkirch statt, nur wenige Schritte entfernt vom jährlichen Christkindlmarkt im Zentrum der Innenstadt.

**Künstler\*innen und Designer\*innen:** anan notebooks, Blanka Hedvig, Dana Volavsek, David Hopp, Elias Campidell, Emanuel Scheib, Emma Johann, Fabio Spink, Florian Schuchlenz, Julia Habarda, Lilian Marie Furrer, Paul Schubert

## Kommt vorbei!

Kommt vorbei, bringt eure Liebsten, Familie und Freunde mit und unterstützt die lokalen Künstler:innen und Designer:innen ✨

Wir freuen uns auf euren Besuch! 🎄✨`,
    excerpt: "Der z57 Wintermarkt geht in die dritte Runde – dieses Jahr in Wien und Feldkirch. Entdeckt viele kleine Labels, Künstler:innen und Designer:innen bei gemütlichen Wintertagen mit Punsch und Musik.",
    details: `06.12. Zieglergasse 57, 1070 Wien, 12-20 Uhr
18.-20. Kreuzgasse 16. 6800 Feldkirch
Do + Fr 12-20 Uhr, Sa 10-17 Uhr`,
    href: "/events/wintermarkt-2025",
    applicationUrl: "/application",
    cta: "Jetzt bewerben",
    color: "#C04021",
    svg: `<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 445.54 441.24">
  <defs>
    <style>
      .cls-1 {
        fill: #fff;
      }
    </style>
  </defs>
  <polygon class="cls-1" points="204.34 0 195.79 116.33 0 183.04 22.73 407.19 96.51 407.19 109.26 269.57 177.36 280.93 197.22 438.43 261.07 441.24 282.37 279.5 337.72 258.2 383.13 387.33 445.54 387.33 445.54 12.75 204.34 0"/>
</svg>`,
    tags: ["markt", "winter", "kunst", "design", "handwerk"],
    category: "markt",
    featured: true,
  },
];

/**
 * Helper function to get events by status
 */
export function getEventsByStatus(status: EventStatus): Event[] {
  return events.filter((event) => event.status === status);
}

/**
 * Helper function to get featured events
 */
export function getFeaturedEvents(): Event[] {
  return events.filter((event) => event.featured);
}

/**
 * Helper function to get event by slug
 */
export function getEventBySlug(slug: string): Event | undefined {
  return events.find((event) => event.slug === slug);
}

/**
 * Helper function to get event by id
 */
export function getEventById(id: string): Event | undefined {
  return events.find((event) => event.id === id);
}

