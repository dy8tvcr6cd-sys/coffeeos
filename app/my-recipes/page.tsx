"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { formatSeconds } from "@/lib/brewUi";
import { getLocalizedText } from "@/lib/i18n";
import { getSavedRecipes } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { SavedRecipe } from "@/types/brewDiagnosis";

export default function MyRecipesPage() {
  const { locale, t } = useLocale();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [beanId, setBeanId] = useState<string | null>(null);

  useEffect(() => {
    setRecipes(getSavedRecipes());
    setBeanId(new URLSearchParams(window.location.search).get("beanId"));
  }, []);

  return (
    <>
      <PageHeader
        title={t("myRecipes")}
        eyebrow={t("recipe")}
        description={t("myRecipesDescription")}
        backHref="/"
      />
      <div className="space-y-5 px-5">
        <Link
          href="/my-recipes/new"
          className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
        >
          <Plus size={16} />
          {t("newSavedRecipe")}
        </Link>

        {recipes.length ? (
          <div className="space-y-3">
            {recipes.map((recipe) => (
              <article key={recipe.id} className="rounded-lg border border-coffee-border bg-coffee-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold leading-snug text-coffee-primary">
                      {getLocalizedText(recipe.name, locale)}
                    </h2>
                    {recipe.purpose && (
                      <p className="mt-2 text-sm leading-6 text-coffee-secondary">
                        {getLocalizedText(recipe.purpose, locale)}
                      </p>
                    )}
                  </div>
                  <ArrowRight size={18} className="shrink-0 text-coffee-secondary" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <InfoTile label={t("brewer")} value={recipe.equipment.brewer} />
                  <InfoTile label={t("ratio")} value={recipe.recipe.ratio} />
                  <InfoTile label={t("waterTemperature")} value={`${recipe.recipe.waterTemperature} C`} />
                  <InfoTile label={t("totalTime")} value={formatSeconds(recipe.recipe.totalTimeSeconds)} />
                </div>
                {recipe.lastUsedAt && (
                  <p className="mt-3 text-xs font-semibold text-coffee-secondary">
                    {t("lastUsed")} · {new Date(recipe.lastUsedAt).toLocaleDateString("ko-KR")}
                  </p>
                )}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-coffee-border pt-4">
                  <Link
                    href={`/my-recipes/${recipe.id}`}
                    className="focus-ring inline-flex h-11 items-center justify-center rounded-lg border border-coffee-border bg-coffee-card px-3 text-sm font-semibold text-coffee-primary"
                  >
                    {t("viewRecipe")}
                  </Link>
                  <Link
                    href={`/my-recipes/${recipe.id}/match${beanId ? `?beanId=${beanId}` : ""}`}
                    className="focus-ring inline-flex h-11 items-center justify-center rounded-lg bg-coffee-dark px-3 text-sm font-semibold text-white"
                  >
                    {t("recipeMatch")}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <SectionCard title={t("noSavedRecipes")}>
            <p className="text-sm leading-6 text-coffee-secondary">
              {t("myRecipesDescription")}
            </p>
          </SectionCard>
        )}
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
