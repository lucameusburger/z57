import "./globals.css";

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import AnalyticsConsentManager from "@/app/components/AnalyticsConsent";
import EinblickEditBoot from "@/app/components/EinblickEditBoot";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/app/lib/metadata";

const intertopia = localFont({
  src: "./fonts/IntertopiaVF.woff2",
  variable: "--font-intertopia",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "de_AT",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#f2efea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${intertopia.variable} antialiased`}>
        <EinblickEditBoot>{children}</EinblickEditBoot>
        <AnalyticsConsentManager />
      </body>
    </html>
  );
}
