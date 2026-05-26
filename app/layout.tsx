import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthGate } from "@/components/AuthGate";
import { BottomNavigation } from "@/components/BottomNavigation";
import { normalizeBaseUrl } from "@/lib/shareLinks";

const siteUrl =
  normalizeBaseUrl(
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL
  ) ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CoffeeOS",
    template: "%s | CoffeeOS"
  },
  description: "카톡에서 바로 열어보는 QR 기반 원두 정보, 브루잉 타이머, 감각 기록 경험.",
  openGraph: {
    title: "CoffeeOS",
    description: "카톡에서 바로 열어보는 QR 원두 경험.",
    url: "/kakao",
    siteName: "CoffeeOS",
    images: [
      {
        url: "/coffeeos-kakao.jpg",
        width: 1200,
        height: 630,
        alt: "CoffeeOS 카톡 공유 이미지"
      }
    ],
    locale: "ko_KR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "CoffeeOS",
    description: "카톡에서 바로 열어보는 QR 원두 경험.",
    images: ["/coffeeos-kakao.jpg"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="mx-auto min-h-screen w-full max-w-[480px] border-x border-coffee-border/70 bg-coffee-background">
          <AuthGate>
            <main className="min-h-screen pb-28">{children}</main>
          </AuthGate>
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
