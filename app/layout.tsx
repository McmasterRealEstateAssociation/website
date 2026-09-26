import type { Metadata, Viewport } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import { copy, site } from "@/content/site";
import "./globals.css";

// Both are variable fonts: one file each covers every weight the site uses.
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: copy.home.title,
    template: `%s | ${site.name} (${site.shortName})`,
  },
  description: site.description,
  applicationName: `${site.name} (${site.shortName})`,
  openGraph: {
    type: "website",
    siteName: `${site.name} (${site.shortName})`,
    locale: "en_CA",
    title: copy.home.title,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: copy.home.title,
    description: site.description,
  },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#7A003C",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" className={`${cinzel.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
