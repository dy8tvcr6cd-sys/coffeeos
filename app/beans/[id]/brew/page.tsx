"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Brain, Waves } from "lucide-react";
import { BrewTimer } from "@/components/BrewTimer";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { getRoasteryById } from "@/data/roasteries";
import { formatTime } from "@/lib/format";
import { getLocalizedText } from "@/lib/i18n";
import { getBeanByIdClient, getRecipeByBeanIdClient } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { Bean } from "@/types/bean";
import type { BrewRecipe } from "@/types/brew";

export default function BrewPage() {
  const { locale, t } = useLocale();
  const params = useParams<{ id: string }>();
  const [bean, setBean] = useState<Bean | undefined>();
  const [recipe, setRecipe] = useState<BrewRecipe | undefined>();

  useEffect(() => {
    const nextBean = getBeanByIdClient(params.id);
    setBean(nextBean);
    setRecipe(nextBean ? getRecipeByBeanIdClient(nextBean.id) : undefined);
  }, [params.id]);

  if (!bean || !recipe) {
    return (
      <>
        <PageHeader title={t("pageNotFound")} backHref={`/beans/${params.id}`} />
        <div className="px-5">
          <Link
            href="/beans"
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {t("beans")}
          </Link>
        </div>
      </>
    );
  }

  const roastery = getRoasteryById(bean.roasteryId);

  return (
    <>
      <PageHeader
        title={t("recommendedRecipe")}
        eyebrow={getLocalizedText(bean.name, locale)}
        description={getLocalizedText(roastery?.name, locale)}
        backHref={`/beans/${bean.id}`}
        action={
          <Link
            href={`/beans/${bean.id}/sensory`}
            aria-label={t("sensoryRecord")}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-coffee-border bg-coffee-card text-coffee-primary"
          >
            <Waves size={18} />
          </Link>
        }
      />
      <div className="space-y-5 px-5">
        <SectionCard title={recipe.brewer} eyebrow={getLocalizedText(recipe.intent, locale)}>
          <div className="grid grid-cols-2 gap-2">
            {[
              [t("grindSize"), recipe.grindSize],
              [t("waterTemperature"), recipe.waterTemperature],
              [t("coffeeAmount"), recipe.coffeeAmount],
              [t("waterAmount"), recipe.waterAmount],
              [t("ratio"), recipe.ratio],
              [t("totalTime"), formatTime(recipe.totalTimeSeconds)]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-coffee-background p-3">
                <p className="text-xs font-semibold uppercase text-coffee-secondary">{label}</p>
                <p className="mt-1 text-sm font-semibold leading-5 text-coffee-primary">{value}</p>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard
          title={t("brewPrescription")}
          eyebrow={t("brewAnalysis")}
          action={
            <Link
              href="/prescription"
              className="focus-ring inline-flex h-9 items-center justify-center rounded-lg bg-coffee-dark px-3 text-sm font-semibold text-white"
            >
              {t("prescription")}
            </Link>
          }
        >
          <p className="inline-flex items-start gap-2 text-sm leading-6 text-coffee-secondary">
            <Brain className="mt-0.5 shrink-0 text-coffee-accent" size={16} />
            {t("brewPrescriptionDescription")}
          </p>
        </SectionCard>
        <BrewTimer recipe={recipe} />
      </div>
    </>
  );
}
