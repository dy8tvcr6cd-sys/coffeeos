"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { calculateRatio, makeDefaultSteps } from "@/lib/brewUi";
import { getLocalizedText, type LocalizedText } from "@/lib/i18n";
import { saveRecipe } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { BrewLogStep, SavedRecipe } from "@/types/brewDiagnosis";

type StepForm = {
  at: number;
  waterAmount: number;
  action: LocalizedText;
};

type RecipeForm = {
  name: LocalizedText;
  purpose: LocalizedText;
  brewer: string;
  filter: string;
  grinder: string;
  coffeeAmount: string;
  waterAmount: string;
  waterTemperature: string;
  grindSize: string;
  totalTimeSeconds: string;
  roastLevels: string;
  processes: string;
  flavorDirection: string;
  notes: LocalizedText;
  steps: StepForm[];
};

const blankText: LocalizedText = { ko: "", en: "", ja: "" };

const initialForm: RecipeForm = {
  name: blankText,
  purpose: blankText,
  brewer: "Hario V60",
  filter: "종이 필터",
  grinder: "",
  coffeeAmount: "15",
  waterAmount: "240",
  waterTemperature: "92",
  grindSize: "중간",
  totalTimeSeconds: "180",
  roastLevels: "light, light-medium",
  processes: "washed",
  flavorDirection: "floral, citrus, clean",
  notes: blankText,
  steps: makeDefaultSteps()
};

function withFallback(value: LocalizedText): LocalizedText {
  return {
    ko: value.ko.trim(),
    en: value.en.trim() || value.ko.trim(),
    ja: value.ja.trim() || value.ko.trim()
  };
}

function numberFrom(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function splitTags(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export default function NewSavedRecipePage() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const [form, setForm] = useState<RecipeForm>(initialForm);
  const [error, setError] = useState("");

  const ratio = calculateRatio(numberFrom(form.coffeeAmount), numberFrom(form.waterAmount));

  function updateText(field: "name" | "purpose" | "notes", lang: keyof LocalizedText, value: string) {
    setForm((current) => ({
      ...current,
      [field]: {
        ...current[field],
        [lang]: value
      }
    }));
    setError("");
  }

  function update(field: keyof RecipeForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function updateStep(index: number, field: keyof StepForm, value: string) {
    setForm((current) => ({
      ...current,
      steps: current.steps.map((step, stepIndex) =>
        stepIndex === index
          ? {
              ...step,
              [field]: field === "action" ? { ko: value, en: value, ja: value } : numberFrom(value)
            }
          : step
      )
    }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.ko.trim()) {
      setError("한국어 레시피 이름은 필수입니다.");
      return;
    }

    const coffeeAmount = numberFrom(form.coffeeAmount);
    const waterAmount = numberFrom(form.waterAmount);
    const waterTemperature = numberFrom(form.waterTemperature);
    const totalTimeSeconds = numberFrom(form.totalTimeSeconds);

    if (!coffeeAmount || !waterAmount || !waterTemperature || !totalTimeSeconds || !form.grindSize.trim()) {
      setError("원두량, 물 양, 물 온도, 분쇄도, 총 추출 시간은 필수입니다.");
      return;
    }

    const recipe: SavedRecipe = {
      id: `saved-recipe-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: withFallback(form.name),
      purpose: withFallback(form.purpose),
      targetBeanStyle: {
        roastLevels: splitTags(form.roastLevels),
        processes: splitTags(form.processes),
        flavorDirection: splitTags(form.flavorDirection)
      },
      equipment: {
        brewer: form.brewer.trim(),
        filter: form.filter.trim() || undefined,
        grinder: form.grinder.trim() || undefined
      },
      recipe: {
        coffeeAmount,
        waterAmount,
        ratio,
        waterTemperature,
        grindSize: form.grindSize.trim(),
        totalTimeSeconds,
        steps: form.steps.map((step): BrewLogStep => ({
          at: step.at,
          waterAmount: step.waterAmount,
          action: step.action
        }))
      },
      notes: withFallback(form.notes)
    };

    saveRecipe(recipe);
    router.push(`/my-recipes/${recipe.id}`);
  }

  return (
    <>
      <PageHeader
        title={t("newSavedRecipe")}
        eyebrow={t("myRecipes")}
        description={t("myRecipesDescription")}
        backHref="/my-recipes"
      />
      <form onSubmit={submit} className="space-y-5 px-5">
        <SectionCard title={t("recipeName")}>
          <div className="grid gap-3">
            <LocalizedField label={t("recipeName")} value={form.name} onChange={(lang, value) => updateText("name", lang, value)} />
            <LocalizedTextArea label={t("purpose")} value={form.purpose} onChange={(lang, value) => updateText("purpose", lang, value)} />
          </div>
        </SectionCard>

        <SectionCard title={t("equipment")}>
          <div className="grid gap-3">
            <Field label={t("brewer")} value={form.brewer} onChange={(value) => update("brewer", value)} />
            <Field label={t("filter")} value={form.filter} onChange={(value) => update("filter", value)} />
            <Field label={t("grinder")} value={form.grinder} onChange={(value) => update("grinder", value)} />
          </div>
        </SectionCard>

        <SectionCard title={t("recipe")} eyebrow={`${t("ratio")} ${ratio}`}>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-2">
              <Field label={`${t("coffeeAmount")} g`} type="number" value={form.coffeeAmount} onChange={(value) => update("coffeeAmount", value)} />
              <Field label={`${t("waterAmount")} g`} type="number" value={form.waterAmount} onChange={(value) => update("waterAmount", value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label={`${t("waterTemperature")} C`} type="number" value={form.waterTemperature} onChange={(value) => update("waterTemperature", value)} />
              <Field label={t("totalTime")} type="number" value={form.totalTimeSeconds} onChange={(value) => update("totalTimeSeconds", value)} />
            </div>
            <Field label={t("grindSize")} value={form.grindSize} onChange={(value) => update("grindSize", value)} />
          </div>
        </SectionCard>

        <SectionCard
          title={t("pouringSteps")}
          action={
            <button
              type="button"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  steps: [
                    ...current.steps,
                    {
                      at: numberFrom(current.totalTimeSeconds),
                      waterAmount: numberFrom(current.waterAmount),
                      action: { ko: "추가 푸어", en: "Additional pour", ja: "追加注湯" }
                    }
                  ]
                }))
              }
              className="focus-ring inline-flex h-9 items-center gap-1 rounded-lg bg-coffee-dark px-3 text-xs font-semibold text-white"
            >
              <Plus size={14} />
              {t("addStep")}
            </button>
          }
        >
          <div className="grid gap-3">
            {form.steps.map((step, index) => (
              <div key={index} className="rounded-lg border border-coffee-border bg-coffee-background p-3">
                <div className="grid grid-cols-2 gap-2">
                  <Field label={t("secondsShort")} type="number" value={String(step.at)} onChange={(value) => updateStep(index, "at", value)} />
                  <Field label={`${t("waterAmount")} g`} type="number" value={String(step.waterAmount)} onChange={(value) => updateStep(index, "waterAmount", value)} />
                </div>
                <div className="mt-2">
                  <Field label={t("stepAction")} value={getLocalizedText(step.action, "ko")} onChange={(value) => updateStep(index, "action", value)} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t("targetBeanStyle")}>
          <div className="grid gap-3">
            <Field label={t("roastLevel")} value={form.roastLevels} onChange={(value) => update("roastLevels", value)} />
            <Field label={t("process")} value={form.processes} onChange={(value) => update("processes", value)} />
            <Field label={t("flavorDirection")} value={form.flavorDirection} onChange={(value) => update("flavorDirection", value)} />
            <LocalizedTextArea label={t("notes")} value={form.notes} onChange={(lang, value) => updateText("notes", lang, value)} />
          </div>
        </SectionCard>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

        <button
          type="submit"
          className="focus-ring inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-coffee-dark px-4 text-base font-semibold text-white shadow-soft"
        >
          <Save size={17} />
          {t("newSavedRecipe")}
        </button>
      </form>
    </>
  );
}

function Field({
  label,
  value,
  type = "text",
  onChange
}: {
  label: string;
  value: string;
  type?: "text" | "number";
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-coffee-primary">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-12 w-full rounded-lg border border-coffee-border bg-coffee-background px-3 text-base text-coffee-primary"
      />
    </label>
  );
}

function LocalizedField({
  label,
  value,
  onChange
}: {
  label: string;
  value: LocalizedText;
  onChange: (lang: keyof LocalizedText, value: string) => void;
}) {
  return (
    <div className="rounded-lg border border-coffee-border p-3">
      <p className="mb-3 text-sm font-semibold text-coffee-primary">{label}</p>
      <div className="grid gap-2">
        {(["ko", "en", "ja"] as const).map((lang) => (
          <label key={lang} className="block">
            <span className="mb-1 block text-xs font-semibold uppercase text-coffee-secondary">
              {lang === "ko" ? "한국어" : lang === "en" ? "English" : "日本語"}
            </span>
            <input
              value={value[lang]}
              onChange={(event) => onChange(lang, event.target.value)}
              className="focus-ring h-11 w-full rounded-lg border border-coffee-border bg-coffee-background px-3 text-sm text-coffee-primary"
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function LocalizedTextArea({
  label,
  value,
  onChange
}: {
  label: string;
  value: LocalizedText;
  onChange: (lang: keyof LocalizedText, value: string) => void;
}) {
  return (
    <div className="rounded-lg border border-coffee-border p-3">
      <p className="mb-3 text-sm font-semibold text-coffee-primary">{label}</p>
      <div className="grid gap-2">
        {(["ko", "en", "ja"] as const).map((lang) => (
          <label key={lang} className="block">
            <span className="mb-1 block text-xs font-semibold uppercase text-coffee-secondary">
              {lang === "ko" ? "한국어" : lang === "en" ? "English" : "日本語"}
            </span>
            <textarea
              value={value[lang]}
              rows={3}
              onChange={(event) => onChange(lang, event.target.value)}
              className="focus-ring w-full resize-none rounded-lg border border-coffee-border bg-coffee-background p-3 text-sm text-coffee-primary"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
