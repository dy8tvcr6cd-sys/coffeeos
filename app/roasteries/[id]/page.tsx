"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Globe } from "lucide-react";
import { BeanCard } from "@/components/BeanCard";
import { PageHeader } from "@/components/PageHeader";
import { RoasteryLogo } from "@/components/RoasteryLogo";
import { SectionCard } from "@/components/SectionCard";
import { getRoasteryById } from "@/data/roasteries";
import { getAllBeansClient } from "@/lib/storage";
import type { Bean } from "@/types/bean";
import { getLocalizedText } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

export default function RoasteryDetailPage() {
  const { locale, t } = useLocale();
  const params = useParams<{ id: string }>();
  const roastery = getRoasteryById(params.id);
  const [allBeans, setAllBeans] = useState<Bean[]>([]);

  useEffect(() => {
    setAllBeans(getAllBeansClient());
  }, []);

  const roasteryBeans = useMemo(
    () => allBeans.filter((bean) => bean.roasteryId === params.id),
    [allBeans, params.id]
  );

  if (!roastery) {
    return (
      <>
        <PageHeader title={t("needsReview")} backHref="/roasteries" />
        <div className="px-5">
          <Link
            href="/roasteries"
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {t("roasteries")}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={getLocalizedText(roastery.name, locale)}
        eyebrow={getLocalizedText(roastery.location, locale)}
        description={getLocalizedText(roastery.description, locale)}
        backHref="/roasteries"
      />
      <div className="space-y-5 px-5">
        <SectionCard
          title={t("roastery")}
          action={
            <RoasteryLogo
              name={roastery.name}
              logoUrl={roastery.logoUrl}
              logoAlt={roastery.logoAlt}
              logoStatus={roastery.logoStatus}
              size="lg"
            />
          }
        >
          <div className="space-y-4">
            <div className="rounded-lg bg-coffee-background p-4">
              <p className="text-sm text-coffee-secondary">{t("philosophy")}</p>
              <p className="mt-2 text-base font-semibold leading-7 text-coffee-primary">
                {getLocalizedText(roastery.philosophy, locale)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-coffee-border p-4">
                <p className="text-sm text-coffee-secondary">{t("roastingStyle")}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-coffee-primary">
                  {getLocalizedText(roastery.roastingStyle, locale) || t("needsReview")}
                </p>
              </div>
              <div className="rounded-lg border border-coffee-border p-4">
                <p className="text-sm text-coffee-secondary">{t("officialWebsite")}</p>
                <a
                  href={roastery.officialWebsiteUrl ?? roastery.sourceUrl ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-coffee-primary"
                >
                  <Globe size={15} />
                  {roastery.officialWebsiteUrl ? new URL(roastery.officialWebsiteUrl).hostname : t("needsReview")}
                </a>
              </div>
            </div>
          </div>
        </SectionCard>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-coffee-primary">{t("beans")}</h2>
            <Link href="/beans" className="inline-flex items-center gap-1 text-sm font-semibold text-coffee-accent">
              {t("viewAll")}
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="space-y-4">
            {roasteryBeans.map((bean) => (
              <BeanCard key={bean.id} bean={bean} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
