import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import ogImage from "@/app/og.png";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Z57 - Atelier and Studio Space",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
