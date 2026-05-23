"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, FlaskConical, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { getLocalizedText } from "@/lib/i18n";
import { formatSeconds, likelyIssueLabels } from "@/lib/brewUi";
import { getBrewLogs, getSavedRecipes } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { BrewLog, SavedRecipe } from "@/types/brewDiagnosis";

export default function BrewDiagnosisHomePage() {
  const { locale, t } = useLocale();
  const [logs, setLogs] = useState<BrewLog[]>([]);
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);

  useEffect(() => {
    setLogs(getBrewLogs());
    setRecipes(getSavedRecipes());
  }, []);

  return (
    <>
      <PageHeader
        title={t("brewDiagnosis")}
        eyebrow={t("analysisResult")}
        description={t("brewDiagnosisDescription")}
        backHref="/"
      />
      <div className="space-y-5 px-5">
        <SectionCard title={t("recordActualBrew")}>
          <p className="text-sm leading-6 text-coffee-secondary">
            {t("brewDiagnosisDescription")}
          </p>
          <Link
            href="/brew-diagnosis/new"
            className="focus-ring mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            {t("newBrewLog")}
          </Link>
        </SectionCard>

        <SectionCard
          title={t("recentBrewLogs")}
          action={
            <Link href="/brew-diagnosis/new" className="text-sm font-semibold text-coffee-accent">
              {t("newBrewLog")}
            </Link>
          }
        >
          {logs.length ? (
            <div className="grid gap-3">
              {logs.slice(0, 4).map((log) => (
                <Link
                  key={log.id}
                  href={`/brew-diagnosis/${log.id}`}
                  className="focus-ring rounded-lg border border-coffee-border bg-coffee-background p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-coffee-primary">
                        {getLocalizedText(log.beanName, locale)}
                      </p>
                      <p className="mt-1 text-xs text-coffee-secondary">
                        {new Date(log.createdAt).toLocaleDateString("ko-KR")} · {log.equipment.brewer} · {formatSeconds(log.recipe.totalTimeSeconds)}
                      </p>
                    </div>
                    <ArrowRight size={16} className="shrink-0 text-coffee-secondary" />
                  </div>
                  {log.diagnosis && (
                    <p className="mt-3 rounded-lg bg-coffee-card px-3 py-2 text-xs font-semibold text-coffee-secondary">
                      {getLocalizedText(likelyIssueLabels[log.diagnosis.likelyIssue], locale)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-coffee-background p-4 text-sm leading-6 text-coffee-secondary">
              {t("noBrewLogs")}
            </p>
          )}
        </SectionCard>

        <SectionCard title={t("savedRecipeShortcut")}>
          <div className="grid gap-2">
            <Link
              href="/my-recipes"
              className="focus-ring flex h-12 items-center justify-between rounded-lg border border-coffee-border bg-coffee-background px-4 text-sm font-semibold text-coffee-primary"
            >
              <span className="inline-flex items-center gap-2">
                <BookOpen size={16} />
                {t("myRecipes")}
              </span>
              <span className="text-coffee-secondary">{recipes.length}</span>
            </Link>
            <Link
              href="/my-recipes/new"
              className="focus-ring flex h-12 items-center justify-between rounded-lg border border-coffee-border bg-coffee-background px-4 text-sm font-semibold text-coffee-primary"
            >
              <span className="inline-flex items-center gap-2">
                <ClipboardList size={16} />
                {t("newSavedRecipe")}
              </span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </SectionCard>

        <SectionCard title={t("diagnosisPrinciples")}>
          <div className="flex gap-3 rounded-lg bg-coffee-background p-4">
            <FlaskConical size={18} className="mt-0.5 shrink-0 text-coffee-accent" />
            <p className="text-sm leading-6 text-coffee-secondary">
              {t("diagnosisPrincipleText")}
            </p>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
