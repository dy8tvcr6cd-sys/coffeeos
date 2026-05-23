"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Save } from "lucide-react";
import type { Bean } from "@/types/bean";
import type { SensoryMode, SensoryScores } from "@/types/sensory";
import { getRoasteryById } from "@/data/roasteries";
import { FlavorChip } from "@/components/FlavorChip";
import { SectionCard } from "@/components/SectionCard";
import { saveSensoryRecord } from "@/lib/storage";
import { getLocalizedText, type LocalizedText } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

type Descriptor = { value: string; label: LocalizedText };

const beginnerDescriptors: Descriptor[] = [
  { value: "floral", label: { ko: "꽃향", en: "floral", ja: "花の香り" } },
  { value: "berry", label: { ko: "베리", en: "berry", ja: "ベリー" } },
  { value: "citrus", label: { ko: "시트러스", en: "citrus", ja: "シトラス" } },
  { value: "peach", label: { ko: "복숭아", en: "peach", ja: "桃" } },
  { value: "tropical", label: { ko: "열대과일", en: "tropical", ja: "トロピカル" } },
  { value: "chocolate", label: { ko: "초콜릿", en: "chocolate", ja: "チョコレート" } },
  { value: "nutty", label: { ko: "견과", en: "nutty", ja: "ナッツ" } },
  { value: "tea-like", label: { ko: "차 같은", en: "tea-like", ja: "お茶のよう" } },
  { value: "creamy", label: { ko: "크리미", en: "creamy", ja: "クリーミー" } },
  { value: "bright", label: { ko: "밝은", en: "bright", ja: "明るい" } },
  { value: "sweet", label: { ko: "단맛", en: "sweet", ja: "甘い" } },
  { value: "clean", label: { ko: "깨끗한", en: "clean", ja: "クリーン" } }
];

const professionalDescriptors = {
  aroma: [
    { value: "floral", label: { ko: "꽃향", en: "floral", ja: "花の香り" } },
    { value: "citrus oil", label: { ko: "시트러스 오일", en: "citrus oil", ja: "シトラスオイル" } },
    { value: "stone fruit", label: { ko: "핵과일", en: "stone fruit", ja: "核果" } },
    { value: "fermentation", label: { ko: "발효감", en: "fermentation", ja: "発酵感" } },
    { value: "cacao", label: { ko: "카카오", en: "cacao", ja: "カカオ" } }
  ],
  flavor: [
    { value: "fruity", label: { ko: "과일", en: "fruity", ja: "果実感" } },
    { value: "caramelized", label: { ko: "캐러멜화", en: "caramelized", ja: "キャラメル化" } },
    { value: "herbal", label: { ko: "허브", en: "herbal", ja: "ハーブ" } },
    { value: "spice", label: { ko: "스파이스", en: "spice", ja: "スパイス" } },
    { value: "tea", label: { ko: "차", en: "tea", ja: "お茶" } }
  ],
  acidity: [
    { value: "malic", label: { ko: "사과산", en: "malic", ja: "リンゴ酸" } },
    { value: "citric", label: { ko: "구연산", en: "citric", ja: "クエン酸" } },
    { value: "tartaric", label: { ko: "주석산", en: "tartaric", ja: "酒石酸" } },
    { value: "sparkling", label: { ko: "스파클링", en: "sparkling", ja: "スパークリング" } },
    { value: "round", label: { ko: "둥근", en: "round", ja: "丸い" } }
  ],
  body: [
    { value: "silky", label: { ko: "실키", en: "silky", ja: "シルキー" } },
    { value: "creamy", label: { ko: "크리미", en: "creamy", ja: "クリーミー" } },
    { value: "syrupy", label: { ko: "시럽 같은", en: "syrupy", ja: "シロップのよう" } },
    { value: "weightless", label: { ko: "가벼운", en: "weightless", ja: "軽やか" } },
    { value: "structured", label: { ko: "구조감", en: "structured", ja: "構造感" } }
  ],
  aftertaste: [
    { value: "clean", label: { ko: "깨끗한", en: "clean", ja: "クリーン" } },
    { value: "lingering", label: { ko: "긴 여운", en: "lingering", ja: "余韻が長い" } },
    { value: "sweet", label: { ko: "달콤한", en: "sweet", ja: "甘い" } },
    { value: "dry", label: { ko: "드라이", en: "dry", ja: "ドライ" } },
    { value: "perfumed", label: { ko: "향수 같은", en: "perfumed", ja: "香水のよう" } }
  ],
  balance: [
    { value: "integrated", label: { ko: "통합감", en: "integrated", ja: "まとまり" } },
    { value: "expressive", label: { ko: "표현력", en: "expressive", ja: "表現力" } },
    { value: "soft", label: { ko: "부드러운", en: "soft", ja: "やわらかい" } },
    { value: "focused", label: { ko: "선명한", en: "focused", ja: "焦点が合う" } },
    { value: "layered", label: { ko: "층이 있는", en: "layered", ja: "層がある" } }
  ]
} satisfies Record<string, Descriptor[]>;

const defaultScores: SensoryScores = {
  aroma: 7,
  flavor: 7,
  acidity: 7,
  body: 7,
  balance: 7,
  aftertaste: 7,
  overall: 7
};

type SensoryFormProps = {
  bean: Bean;
};

export function SensoryForm({ bean }: SensoryFormProps) {
  const { locale, t } = useLocale();
  const roastery = getRoasteryById(bean.roasteryId);
  const [mode, setMode] = useState<SensoryMode>("beginner");
  const [descriptors, setDescriptors] = useState<string[]>([]);
  const [scores, setScores] = useState<SensoryScores>(defaultScores);
  const [memo, setMemo] = useState("");
  const [saved, setSaved] = useState(false);

  const descriptorGroups = useMemo(() => {
    if (mode === "beginner") {
      return { descriptors: beginnerDescriptors };
    }
    return professionalDescriptors;
  }, [mode]);

  function toggleDescriptor(label: string) {
    setSaved(false);
    setDescriptors((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
    );
  }

  function updateScore(key: keyof SensoryScores, value: number) {
    setSaved(false);
    setScores((current) => ({ ...current, [key]: value }));
  }

  function saveRecord() {
    saveSensoryRecord({
      id: `${bean.id}-${Date.now()}`,
      beanId: bean.id,
      beanName: getLocalizedText(bean.name, locale),
      roasteryName: getLocalizedText(roastery?.name, locale) || "CoffeeOS",
      mode,
      descriptors,
      scores,
      memo,
      createdAt: new Date().toISOString()
    });
    setSaved(true);
  }

  const scoreKeys = Object.keys(scores) as Array<keyof SensoryScores>;

  return (
    <div className="space-y-5">
      <SectionCard title={t("sensoryMode")} eyebrow={getLocalizedText(bean.name, locale)}>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-coffee-background p-1">
          {(["beginner", "professional"] as SensoryMode[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item);
                setDescriptors([]);
                setSaved(false);
              }}
              className={`focus-ring h-11 rounded-lg text-sm font-semibold transition ${
                mode === item ? "bg-coffee-dark text-white" : "text-coffee-secondary"
              }`}
            >
              {t(item)}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title={mode === "beginner" ? t("simpleDescriptors") : t("cvaDescriptors")}>
        <div className="space-y-4">
          {Object.entries(descriptorGroups).map(([group, labels]) => (
            <div key={group}>
              {mode === "professional" && (
                <p className="mb-2 text-xs font-semibold uppercase text-coffee-accent">
                  {t(group as keyof typeof import("@/data/translations").translations)}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {labels.map((descriptor) => (
                  <FlavorChip
                    key={`${group}-${descriptor.value}`}
                    label={getLocalizedText(descriptor.label, locale)}
                    selected={descriptors.includes(descriptor.value)}
                    onClick={() => toggleDescriptor(descriptor.value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title={t("score")}>
        <div className="space-y-4">
          {scoreKeys.map((key) => (
            <label key={key} className="block">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-coffee-primary">{t(key)}</span>
                <span className="rounded-lg bg-coffee-background px-2 py-1 text-sm font-semibold tabular-nums text-coffee-secondary">
                  {scores[key].toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={scores[key]}
                onChange={(event) => updateScore(key, Number(event.target.value))}
                className="w-full"
              />
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title={t("memo")}>
        <textarea
          value={memo}
          onChange={(event) => {
            setSaved(false);
            setMemo(event.target.value);
          }}
          rows={5}
          placeholder={t("memoPlaceholder")}
          className="focus-ring w-full resize-none rounded-lg border border-coffee-border bg-coffee-background p-4 text-base text-coffee-primary placeholder:text-coffee-secondary/70"
        />
      </SectionCard>

      <div className="sticky bottom-24 z-10 px-1">
        <button
          type="button"
          onClick={saveRecord}
          className="focus-ring inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-coffee-dark px-4 text-base font-semibold text-white shadow-soft"
        >
          {saved ? <Check size={18} /> : <Save size={18} />}
          {saved ? t("savedToArchive") : t("saveSensoryRecord")}
        </button>
        {saved && (
          <Link
            href="/archive"
            className="focus-ring mt-3 inline-flex h-12 w-full items-center justify-center rounded-lg border border-coffee-border bg-coffee-card text-sm font-semibold text-coffee-primary"
          >
            {t("viewArchive")}
          </Link>
        )}
      </div>
    </div>
  );
}
