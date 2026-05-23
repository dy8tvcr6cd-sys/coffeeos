"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Circle, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { roasteries } from "@/data/roasteries";
import { hasLocalizedValue } from "@/lib/customerDisplay";
import { getLocalizedText, type LocalizedText } from "@/lib/i18n";
import { addCustomBean, getCustomBeans } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { Bean, RoastLevel } from "@/types/bean";
import type { BrewRecipe } from "@/types/brew";

type BeanForm = {
  name: LocalizedText;
  roasteryId: string;
  country: LocalizedText;
  region: LocalizedText;
  farm: LocalizedText;
  producer: LocalizedText;
  variety: string;
  altitude: string;
  process: LocalizedText;
  roastLevel: RoastLevel;
  harvestPeriod: string;
  moisture: string;
  density: string;
  hotNotes: LocalizedText;
  warmNotes: LocalizedText;
  coldNotes: LocalizedText;
  hotDescription: LocalizedText;
  warmDescription: LocalizedText;
  coldDescription: LocalizedText;
  roastingIntent: LocalizedText;
  farmStory: LocalizedText;
  price: string;
  purchaseUrl: string;
  brewer: string;
  grindSize: string;
  waterTemperature: string;
  coffeeAmount: string;
  waterAmount: string;
  totalTimeSeconds: string;
  brewDescription: LocalizedText;
};

const blankText: LocalizedText = { ko: "", en: "", ja: "" };

const initialForm: BeanForm = {
  name: blankText,
  roasteryId: "momos-coffee",
  country: blankText,
  region: blankText,
  farm: blankText,
  producer: blankText,
  variety: "",
  altitude: "",
  process: blankText,
  roastLevel: "unknown",
  harvestPeriod: "",
  moisture: "",
  density: "",
  hotNotes: blankText,
  warmNotes: blankText,
  coldNotes: blankText,
  hotDescription: blankText,
  warmDescription: blankText,
  coldDescription: blankText,
  roastingIntent: blankText,
  farmStory: blankText,
  price: "",
  purchaseUrl: "",
  brewer: "Hario V60",
  grindSize: "Medium",
  waterTemperature: "92 C",
  coffeeAmount: "15 g",
  waterAmount: "240 g",
  totalTimeSeconds: "180",
  brewDescription: blankText
};

const localeLabels = {
  ko: "한국어",
  en: "English",
  ja: "日本語"
};

const roastLevelOptions: { value: RoastLevel; label: LocalizedText }[] = [
  { value: "light", label: { ko: "라이트", en: "Light", ja: "ライト" } },
  { value: "light-medium", label: { ko: "라이트 미디엄", en: "Light medium", ja: "ライトミディアム" } },
  { value: "medium", label: { ko: "미디엄", en: "Medium", ja: "ミディアム" } },
  { value: "medium-dark", label: { ko: "미디엄 다크", en: "Medium dark", ja: "ミディアムダーク" } },
  { value: "dark", label: { ko: "다크", en: "Dark", ja: "ダーク" } },
  { value: "unknown", label: { ko: "로스터리 등록 예정", en: "To be registered", ja: "登録予定" } }
];

function withFallback(value: LocalizedText): LocalizedText {
  return {
    ko: value.ko.trim(),
    en: value.en.trim() || value.ko.trim(),
    ja: value.ja.trim() || value.ko.trim()
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function splitLocalizedNotes(value: LocalizedText) {
  const ko = value.ko.split(",").map((item) => item.trim()).filter(Boolean);
  const en = value.en.split(",").map((item) => item.trim()).filter(Boolean);
  const ja = value.ja.split(",").map((item) => item.trim()).filter(Boolean);
  const length = Math.max(ko.length, en.length, ja.length, 1);

  return Array.from({ length }).map((_, index) => ({
    name: {
      ko: ko[index] ?? ko[0] ?? "로스터리 등록 예정",
      en: en[index] ?? ko[index] ?? ko[0] ?? "To be registered",
      ja: ja[index] ?? ko[index] ?? ko[0] ?? "登録予定"
    },
    intensity: 3,
    color: ["#C8A45D", "#C85D5D", "#8A6F4D"][index % 3],
    category: "unknown" as const
  }));
}

export default function AdminPage() {
  const { locale, t } = useLocale();
  const [form, setForm] = useState<BeanForm>(initialForm);
  const [customBeans, setCustomBeans] = useState<Bean[]>([]);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setCustomBeans(getCustomBeans());
  }, []);

  const missingRequired = useMemo(
    () => !form.name.ko.trim() || !form.country.ko.trim() || !form.farm.ko.trim() || !form.hotNotes.ko.trim(),
    [form]
  );

  const completionChecks = useMemo(
    () => [
      { label: t("checklistBeanName"), complete: Boolean(form.name.ko.trim()) },
      { label: t("checklistRoastery"), complete: Boolean(form.roasteryId) },
      { label: t("checklistCountry"), complete: Boolean(form.country.ko.trim()) },
      { label: t("checklistProcess"), complete: Boolean(form.process.ko.trim()) },
      {
        label: t("checklistCupNotes"),
        complete: Boolean(form.hotNotes.ko.trim() || form.warmNotes.ko.trim() || form.coldNotes.ko.trim())
      },
      { label: t("checklistRoastingIntent"), complete: Boolean(form.roastingIntent.ko.trim()) },
      {
        label: t("checklistBrewRecipe"),
        complete: Boolean(
          form.brewer.trim() &&
            form.grindSize.trim() &&
            form.waterTemperature.trim() &&
            form.coffeeAmount.trim() &&
            form.waterAmount.trim() &&
            form.totalTimeSeconds.trim() &&
            form.brewDescription.ko.trim()
        )
      },
      { label: t("checklistPurchaseUrl"), complete: Boolean(form.purchaseUrl.trim()) },
      {
        label: t("checklistMultilingual"),
        complete:
          hasLocalizedValue(form.name) &&
          hasLocalizedValue(form.country) &&
          hasLocalizedValue(form.process) &&
          hasLocalizedValue(form.hotNotes) &&
          hasLocalizedValue(form.roastingIntent) &&
          hasLocalizedValue(form.brewDescription)
      }
    ],
    [form, t]
  );

  function updateTextField(field: keyof BeanForm, lang: keyof LocalizedText, value: string) {
    setForm((current) => ({
      ...current,
      [field]: {
        ...(current[field] as LocalizedText),
        [lang]: value
      }
    }));
    setError("");
  }

  function updateField(field: keyof BeanForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (missingRequired) {
      setError("한국어 원두명, 국가, 농장, HOT 노트는 필수입니다.");
      return;
    }

    const name = withFallback(form.name);
    const id = `${slugify(name.en || name.ko)}-${Date.now()}`;
    const recipeId = `brew-${id}`;
    const price = Number(form.price.replace(/[^0-9]/g, "")) || null;
    const totalTimeSeconds = Number(form.totalTimeSeconds) || 180;

    const bean: Bean = {
      id,
      slug: id,
      roasteryId: form.roasteryId,
      name,
      farmId: null,
      country: withFallback(form.country),
      region: withFallback(form.region),
      farm: withFallback(form.farm),
      producer: withFallback(form.producer),
      variety: form.variety.trim() || null,
      altitude: form.altitude.trim() || null,
      process: withFallback(form.process),
      roastLevel: form.roastLevel,
      harvestPeriod: form.harvestPeriod.trim() || null,
      moisture: form.moisture.trim() || null,
      density: form.density.trim() || null,
      cupNotes: [
        {
          stage: "HOT",
          notes: splitLocalizedNotes(form.hotNotes),
          description: withFallback(form.hotDescription)
        },
        {
          stage: "WARM",
          notes: splitLocalizedNotes(form.warmNotes),
          description: withFallback(form.warmDescription)
        },
        {
          stage: "COLD",
          notes: splitLocalizedNotes(form.coldNotes),
          description: withFallback(form.coldDescription)
        }
      ],
      roastingIntent: withFallback(form.roastingIntent),
      farmStory: withFallback(form.farmStory),
      recommendedBrewIds: [recipeId],
      purchaseUrl: form.purchaseUrl.trim() || null,
      sourceUrl: null,
      price,
      tags: splitLocalizedNotes(form.hotNotes).map((item) => item.name.en.toLowerCase()),
      similarBeanIds: ["momos-honduras-coe-la-pena", "bean-brothers-peru-el-palmo", "coffee-libre-vertigo"],
      status: "needs_review",
      lastResearchedAt: new Date().toISOString().slice(0, 10)
    };

    const recipe: BrewRecipe = {
      id: recipeId,
      beanId: id,
      brewer: form.brewer.trim(),
      grindSize: form.grindSize.trim(),
      waterTemperature: form.waterTemperature.trim(),
      coffeeAmount: form.coffeeAmount.trim(),
      waterAmount: form.waterAmount.trim(),
      ratio: "custom",
      totalTimeSeconds,
      intent: withFallback(form.brewDescription),
      status: "needs_review",
      steps: [
        {
          id: `${recipeId}-bloom`,
          at: 0,
          duration: 35,
          title: { ko: "블루밍", en: "Bloom", ja: "ブルーム" },
          water: "25%",
          instruction: { ko: "커피 전체를 고르게 적십니다.", en: "Wet the coffee evenly.", ja: "粉全体を均一に湿らせます。" }
        },
        {
          id: `${recipeId}-build`,
          at: 35,
          duration: 50,
          title: { ko: "단맛 만들기", en: "Build sweetness", ja: "甘さを作る" },
          water: "60%",
          instruction: { ko: "천천히 원을 그리며 단맛을 만듭니다.", en: "Pour slowly in circles to build sweetness.", ja: "ゆっくり円を描いて甘さを引き出します。" }
        },
        {
          id: `${recipeId}-finish`,
          at: 95,
          duration: Math.max(totalTimeSeconds - 95, 45),
          title: { ko: "마무리", en: "Finish", ja: "仕上げ" },
          water: "100%",
          instruction: { ko: "부드럽게 마무리하고 드로우다운을 기다립니다.", en: "Finish gently and wait for drawdown.", ja: "やさしく注ぎ終え、落ち切るのを待ちます。" }
        }
      ]
    };

    addCustomBean(bean, recipe);
    setCustomBeans(getCustomBeans());
    setSavedId(id);
    setForm(initialForm);
  }

  return (
    <>
      <PageHeader
        title={t("admin")}
        eyebrow={t("addBean")}
        description={t("adminDescription")}
        backHref="/"
      />
      <div className="space-y-5 px-5">
        <form onSubmit={submit} className="space-y-5">
          <SectionCard title={t("internalCompletionChecklist")}>
            <div className="grid gap-2">
              {completionChecks.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 rounded-lg bg-coffee-background px-3 py-2"
                >
                  <span className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-coffee-primary">
                    {item.complete ? (
                      <Check size={16} className="shrink-0 text-coffee-accent" />
                    ) : (
                      <Circle size={16} className="shrink-0 text-coffee-secondary" />
                    )}
                    {item.label}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-coffee-secondary">
                    {item.complete ? t("complete") : t("incomplete")}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title={t("beanIdentity")}>
            <div className="grid gap-3">
              <LocalizedField label={t("beanName")} value={form.name} onChange={(lang, value) => updateTextField("name", lang, value)} />
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-coffee-primary">{t("roastery")}</span>
                <select
                  value={form.roasteryId}
                  onChange={(event) => updateField("roasteryId", event.target.value)}
                  className="focus-ring h-12 w-full rounded-lg border border-coffee-border bg-coffee-background px-3 text-base text-coffee-primary"
                >
                  {roasteries.map((roastery) => (
                    <option key={roastery.id} value={roastery.id}>
                      {getLocalizedText(roastery.name, locale)}
                    </option>
                  ))}
                </select>
              </label>
              <LocalizedField label={t("country")} value={form.country} onChange={(lang, value) => updateTextField("country", lang, value)} />
              <LocalizedField label={t("region")} value={form.region} onChange={(lang, value) => updateTextField("region", lang, value)} />
              <LocalizedField label={t("farm")} value={form.farm} onChange={(lang, value) => updateTextField("farm", lang, value)} />
              <LocalizedField label={t("producer")} value={form.producer} onChange={(lang, value) => updateTextField("producer", lang, value)} />
              <LocalizedField label={t("process")} value={form.process} onChange={(lang, value) => updateTextField("process", lang, value)} />
              <Field label={t("variety")} value={form.variety} onChange={(value) => updateField("variety", value)} />
              <Field label={t("altitude")} value={form.altitude} onChange={(value) => updateField("altitude", value)} />
              <Field label={t("harvest")} value={form.harvestPeriod} onChange={(value) => updateField("harvestPeriod", value)} />
              <Field label={t("moisture")} value={form.moisture} onChange={(value) => updateField("moisture", value)} />
              <Field label={t("density")} value={form.density} onChange={(value) => updateField("density", value)} />
              <Field label={t("currentPrice")} value={form.price} onChange={(value) => updateField("price", value)} />
              <Field label={t("purchaseUrl")} value={form.purchaseUrl} onChange={(value) => updateField("purchaseUrl", value)} />
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-coffee-primary">{t("roastLevel")}</span>
                <select
                  value={form.roastLevel}
                  onChange={(event) => updateField("roastLevel", event.target.value)}
                  className="focus-ring h-12 w-full rounded-lg border border-coffee-border bg-coffee-background px-3 text-base text-coffee-primary"
                >
                  {roastLevelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {getLocalizedText(option.label, locale)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </SectionCard>

          <SectionCard title={t("cupNoteTimeline")}>
            <div className="grid gap-4">
              <LocalizedField label="HOT 노트" value={form.hotNotes} onChange={(lang, value) => updateTextField("hotNotes", lang, value)} />
              <LocalizedTextArea label="HOT 설명" value={form.hotDescription} onChange={(lang, value) => updateTextField("hotDescription", lang, value)} />
              <LocalizedField label="WARM 노트" value={form.warmNotes} onChange={(lang, value) => updateTextField("warmNotes", lang, value)} />
              <LocalizedTextArea label="WARM 설명" value={form.warmDescription} onChange={(lang, value) => updateTextField("warmDescription", lang, value)} />
              <LocalizedField label="COLD 노트" value={form.coldNotes} onChange={(lang, value) => updateTextField("coldNotes", lang, value)} />
              <LocalizedTextArea label="COLD 설명" value={form.coldDescription} onChange={(lang, value) => updateTextField("coldDescription", lang, value)} />
            </div>
          </SectionCard>

          <SectionCard title={t("roastingIntent")}>
            <div className="grid gap-4">
              <LocalizedTextArea label={t("roastingIntent")} value={form.roastingIntent} onChange={(lang, value) => updateTextField("roastingIntent", lang, value)} />
              <LocalizedTextArea label={t("farmStory")} value={form.farmStory} onChange={(lang, value) => updateTextField("farmStory", lang, value)} />
            </div>
          </SectionCard>

          <SectionCard title={t("recommendedRecipe")}>
            <div className="grid gap-3">
              <Field label={t("brewer")} value={form.brewer} onChange={(value) => updateField("brewer", value)} />
              <Field label={t("grindSize")} value={form.grindSize} onChange={(value) => updateField("grindSize", value)} />
              <Field label={t("waterTemperature")} value={form.waterTemperature} onChange={(value) => updateField("waterTemperature", value)} />
              <Field label={t("coffeeAmount")} value={form.coffeeAmount} onChange={(value) => updateField("coffeeAmount", value)} />
              <Field label={t("waterAmount")} value={form.waterAmount} onChange={(value) => updateField("waterAmount", value)} />
              <Field label={t("totalTime")} value={form.totalTimeSeconds} onChange={(value) => updateField("totalTimeSeconds", value)} />
              <LocalizedTextArea label={t("recommendedRecipe")} value={form.brewDescription} onChange={(lang, value) => updateTextField("brewDescription", lang, value)} />
            </div>
          </SectionCard>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

          <button
            type="submit"
            className="focus-ring inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-coffee-dark px-4 text-base font-semibold text-white shadow-soft"
          >
            <Plus size={18} />
            {t("addBean")}
          </button>
        </form>

        {savedId && (
          <SectionCard title={t("beanAdded")}>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-coffee-primary">
              <Check size={16} className="text-coffee-accent" />
              {t("saved")}
            </p>
            <Link
              href={`/beans/${savedId}`}
              className="focus-ring mt-4 inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
            >
              {t("openNewBean")}
            </Link>
          </SectionCard>
        )}

        {!!customBeans.length && (
          <SectionCard title={t("localBeans")}>
            <div className="grid gap-2">
              {customBeans.map((bean) => (
                <Link
                  key={bean.id}
                  href={`/beans/${bean.id}`}
                  className="focus-ring rounded-lg border border-coffee-border bg-coffee-background p-3 text-sm font-semibold text-coffee-primary"
                >
                  {getLocalizedText(bean.name, locale)}
                </Link>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    </>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-coffee-primary">{label}</span>
      <input
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
            <span className="mb-1 block text-xs font-semibold uppercase text-coffee-secondary">{localeLabels[lang]}</span>
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
            <span className="mb-1 block text-xs font-semibold uppercase text-coffee-secondary">{localeLabels[lang]}</span>
            <textarea
              value={value[lang]}
              onChange={(event) => onChange(lang, event.target.value)}
              rows={3}
              className="focus-ring w-full resize-none rounded-lg border border-coffee-border bg-coffee-background p-3 text-sm text-coffee-primary"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
