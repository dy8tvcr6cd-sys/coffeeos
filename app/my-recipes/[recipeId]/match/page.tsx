"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, FlaskConical } from "lucide-react";
import { BeanCard } from "@/components/BeanCard";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { formatSeconds, prescriptionVariableLabels } from "@/lib/brewUi";
import { getLocalizedText } from "@/lib/i18n";
import { matchRecipeToBean } from "@/lib/recipeMatcher";
import { getAllBeansClient, getSavedRecipeById, saveBrewLogDraft, updateSavedRecipe } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { Bean } from "@/types/bean";
import type { BrewPrescription, RecipeMatchResult, SavedRecipe } from "@/types/brewDiagnosis";

export default function RecipeMatchPage() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const router = useRouter();
  const { locale, t } = useLocale();
  const [recipe, setRecipe] = useState<SavedRecipe | undefined>();
  const [beans, setBeans] = useState<Bean[]>([]);
  const [selectedBeanId, setSelectedBeanId] = useState("");

  useEffect(() => {
    const nextRecipe = getSavedRecipeById(recipeId);
    const nextBeans = getAllBeansClient();
    const queryBeanId = new URLSearchParams(window.location.search).get("beanId");
    setRecipe(nextRecipe);
    setBeans(nextBeans);
    setSelectedBeanId(queryBeanId || nextBeans[0]?.id || "");
  }, [recipeId]);

  const selectedBean = beans.find((bean) => bean.id === selectedBeanId);
  const match = useMemo(
    () => (recipe && selectedBean ? matchRecipeToBean(recipe, selectedBean) : undefined),
    [recipe, selectedBean]
  );

  if (!recipe) {
    return (
      <>
        <PageHeader title={t("pageNotFound")} backHref="/my-recipes" />
        <div className="px-5">
          <Link
            href="/my-recipes"
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {t("myRecipes")}
          </Link>
        </div>
      </>
    );
  }

  function applyRecipe() {
    if (!recipe || !selectedBean) {
      return;
    }

    saveBrewLogDraft({
      beanId: selectedBean.id,
      fromRecipeId: recipe.id,
      recipe: recipe.recipe,
      equipment: recipe.equipment
    });
    updateSavedRecipe({ ...recipe, lastUsedAt: new Date().toISOString() });
    router.push(`/brew-diagnosis/new?beanId=${selectedBean.id}`);
  }

  return (
    <>
      <PageHeader
        title={t("recipeMatch")}
        eyebrow={t("myRecipes")}
        description={t("myRecipesDescription")}
        backHref={`/my-recipes/${recipe.id}`}
      />
      <div className="space-y-5 px-5">
        <SectionCard title={t("selectedRecipe")}>
          <h2 className="text-lg font-semibold text-coffee-primary">{getLocalizedText(recipe.name, locale)}</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <InfoTile label={t("brewer")} value={recipe.equipment.brewer} />
            <InfoTile label={t("ratio")} value={recipe.recipe.ratio} />
            <InfoTile label={t("waterTemperature")} value={`${recipe.recipe.waterTemperature} C`} />
            <InfoTile label={t("totalTime")} value={formatSeconds(recipe.recipe.totalTimeSeconds)} />
          </div>
        </SectionCard>

        <SectionCard title={t("chooseBean")}>
          <select
            value={selectedBeanId}
            onChange={(event) => setSelectedBeanId(event.target.value)}
            className="focus-ring h-12 w-full rounded-lg border border-coffee-border bg-coffee-background px-3 text-base text-coffee-primary"
          >
            {beans.map((bean) => (
              <option key={bean.id} value={bean.id}>
                {getLocalizedText(bean.name, locale)}
              </option>
            ))}
          </select>
        </SectionCard>

        {selectedBean && (
          <section>
            <h2 className="mb-3 text-lg font-semibold text-coffee-primary">{t("selectedBean")}</h2>
            <BeanCard bean={selectedBean} compact />
          </section>
        )}

        {match && (
          <>
            <SectionCard title={t("matchResult")} eyebrow={fitLabel(match, t)}>
              <div className="flex gap-3 rounded-lg bg-coffee-dark p-4 text-white">
                <FlaskConical size={18} className="mt-0.5 shrink-0 text-coffee-accent" />
                <p className="text-sm font-semibold leading-6">{getLocalizedText(match.summary, locale)}</p>
              </div>
            </SectionCard>

            <SectionCard title={t("reasons")}>
              <div className="grid gap-2">
                {match.reasons.map((reason, index) => (
                  <p key={index} className="rounded-lg bg-coffee-background p-4 text-sm leading-6 text-coffee-secondary">
                    {getLocalizedText(reason, locale)}
                  </p>
                ))}
              </div>
            </SectionCard>

            <SectionCard title={t("adjustmentSuggestions")}>
              <div className="grid gap-3">
                {match.suggestedAdjustments.map((item) => (
                  <PrescriptionCard key={`${item.priority}-${item.variable}`} prescription={item} />
                ))}
              </div>
            </SectionCard>

            <button
              type="button"
              onClick={applyRecipe}
              className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
            >
              {t("applyRecipe")}
              <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>
    </>
  );
}

function fitLabel(match: RecipeMatchResult, t: (key: "highFit" | "mediumFit" | "lowFit" | "needsMoreDataFit") => string) {
  if (match.fit === "high") {
    return t("highFit");
  }
  if (match.fit === "medium") {
    return t("mediumFit");
  }
  if (match.fit === "low") {
    return t("lowFit");
  }
  return t("needsMoreDataFit");
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
