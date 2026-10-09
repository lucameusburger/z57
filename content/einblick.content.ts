import { defineSiteContent, field, page, section } from "@einblick/sdk/content";

export const content = defineSiteContent({
  website: "z57-website",
  locales: ["de"],
  pages: {
    home: page({
      label: "Startseite",
      path: "/",
      sections: {
        hero: section("Hero", {
          text: field.text({
            label: "Text",
            default:
              "z57 atelier and studio space vienna . grafik . nailart . architektur . webentwicklung . fotografie . design . exhibitions . workshops . co-working . ",
          }),
        }),
        model: section("Raum", {
          heading: field.string({
            label: "Überschrift",
            default: "In drei Dimensionen",
          }),
        }),
        members: section("Mitglieder", {
          heading: field.string({
            label: "Überschrift",
            default: "Wer wir sind",
          }),
        }),
        contact: section("Kontakt", {
          heading: field.string({
            label: "Überschrift",
            default: "Get in touch",
          }),
        }),
      },
    }),
    impressum: page({
      label: "Impressum",
      path: "/impressum",
      sections: {
        intro: section("Einleitung", {
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Angaben gemäß den österreichischen Informationspflichten für diese Website und die Kommunikation rund um das Atelier z57.",
          }),
          title: field.string({ label: "Titel", default: "Impressum" }),
          updatedAt: field.string({ label: "Stand", default: "7. März 2026" }),
        }),
        publisher: section("Medieninhaber und Herausgeber", {
          heading: field.string({
            label: "Überschrift",
            default: "Medieninhaber und Herausgeber",
          }),
          paragraph1: field.text({ label: "Absatz 1", default: "z57" }),
          paragraph2: field.text({
            label: "Absatz 2",
            default: "ZVR 1169564571",
          }),
          paragraph3: field.text({
            label: "Absatz 3",
            default: "Zieglergasse 57, 1070 Wien, Österreich",
          }),
        }),
        purpose: section("Unternehmensgegenstand", {
          heading: field.string({
            label: "Überschrift",
            default: "Unternehmensgegenstand",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Diese Website informiert über das Atelier z57, seine Mitglieder, Veranstaltungen, Projekte und Kontaktmöglichkeiten.",
          }),
        }),
        responsibility: section("Inhaltliche Verantwortung", {
          heading: field.string({
            label: "Überschrift",
            default: "Inhaltliche Verantwortung",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Für die Inhalte dieser Website verantwortlich ist z57, erreichbar unter den oben genannten Kontaktdaten.",
          }),
        }),
        liability: section("Haftung für Inhalte und Links", {
          heading: field.string({
            label: "Überschrift",
            default: "Haftung für Inhalte und Links",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Die Inhalte dieser Website werden mit Sorgfalt erstellt und laufend gepflegt. Für die Richtigkeit, Vollständigkeit und Aktualität wird jedoch keine Gewähr übernommen.",
          }),
          paragraph2: field.text({
            label: "Absatz 2",
            default:
              "Für Inhalte externer Websites, auf die direkt oder indirekt verwiesen wird, wird keine Haftung übernommen. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.",
          }),
        }),
        copyright: section("Urheberrecht", {
          heading: field.string({
            label: "Überschrift",
            default: "Urheberrecht",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Texte, Bilder und weitere Inhalte dieser Website unterliegen, soweit nicht anders gekennzeichnet, dem Urheberrecht der jeweiligen Rechteinhaber:innen. Eine Verwendung ohne vorherige Zustimmung ist nur im gesetzlich zulässigen Rahmen erlaubt.",
          }),
        }),
      },
    }),
    datenschutz: page({
      label: "Datenschutz",
      path: "/datenschutz",
      sections: {
        intro: section("Einleitung", {
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Diese Hinweise beschreiben, welche personenbezogenen Daten beim Besuch dieser Website verarbeitet werden und zu welchen Zwecken das geschieht.",
          }),
          title: field.string({ label: "Titel", default: "Datenschutz" }),
          updatedAt: field.string({ label: "Stand", default: "15. Juli 2026" }),
        }),
        controller: section("Verantwortliche Stelle", {
          heading: field.string({
            label: "Überschrift",
            default: "Verantwortliche Stelle",
          }),
          paragraph1: field.text({ label: "Absatz 1", default: "z57" }),
          paragraph2: field.text({
            label: "Absatz 2",
            default: "Zieglergasse 57, 1070 Wien, Österreich",
          }),
        }),
        access: section("Server- und Zugriffsdaten", {
          heading: field.string({
            label: "Überschrift",
            default: "Server- und Zugriffsdaten",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Beim Aufruf der Website können technisch notwendige Informationen wie IP-Adresse, Datum und Uhrzeit, angeforderte Inhalte, Browsertyp und Betriebssystem verarbeitet werden. Diese Daten dienen der sicheren Bereitstellung der Website, der Fehleranalyse und der Abwehr von Missbrauch.",
          }),
        }),
        contact: section("Kontaktaufnahme", {
          heading: field.string({
            label: "Überschrift",
            default: "Kontaktaufnahme",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Wenn du per E-Mail Kontakt aufnimmst, werden die von dir übermittelten Angaben zur Bearbeitung deiner Anfrage und für mögliche Anschlussfragen verarbeitet.",
          }),
        }),
        forms: section("Formulare und Bewerbungen", {
          heading: field.string({
            label: "Überschrift",
            default: "Formulare und Bewerbungen",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Sofern auf dieser Website Formulare genutzt oder künftig wieder aktiviert werden, verarbeiten wir die dabei angegebenen Daten nur zur Bearbeitung der jeweiligen Anfrage oder Bewerbung sowie für die damit verbundene Kommunikation.",
          }),
        }),
        legalBasis: section("Rechtsgrundlagen", {
          heading: field.string({
            label: "Überschrift",
            default: "Rechtsgrundlagen",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Die Verarbeitung erfolgt insbesondere zur Bereitstellung der Website, zur Wahrung berechtigter Interessen an einem sicheren Betrieb sowie zur Bearbeitung von Anfragen und Kommunikation mit Interessent:innen.",
          }),
        }),
        analytics: section("Cookieless Reichweitenmessung mit Einblick", {
          heading: field.string({
            label: "Überschrift",
            default: "Cookieless Reichweitenmessung mit Einblick",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Wenn du zustimmst, verwenden wir Einblick Website Analytics, um die Nutzung dieser Website in aggregierter Form auszuwerten. Dabei werden keine Analyse-Cookies gesetzt und keine dauerhafte Besucher-ID auf deinem Gerät gespeichert. Verarbeitet werden insbesondere aufgerufene Pfade, Referrer- und Kampagneninformationen sowie technische Angaben wie Geräte-, Browser- und grobe Regionskategorien.",
          }),
          paragraph2: field.text({
            label: "Absatz 2",
            default:
              "IP-Adresse und User-Agent werden nur kurzzeitig zur Ableitung einer täglich wechselnden pseudonymen Kennung und technischer Kategorien verarbeitet; sie werden nicht im Analyse-Datensatz gespeichert. Die Detaildaten werden entsprechend unserer Einblick-Konfiguration für höchstens 90 Tage aufbewahrt.",
          }),
          paragraph3: field.text({
            label: "Absatz 3",
            default:
              "Rechtsgrundlage ist deine Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. Ohne Einwilligung sendet Einblick keine Analysedaten. Du kannst deine Entscheidung jederzeit über „Datenschutz-Einstellungen“ ändern oder widerrufen. Dort kannst du die notwendige lokale Speicherung deiner Auswahl und Einblick Analytics getrennt einsehen. Die Entscheidung selbst wird ausschließlich im lokalen Speicher deines Browsers gespeichert.",
          }),
          paragraph4: field.text({
            label: "Absatz 4",
            default:
              "Ein aktiviertes Global-Privacy-Control-Signal deines Browsers wird unabhängig von deiner gespeicherten Auswahl respektiert und verhindert die Erfassung.",
          }),
        }),
        recipients: section("Empfänger und Speicherdauer", {
          heading: field.string({
            label: "Überschrift",
            default: "Empfänger und Speicherdauer",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Daten werden nur an Dienstleister weitergegeben, soweit das für Hosting, technische Bereitstellung, Einblick Website Analytics oder Kommunikation erforderlich ist. Personenbezogene Daten werden nur so lange gespeichert, wie das für den jeweiligen Zweck notwendig ist oder gesetzliche Aufbewahrungspflichten bestehen.",
          }),
        }),
        rights: section("Deine Rechte", {
          heading: field.string({
            label: "Überschrift",
            default: "Deine Rechte",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen die Verarbeitung deiner Daten, soweit die gesetzlichen Voraussetzungen vorliegen.",
          }),
          paragraph2: field.text({
            label: "Absatz 2",
            default:
              "Wenn du der Ansicht bist, dass die Verarbeitung deiner Daten gegen Datenschutzrecht verstößt, kannst du dich zudem an die zuständige Datenschutzbehörde wenden.",
          }),
        }),
      },
    }),
    cookies: page({
      label: "Cookies",
      path: "/cookies",
      sections: {
        intro: section("Einleitung", {
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Hier findest du einen kurzen Überblick darüber, ob und wie auf dieser Website Cookies eingesetzt werden.",
          }),
          title: field.string({ label: "Titel", default: "Cookies" }),
          updatedAt: field.string({ label: "Stand", default: "15. Juli 2026" }),
        }),
        current: section("Aktueller Einsatz", {
          heading: field.string({
            label: "Überschrift",
            default: "Aktueller Einsatz",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Auf dieser Website sind derzeit keine optionalen Analyse-, Marketing- oder Tracking-Cookies eingebunden. Einblick Website Analytics arbeitet cookieless und wird erst nach deiner Zustimmung aktiviert.",
          }),
        }),
        choice: section("Speicherung deiner Entscheidung", {
          heading: field.string({
            label: "Überschrift",
            default: "Speicherung deiner Entscheidung",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Deine Auswahl zur cookieless Reichweitenmessung wird im lokalen Speicher deines Browsers abgelegt. Dadurch können wir deine Entscheidung bei späteren Besuchen berücksichtigen. Du kannst Einblick Analytics ablehnen, akzeptieren oder individuell anpassen und die Auswahl jederzeit über „Datenschutz-Einstellungen“ ändern oder widerrufen.",
          }),
        }),
        necessary: section("Technisch notwendige Cookies", {
          heading: field.string({
            label: "Überschrift",
            default: "Technisch notwendige Cookies",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Je nach Hosting- oder Sicherheitskonfiguration können technisch notwendige Cookies oder vergleichbare Speichermechanismen eingesetzt werden, damit die Website korrekt ausgeliefert und vor Missbrauch geschützt werden kann.",
          }),
        }),
        browser: section("Browser-Einstellungen", {
          heading: field.string({
            label: "Überschrift",
            default: "Browser-Einstellungen",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Du kannst Cookies jederzeit in deinem Browser verwalten, einschränken oder löschen. Bitte beachte, dass einzelne Funktionen der Website ohne technisch notwendige Cookies eingeschränkt sein können.",
          }),
        }),
        changes: section("Änderungen", {
          heading: field.string({
            label: "Überschrift",
            default: "Änderungen",
          }),
          paragraph1: field.text({
            label: "Absatz 1",
            default:
              "Falls künftig zusätzliche Dienste eingebunden werden, die Cookies oder ähnliche Technologien verwenden, wird diese Seite entsprechend aktualisiert.",
          }),
        }),
      },
    }),
    archive: page({
      label: "Alle Posts",
      path: "/posts",
      sections: {
        intro: section("Einleitung", {
          eyebrow: field.string({ label: "Kategorie", default: "Archiv" }),
          heading: field.string({
            label: "Überschrift",
            default: "Alle Posts",
          }),
          intro: field.text({
            label: "Einleitung",
            default:
              "Alle Beiträge, Rückblicke und Einblicke aus dem Atelier z57 an einem Ort.",
          }),
        }),
      },
    }),
    application: page({
      label: "Bewerbung",
      path: "/application",
      sections: {
        intro: section("Einleitung", {
          eyebrow: field.string({ label: "Kategorie", default: "legacy" }),
          heading: field.string({
            label: "Überschrift",
            default: "Bewerbung derzeit pausiert",
          }),
          intro: field.text({
            label: "Einleitung",
            default:
              "Das Bewerbungsformular bleibt vorerst nur als Archivseite bestehen und ist aktuell nicht aktiv. Wenn ihr mit z57 in Kontakt treten möchtet, schreibt direkt an",
          }),
        }),
      },
    }),
  },
});
