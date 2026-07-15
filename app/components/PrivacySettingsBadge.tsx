"use client";

import { OPEN_PRIVACY_SETTINGS_EVENT } from "@/app/lib/privacy-settings";

import Badge from "./Badge";

export default function PrivacySettingsBadge() {
  return (
    <Badge
      aria-label="Datenschutz-Einstellungen öffnen"
      onClick={() => window.dispatchEvent(new Event(OPEN_PRIVACY_SETTINGS_EVENT))}
    >
      Datenschutz-Einstellungen
    </Badge>
  );
}
