"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { deleteSensoryRecord, getSensoryRecords } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { SensoryRecord } from "@/types/sensory";

export default function ArchivePage() {
  const { t } = useLocale();
  const [records, setRecords] = useState<SensoryRecord[]>([]);

  useEffect(() => {
    setRecords(getSensoryRecords());
  }, []);

  const averageOverall = useMemo(() => {
    if (!records.length) {
      return "0.0";
    }
    const total = records.reduce((sum, record) => sum + record.scores.overall, 0);
    return (total / records.length).toFixed(1);
  }, [records]);

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
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-coffee-border bg-coffee-card p-4 shadow-soft">
            <p className="text-2xl font-semibold text-coffee-primary">{records.length}</p>
            <p className="mt-1 text-sm text-coffee-secondary">{t("records")}</p>
          </div>
          <div className="rounded-lg border border-coffee-border bg-coffee-card p-4 shadow-soft">
            <p className="text-2xl font-semibold text-coffee-primary">{averageOverall}</p>
            <p className="mt-1 text-sm text-coffee-secondary">{t("avgOverall")}</p>
          </div>
        </div>

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

        <div className="space-y-4">
          {records.map((record) => (
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
                  aria-label="Delete record"
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
                  [t("overall"), record.scores.overall]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-coffee-background p-3">
                    <p className="text-xs text-coffee-secondary">{label}</p>
                    <p className="mt-1 text-lg font-semibold text-coffee-primary">{Number(value).toFixed(1)}</p>
                  </div>
                ))}
              </div>
              {record.memo && <p className="mt-4 text-sm leading-6 text-coffee-secondary">{record.memo}</p>}
              <Link
                href={`/beans/${record.beanId}`}
                className="focus-ring mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg border border-coffee-border text-sm font-semibold text-coffee-primary"
              >
                {t("openBean")}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
