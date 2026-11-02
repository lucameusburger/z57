import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import ogImage from "@/app/og.png";
import AnalyticsConsentManager from "@/app/components/AnalyticsConsent";
import EinblickEditBoot from "@/app/components/EinblickEditBoot";

const intertopia = localFont({
  src: "./fonts/IntertopiaVF.woff2",
  variable: "--font-intertopia",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: "z57 - Atelier and Studio Space",
  description: "We are an Atelier and Studio Space in the heart of Vienna",
  openGraph: {
    images: [
      {
        url: ogImage.src,
        width: 1200,
        height: 630,
        alt: "Group Image",
      },
    ],
  },
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
