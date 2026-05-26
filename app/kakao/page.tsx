import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Timer } from "lucide-react";

const sharedBeanId = "peru-la-primavera-geisha-washed";

export const metadata: Metadata = {
  title: "카톡 공유용 QR 원두 경험",
  description: "CoffeeOS를 카톡 인앱 브라우저에서 바로 열어보세요.",
  alternates: {
    canonical: "/kakao"
  },
  openGraph: {
    title: "CoffeeOS - 카톡에서 바로 여는 QR 원두 경험",
    description: "원두 정보와 브루잉 타이머를 로그인 없이 바로 확인하세요.",
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
    title: "CoffeeOS - 카톡에서 바로 여는 QR 원두 경험",
    description: "원두 정보와 브루잉 타이머를 로그인 없이 바로 확인하세요.",
    images: ["/coffeeos-kakao.jpg"]
  }
};

export default function KakaoSharePage() {
  return (
    <div className="min-h-screen bg-coffee-background">
      <section className="relative min-h-[520px] overflow-hidden px-6 pb-8 pt-10">
        <img
          src="/coffeeos-kakao.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-dark/10 via-coffee-background/20 to-coffee-background" />
        <div className="relative flex min-h-[460px] flex-col justify-end">
          <p className="text-sm font-semibold text-coffee-accent">CoffeeOS</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-coffee-primary">
            카톡에서 바로 여는 QR 원두 경험
          </h1>
          <p className="mt-4 text-base leading-7 text-coffee-secondary">
            원두 정보와 브루잉 타이머를 로그인 없이 먼저 확인할 수 있습니다.
          </p>
          <div className="mt-6 grid gap-2">
            <Link
              href={`/beans/${sharedBeanId}`}
              className="focus-ring inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white shadow-soft"
            >
              원두 경험 열기
              <ArrowRight size={17} />
            </Link>
            <Link
              href={`/beans/${sharedBeanId}/brew`}
              className="focus-ring inline-flex h-14 items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-card px-4 text-sm font-semibold text-coffee-primary shadow-soft"
            >
              <Timer size={17} />
              브루잉 타이머 열기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
