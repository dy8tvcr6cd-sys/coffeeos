"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Brain, CalendarDays, ClipboardList, QrCode, Timer } from "lucide-react";
import { BeanCard } from "@/components/BeanCard";
import { PageHeader } from "@/components/PageHeader";
import { RoasteryLogo } from "@/components/RoasteryLogo";
import { SectionCard } from "@/components/SectionCard";
import { beans } from "@/data/beans";
import { roasteries } from "@/data/roasteries";
import { getLocalizedText } from "@/lib/i18n";
import { getSensoryRecords } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { SensoryRecord } from "@/types/sensory";

const featuredBeanIds = [
  "momos-honduras-coe-la-pena",
  "bean-brothers-peru-el-palmo",
  "coffee-libre-vertigo",
  "peru-la-primavera-geisha-washed"
];

export default function Home() {
  const { locale, t } = useLocale();
  const [recentRecords, setRecentRecords] = useState<SensoryRecord[]>([]);
  const featuredBeans = featuredBeanIds
    .map((id) => beans.find((bean) => bean.id === id))
    .filter((bean): bean is (typeof beans)[number] => Boolean(bean));
  const scanBean = beans.find((bean) => bean.id === "peru-la-primavera-geisha-washed") ?? beans[0];

  useEffect(() => {
    setRecentRecords(getSensoryRecords().slice(0, 2));
  }, []);

  return (
    <>
      <PageHeader
        title="CoffeeOS"
        eyebrow={t("qrExperience")}
        description={t("homeDescription")}
      />
      <div className="space-y-5 px-5">
        <SectionCard eyebrow={t("scanResult")} title={getLocalizedText(scanBean.name, locale)}>
          <div className="grid grid-cols-[72px_1fr] gap-4">
            <div className="grid h-[72px] w-[72px] grid-cols-4 grid-rows-4 gap-1 rounded-lg border border-coffee-border bg-coffee-background p-2">
              {Array.from({ length: 16 }).map((_, index) => (
                <span
                  key={index}
                  className={`rounded-sm ${
                    [0, 1, 4, 5, 10, 11, 14, 15, 7, 8].includes(index)
                      ? "bg-coffee-dark"
                      : "bg-coffee-border"
                  }`}
                />
              ))}
            </div>
            <div>
              <p className="text-sm leading-6 text-coffee-secondary">{t("qrFlowDescription")}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href={`/beans/${scanBean.id}`}
                  className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-coffee-dark px-3 text-sm font-semibold text-white"
                >
                  <QrCode size={16} />
                  {t("open")}
                </Link>
                <Link
                  href={`/beans/${scanBean.id}/brew`}
                  className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-card px-3 text-sm font-semibold text-coffee-primary"
                >
                  <Timer size={16} />
                  {t("brew")}
                </Link>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t("recentCustomerRecords")}>
          {recentRecords.length ? (
            <div className="grid gap-2">
              {recentRecords.map((record) => (
                <Link
                  key={record.id}
                  href={`/sensory/${record.id}`}
                  className="focus-ring rounded-lg border border-coffee-border bg-coffee-background p-3"
                >
                  <p className="text-sm font-semibold text-coffee-primary">{record.beanName}</p>
                  <p className="mt-1 text-xs leading-5 text-coffee-secondary">
                    {record.roasteryName} · {new Date(record.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid gap-2">
              {([
                ["getPrescription", "brewDiagnosisDescription", "/brew-diagnosis"],
                ["myRecipes", "myRecipesDescription", "/my-recipes"],
                ["reviewArchive", "archiveDescription", "/archive"]
              ] as const).map(([titleKey, descriptionKey, href]) => (
              <Link
                key={titleKey}
                href={href}
                className="focus-ring rounded-lg border border-coffee-border bg-coffee-background p-3"
              >
                <p className="text-sm font-semibold text-coffee-primary">{t(titleKey)}</p>
                <p className="mt-1 text-xs leading-5 text-coffee-secondary">{t(descriptionKey)}</p>
              </Link>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title={t("partnerRoasteries")}>
          <div className="grid grid-cols-2 gap-2">
            {roasteries.map((roastery) => (
              <Link
                key={roastery.id}
                href={`/roasteries/${roastery.id}`}
                className="focus-ring flex items-center gap-3 rounded-lg border border-coffee-border bg-coffee-background p-3"
              >
                <RoasteryLogo
                  name={roastery.name}
                  logoUrl={roastery.logoUrl}
                  logoAlt={roastery.logoAlt}
                  logoStatus={roastery.logoStatus}
                  size="sm"
                />
                <span className="min-w-0 text-sm font-semibold leading-5 text-coffee-primary">
                  {getLocalizedText(roastery.name, locale)}
                </span>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t("workflow")}>
          <div className="grid gap-2">
            {[
              { href: "/brew-diagnosis", label: t("getPrescription"), icon: Brain },
              { href: "/my-recipes", label: t("myRecipes"), icon: ClipboardList },
              { href: "/archive", label: t("reviewArchive"), icon: ClipboardList },
              { href: "/recommend", label: t("getRecommendations"), icon: ArrowRight },
              { href: "/cupping", label: t("joinCupping"), icon: CalendarDays }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring flex h-12 items-center justify-between rounded-lg border border-coffee-border bg-coffee-background px-4 text-sm font-semibold text-coffee-primary"
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon size={16} />
                    {item.label}
                  </span>
                  <ArrowRight size={16} />
                </Link>
              );
            })}
          </div>
        </SectionCard>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-coffee-primary">{t("featuredBeans")}</h2>
            <Link href="/beans" className="text-sm font-semibold text-coffee-accent">
              {t("viewAll")}
            </Link>
          </div>
          <div className="space-y-3">
            {featuredBeans.map((bean) => (
              <BeanCard key={bean.id} bean={bean} compact />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
