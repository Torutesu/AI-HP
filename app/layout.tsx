import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { SITE_URL, SITE_NAME, SITE_NAME_EN, SITE_DESCRIPTION } from "@/lib/site";
import CustomCursor from "@/components/CustomCursor";
import Analytics from "@/components/Analytics";
import MobileStickyCta from "@/components/MobileStickyCta";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | AIを、たしかな経営成果へ。`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    title: `${SITE_NAME} | AIを、たしかな経営成果へ。`,
    description: "AI Native企業を、産み出す。試すだけで終わらせず、経営の数字が動く形で実装します。",
    locale: "ja_JP",
    type: "website",
    url: SITE_URL,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} | AIを、たしかな経営成果へ。`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | AIを、たしかな経営成果へ。`,
    description: "AI Native企業を、産み出す。試すだけで終わらせず、経営の数字が動く形で実装します。",
    images: ["/og.png"],
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: ["AI総戦研", "AI Strategy Institute", "AI総合戦略研", "AISRI"],
  url: SITE_URL,
  logo: `${SITE_URL}/logo-mark.png`,
  description: SITE_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressCountry: "JP",
    addressRegion: "東京都",
    addressLocality: "渋谷区",
    streetAddress: "恵比寿西1-16-11",
  },
  knowsAbout: ["AI導入支援", "AI戦略策定", "内製AI開発", "業務自動化", "生成AI活用"],
  // TODO: 確定したら公式プロフィールURLを追加（X / PR TIMES / Wantedly 等）
  sameAs: [] as string[],
  parentOrganization: { "@type": "Organization", name: "株式会社Select" },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: SITE_NAME_EN,
  url: SITE_URL,
  inLanguage: "ja",
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
        <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} マガジン`} href="/feed.xml" />
        {SITE_VERIFICATION.google ? <meta name="google-site-verification" content={SITE_VERIFICATION.google} /> : null}
        {SITE_VERIFICATION.bing ? <meta name="msvalidate.01" content={SITE_VERIFICATION.bing} /> : null}
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <CustomCursor />
        {children}
        <MobileStickyCta />
      </body>
    </html>
  );
}
