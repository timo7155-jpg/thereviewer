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
    default: "TheReviewer.mu — Connecting Businesses and Customers in Mauritius",
    template: "%s | TheReviewer.mu",
  },
  description: "Discover, rate, and book the best businesses in Mauritius. Hotels, restaurants, spas, tours, car rentals and more — verified reviews, AI-powered insights, and instant booking.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://thereviewer.vercel.app'),
  openGraph: {
    title: "TheReviewer.mu — Connecting Businesses and Customers in Mauritius",
    description: "Find the right place, share your experience, book in one click. 200+ businesses across Mauritius with verified reviews and AI analysis.",
    siteName: "TheReviewer.mu",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheReviewer.mu",
    description: "Discover, rate & book the best businesses in Mauritius",
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
