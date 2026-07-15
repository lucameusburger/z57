import type { Metadata } from "next";

import LegalPage from "@/app/components/LegalPage";
import { EditableText } from "@einblick/editor/react";
import { getSiteInfos } from "@/app/types/infos";

export const metadata: Metadata = {
  title: "Datenschutz | z57",
  description: "Datenschutzhinweise der Website von z57.",
};

export default async function DatenschutzPage() {
  const siteInfos = await getSiteInfos();

  return (
    <LegalPage
      title="Datenschutz"
      updatedAt="15. Juli 2026"
      intro={
        <p>
          Diese Hinweise beschreiben, welche personenbezogenen Daten beim Besuch
          dieser Website verarbeitet werden und zu welchen Zwecken das
          geschieht.
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
          {siteInfos.emailHref && siteInfos.email ? (
            <a
              className="underline underline-offset-4"
              href={siteInfos.emailHref}
            >
              <EditableText as="span" binding={siteInfos.bindings.email}>
                {siteInfos.email}
              </EditableText>
            </a>
          ) : null}
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
          Angaben zur Bearbeitung deiner Anfrage und für mögliche
          Anschlussfragen verarbeitet.
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
          zur Wahrung berechtigter Interessen an einem sicheren Betrieb sowie
          zur Bearbeitung von Anfragen und Kommunikation mit Interessent:innen.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Cookieless Reichweitenmessung mit Einblick
        </h2>
        <p>
          Wenn du zustimmst, verwenden wir Einblick Website Analytics, um die
          Nutzung dieser Website in aggregierter Form auszuwerten. Dabei werden
          keine Analyse-Cookies gesetzt und keine dauerhafte Besucher-ID auf
          deinem Gerät gespeichert. Verarbeitet werden insbesondere aufgerufene
          Pfade, Referrer- und Kampagneninformationen sowie technische Angaben
          wie Geräte-, Browser- und grobe Regionskategorien.
        </p>
        <p>
          IP-Adresse und User-Agent werden nur kurzzeitig zur Ableitung einer
          täglich wechselnden pseudonymen Kennung und technischer Kategorien
          verarbeitet; sie werden nicht im Analyse-Datensatz gespeichert. Die
          Detaildaten werden entsprechend unserer Einblick-Konfiguration für
          höchstens 90 Tage aufbewahrt.
        </p>
        <p>
          Rechtsgrundlage ist deine Einwilligung gemäß Art. 6 Abs. 1 lit. a
          DSGVO. Ohne Einwilligung sendet Einblick keine Analysedaten. Du kannst
          deine Entscheidung jederzeit über „Datenschutz-Einstellungen“ ändern
          oder widerrufen. Dort kannst du die notwendige lokale Speicherung
          deiner Auswahl und Einblick Analytics getrennt einsehen. Die
          Entscheidung selbst wird ausschließlich im lokalen Speicher deines
          Browsers gespeichert.
        </p>
        <p>
          Ein aktiviertes Global-Privacy-Control-Signal deines Browsers wird
          unabhängig von deiner gespeicherten Auswahl respektiert und verhindert
          die Erfassung.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Empfänger und Speicherdauer
        </h2>
        <p>
          Daten werden nur an Dienstleister weitergegeben, soweit das für
          Hosting, technische Bereitstellung, Einblick Website Analytics oder
          Kommunikation erforderlich ist. Personenbezogene Daten werden nur so
          lange gespeichert, wie das für den jeweiligen Zweck notwendig ist oder
          gesetzliche Aufbewahrungspflichten bestehen.
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
