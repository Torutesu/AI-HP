import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
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
  metadataBase: new URL("https://ai-strategy-institute.example"),
  title: {
    default: "AI総合戦略研究所 | AIを、たしかな経営成果へ。",
    template: "%s | AI総合戦略研究所",
  },
  description:
    "AIを「試して終わり」にさせません。貴社の事業に深く根ざす形でコストのムダを整え、売上の芽を育て、AIが経営の数字を動かすところまで伴走してご支援します。",
  openGraph: {
    title: "AI総合戦略研究所 | AIを、たしかな経営成果へ。",
    description: "AI Native企業を、産み出す。試すだけで終わらせず、経営の数字が動く形で実装します。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body>{children}</body>
    </html>
  );
}
