"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Check, RotateCcw, Save } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { analyzeBrewLog } from "@/lib/brewDiagnosis";
import {
  brewProblemLabels,
  confidenceLabels,
  formatSeconds,
  likelyIssueLabels,
  prescriptionVariableLabels,
  text
} from "@/lib/brewUi";
import { getLocalizedText } from "@/lib/i18n";
import { getBrewLogById, saveRecipe, updateBrewLog } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { BrewLog, BrewPrescription, SavedRecipe } from "@/types/brewDiagnosis";

export default function BrewDiagnosisDetailPage() {
  const { recordId } = useParams<{ recordId: string }>();
  const { locale, t } = useLocale();
  const [log, setLog] = useState<BrewLog | undefined>();
  const [savedRecipeId, setSavedRecipeId] = useState<string | null>(null);

  useEffect(() => {
    setLog(getBrewLogById(recordId));
  }, [recordId]);

  if (!log) {
    return (
      <>
        <PageHeader title={t("pageNotFound")} backHref="/brew-diagnosis" />
        <div className="px-5">
          <Link
            href="/brew-diagnosis"
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {t("brewDiagnosis")}
          </Link>
        </div>
      </>
    );
  }

  const diagnosis = log.diagnosis ?? analyzeBrewLog(log);

  function saveAsRecipe() {
    if (!log) {
      return;
    }

    const now = new Date().toISOString();
    const recipe: SavedRecipe = {
      id: `saved-recipe-${Date.now()}`,
      createdAt: now,
      lastUsedAt: log.createdAt,
      name: {
        ko: `${getLocalizedText(log.beanName, "ko")} 추출 레시피`,
        en: `${getLocalizedText(log.beanName, "en") || getLocalizedText(log.beanName, "ko")} brew recipe`,
        ja: `${getLocalizedText(log.beanName, "ja") || getLocalizedText(log.beanName, "ko")} 抽出レシピ`
      },
      purpose: text(
        "실제 추출 기록에서 저장한 레시피입니다.",
        "Saved from an actual brew log.",
        "実際の抽出記録から保存したレシピです。"
      ),
      equipment: {
        brewer: log.equipment.brewer,
        filter: log.equipment.filter,
        grinder: log.equipment.grinder
      },
      recipe: log.recipe,
      notes: log.result.memo ? { ko: log.result.memo, en: log.result.memo, ja: log.result.memo } : undefined,
      likedBeanIds: log.result.selectedProblems.includes("good") ? [log.beanId] : undefined
    };

    saveRecipe(recipe);
    setSavedRecipeId(recipe.id);
  }

  function reanalyze() {
    if (!log) {
      return;
    }

    const next: BrewLog = { ...log, diagnosis: analyzeBrewLog(log) };
    updateBrewLog(next);
    setLog(next);
  }

  return (
    <>
      <PageHeader
        title={getLocalizedText(log.beanName, locale)}
        eyebrow={t("analysisResult")}
        description={new Date(log.createdAt).toLocaleString("ko-KR")}
        backHref="/brew-diagnosis"
      />
      <div className="space-y-5 px-5">
        <SectionCard title={t("recipe")}>
          <div className="grid grid-cols-2 gap-2">
            {[
              [t("brewer"), log.equipment.brewer],
              [t("coffeeAmount"), `${log.recipe.coffeeAmount} g`],
              [t("waterAmount"), `${log.recipe.waterAmount} g`],
              [t("ratio"), log.recipe.ratio],
              [t("waterTemperature"), `${log.recipe.waterTemperature} C`],
              [t("totalTime"), formatSeconds(log.recipe.totalTimeSeconds)]
            ].map(([label, value]) => (
              <InfoTile key={label} label={label} value={value} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t("tasteResult")}>
          <div className="flex flex-wrap gap-2">
            {log.result.selectedProblems.map((problem) => (
              <span
                key={problem}
                className="rounded-lg border border-coffee-border bg-coffee-background px-3 py-2 text-sm font-semibold text-coffee-secondary"
              >
                {getLocalizedText(brewProblemLabels[problem], locale)}
              </span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <InfoTile label={t("sweetness")} value={`${log.result.sweetness ?? "-"} / 10`} />
            <InfoTile label={t("acidity")} value={`${log.result.acidity ?? "-"} / 10`} />
            <InfoTile label={t("bitterness")} value={`${log.result.bitterness ?? "-"} / 10`} />
            <InfoTile label={t("satisfaction")} value={`${log.result.satisfaction ?? "-"} / 10`} />
          </div>
          {log.result.memo && (
            <p className="mt-4 rounded-lg bg-coffee-background p-4 text-sm leading-6 text-coffee-secondary">
              {log.result.memo}
            </p>
          )}
        </SectionCard>

        <SectionCard title={t("analysisResult")} eyebrow={getLocalizedText(confidenceLabels[diagnosis.confidence], locale)}>
          <p className="text-base font-semibold leading-7 text-coffee-primary">
            {getLocalizedText(diagnosis.summary, locale)}
          </p>
          <div className="mt-4 rounded-lg bg-coffee-dark p-4 text-white">
            <p className="text-xs font-semibold uppercase text-white/60">{t("likelyIssue")}</p>
            <p className="mt-2 text-lg font-semibold">
              {getLocalizedText(likelyIssueLabels[diagnosis.likelyIssue], locale)} · {t("possiblePhrase")}
            </p>
          </div>
        </SectionCard>

        <SectionCard title={t("reasons")}>
          <div className="grid gap-2">
            {diagnosis.reasons.map((reason, index) => (
              <p key={index} className="rounded-lg bg-coffee-background p-4 text-sm leading-6 text-coffee-secondary">
                {getLocalizedText(reason, locale)}
              </p>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t("prescriptionSuggestions")}>
          <div className="grid gap-3">
            {diagnosis.prescriptions
              .slice()
              .sort((a, b) => a.priority - b.priority)
              .map((item) => (
                <PrescriptionCard key={`${item.priority}-${item.variable}`} prescription={item} />
              ))}
          </div>
        </SectionCard>

        {diagnosis.nextTestRecipe && (
          <SectionCard title={t("suggestedNextTest")}>
            <div className="grid grid-cols-2 gap-2">
              <InfoTile label={t("grindSize")} value={String(diagnosis.nextTestRecipe.grindSize ?? log.recipe.grindSize)} />
              <InfoTile label={t("waterTemperature")} value={`${diagnosis.nextTestRecipe.waterTemperature ?? log.recipe.waterTemperature} C`} />
              <InfoTile label={t("totalTime")} value={formatSeconds(diagnosis.nextTestRecipe.totalTimeSeconds ?? log.recipe.totalTimeSeconds)} />
              <InfoTile label={t("ratio")} value={String(diagnosis.nextTestRecipe.ratio ?? log.recipe.ratio)} />
            </div>
          </SectionCard>
        )}

        <div className="grid gap-2">
          <button
            type="button"
            onClick={saveAsRecipe}
            className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {savedRecipeId ? <Check size={16} /> : <Save size={16} />}
            {savedRecipeId ? t("recipeSaved") : t("saveFavoriteRecipe")}
          </button>
          {savedRecipeId && (
            <Link
              href={`/my-recipes/${savedRecipeId}`}
              className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-card px-4 text-sm font-semibold text-coffee-primary"
            >
              {t("viewRecipe")}
              <ArrowRight size={16} />
            </Link>
          )}
          <button
            type="button"
            onClick={reanalyze}
            className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-card px-4 text-sm font-semibold text-coffee-primary"
          >
            <RotateCcw size={16} />
            {t("reanalyze")}
          </button>
          <Link
            href="/brew-diagnosis/new"
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg border border-coffee-border bg-coffee-card px-4 text-sm font-semibold text-coffee-primary"
          >
            {t("newBrewLog")}
          </Link>
          {!log.beanId.startsWith("manual-") && (
            <Link
              href={`/beans/${log.beanId}`}
              className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg border border-coffee-border bg-coffee-card px-4 text-sm font-semibold text-coffee-primary"
            >
              {t("goToBean")}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-coffee-background p-3">
      <p className="text-xs font-semibold uppercase text-coffee-secondary">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-5 text-coffee-primary">{value}</p>
    </div>
  );
}

function PrescriptionCard({ prescription }: { prescription: BrewPrescription }) {
  const { locale } = useLocale();

  return (
    <article className="rounded-lg border border-coffee-border bg-coffee-background p-4">
      <p className="text-xs font-semibold uppercase text-coffee-accent">
        {getLocalizedText(prescriptionVariableLabels[prescription.variable], locale)}
      </p>
      <h3 className="mt-2 text-base font-semibold leading-6 text-coffee-primary">
        {getLocalizedText(prescription.action, locale)}
      </h3>
      <p className="mt-3 text-sm leading-6 text-coffee-secondary">
        {getLocalizedText(prescription.reason, locale)}
      </p>
      <p className="mt-3 rounded-lg bg-coffee-card p-3 text-sm font-semibold leading-6 text-coffee-primary">
        {getLocalizedText(prescription.expectedResult, locale)}
      </p>
    </article>
  );
}
