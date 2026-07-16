import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { SITE_URL, SITE_NAME, SITE_NAME_EN, SITE_DESCRIPTION } from "@/lib/site";
import CustomCursor from "@/components/CustomCursor";
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
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
