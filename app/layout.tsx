import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/content";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ORIZON — Intelligence, engineered.",
    template: "%s · ORIZON",
  },
  description: site.description,
  applicationName: "ORIZON",
  keywords: ["AI", "LLM", "software engineering", "custom software", "Algeria", "Algiers", "data platforms", "cloud", "cybersecurity", "enterprise systems"],
  openGraph: {
    type: "website",
    siteName: "ORIZON",
    title: "ORIZON — Intelligence, engineered.",
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <head>
        {/* Enables reveal-on-scroll only when JS runs, so content is never hidden without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
