"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BeanCard } from "@/components/BeanCard";
import { FlavorChip } from "@/components/FlavorChip";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { getLocalizedText } from "@/lib/i18n";
import { getAllBeansClient, getSensoryRecords } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { Bean } from "@/types/bean";
import type { SensoryRecord } from "@/types/sensory";

const descriptorOptions = [
  "floral",
  "berry",
  "citrus",
  "peach",
  "tropical",
  "chocolate",
  "nutty",
  "tea-like",
  "creamy",
  "balanced",
  "clean",
  "sweet"
];

export default function RecommendPage() {
  const { locale, t } = useLocale();
  const [beans, setBeans] = useState<Bean[]>([]);
  const [records, setRecords] = useState<SensoryRecord[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setBeans(getAllBeansClient());
    setRecords(getSensoryRecords());
  }, []);

  const archiveDescriptors = useMemo(() => {
    const counts = new Map<string, number>();
    records.forEach((record) => {
      record.descriptors.forEach((descriptor) => {
        counts.set(descriptor, (counts.get(descriptor) ?? 0) + record.scores.overall);
      });
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([descriptor]) => descriptor);
  }, [records]);

  const activeDescriptors = selected.length
    ? selected
    : archiveDescriptors.length
      ? archiveDescriptors
      : ["sweet", "clean", "balanced"];

  const recommendations = useMemo(() => {
    return beans
      .map((bean) => {
        const notePool = [
          ...bean.tags,
          ...bean.cupNotes.flatMap((moment) => moment.notes.map((note) => getLocalizedText(note.name, locale))),
          getLocalizedText(bean.process, locale),
          bean.roastLevel
        ].map((note) => note.toLowerCase());
        const score = activeDescriptors.reduce((sum, descriptor) => {
          return sum + (notePool.some((note) => note.includes(descriptor.toLowerCase())) ? 1 : 0);
        }, 0);
        return { bean, score };
      })
      .sort((a, b) => b.score - a.score || (b.bean.price ?? 0) - (a.bean.price ?? 0))
      .slice(0, 5);
  }, [activeDescriptors, beans, locale]);

  function toggleDescriptor(label: string) {
    setSelected((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
    );
  }

  return (
    <>
      <PageHeader
        title={t("tasteRecommendation")}
        eyebrow={t("localMatch")}
        description={t("homeDescription")}
      />
      <div className="space-y-5 px-5">
        <SectionCard title={t("preferenceInput")}>
          <div className="flex flex-wrap gap-2">
            {descriptorOptions.map((descriptor) => (
              <FlavorChip
                key={descriptor}
                label={descriptor}
                selected={selected.includes(descriptor)}
                onClick={() => toggleDescriptor(descriptor)}
              />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelected(archiveDescriptors)}
              className="focus-ring h-11 rounded-lg bg-coffee-dark px-3 text-sm font-semibold text-white disabled:opacity-45"
              disabled={!archiveDescriptors.length}
            >
              {t("useArchive")}
            </button>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="focus-ring h-11 rounded-lg border border-coffee-border bg-coffee-card px-3 text-sm font-semibold text-coffee-primary"
            >
              {t("reset")}
            </button>
          </div>
          {!archiveDescriptors.length && (
            <p className="mt-3 text-sm leading-6 text-coffee-secondary">
              {t("archiveDescription")}
            </p>
          )}
        </SectionCard>

        <SectionCard title={t("matchProfile")}>
          <div className="flex flex-wrap gap-2">
            {activeDescriptors.map((descriptor) => (
              <span
                key={descriptor}
                className="rounded-lg bg-coffee-background px-3 py-2 text-sm font-semibold text-coffee-secondary"
              >
                {descriptor}
              </span>
            ))}
          </div>
        </SectionCard>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-coffee-primary">{t("recommendedBeans")}</h2>
          <div className="space-y-4">
            {recommendations.map(({ bean, score }) => (
              <div key={bean.id} className="space-y-2">
                <BeanCard bean={bean} compact />
                <p className="px-1 text-sm text-coffee-secondary">
                  {t("localMatch")} {score}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Link
          href="/archive"
          className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg border border-coffee-border bg-coffee-card text-sm font-semibold text-coffee-primary"
        >
          {t("viewArchive")}
        </Link>
      </div>
    </>
  );
}
