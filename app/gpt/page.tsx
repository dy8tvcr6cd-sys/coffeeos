import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, Coffee, FileText, Timer } from "lucide-react";

const sharedBeanId = "peru-la-primavera-geisha-washed";

const reviewLinks = [
  {
    href: `/beans/${sharedBeanId}`,
    label: "대표 원두 페이지",
    description: "원두 정보, 컵 노트, 로스터리 정보, 추천 레시피를 확인합니다.",
    icon: Coffee
  },
  {
    href: `/beans/${sharedBeanId}/brew`,
    label: "브루잉 타이머",
    description: "추천 레시피 흐름과 추출 타이머 화면을 확인합니다.",
    icon: Timer
  },
  {
    href: "/kakao",
    label: "카톡 공유 화면",
    description: "카카오톡 인앱 브라우저에서 보여줄 첫 화면을 확인합니다.",
    icon: FileText
  }
];

export const metadata: Metadata = {
  title: "GPT 공유용 CoffeeOS 링크",
  description: "CoffeeOS를 GPT가 바로 확인할 수 있는 공개 링크입니다.",
  alternates: {
    canonical: "/gpt"
  },
  openGraph: {
    title: "CoffeeOS - GPT 확인용 공개 링크",
    description: "원두 정보와 브루잉 타이머, 카톡 공유 화면을 로그인 없이 확인하세요.",
    url: "/gpt",
    siteName: "CoffeeOS",
    images: [
      {
        url: "/coffeeos-kakao.jpg",
        width: 1200,
        height: 630,
        alt: "CoffeeOS 공유 이미지"
      }
    ],
    locale: "ko_KR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "CoffeeOS - GPT 확인용 공개 링크",
    description: "원두 정보와 브루잉 타이머, 카톡 공유 화면을 로그인 없이 확인하세요.",
    images: ["/coffeeos-kakao.jpg"]
  }
};

export default function GptSharePage() {
  return (
    <div className="min-h-screen bg-coffee-background">
      <section className="relative overflow-hidden px-6 pb-8 pt-10">
        <img
          src="/coffeeos-kakao.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-dark/10 via-coffee-background/30 to-coffee-background" />
        <div className="relative flex min-h-[360px] flex-col justify-end">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-coffee-card/90 text-coffee-primary shadow-soft">
            <Bot size={22} />
          </div>
          <p className="mt-5 text-sm font-semibold text-coffee-accent">CoffeeOS</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-coffee-primary">
            GPT 확인용 공개 링크
          </h1>
          <p className="mt-4 text-base leading-7 text-coffee-secondary">
            로그인 없이 열리는 CoffeeOS 대표 흐름입니다.
          </p>
        </div>
      </section>

      <section className="px-5 pb-10">
        <div className="grid gap-3">
          {reviewLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring flex items-center gap-3 rounded-lg border border-coffee-border bg-coffee-card p-4 shadow-soft"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-coffee-background text-coffee-primary">
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-coffee-primary">{item.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-coffee-secondary">
                    {item.description}
                  </span>
                </span>
                <ArrowRight size={17} className="shrink-0 text-coffee-muted" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
