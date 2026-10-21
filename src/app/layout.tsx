import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import AppProviders from "@/providers/AppProviders";

import { constructMetadata, generateOrganizationSchema } from "@/lib/seo";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  ...constructMetadata({
    title: "Virtual Theological Institute (VTI) - Bible Education for Everyone, Everywhere",
    description:
      "A non-denominational Urdu Bible learning platform committed to offering Bible courses tailored to the needs of the Pakistani Christian community and global believers. Accessible, practical, and 100% free.",
  }),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/assets/img/logo/favicon.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
