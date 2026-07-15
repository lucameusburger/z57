"use client";

import type { AnalyticsConsent } from "@einblick/analytics";
import { Analytics } from "@einblick/analytics/next";
import Link from "next/link";
import { useEffect, useState } from "react";

import { OPEN_PRIVACY_SETTINGS_EVENT } from "@/app/lib/privacy-settings";

const STORAGE_KEY = "z57-analytics-consent-v1";

type StoredDecision = Exclude<AnalyticsConsent, "unknown">;
type ConsentView = "banner" | "preferences" | null;

function hasGlobalPrivacyControl() {
  return (
    navigator as Navigator & { globalPrivacyControl?: boolean }
  ).globalPrivacyControl === true;
}

export default function AnalyticsConsentManager() {
  const [consent, setConsent] = useState<AnalyticsConsent>("unknown");
  const [view, setView] = useState<ConsentView>(null);
  const [draftAnalytics, setDraftAnalytics] = useState(false);
  const [globalPrivacyControl, setGlobalPrivacyControl] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      const privacyControlEnabled = hasGlobalPrivacyControl();
      setGlobalPrivacyControl(privacyControlEnabled);

      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);

        if (stored === "granted" || stored === "denied") {
          setConsent(privacyControlEnabled ? "denied" : stored);
          setDraftAnalytics(stored === "granted");
        } else {
          setView("banner");
        }
      } catch {
        setView("banner");
      } finally {
        setIsReady(true);
      }
    });

    const syncDecision = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;

      const privacyControlEnabled = hasGlobalPrivacyControl();
      setGlobalPrivacyControl(privacyControlEnabled);

      if (event.newValue === "granted" || event.newValue === "denied") {
        setConsent(privacyControlEnabled ? "denied" : event.newValue);
        setDraftAnalytics(event.newValue === "granted");
        setView(null);
      } else {
        setConsent("unknown");
        setDraftAnalytics(false);
        setView("banner");
      }
    };

    window.addEventListener("storage", syncDecision);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", syncDecision);
    };
  }, []);

  const saveDecision = (decision: StoredDecision) => {
    const effectiveDecision = globalPrivacyControl ? "denied" : decision;

    setConsent(effectiveDecision);
    setDraftAnalytics(decision === "granted");
    setView(null);

    try {
      window.localStorage.setItem(STORAGE_KEY, decision);
    } catch {
      // The in-memory decision still applies for this visit.
    }
  };

  const openPreferences = () => {
    setDraftAnalytics(consent === "granted" && !globalPrivacyControl);
    setView("preferences");
  };

  useEffect(() => {
    const handleOpenPreferences = () => {
      setDraftAnalytics(consent === "granted" && !globalPrivacyControl);
      setView("preferences");
    };

    window.addEventListener(
      OPEN_PRIVACY_SETTINGS_EVENT,
      handleOpenPreferences,
    );

    return () => {
      window.removeEventListener(
        OPEN_PRIVACY_SETTINGS_EVENT,
        handleOpenPreferences,
      );
    };
  }, [consent, globalPrivacyControl]);

  return (
    <>
      <Analytics
        consent={globalPrivacyControl ? "denied" : consent}
        respectGlobalPrivacyControl
      />

      {isReady && view === "banner" ? (
        <section
          aria-label="Datenschutz-Einstellungen"
          aria-live="polite"
          className="fixed inset-x-0 bottom-0 z-[100] w-full rounded-t-[2rem] border border-foreground bg-background p-5 md:p-6"
        >
          <div className="mx-auto w-full max-w-4xl">
            <p className="text-sm text-foreground/60">Deine Privatsphäre</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Datenschutz auswählen
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed md:text-base">
              Wir verwenden notwendige lokale Speicherung, um deine Auswahl zu
              merken. Eine optionale cookieless Reichweitenmessung wird erst
              nach deiner Zustimmung aktiviert. Ohne Entscheidung bleibt jede
              optionale Verarbeitung pausiert.
            </p>
            {globalPrivacyControl ? (
              <p className="mt-3 rounded-2xl border border-foreground px-4 py-3 text-sm">
                Dein Browser sendet Global Privacy Control. Deshalb bleibt die
                Reichweitenmessung unabhängig von der Auswahl deaktiviert.
              </p>
            ) : null}
            <p className="mt-3 text-sm">
              Mehr dazu im{" "}
              <Link
                className="underline underline-offset-4"
                href="/datenschutz"
              >
                Datenschutz
              </Link>
              .
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <button
                className="rounded-full border border-foreground px-4 py-2.5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
                onClick={() => saveDecision("denied")}
                type="button"
              >
                Ablehnen
              </button>
              <button
                className="rounded-full border border-foreground px-4 py-2.5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
                onClick={openPreferences}
                type="button"
              >
                Anpassen
              </button>
              <button
                className="rounded-full border border-foreground bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={globalPrivacyControl}
                onClick={() => saveDecision("granted")}
                type="button"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {isReady && view === "preferences" ? (
        <section
          aria-label="Individuelle Datenschutz-Einstellungen"
          aria-live="polite"
          className="fixed inset-x-0 bottom-0 z-[100] w-full rounded-t-[2rem] border border-foreground bg-background p-5 md:p-6"
        >
          <div className="mx-auto w-full max-w-4xl">
            <p className="text-sm text-foreground/60">
              Datenschutz-Einstellungen
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Auswahl anpassen
            </h2>
            <div className="mt-5 divide-y divide-foreground/25 border-y border-foreground/25">
              <div className="flex items-start justify-between gap-5 py-4">
                <div>
                  <h3 className="font-semibold">Notwendige Speicherung</h3>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/75">
                    Speichert nur deine Auswahl in diesem Browser. Sie ist für
                    die Verwaltung und den Widerruf deiner Entscheidung
                    erforderlich.
                  </p>
                </div>
                <input
                  aria-label="Notwendige Speicherung immer aktiv"
                  checked
                  className="mt-1 h-5 w-5 shrink-0 accent-foreground"
                  disabled
                  readOnly
                  type="checkbox"
                />
              </div>
              <div className="flex items-start justify-between gap-5 py-4">
                <div>
                  <h3 className="font-semibold">Einblick Analytics</h3>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/75">
                    Cookieless und pseudonymisiert. Hilft uns, Aufrufe und die
                    Nutzung der Website zu verstehen.
                  </p>
                  {globalPrivacyControl ? (
                    <p className="mt-2 text-sm font-medium">
                      Durch Global Privacy Control deaktiviert.
                    </p>
                  ) : null}
                </div>
                <input
                  aria-label="Einblick Analytics erlauben"
                  checked={draftAnalytics && !globalPrivacyControl}
                  className="mt-1 h-5 w-5 shrink-0 accent-foreground"
                  disabled={globalPrivacyControl}
                  onChange={(event) => setDraftAnalytics(event.target.checked)}
                  type="checkbox"
                />
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <button
                className="rounded-full border border-foreground px-4 py-2.5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
                onClick={() => saveDecision("denied")}
                type="button"
              >
                Alle ablehnen
              </button>
              <button
                className="rounded-full border border-foreground px-4 py-2.5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
                onClick={() =>
                  setView(consent === "unknown" ? "banner" : null)
                }
                type="button"
              >
                Zurück
              </button>
              <button
                className="rounded-full border border-foreground bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-75"
                onClick={() =>
                  saveDecision(draftAnalytics ? "granted" : "denied")
                }
                type="button"
              >
                Auswahl speichern
              </button>
            </div>
          </div>
        </section>
      ) : null}

    </>
  );
}
