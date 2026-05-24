"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Brain, Waves } from "lucide-react";
import { BrewTimer } from "@/components/BrewTimer";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { getBeanById } from "@/data/beans";
import { getRecipeByBeanId } from "@/data/brewRecipes";
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
  const [clientBean, setClientBean] = useState<Bean | undefined>();
  const [clientRecipe, setClientRecipe] = useState<BrewRecipe | undefined>();
  const [mode, setMode] = useState<"simple" | "professional">("simple");

  useEffect(() => {
    const nextBean = getBeanByIdClient(params.id);
    setClientBean(nextBean);
    setClientRecipe(nextBean ? getRecipeByBeanIdClient(nextBean.id) : undefined);
  }, [params.id]);

  const bean = clientBean ?? getBeanById(params.id);
  const recipe = bean ? clientRecipe ?? getRecipeByBeanId(bean.id) : undefined;

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
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-coffee-card p-1 shadow-soft">
          {[
            ["simple", t("simpleRecipe")],
            ["professional", t("professionalRecipe")]
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value as "simple" | "professional")}
              className={`focus-ring h-11 rounded-lg text-sm font-semibold transition ${
                mode === value ? "bg-coffee-dark text-white" : "text-coffee-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

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

        {mode === "simple" ? (
          <SectionCard title={t("beginnerTasteAdjustment")}>
            <div className="grid gap-2">
              {[
                {
                  ko: "맛이 시고 약하면 분쇄를 한 단계 곱게 하거나 총 시간을 10초 늘려보세요.",
                  en: "If the cup is sour and weak, grind one step finer or extend total time by 10 seconds.",
                  ja: "酸っぱく弱い場合は、挽き目を一段細かくするか総時間を10秒伸ばしてください。"
                },
                {
                  ko: "맛이 쓰고 떫으면 분쇄를 한 단계 굵게 하거나 후반 물줄기를 부드럽게 줄여보세요.",
                  en: "If the cup is bitter and dry, grind one step coarser or soften the final pour.",
                  ja: "苦く渋い場合は、挽き目を一段粗くするか後半の注湯を穏やかにしてください。"
                },
                {
                  ko: "맛이 탁하면 스월링과 강한 중앙 푸어를 줄이고 물줄기를 일정하게 유지하세요.",
                  en: "If the cup is muddy, reduce swirling and strong center pouring while keeping the stream steady.",
                  ja: "濁る場合は、スワールと強い中心注湯を減らし、湯流を一定に保ってください。"
                }
              ].map((item) => (
                <p key={item.ko} className="rounded-lg bg-coffee-background p-3 text-sm leading-6 text-coffee-secondary">
                  {getLocalizedText(item, locale)}
                </p>
              ))}
            </div>
          </SectionCard>
        ) : recipe.professional ? (
          <SectionCard title={t("professionalRecipe")}>
            <div className="grid grid-cols-2 gap-2">
              {[
                [t("grinderReference"), recipe.professional.grinderReference],
                [t("targetTds"), recipe.professional.targetTds],
                [t("targetExtractionYield"), recipe.professional.targetExtractionYield],
                [t("bypass"), recipe.professional.bypass],
                [t("drawdownRange"), recipe.professional.drawdownRange],
                [t("agitationLevel"), getLocalizedText(recipe.professional.agitationLevel, locale)]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-coffee-background p-3">
                  <p className="text-xs font-semibold uppercase text-coffee-secondary">{label}</p>
                  <p className="mt-1 text-sm font-semibold leading-5 text-coffee-primary">{value || t("registeredSoon")}</p>
                </div>
              ))}
            </div>
            {recipe.professional.adjustmentGuide && (
              <p className="mt-4 rounded-lg bg-coffee-background p-4 text-sm leading-6 text-coffee-secondary">
                {getLocalizedText(recipe.professional.adjustmentGuide, locale)}
              </p>
            )}
          </SectionCard>
        ) : (
          <SectionCard title={t("professionalRecipe")}>
            <p className="text-sm leading-6 text-coffee-secondary">{t("professionalRecipeMissing")}</p>
          </SectionCard>
        )}

        <SectionCard
          title={t("brewPrescription")}
          eyebrow={t("brewAnalysis")}
          action={
            <Link
              href={`/brew-diagnosis/new?beanId=${bean.id}`}
              className="focus-ring inline-flex h-9 items-center justify-center rounded-lg bg-coffee-dark px-3 text-sm font-semibold text-white"
            >
              {t("newBrewLog")}
            </Link>
          }
        >
          <p className="inline-flex items-start gap-2 text-sm leading-6 text-coffee-secondary">
            <Brain className="mt-0.5 shrink-0 text-coffee-accent" size={16} />
            {t("brewDiagnosisDescription")}
          </p>
        </SectionCard>
        <BrewTimer recipe={recipe} />
      </div>
    </>
  );
}
