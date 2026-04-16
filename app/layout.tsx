import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import ChatWidget from "./ChatWidget";
import SessionGuard from "./SessionGuard";
import PageTracker from "./PageTracker";

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
    default: "TheReviewer.mu — Businesses & Travel in Mauritius and Rodrigues",
    template: "%s | TheReviewer.mu",
  },
  description: "Discover, rate, and book the best businesses across Mauritius and Rodrigues — hotels, restaurants, guest houses, spas, tours, car rentals and more. Verified reviews, AI-powered insights, licensed listings, instant booking.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://thereviewer.mu'),
  openGraph: {
    title: "TheReviewer.mu — Businesses & Travel in Mauritius and Rodrigues",
    description: "Find the right place, share your experience, book in one click. 450+ businesses across Mauritius and Rodrigues with verified reviews, AI analysis and official licenses.",
    siteName: "TheReviewer.mu",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheReviewer.mu",
    description: "Discover, rate & book the best businesses across Mauritius and Rodrigues",
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
        <LangProvider>
          {children}
          <SessionGuard />
          <PageTracker />
          <ChatWidget />
        </LangProvider>
      </body>
    </html>
  );
}
