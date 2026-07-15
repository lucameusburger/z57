import type { Metadata } from "next";

import LegalPage from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookies | z57",
  description: "Informationen zu Cookies auf der Website von z57.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookies"
      updatedAt="15. Juli 2026"
      intro={
        <p>
          Hier findest du einen kurzen Überblick darüber, ob und wie auf dieser
          Website Cookies eingesetzt werden.
        </p>
      }
    >
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Aktueller Einsatz
        </h2>
        <p>
          Auf dieser Website sind derzeit keine optionalen Analyse-, Marketing-
          oder Tracking-Cookies eingebunden. Einblick Website Analytics arbeitet
          cookieless und wird erst nach deiner Zustimmung aktiviert.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Speicherung deiner Entscheidung
        </h2>
        <p>
          Deine Auswahl zur cookieless Reichweitenmessung wird im lokalen
          Speicher deines Browsers abgelegt. Dadurch können wir deine
          Entscheidung bei späteren Besuchen berücksichtigen. Du kannst
          Einblick Analytics ablehnen, akzeptieren oder individuell anpassen
          und die Auswahl jederzeit über „Datenschutz-Einstellungen“ ändern
          oder widerrufen.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Technisch notwendige Cookies
        </h2>
        <p>
          Je nach Hosting- oder Sicherheitskonfiguration können technisch
          notwendige Cookies oder vergleichbare Speichermechanismen eingesetzt
          werden, damit die Website korrekt ausgeliefert und vor Missbrauch
          geschützt werden kann.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Browser-Einstellungen
        </h2>
        <p>
          Du kannst Cookies jederzeit in deinem Browser verwalten, einschränken
          oder löschen. Bitte beachte, dass einzelne Funktionen der Website ohne
          technisch notwendige Cookies eingeschränkt sein können.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">Änderungen</h2>
        <p>
          Falls künftig zusätzliche Dienste eingebunden werden, die Cookies oder
          ähnliche Technologien verwenden, wird diese Seite entsprechend
          aktualisiert.
        </p>
      </section>
    </LegalPage>
  );
}
