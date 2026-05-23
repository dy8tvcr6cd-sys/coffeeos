"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { beans as mockBeans } from "@/data/beans";
import { getRoasteryById } from "@/data/roasteries";
import { analyzeBrewLog } from "@/lib/brewDiagnosis";
import { brewProblemLabels, calculateRatio, makeDefaultSteps } from "@/lib/brewUi";
import { getLocalizedText, type LocalizedText } from "@/lib/i18n";
import { clearBrewLogDraft, getAllBeansClient, getBrewLogDraft, saveBrewLog } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { Bean } from "@/types/bean";
import type { BrewLog, BrewLogStep, BrewProblem } from "@/types/brewDiagnosis";

type StepForm = {
  at: string;
  waterAmount: string;
  action: string;
};

type BrewLogForm = {
  beanId: string;
  manualBeanName: string;
  brewer: string;
  filter: string;
  grinder: string;
  kettle: string;
  coffeeAmount: string;
  waterAmount: string;
  waterTemperature: string;
  grindSize: string;
  totalTimeSeconds: string;
  steps: StepForm[];
  selectedProblems: BrewProblem[];
  perceivedStrength: number;
  sweetness: number;
  acidity: number;
  bitterness: number;
  astringency: number;
  body: number;
  clarity: number;
  aroma: number;
  aftertaste: number;
  satisfaction: number;
  memo: string;
  tds: string;
  extractionYield: string;
  beverageWeight: string;
};

const problemOrder: BrewProblem[] = [
  "too_sour",
  "sharp_acidity",
  "weak",
  "flat",
  "bitter",
  "astringent",
  "muddy",
  "thin",
  "low_aroma",
  "good"
];

const initialForm: BrewLogForm = {
  beanId: mockBeans[0]?.id ?? "",
  manualBeanName: "",
  brewer: "Hario V60",
  filter: "종이 필터",
  grinder: "",
  kettle: "",
  coffeeAmount: "15",
  waterAmount: "240",
  waterTemperature: "92",
  grindSize: "중간",
  totalTimeSeconds: "180",
  steps: makeDefaultSteps().map((step) => ({
    at: String(step.at),
    waterAmount: String(step.waterAmount),
    action: step.action.ko
  })),
  selectedProblems: [],
  perceivedStrength: 5,
  sweetness: 5,
  acidity: 5,
  bitterness: 5,
  astringency: 5,
  body: 5,
  clarity: 5,
  aroma: 5,
  aftertaste: 5,
  satisfaction: 5,
  memo: "",
  tds: "",
  extractionYield: "",
  beverageWeight: ""
};

function localizedUserText(value: string): LocalizedText {
  return { ko: value, en: value, ja: value };
}

function numberFrom(value: string, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function NewBrewLogPage() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const [allBeans, setAllBeans] = useState<Bean[]>(mockBeans);
  const [form, setForm] = useState<BrewLogForm>(initialForm);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const beans = getAllBeansClient();
    setAllBeans(beans);

    const query = new URLSearchParams(window.location.search);
    const queryBeanId = query.get("beanId");
    const draft = getBrewLogDraft();
    const selectedBeanId = queryBeanId || draft?.beanId || beans[0]?.id || "";

    setForm((current) => ({
      ...current,
      beanId: selectedBeanId,
      brewer: draft?.equipment?.brewer ?? current.brewer,
      filter: draft?.equipment?.filter ?? current.filter,
      grinder: draft?.equipment?.grinder ?? current.grinder,
      coffeeAmount: draft?.recipe ? String(draft.recipe.coffeeAmount) : current.coffeeAmount,
      waterAmount: draft?.recipe ? String(draft.recipe.waterAmount) : current.waterAmount,
      waterTemperature: draft?.recipe ? String(draft.recipe.waterTemperature) : current.waterTemperature,
      grindSize: draft?.recipe?.grindSize ?? current.grindSize,
      totalTimeSeconds: draft?.recipe ? String(draft.recipe.totalTimeSeconds) : current.totalTimeSeconds,
      steps: draft?.recipe?.steps?.length
        ? draft.recipe.steps.map((step) => ({
            at: String(step.at),
            waterAmount: String(step.waterAmount),
            action: getLocalizedText(step.action, "ko")
          }))
        : current.steps
    }));
    setDraftLoaded(Boolean(draft));
  }, []);

  const ratio = useMemo(
    () => calculateRatio(numberFrom(form.coffeeAmount), numberFrom(form.waterAmount)),
    [form.coffeeAmount, form.waterAmount]
  );

  const selectedBean = allBeans.find((bean) => bean.id === form.beanId);

  function update<K extends keyof BrewLogForm>(field: K, value: BrewLogForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function updateStep(index: number, field: keyof StepForm, value: string) {
    setForm((current) => ({
      ...current,
      steps: current.steps.map((step, stepIndex) => (stepIndex === index ? { ...step, [field]: value } : step))
    }));
  }

  function toggleProblem(problem: BrewProblem) {
    setForm((current) => ({
      ...current,
      selectedProblems: current.selectedProblems.includes(problem)
        ? current.selectedProblems.filter((item) => item !== problem)
        : [...current.selectedProblems, problem]
    }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const coffeeAmount = numberFrom(form.coffeeAmount);
    const waterAmount = numberFrom(form.waterAmount);
    const waterTemperature = numberFrom(form.waterTemperature);
    const totalTimeSeconds = numberFrom(form.totalTimeSeconds);

    if (!selectedBean && !form.manualBeanName.trim()) {
      setError("원두를 선택하거나 직접 입력해주세요.");
      return;
    }

    if (!coffeeAmount || !waterAmount || !waterTemperature || !totalTimeSeconds || !form.grindSize.trim()) {
      setError("원두량, 물 양, 물 온도, 분쇄도, 총 추출 시간은 필수입니다.");
      return;
    }

    if (!form.selectedProblems.length) {
      setError("맛 결과를 최소 하나 선택해주세요.");
      return;
    }

    const roastery = selectedBean ? getRoasteryById(selectedBean.roasteryId) : undefined;
    const steps: BrewLogStep[] = form.steps
      .filter((step) => step.action.trim())
      .map((step) => ({
        at: numberFrom(step.at),
        waterAmount: numberFrom(step.waterAmount),
        action: localizedUserText(step.action.trim())
      }));

    const now = new Date().toISOString();
    const logWithoutDiagnosis: BrewLog = {
      id: `brew-log-${Date.now()}`,
      beanId: selectedBean?.id ?? `manual-${Date.now()}`,
      roasteryId: selectedBean?.roasteryId,
      createdAt: now,
      beanName: selectedBean?.name ?? localizedUserText(form.manualBeanName.trim()),
      roasteryName: roastery?.name,
      equipment: {
        brewer: form.brewer.trim(),
        filter: form.filter.trim() || undefined,
        grinder: form.grinder.trim() || undefined,
        kettle: form.kettle.trim() || undefined
      },
      recipe: {
        coffeeAmount,
        waterAmount,
        ratio,
        waterTemperature,
        grindSize: form.grindSize.trim(),
        totalTimeSeconds,
        steps
      },
      result: {
        perceivedStrength: form.perceivedStrength,
        sweetness: form.sweetness,
        acidity: form.acidity,
        bitterness: form.bitterness,
        astringency: form.astringency,
        body: form.body,
        clarity: form.clarity,
        aroma: form.aroma,
        aftertaste: form.aftertaste,
        satisfaction: form.satisfaction,
        selectedProblems: form.selectedProblems,
        memo: form.memo.trim() || undefined
      },
      measurements: {
        tds: form.tds ? numberFrom(form.tds) : undefined,
        extractionYield: form.extractionYield ? numberFrom(form.extractionYield) : undefined,
        beverageWeight: form.beverageWeight ? numberFrom(form.beverageWeight) : undefined
      }
    };

    const log = {
      ...logWithoutDiagnosis,
      diagnosis: analyzeBrewLog(logWithoutDiagnosis)
    };

    saveBrewLog(log);
    clearBrewLogDraft();
    router.push(`/brew-diagnosis/${log.id}`);
  }

  return (
    <>
      <PageHeader
        title={t("newBrewLog")}
        eyebrow={t("brewDiagnosis")}
        description={t("brewDiagnosisDescription")}
        backHref="/brew-diagnosis"
      />
      <form onSubmit={submit} className="space-y-5 px-5">
        {draftLoaded && (
          <p className="rounded-lg border border-coffee-border bg-coffee-card p-4 text-sm leading-6 text-coffee-secondary">
            {t("draftLoaded")}
          </p>
        )}

        <SectionCard title={t("beanIdentity")}>
          <div className="grid gap-3">
            <FieldSelect
              label={t("selectBean")}
              value={form.beanId}
              onChange={(value) => update("beanId", value)}
              options={[
                { value: "", label: t("manualBeanName") },
                ...allBeans.map((bean) => ({ value: bean.id, label: getLocalizedText(bean.name, locale) }))
              ]}
            />
            <Field label={t("manualBeanName")} value={form.manualBeanName} onChange={(value) => update("manualBeanName", value)} />
            <p className="text-xs leading-5 text-coffee-secondary">{t("directBeanInput")}</p>
          </div>
        </SectionCard>

        <SectionCard title={t("equipment")}>
          <div className="grid gap-3">
            <Field label={t("brewer")} value={form.brewer} onChange={(value) => update("brewer", value)} />
            <Field label={t("filter")} value={form.filter} onChange={(value) => update("filter", value)} />
            <Field label={t("grinder")} value={form.grinder} onChange={(value) => update("grinder", value)} />
            <Field label={t("kettle")} value={form.kettle} onChange={(value) => update("kettle", value)} />
          </div>
        </SectionCard>

        <SectionCard title={t("recipe")} eyebrow={t("ratioAuto")}>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-2">
              <Field label={`${t("coffeeAmount")} g`} type="number" value={form.coffeeAmount} onChange={(value) => update("coffeeAmount", value)} />
              <Field label={`${t("waterAmount")} g`} type="number" value={form.waterAmount} onChange={(value) => update("waterAmount", value)} />
            </div>
            <div className="rounded-lg bg-coffee-background p-3">
              <p className="text-xs font-semibold uppercase text-coffee-secondary">{t("ratio")}</p>
              <p className="mt-1 text-lg font-semibold text-coffee-primary">{ratio}</p>
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
                update("steps", [
                  ...form.steps,
                  { at: String(numberFrom(form.totalTimeSeconds)), waterAmount: form.waterAmount, action: "추가 푸어" }
                ])
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
                  <Field label={t("secondsShort")} type="number" value={step.at} onChange={(value) => updateStep(index, "at", value)} />
                  <Field label={`${t("waterAmount")} g`} type="number" value={step.waterAmount} onChange={(value) => updateStep(index, "waterAmount", value)} />
                </div>
                <div className="mt-2">
                  <Field label={t("stepAction")} value={step.action} onChange={(value) => updateStep(index, "action", value)} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t("tasteResult")}>
          <div className="flex flex-wrap gap-2">
            {problemOrder.map((problem) => (
              <button
                key={problem}
                type="button"
                onClick={() => toggleProblem(problem)}
                className={`focus-ring rounded-lg border px-3 py-2 text-sm font-semibold ${
                  form.selectedProblems.includes(problem)
                    ? "border-coffee-dark bg-coffee-dark text-white"
                    : "border-coffee-border bg-coffee-background text-coffee-secondary"
                }`}
              >
                {getLocalizedText(brewProblemLabels[problem], locale)}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-3">
            <Slider label={t("sweetness")} value={form.sweetness} onChange={(value) => update("sweetness", value)} />
            <Slider label={t("acidity")} value={form.acidity} onChange={(value) => update("acidity", value)} />
            <Slider label={t("bitterness")} value={form.bitterness} onChange={(value) => update("bitterness", value)} />
            <Slider label={t("astringency")} value={form.astringency} onChange={(value) => update("astringency", value)} />
            <Slider label={t("body")} value={form.body} onChange={(value) => update("body", value)} />
            <Slider label={t("clarity")} value={form.clarity} onChange={(value) => update("clarity", value)} />
            <Slider label={t("satisfaction")} value={form.satisfaction} onChange={(value) => update("satisfaction", value)} />
          </div>
          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-semibold text-coffee-primary">{t("memo")}</span>
            <textarea
              value={form.memo}
              onChange={(event) => update("memo", event.target.value)}
              rows={3}
              className="focus-ring w-full resize-none rounded-lg border border-coffee-border bg-coffee-background p-3 text-sm text-coffee-primary"
            />
          </label>
        </SectionCard>

        <SectionCard title={t("optionalMeasurements")}>
          <div className="grid gap-3">
            <Field label={t("tds")} type="number" value={form.tds} onChange={(value) => update("tds", value)} />
            <Field label={t("extractionYield")} type="number" value={form.extractionYield} onChange={(value) => update("extractionYield", value)} />
            <Field label={`${t("beverageWeight")} g`} type="number" value={form.beverageWeight} onChange={(value) => update("beverageWeight", value)} />
          </div>
        </SectionCard>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

        <button
          type="submit"
          className="focus-ring inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-coffee-dark px-4 text-base font-semibold text-white shadow-soft"
        >
          <Save size={17} />
          {t("submitDiagnosis")}
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

function FieldSelect({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-coffee-primary">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-12 w-full rounded-lg border border-coffee-border bg-coffee-background px-3 text-base text-coffee-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block rounded-lg bg-coffee-background p-3">
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-coffee-primary">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-coffee-secondary">{value}/10</span>
      </span>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full accent-coffee-accent"
      />
    </label>
  );
}
