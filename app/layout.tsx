import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TheReviewer.mu — Trusted Business Reviews in Mauritius",
    template: "%s | TheReviewer.mu",
  },
  description: "Find trusted reviews for businesses in Mauritius. Hotels, restaurants, shops and more — real reviews from real customers.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://thereviewer.vercel.app'),
  openGraph: {
    title: "TheReviewer.mu — Trusted Business Reviews in Mauritius",
    description: "Find trusted reviews for businesses in Mauritius. Hotels, restaurants, shops and more.",
    siteName: "TheReviewer.mu",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheReviewer.mu",
    description: "Trusted business reviews for Mauritius",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
