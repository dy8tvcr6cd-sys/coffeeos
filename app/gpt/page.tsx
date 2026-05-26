import type { Metadata } from "next";
import Link from "next/link";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileJson,
  FileText,
  GitBranch,
  Github,
  Image as ImageIcon,
  Link as LinkIcon,
  Lock,
  Route,
  ShieldCheck
} from "lucide-react";
import reviewManifest from "@/public/review-manifest.json";

type ReviewRoute = {
  href: string;
  label: string;
  description: string;
};

type ReviewScreenshot = {
  src: string;
  title: string;
  route: string;
};

const exampleBeanId = "peru-la-primavera-geisha-washed";
const exampleRoasteryId = "kook-coffee-roasters";

const latestDeploymentUrl = reviewManifest.latestDeploymentUrl;
const repositoryUrl = "https://github.com/dy8tvcr6cd-sys/coffeeos";
const handoffUrl = `${repositoryUrl}/blob/master/docs/GPT_HANDOFF.md`;
const screenshotGuideUrl = `${repositoryUrl}/blob/master/docs/SCREENSHOT_GUIDE.md`;
const manifestUrl = `${latestDeploymentUrl}/review-manifest.json`;

const publicReviewRoutes: ReviewRoute[] = [
  {
    href: "/beans",
    label: "/beans",
    description: "공개 원두 목록"
  },
  {
    href: `/beans/${exampleBeanId}`,
    label: `/beans/${exampleBeanId}`,
    description: "대표 QR 원두 상세"
  },
  {
    href: `/beans/${exampleBeanId}/brew`,
    label: `/beans/${exampleBeanId}/brew`,
    description: "대표 브루잉 타이머"
  },
  {
    href: "/roasteries",
    label: "/roasteries",
    description: "공개 로스터리 목록"
  },
  {
    href: `/roasteries/${exampleRoasteryId}`,
    label: `/roasteries/${exampleRoasteryId}`,
    description: "대표 로스터리 상세"
  },
  {
    href: "/login",
    label: "/login",
    description: "고객 로그인"
  },
  {
    href: "/signup",
    label: "/signup",
    description: "고객 회원가입"
  }
];

const protectedRoutes = [
  "/",
  "/archive",
  "/my-recipes",
  "/brew-diagnosis",
  "/account",
  "/sensory/[recordId]"
];

const adminRoutes = [
  "/roastery-admin/login",
  "/roastery-admin/signup",
  "/roastery-admin/dashboard",
  "/roastery-admin/beans",
  "/roastery-admin/qr",
  "/roastery-admin/preview"
];

const reviewLinks: ReviewRoute[] = [
  {
    href: "/gpt",
    label: "GPT 리뷰 페이지",
    description: "현재 제품 흐름과 검토 기준"
  },
  {
    href: "/kakao",
    label: "카톡 공유 진입",
    description: "카카오톡 인앱 브라우저용 공개 화면"
  },
  {
    href: manifestUrl,
    label: "review-manifest.json",
    description: "링크 접근이 실패할 때 사용할 구조화 데이터"
  },
  {
    href: handoffUrl,
    label: "GitHub 핸드오프 문서",
    description: "화면이 열리지 않을 때 읽을 제품 설명 문서"
  },
  {
    href: screenshotGuideUrl,
    label: "스크린샷 전달 가이드",
    description: "리뷰용 화면 이미지를 저장하고 공유하는 방법"
  }
];

const screenshots: ReviewScreenshot[] = [
  { src: "/review-screenshots/01-login.png", title: "로그인", route: "/login" },
  { src: "/review-screenshots/02-home.png", title: "홈", route: "/" },
  { src: "/review-screenshots/03-beans-list.png", title: "원두 목록", route: "/beans" },
  { src: "/review-screenshots/04-bean-detail.png", title: "원두 상세", route: `/beans/${exampleBeanId}` },
  { src: "/review-screenshots/05-brew-timer.png", title: "브루잉 타이머", route: `/beans/${exampleBeanId}/brew` },
  { src: "/review-screenshots/06-sensory.png", title: "센서리 기록", route: "/beans/[id]/sensory" },
  { src: "/review-screenshots/07-brew-diagnosis.png", title: "추출 처방", route: "/brew-diagnosis" },
  { src: "/review-screenshots/08-my-recipes.png", title: "나의 레시피", route: "/my-recipes" },
  { src: "/review-screenshots/09-roasteries.png", title: "로스터리 목록", route: "/roasteries" },
  { src: "/review-screenshots/10-roastery-detail.png", title: "로스터리 상세", route: `/roasteries/${exampleRoasteryId}` },
  { src: "/review-screenshots/11-roastery-admin-login.png", title: "로스터리 관리자 로그인", route: "/roastery-admin/login" },
  { src: "/review-screenshots/12-roastery-admin-dashboard.png", title: "로스터리 관리자 대시보드", route: "/roastery-admin/dashboard" }
];

const implementedFeatures = [
  "공개 원두 목록과 QR 원두 상세",
  "추천 브루잉 레시피와 단계별 타이머",
  "센서리 기록, 추출 기록, 추출 처방 흐름",
  "나의 레시피 저장과 재사용 흐름",
  "공개 로스터리 목록과 브랜드 소개 중심 상세",
  "고객 화면과 분리된 로스터리 관리자 영역",
  "카톡 공유용 공개 진입 페이지",
  "로컬 저장소 기반 프로토타입 데이터 유지"
];

const knownIssues = [
  "trycloudflare.com 같은 임시 터널은 만료되거나 외부 GPT 환경에서 열리지 않을 수 있습니다.",
  "일부 개인 기록과 관리자 등록 데이터는 현재 로컬 저장소 기반 프로토타입입니다.",
  "관리자에서 새로 추가한 원두를 다른 기기에서 보려면 배포 데이터나 백엔드 저장이 필요합니다.",
  "일부 샘플 원두는 구매 링크와 로스터리 제공 정보가 아직 등록 예정 상태입니다.",
  "라이브 페이지가 열리지 않으면 스크린샷, review-manifest.json, GPT_HANDOFF.md를 기준으로 리뷰해야 합니다."
];

const reviewChecklist = [
  "로그인 없이 원두 페이지를 볼 수 있는가?",
  "원두 페이지에서 추출 시작이 바로 가능한가?",
  "브루잉 타이머가 실제로 작동하는가?",
  "브루잉 단계가 40g (40g)처럼 명확히 표시되는가?",
  "기록 저장은 로그인 후 가능한가?",
  "추출 처방이 실제 추출 기록 기반인가?",
  "나의 레시피로 저장하고 다시 사용할 수 있는가?",
  "로스터리 페이지는 브랜드 소개 중심인가?",
  "로스터리 관리자 기능이 고객 화면에 노출되지 않는가?"
];

export const metadata: Metadata = {
  title: "CoffeeOS GPT Review",
  description: "CoffeeOS 제품 흐름과 주요 화면을 검토하기 위한 리뷰 페이지입니다.",
  alternates: {
    canonical: "/gpt"
  },
  openGraph: {
    title: "CoffeeOS GPT Review",
    description: "CoffeeOS 제품 흐름과 주요 화면을 검토하기 위한 리뷰 페이지입니다.",
    url: "/gpt",
    siteName: "CoffeeOS",
    images: [
      {
        url: "/coffeeos-kakao.jpg",
        width: 1200,
        height: 630,
        alt: "CoffeeOS 리뷰 공유 이미지"
      }
    ],
    locale: "ko_KR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "CoffeeOS GPT Review",
    description: "CoffeeOS 제품 흐름과 주요 화면을 검토하기 위한 리뷰 페이지입니다.",
    images: ["/coffeeos-kakao.jpg"]
  }
};

function hasScreenshot(src: string) {
  return existsSync(join(process.cwd(), "public", src.replace(/^\//, "")));
}

function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${latestDeploymentUrl}${path}`;
}

export default function GptReviewPage() {
  return (
    <div className="min-h-screen bg-coffee-background px-5 py-6">
      <header className="rounded-lg border border-coffee-border bg-coffee-card p-5 shadow-soft">
        <p className="text-xs font-semibold uppercase text-coffee-accent">CoffeeOS Review Handoff</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-coffee-primary">
          CoffeeOS GPT 리뷰 페이지
        </h1>
        <p className="mt-3 text-sm leading-6 text-coffee-secondary">
          CoffeeOS의 현재 화면, 제품 흐름, 핵심 기능을 ChatGPT가 확인하고 피드백할 수 있도록 정리한 페이지입니다.
        </p>
      </header>

      <main className="mt-5 grid gap-5 pb-8">
        <ReviewSection title="한 줄 정의" icon={<FileText size={18} />}>
          <p className="text-sm leading-7 text-coffee-primary">
            CoffeeOS는 로스터리가 등록한 원두 정보를 QR로 고객에게 전달하고, 고객이 원두 이해, 브루잉 실행, 센서리 기록, 추출 처방, 저장 레시피, 재구매 흐름까지 이어갈 수 있게 하는 커피 경험 운영 플랫폼입니다.
          </p>
        </ReviewSection>

        <ReviewSection title="핵심 제품 루프" icon={<ArrowRight size={18} />}>
          <div className="grid gap-2">
            {reviewManifest.coreLoop.map((step, index) => (
              <div key={step} className="flex items-center gap-2 text-sm text-coffee-primary">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-coffee-background text-xs font-semibold text-coffee-accent">
                  {index + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </ReviewSection>

        <ReviewSection title="확인할 공개 화면" icon={<Route size={18} />}>
          <RouteGrid routes={publicReviewRoutes} />
        </ReviewSection>

        <ReviewSection title="로그인 필요 화면" icon={<Lock size={18} />}>
          <RouteList routes={protectedRoutes} />
        </ReviewSection>

        <ReviewSection title="비공개 관리자 영역" icon={<ShieldCheck size={18} />}>
          <p className="text-sm leading-6 text-coffee-secondary">
            로스터리 관리자 기능은 고객 화면에 노출하지 않습니다. 원두 등록, QR 생성, 관리자 대시보드는 /roastery-admin 영역에서만 접근합니다.
          </p>
          <div className="mt-4">
            <RouteList routes={adminRoutes} />
          </div>
        </ReviewSection>

        <ReviewSection title="중요 리뷰 링크" icon={<LinkIcon size={18} />}>
          <RouteGrid routes={reviewLinks} external />
        </ReviewSection>

        <ReviewSection title="스크린샷 갤러리" icon={<ImageIcon size={18} />}>
          <div className="grid gap-3">
            {screenshots.map((item) => {
              const exists = hasScreenshot(item.src);

              return (
                <div key={item.src} className="overflow-hidden rounded-lg border border-coffee-border bg-coffee-background">
                  {exists ? (
                    <img src={item.src} alt={`${item.title} 스크린샷`} className="aspect-[4/3] w-full object-cover" />
                  ) : (
                    <div className="grid aspect-[4/3] place-items-center px-4 text-center">
                      <div>
                        <ImageIcon size={24} className="mx-auto text-coffee-muted" />
                        <p className="mt-3 text-sm font-semibold text-coffee-primary">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-coffee-secondary">
                          스크린샷이 아직 등록되지 않았습니다.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="border-t border-coffee-border px-4 py-3">
                    <p className="text-sm font-semibold text-coffee-primary">{item.title}</p>
                    <p className="mt-1 text-xs text-coffee-secondary">{item.route}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ReviewSection>

        <ReviewSection title="현재 구현된 기능" icon={<CheckCircle2 size={18} />}>
          <Checklist items={implementedFeatures} />
        </ReviewSection>

        <ReviewSection title="알려진 제한과 리뷰 초점" icon={<AlertTriangle size={18} />}>
          <Checklist items={knownIssues} />
          <div className="mt-5 rounded-lg border border-coffee-border bg-coffee-background p-4">
            <p className="text-sm font-semibold text-coffee-primary">리뷰 기준</p>
            <p className="mt-2 text-sm leading-6 text-coffee-secondary">
              이 앱은 단순한 원두 쇼핑몰이나 예쁜 QR 랜딩페이지가 아닙니다. 모든 기능은 원두 이해, 추출 실행, 기록 저장, 처방, 레시피 재사용, 재구매 흐름을 강화해야 합니다.
            </p>
          </div>
        </ReviewSection>

        <ReviewSection title="리뷰 체크리스트" icon={<CheckCircle2 size={18} />}>
          <Checklist items={reviewChecklist} />
        </ReviewSection>

        <ReviewSection title="배포와 저장소 정보" icon={<Github size={18} />}>
          <InfoList
            items={[
              ["Deployment URL", latestDeploymentUrl],
              ["GitHub repository", repositoryUrl],
              ["GitHub handoff", handoffUrl],
              ["Review manifest", manifestUrl],
              ["Last updated", reviewManifest.lastUpdated],
              ["Current branch", reviewManifest.currentBranch],
              ["Build status", reviewManifest.buildStatusNote]
            ]}
          />
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-coffee-border bg-coffee-background p-4 text-xs leading-5 text-coffee-secondary">
            <GitBranch size={16} className="mt-0.5 shrink-0 text-coffee-muted" />
            <p>최신 배포 정보는 Vercel과 GitHub 커밋을 기준으로 확인해주세요.</p>
          </div>
        </ReviewSection>

        <ReviewSection title="구조화 리뷰 데이터" icon={<FileJson size={18} />}>
          <div className="rounded-lg bg-coffee-dark p-4 text-xs leading-5 text-white">
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(reviewManifest, null, 2)}</pre>
          </div>
        </ReviewSection>
      </main>
    </div>
  );
}

function ReviewSection({
  title,
  icon,
  children
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-coffee-border bg-coffee-card p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-2 text-coffee-primary">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-coffee-background text-coffee-accent">
          {icon}
        </span>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function RouteGrid({ routes, external = false }: { routes: ReviewRoute[]; external?: boolean }) {
  return (
    <div className="grid gap-3">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={external ? route.href : route.href}
          className="focus-ring flex items-center gap-3 rounded-lg border border-coffee-border bg-coffee-background p-4"
        >
          <span className="min-w-0 flex-1">
            <span className="block break-words text-sm font-semibold text-coffee-primary">
              {external ? route.label : route.label}
            </span>
            <span className="mt-1 block text-xs leading-5 text-coffee-secondary">{route.description}</span>
            {external ? (
              <span className="mt-1 block break-words text-xs text-coffee-muted">{absoluteUrl(route.href)}</span>
            ) : null}
          </span>
          <ArrowRight size={17} className="shrink-0 text-coffee-muted" />
        </Link>
      ))}
    </div>
  );
}

function RouteList({ routes }: { routes: string[] }) {
  return (
    <ul className="grid gap-2">
      {routes.map((route) => (
        <li key={route} className="rounded-lg bg-coffee-background px-3 py-2 text-sm font-medium text-coffee-primary">
          {route}
        </li>
      ))}
    </ul>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-6 text-coffee-secondary">
          <CheckCircle2 size={16} className="mt-1 shrink-0 text-coffee-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoList({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="grid gap-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-lg border border-coffee-border bg-coffee-background p-4">
          <dt className="text-xs font-semibold uppercase text-coffee-muted">{label}</dt>
          <dd className="mt-1 break-words text-sm font-medium text-coffee-primary">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
