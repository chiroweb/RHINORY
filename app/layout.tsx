import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RHINORY | HOUSE · LAND · OUTDOOR",
  description: "단독주택과 야외공간에 필요한 모든 것. 제품부터 설치까지 RHINORY가 제안합니다.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
