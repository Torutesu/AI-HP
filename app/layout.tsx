import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Noto_Sans_JP } from "next/font/google";
import {
  SITE_URL,
  SITE_NAME,
  SITE_NAME_EN,
  SITE_DESCRIPTION,
  ORGANIZATION_ID, WEBSITE_ID, PARENT_URL, SOCIAL_PROFILES,
} from "@/lib/site";
import { buildPageMetadata, HOME_TITLE } from "@/lib/seo";
import Analytics from "@/components/Analytics";
import { SITE_VERIFICATION } from "@/lib/analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  ...buildPageMetadata({ title: HOME_TITLE, path: "/" }),
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: HOME_TITLE, template: `%s | ${SITE_NAME}` },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  icons: {
    icon: { url: "/icon.png?v=20260905", sizes: "256x256", type: "image/png" },
    apple: { url: "/apple-icon.png?v=20260905", sizes: "180x180", type: "image/png" },
    shortcut: "/favicon.ico?v=20260905",
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  alternateName: ["AI総研", "AI Strategy Institute"],
  url: SITE_URL,
  logo: `${SITE_URL}/social/icon-1024.png`,
  description: SITE_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressCountry: "JP",
    addressRegion: "東京都",
    addressLocality: "渋谷区",
    streetAddress: "恵比寿西1-16-11",
  },
  knowsAbout: [
    "AI導入支援",
    "AI戦略策定",
    "内製AI開発",
    "業務自動化",
    "生成AI活用",
  ],
  sameAs: SOCIAL_PROFILES.map((profile) => profile.url),
  parentOrganization: {
    "@type": "Organization",
    name: "株式会社Select",
    url: PARENT_URL,
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  alternateName: SITE_NAME_EN,
  url: SITE_URL,
  inLanguage: "ja",
  publisher: { "@id": ORGANIZATION_ID },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <head>
        {/* RSS discovery — declared here (not via metadata.alternates) because
            each page's alternates.canonical shallow-replaces the layout's. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_NAME} マガジン`}
          href="/feed.xml"
        />
        {SITE_VERIFICATION.google ? (
          <meta
            name="google-site-verification"
            content={SITE_VERIFICATION.google}
          />
        ) : null}
        {SITE_VERIFICATION.bing ? (
          <meta name="msvalidate.01" content={SITE_VERIFICATION.bing} />
        ) : null}
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
