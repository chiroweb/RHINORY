import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rhinory.shop";

export const metadata: Metadata = {
  title: { default: "RHINORY | 전원주택 외부공간 쇼핑몰", template: "%s | RHINORY" },
  description: "전원주택과 단독주택의 울타리, 자동대문, 야외창고, 데크, 정원관리, 보안용품을 한곳에서 비교하고 상담받는 RHINORY입니다.",
  keywords: ["전원주택 종합몰", "단독주택 외부공간", "전원주택 울타리", "자동대문", "야외창고", "마당 인테리어", "정원관리용품", "전원주택 관리용품"],
  category: "전원주택 외부공간 쇼핑몰",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "RHINORY",
    title: "RHINORY | 전원주택 외부공간 쇼핑몰",
    description: "전원주택의 울타리, 대문, 야외창고, 데크, 정원관리와 설치상담까지 한곳에서 확인하세요.",
    url: siteUrl,
    images: [{ url: "/images/hero-territory.png", alt: "RHINORY HOUSE · LAND · OUTDOOR" }],
  },
  twitter: { card: "summary_large_image", title: "RHINORY | 전원주택 외부공간 쇼핑몰", description: "전원주택의 울타리, 대문, 야외창고, 데크, 정원관리와 설치상담까지." },
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
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "RHINORY", url: siteUrl, logo: `${siteUrl}/favicon.png`, description: "전원주택과 단독주택 외부공간에 필요한 상품, 설치, 관리 정보를 제안하는 전문 커머스 플랫폼." },
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "RHINORY", publisher: { "@id": `${siteUrl}/#organization` }, inLanguage: "ko-KR" },
    ],
  };
  return <html lang="ko"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />{children}</body></html>;
}
