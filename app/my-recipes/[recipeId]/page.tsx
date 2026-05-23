"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { formatSeconds } from "@/lib/brewUi";
import { getLocalizedText } from "@/lib/i18n";
import { deleteSavedRecipe, getSavedRecipeById } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { SavedRecipe } from "@/types/brewDiagnosis";

export default function SavedRecipeDetailPage() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const router = useRouter();
  const { locale, t } = useLocale();
  const [recipe, setRecipe] = useState<SavedRecipe | undefined>();

  useEffect(() => {
    setRecipe(getSavedRecipeById(recipeId));
  }, [recipeId]);

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

  function removeRecipe() {
    if (!recipe) {
      return;
    }

    deleteSavedRecipe(recipe.id);
    router.push("/my-recipes");
  }

  return (
    <>
      <PageHeader
        title={getLocalizedText(recipe.name, locale)}
        eyebrow={t("myRecipes")}
        description={recipe.purpose ? getLocalizedText(recipe.purpose, locale) : t("myRecipesDescription")}
        backHref="/my-recipes"
      />
      <div className="space-y-5 px-5">
        <SectionCard title={t("equipment")}>
          <div className="grid grid-cols-2 gap-2">
            <InfoTile label={t("brewer")} value={recipe.equipment.brewer} />
            <InfoTile label={t("filter")} value={recipe.equipment.filter ?? t("registeredSoon")} />
            <InfoTile label={t("grinder")} value={recipe.equipment.grinder ?? t("registeredSoon")} />
            <InfoTile label={t("ratio")} value={recipe.recipe.ratio} />
          </div>
        </SectionCard>

        <SectionCard title={t("recipe")}>
          <div className="grid grid-cols-2 gap-2">
            <InfoTile label={t("coffeeAmount")} value={`${recipe.recipe.coffeeAmount} g`} />
            <InfoTile label={t("waterAmount")} value={`${recipe.recipe.waterAmount} g`} />
            <InfoTile label={t("waterTemperature")} value={`${recipe.recipe.waterTemperature} C`} />
            <InfoTile label={t("grindSize")} value={recipe.recipe.grindSize} />
            <InfoTile label={t("totalTime")} value={formatSeconds(recipe.recipe.totalTimeSeconds)} />
            <InfoTile label={t("ratio")} value={recipe.recipe.ratio} />
          </div>
        </SectionCard>

        <SectionCard title={t("pouringSteps")}>
          <div className="grid gap-2">
            {recipe.recipe.steps.map((step, index) => (
              <div key={index} className="grid grid-cols-[64px_72px_1fr] gap-2 rounded-lg bg-coffee-background p-3 text-sm">
                <span className="font-semibold text-coffee-primary">{formatSeconds(step.at)}</span>
                <span className="font-semibold text-coffee-secondary">{step.waterAmount} g</span>
                <span className="text-coffee-secondary">{getLocalizedText(step.action, locale)}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {recipe.notes && (
          <SectionCard title={t("notes")}>
            <p className="text-sm leading-6 text-coffee-secondary">{getLocalizedText(recipe.notes, locale)}</p>
          </SectionCard>
        )}

        <div className="grid gap-2">
          <Link
            href={`/my-recipes/${recipe.id}/match`}
            className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {t("recipeMatch")}
            <ArrowRight size={16} />
          </Link>
          <button
            type="button"
            onClick={removeRecipe}
            className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-card px-4 text-sm font-semibold text-coffee-primary"
          >
            <Trash2 size={16} />
            {t("deleteRecipe")}
          </button>
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
