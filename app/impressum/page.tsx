import type { Metadata } from "next";

import LegalPage from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Impressum | z57",
  description: "Impressum der Website von z57.",
};

export default function ImpressumPage() {
  return (
    <LegalPage
      title="Impressum"
      updatedAt="7. März 2026"
      intro={
        <p>
          Angaben gemäß den österreichischen Informationspflichten für diese
          Website und die Kommunikation rund um das Atelier z57.
        </p>
      }
    >
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Medieninhaber und Herausgeber
        </h2>
        <p>z57</p>
        <p>ZVR 1169564571</p>
        <p>Zieglergasse 57, 1070 Wien, Österreich</p>
        <p>
          E-Mail:{" "}
          <a className="underline underline-offset-4" href="mailto:atelier@z57.at">
            atelier@z57.at
          </a>
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">Unternehmensgegenstand</h2>
        <p>
          Diese Website informiert über das Atelier z57, seine Mitglieder,
          Veranstaltungen, Projekte und Kontaktmöglichkeiten.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Inhaltliche Verantwortung
        </h2>
        <p>
          Für die Inhalte dieser Website verantwortlich ist z57, erreichbar unter
          den oben genannten Kontaktdaten.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Haftung für Inhalte und Links
        </h2>
        <p>
          Die Inhalte dieser Website werden mit Sorgfalt erstellt und laufend
          gepflegt. Für die Richtigkeit, Vollständigkeit und Aktualität wird
          jedoch keine Gewähr übernommen.
        </p>
        <p>
          Für Inhalte externer Websites, auf die direkt oder indirekt verwiesen
          wird, wird keine Haftung übernommen. Für den Inhalt der verlinkten
          Seiten sind ausschließlich deren Betreiber verantwortlich.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">Urheberrecht</h2>
        <p>
          Texte, Bilder und weitere Inhalte dieser Website unterliegen, soweit
          nicht anders gekennzeichnet, dem Urheberrecht der jeweiligen
          Rechteinhaber:innen. Eine Verwendung ohne vorherige Zustimmung ist nur
          im gesetzlich zulässigen Rahmen erlaubt.
        </p>
      </section>
    </LegalPage>
  );
}
