import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import ProfileSetupModal from "@/components/ProfileSetupModal";
import { Analytics } from "@vercel/analytics/react";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gen-a-ijobhub.vercel.app'),
  title: {
    default: "GenAIJobHub - The #1 AI Jobs Board",
    template: "%s | GenAIJobHub",
  },
  description: "GenAIJobHub is the leading platform connecting AI professionals with top employers. Discover remote AI jobs, freelance gigs, and cutting-edge AI tools.",
  openGraph: {
    title: "GenAIJobHub - The #1 AI Jobs Board",
    description: "Connect with top employers and find the best AI jobs, freelance gigs, and tools.",
    url: 'https://gen-a-ijobhub.vercel.app',
    siteName: 'GenAIJobHub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "GenAIJobHub - The #1 AI Jobs Board",
    description: "Connect with top employers and find the best AI jobs, freelance gigs, and tools.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${outfit.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`} style={{ fontFamily: 'var(--font-outfit), system-ui, sans-serif' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://gen-a-ijobhub.vercel.app/#website",
                  "url": "https://gen-a-ijobhub.vercel.app/",
                  "name": "GenAIJobHub",
                  "description": "The leading platform connecting AI professionals with top employers.",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://gen-a-ijobhub.vercel.app/jobs?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://gen-a-ijobhub.vercel.app/#organization",
                  "name": "GenAIJobHub",
                  "url": "https://gen-a-ijobhub.vercel.app/",
                  "logo": "https://gen-a-ijobhub.vercel.app/logo.png"
                }
              ]
            })
          }}
        />
        <AuthProvider>
          <Navbar />
          <ProfileSetupModal />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}

