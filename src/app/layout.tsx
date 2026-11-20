import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import { Shell } from "@/components/shell";
import "./globals.css";
const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    default: "Griddle Club — A Mackay Design Concept",
    template: "%s · Griddle Club",
  },
  description:
    "An independent restaurant website concept with a fictional menu, simulated checkout and menu assistant. No real orders or payments.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Griddle Club — Fictional Restaurant Concept",
    description:
      "A fictional restaurant experience by Mackay Design. Demonstration only.",
    images: [
      {
        url: "/images/hero.webp",
        width: 1672,
        height: 941,
        alt: "Generated burger concept photography",
      },
    ],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${display.variable} ${body.variable}`}>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
