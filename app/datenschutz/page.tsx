import type { Metadata } from "next";

import LegalPage from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Datenschutz | z57",
  description: "Datenschutzhinweise der Website von z57.",
};

export default function DatenschutzPage() {
  return (
    <LegalPage
      title="Datenschutz"
      updatedAt="7. März 2026"
      intro={
        <p>
          Diese Hinweise beschreiben, welche personenbezogenen Daten beim Besuch
          dieser Website verarbeitet werden und zu welchen Zwecken das geschieht.
        </p>
      }
    >
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Verantwortliche Stelle
        </h2>
        <p>z57</p>
        <p>Zieglergasse 57, 1070 Wien, Österreich</p>
        <p>
          E-Mail:{" "}
          <a className="underline underline-offset-4" href="mailto:atelier@z57.at">
            atelier@z57.at
          </a>
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Server- und Zugriffsdaten
        </h2>
        <p>
          Beim Aufruf der Website können technisch notwendige Informationen wie
          IP-Adresse, Datum und Uhrzeit, angeforderte Inhalte, Browsertyp und
          Betriebssystem verarbeitet werden. Diese Daten dienen der sicheren
          Bereitstellung der Website, der Fehleranalyse und der Abwehr von
          Missbrauch.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">Kontaktaufnahme</h2>
        <p>
          Wenn du per E-Mail Kontakt aufnimmst, werden die von dir übermittelten
          Angaben zur Bearbeitung deiner Anfrage und für mögliche Anschlussfragen
          verarbeitet.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Formulare und Bewerbungen
        </h2>
        <p>
          Sofern auf dieser Website Formulare genutzt oder künftig wieder
          aktiviert werden, verarbeiten wir die dabei angegebenen Daten nur zur
          Bearbeitung der jeweiligen Anfrage oder Bewerbung sowie für die damit
          verbundene Kommunikation.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">Rechtsgrundlagen</h2>
        <p>
          Die Verarbeitung erfolgt insbesondere zur Bereitstellung der Website,
          zur Wahrung berechtigter Interessen an einem sicheren Betrieb sowie zur
          Bearbeitung von Anfragen und Kommunikation mit Interessent:innen.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Empfänger und Speicherdauer
        </h2>
        <p>
          Daten werden nur an Dienstleister weitergegeben, soweit das für Hosting,
          technische Bereitstellung oder Kommunikation erforderlich ist.
          Personenbezogene Daten werden nur so lange gespeichert, wie das für den
          jeweiligen Zweck notwendig ist oder gesetzliche Aufbewahrungspflichten
          bestehen.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">Deine Rechte</h2>
        <p>
          Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
          der Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen die
          Verarbeitung deiner Daten, soweit die gesetzlichen Voraussetzungen
          vorliegen.
        </p>
        <p>
          Wenn du der Ansicht bist, dass die Verarbeitung deiner Daten gegen
          Datenschutzrecht verstößt, kannst du dich zudem an die zuständige
          Datenschutzbehörde wenden.
        </p>
      </section>
    </LegalPage>
  );
}
