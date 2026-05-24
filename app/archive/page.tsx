"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Printer, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { deleteSensoryRecord, getSensoryRecords } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { SensoryMode, SensoryRecord } from "@/types/sensory";

export default function ArchivePage() {
  const { t } = useLocale();
  const [records, setRecords] = useState<SensoryRecord[]>([]);
  const [query, setQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<"all" | SensoryMode>("all");
  const [beanFilter, setBeanFilter] = useState<string | null>(null);

  useEffect(() => {
    setRecords(getSensoryRecords());
    setBeanFilter(new URLSearchParams(window.location.search).get("beanId"));
  }, []);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesMode = modeFilter === "all" || record.mode === modeFilter;
      const matchesBean = !beanFilter || record.beanId === beanFilter;
      const matchesQuery =
        !normalizedQuery ||
        record.beanName.toLowerCase().includes(normalizedQuery) ||
        record.roasteryName.toLowerCase().includes(normalizedQuery);

      return matchesMode && matchesBean && matchesQuery;
    });
  }, [beanFilter, modeFilter, query, records]);

  function removeRecord(id: string) {
    deleteSensoryRecord(id);
    setRecords(getSensoryRecords());
  }

  return (
    <>
      <PageHeader
        title={t("coffeeArchive")}
        eyebrow={t("sensoryRecord")}
        description={t("archiveDescription")}
      />
      <div className="space-y-5 px-5">
        <SectionCard title={t("savedSensoryRecords")}>
          <div className="space-y-3">
            <label className="relative block">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-coffee-secondary" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchRecords")}
                className="focus-ring h-12 w-full rounded-lg border border-coffee-border bg-coffee-background pl-10 pr-3 text-sm text-coffee-primary placeholder:text-coffee-secondary/70"
              />
            </label>
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-coffee-background p-1">
              {([
                ["all", t("allModes")],
                ["beginner", t("beginner")],
                ["professional", t("professional")]
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setModeFilter(value)}
                  className={`focus-ring h-10 rounded-lg text-xs font-semibold transition ${
                    modeFilter === value ? "bg-coffee-dark text-white" : "text-coffee-secondary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        {!records.length && (
          <SectionCard title={t("noRecordsYet")}>
            <p className="text-sm leading-6 text-coffee-secondary">
              {t("qrFlowDescription")}
            </p>
            <Link
              href="/beans"
              className="focus-ring mt-4 inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
            >
              {t("browseBeans")}
            </Link>
          </SectionCard>
        )}

        {!!records.length && !filteredRecords.length && (
          <SectionCard title={t("noRecordsYet")}>
            <p className="text-sm leading-6 text-coffee-secondary">{t("searchRecords")}</p>
          </SectionCard>
        )}

        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <article key={record.id} className="rounded-lg border border-coffee-border bg-coffee-card p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-coffee-accent">{record.roasteryName}</p>
                  <h2 className="mt-1 text-lg font-semibold leading-snug text-coffee-primary">{record.beanName}</h2>
                  <p className="mt-1 text-sm text-coffee-secondary">
                  {new Date(record.createdAt).toLocaleDateString()} / {t(record.mode)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="기록 삭제"
                  onClick={() => removeRecord(record.id)}
                  className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-coffee-border text-coffee-secondary"
                >
                  <Trash2 size={17} />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {record.descriptors.map((descriptor) => (
                  <span
                    key={descriptor}
                    className="rounded-lg border border-coffee-border bg-coffee-background px-3 py-1.5 text-xs font-medium text-coffee-secondary"
                  >
                    {descriptor}
                  </span>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  [t("aroma"), record.scores.aroma],
                  [t("acidity"), record.scores.acidity],
                  [
                    record.mode === "professional" && record.professional?.finalScore
                      ? t("finalScore")
                      : t("overall"),
                    record.mode === "professional" && record.professional?.finalScore
                      ? record.professional.finalScore
                      : record.scores.overall
                  ]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-coffee-background p-3">
                    <p className="text-xs text-coffee-secondary">{label}</p>
                    <p className="mt-1 text-lg font-semibold text-coffee-primary">{Number(value).toFixed(1)}</p>
                  </div>
                ))}
              </div>
              {record.memo && (
                <div className="mt-4 rounded-lg bg-coffee-background p-3">
                  <p className="text-xs font-semibold text-coffee-secondary">{t("memoPreview")}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-coffee-primary">{record.memo}</p>
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href={`/sensory/${record.id}`}
                  className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-coffee-dark px-3 text-sm font-semibold text-white"
                >
                  <Eye size={16} />
                  {t("viewRecord")}
                </Link>
                {record.mode === "professional" ? (
                  <Link
                    href={`/sensory/${record.id}/print`}
                    className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-coffee-border text-sm font-semibold text-coffee-primary"
                  >
                    <Printer size={16} />
                    {t("printRecord")}
                  </Link>
                ) : (
                  <Link
                    href={`/beans/${record.beanId}`}
                    className="focus-ring inline-flex h-11 items-center justify-center rounded-lg border border-coffee-border text-sm font-semibold text-coffee-primary"
                  >
                    {t("openBean")}
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
