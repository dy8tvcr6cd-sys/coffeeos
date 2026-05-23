"use client";

import { useMemo, useState } from "react";
import { Brain, Check, RotateCcw, Save, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { brewEvidence, getBrewEvidenceById } from "@/data/brewEvidence";
import { translations } from "@/data/translations";
import { getLocalizedText } from "@/lib/i18n";
import { prescribeBrew } from "@/lib/prescriptionEngine";
import { useLocale } from "@/lib/useLocale";
import type { BrewPrescription, BrewPrescriptionInput, BrewVariable, RecipeStyle } from "@/types/prescription";

const storageKey = "coffeeos_brew_prescriptions";

const defaultInput: BrewPrescriptionInput = {
  recipeStyle: "sweetness",
  temperatureC: 92,
  grindSize: 5,
  targetTimeSeconds: 180,
  actualTimeSeconds: 160,
  bloomSeconds: 35,
  pourCount: 3,
  symptoms: []
};

const recipeStyles: { value: RecipeStyle; labelKey: "clarity" | "sweetness" | "bodyGoal" | "stability" }[] = [
  { value: "sweetness", labelKey: "sweetness" },
  { value: "clarity", labelKey: "clarity" },
  { value: "body", labelKey: "bodyGoal" },
  { value: "stability", labelKey: "stability" }
];

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function variableText(variable: BrewVariable, t: (key: keyof typeof translations) => string) {
  const labels = {
    temperatureC: t("waterTemperature"),
    grindSize: t("grindSize"),
    targetTimeSeconds: t("targetBrewTime"),
    bloomSeconds: t("bloomTime"),
    pourCount: t("pourCount")
  };
  return labels[variable];
}

function savePrescription(input: BrewPrescriptionInput, prescription: BrewPrescription) {
  if (typeof window === "undefined") {
    return;
  }

  const current = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as unknown[];
  window.localStorage.setItem(
    storageKey,
    JSON.stringify([
      {
        id: `prescription-${Date.now()}`,
        createdAt: new Date().toISOString(),
        input,
        prescription
      },
      ...current
    ])
  );
}

export default function PrescriptionPage() {
  const { locale, t } = useLocale();
  const [input, setInput] = useState<BrewPrescriptionInput>(defaultInput);
  const [saved, setSaved] = useState(false);

  const prescription = useMemo(() => prescribeBrew(input), [input]);
  const referencedEvidence = prescription.evidenceIds
    .map((id) => getBrewEvidenceById(id))
    .filter((item): item is (typeof brewEvidence)[number] => Boolean(item));

  function updateNumber(field: keyof BrewPrescriptionInput, value: number) {
    setInput((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function updateStyle(value: RecipeStyle) {
    setInput((current) => ({ ...current, recipeStyle: value }));
    setSaved(false);
  }

  return (
    <>
      <PageHeader
        title={t("brewPrescription")}
        eyebrow="CoffeeOS AI"
        description={t("brewPrescriptionDescription")}
        backHref="/"
      />
      <div className="space-y-5 px-5">
        <SectionCard
          title={t("recipeStyle")}
          eyebrow={t("oneVariableRule")}
          action={<SlidersHorizontal size={18} className="text-coffee-accent" />}
        >
          <div className="grid grid-cols-2 gap-2">
            {recipeStyles.map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => updateStyle(style.value)}
                className={`focus-ring min-h-12 rounded-lg border px-3 text-sm font-semibold ${
                  input.recipeStyle === style.value
                    ? "border-coffee-dark bg-coffee-dark text-white"
                    : "border-coffee-border bg-coffee-background text-coffee-secondary"
                }`}
              >
                {t(style.labelKey)}
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t("recommendedRecipe")}>
          <div className="grid gap-4">
            <RangeControl
              label={t("waterTemperature")}
              value={input.temperatureC}
              min={86}
              max={98}
              step={1}
              suffix="C"
              onChange={(value) => updateNumber("temperatureC", value)}
            />
            <RangeControl
              label={t("grindSize")}
              value={input.grindSize}
              min={1}
              max={10}
              step={1}
              suffix="/10"
              hint="1 fine / 10 coarse"
              onChange={(value) => updateNumber("grindSize", value)}
            />
            <RangeControl
              label={t("targetBrewTime")}
              value={input.targetTimeSeconds}
              min={120}
              max={300}
              step={5}
              display={formatSeconds(input.targetTimeSeconds)}
              onChange={(value) => updateNumber("targetTimeSeconds", value)}
            />
            <RangeControl
              label={t("actualBrewTime")}
              value={input.actualTimeSeconds}
              min={90}
              max={360}
              step={5}
              display={formatSeconds(input.actualTimeSeconds)}
              onChange={(value) => updateNumber("actualTimeSeconds", value)}
            />
            <RangeControl
              label={t("bloomTime")}
              value={input.bloomSeconds}
              min={20}
              max={70}
              step={5}
              suffix="s"
              onChange={(value) => updateNumber("bloomSeconds", value)}
            />
            <RangeControl
              label={t("pourCount")}
              value={input.pourCount}
              min={1}
              max={5}
              step={1}
              onChange={(value) => updateNumber("pourCount", value)}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setInput(defaultInput);
                setSaved(false);
              }}
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-card px-3 text-sm font-semibold text-coffee-primary"
            >
              <RotateCcw size={16} />
              {t("resetInputs")}
            </button>
            <button
              type="button"
              onClick={() => {
                savePrescription(input, prescription);
                setSaved(true);
              }}
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-coffee-dark px-3 text-sm font-semibold text-white"
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              {saved ? t("savedPrescription") : t("savePrescription")}
            </button>
          </div>
        </SectionCard>

        <SectionCard
          title={t("diagnosis")}
          eyebrow={`${t("confidence")} ${prescription.confidence}%`}
          action={<Brain size={19} className="text-coffee-accent" />}
        >
          <div className="h-2 overflow-hidden rounded-lg bg-coffee-background">
            <div
              className="h-full rounded-lg bg-coffee-accent transition-all"
              style={{ width: `${prescription.confidence}%` }}
            />
          </div>
          <p className="mt-4 text-base leading-7 text-coffee-primary">
            {getLocalizedText(prescription.diagnosis, locale)}
          </p>
        </SectionCard>

        <SectionCard title={t("primaryAdjustment")}>
          <div className="rounded-lg bg-coffee-dark p-4 text-white">
            <p className="text-sm text-white/64">
              {getLocalizedText(prescription.primaryAdjustment.label, locale)}
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-2xl font-semibold tabular-nums">
                {prescription.primaryAdjustment.currentValue}
              </p>
              <span className="text-sm font-semibold text-coffee-accent">
                {getLocalizedText(prescription.primaryAdjustment.delta, locale)}
              </span>
              <p className="text-2xl font-semibold tabular-nums">
                {prescription.primaryAdjustment.nextValue}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-coffee-secondary">
            {getLocalizedText(prescription.primaryAdjustment.reason, locale)}
          </p>
          <div className="mt-4 rounded-lg border border-dashed border-coffee-border p-4">
            <p className="text-xs font-semibold uppercase text-coffee-accent">{t("holdVariables")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {prescription.holdVariables.map((variable) => (
                <span
                  key={variable}
                  className="rounded-lg bg-coffee-background px-3 py-2 text-xs font-semibold text-coffee-secondary"
                >
                  {variableText(variable, t)}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t("nextRecipe")}>
          <div className="grid grid-cols-2 gap-2">
            {[
              [t("waterTemperature"), `${prescription.nextRecipe.temperatureC}C`],
              [t("grindSize"), `${prescription.nextRecipe.grindSize}/10`],
              [t("targetBrewTime"), formatSeconds(prescription.nextRecipe.targetTimeSeconds)],
              [t("bloomTime"), `${prescription.nextRecipe.bloomSeconds}s`],
              [t("pourCount"), `${prescription.nextRecipe.pourCount}`],
              [t("recipeStyle"), t(recipeStyles.find((style) => style.value === prescription.nextRecipe.recipeStyle)?.labelKey ?? "sweetness")]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-coffee-background p-3">
                <p className="text-xs font-semibold uppercase text-coffee-secondary">{label}</p>
                <p className="mt-1 text-sm font-semibold leading-5 text-coffee-primary">{value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t("expectedEffects")}>
          <div className="space-y-3">
            {prescription.expectedEffects.map((effect, index) => (
              <p key={`${effect.ko}-${index}`} className="rounded-lg bg-coffee-background p-3 text-sm leading-6 text-coffee-secondary">
                {getLocalizedText(effect, locale)}
              </p>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t("caution")}>
          <div className="space-y-3">
            {prescription.cautions.map((caution, index) => (
              <p key={`${caution.ko}-${index}`} className="rounded-lg border border-coffee-border p-3 text-sm leading-6 text-coffee-secondary">
                {getLocalizedText(caution, locale)}
              </p>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t("evidence")}>
          <div className="space-y-3">
            {referencedEvidence.map((evidence) => (
              <a
                key={evidence.id}
                href={evidence.sourceUrl}
                target={evidence.sourceUrl.startsWith("/") ? undefined : "_blank"}
                rel={evidence.sourceUrl.startsWith("/") ? undefined : "noreferrer"}
                className="focus-ring block rounded-lg border border-coffee-border bg-coffee-background p-4"
              >
                <p className="text-sm font-semibold text-coffee-primary">{evidence.title}</p>
                <p className="mt-1 text-xs font-semibold uppercase text-coffee-accent">{evidence.sourceName}</p>
                <p className="mt-3 text-sm leading-6 text-coffee-secondary">
                  {getLocalizedText(evidence.summary, locale)}
                </p>
              </a>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  suffix = "",
  display,
  hint,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  display?: string;
  hint?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-lg border border-coffee-border bg-coffee-background p-4">
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-coffee-primary">{label}</span>
        <span className="shrink-0 rounded-lg bg-coffee-card px-3 py-1 text-sm font-semibold tabular-nums text-coffee-primary">
          {display ?? `${value}${suffix}`}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full accent-coffee-accent"
      />
      {hint && <span className="mt-2 block text-xs font-semibold uppercase text-coffee-secondary">{hint}</span>}
    </label>
  );
}
