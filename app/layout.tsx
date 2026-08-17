import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rhinory.shop";

export const metadata: Metadata = {
  title: { default: "RHINORY | HOUSE · LAND · OUTDOOR", template: "%s | RHINORY" },
  description: "단독주택과 야외공간에 필요한 모든 것. 제품부터 설치까지 RHINORY가 제안합니다.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "RHINORY",
    title: "RHINORY | HOUSE · LAND · OUTDOOR",
    description: "단독주택과 야외공간에 필요한 모든 것. 제품부터 설치까지 RHINORY가 제안합니다.",
    url: siteUrl,
    images: [{ url: "/images/hero-territory.png", alt: "RHINORY HOUSE · LAND · OUTDOOR" }],
  },
  twitter: { card: "summary_large_image", title: "RHINORY | HOUSE · LAND · OUTDOOR", description: "단독주택과 야외공간에 필요한 모든 것." },
  robots: { index: true, follow: true },
  other: { "naver-site-verification": "53236517f04250cf1d8aa66b77b5b6c4e5aaf600" },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/favicon.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "RHINORY", url: siteUrl, logo: `${siteUrl}/favicon.png`, description: "단독주택과 야외공간에 필요한 상품과 설치 서비스를 제안하는 전문 커머스 플랫폼." },
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "RHINORY", publisher: { "@id": `${siteUrl}/#organization` }, inLanguage: "ko-KR" },
    ],
  };
  return <html lang="ko"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />{children}</body></html>;
}
