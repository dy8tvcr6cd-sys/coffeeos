import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthGate } from "@/components/AuthGate";
import { BottomNavigation } from "@/components/BottomNavigation";

export const metadata: Metadata = {
  title: "CoffeeOS",
  description: "A QR-based coffee experience system for roasteries, beans, brewing, sensory records, and repurchase."
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
