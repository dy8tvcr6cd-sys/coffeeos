"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Printer } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getSensoryRecords } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { SensoryRecord, SensoryScores } from "@/types/sensory";

const scoreKeys: Array<keyof SensoryScores> = [
  "aroma",
  "flavor",
  "acidity",
  "sweetness",
  "body",
  "balance",
  "aftertaste",
  "overall"
];

export default function SensoryPrintPage() {
  const { t } = useLocale();
  const { recordId } = useParams<{ recordId: string }>();
  const [record, setRecord] = useState<SensoryRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRecord(getSensoryRecords().find((item) => item.id === recordId) ?? null);
    setLoaded(true);
  }, [recordId]);

  const visibleScores = useMemo(
    () => scoreKeys.filter((key) => typeof record?.scores[key] === "number"),
    [record]
  );

  if (!loaded) {
    return <PageHeader title={t("printRecord")} eyebrow={t("sensoryRecord")} backHref="/archive" />;
  }

  if (!record) {
    return (
      <>
        <PageHeader title={t("pageNotFound")} eyebrow={t("sensoryRecord")} backHref="/archive" />
        <div className="px-5 print:hidden">
          <Link
            href="/archive"
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {t("viewArchive")}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="print:hidden">
        <PageHeader
          title={t("printRecord")}
          eyebrow={t("printNativeLayout")}
          description={record.beanName}
          backHref={`/sensory/${record.id}`}
        />
        <div className="px-5">
          <button
            type="button"
            onClick={() => window.print()}
            className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            <Printer size={16} />
            {t("printRecord")}
          </button>
        </div>
      </div>

      <main className="mx-auto mt-6 max-w-[820px] bg-white px-6 pb-16 text-[#181818] print:mt-0 print:max-w-none print:px-0 print:pb-0">
        <section className="rounded-lg border border-coffee-border bg-white p-6 print:border-[#d8d1c8]">
          <div className="flex items-start justify-between gap-4 border-b border-coffee-border pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-coffee-accent">{t("printNativeLayout")}</p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight">{record.beanName}</h1>
              <p className="mt-2 text-sm text-coffee-secondary">
                {record.roasteryName} · {new Date(record.createdAt).toLocaleDateString()} · {t(record.mode)}
              </p>
            </div>
            {record.professional?.finalScore && (
              <div className="rounded-lg border border-coffee-border px-4 py-3 text-right">
                <p className="text-xs font-semibold text-coffee-secondary">{t("finalScore")}</p>
                <p className="mt-1 text-3xl font-semibold">{record.professional.finalScore}</p>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <PrintField label={t("sampleInformation")} value={record.professional?.sampleInfo || record.beanName} />
            <PrintField label={t("sampleNumber")} value={record.professional?.sampleNumber || "-"} />
            <PrintField label={t("evaluator")} value={record.professional?.evaluator || "-"} />
            <PrintField label={t("cuppingDate")} value={record.professional?.cuppingDate || new Date(record.createdAt).toLocaleDateString()} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {visibleScores.map((key) => (
              <PrintField key={key} label={t(key)} value={(record.scores[key] ?? 0).toFixed(1)} />
            ))}
          </div>

          <div className="mt-5 grid gap-3">
            <PrintField label={t("dryAroma")} value={record.professional?.dryAroma || "-"} large />
            <PrintField label={t("wetAroma")} value={record.professional?.wetAroma || "-"} large />
            <PrintField label={t("flavorDescription")} value={record.professional?.flavorDescription || record.descriptors.join(", ") || "-"} large />
            <PrintField label={t("defects")} value={record.professional?.defects || "-"} large />
            <PrintField label={t("finalSummary")} value={record.professional?.finalSummary || record.memo || "-"} large />
          </div>
        </section>
      </main>
    </>
  );
}

function PrintField({ label, value, large = false }: { label: string; value: string; large?: boolean }) {
  return (
    <div className="rounded-lg border border-coffee-border p-3 print:border-[#d8d1c8]">
      <p className="text-xs font-semibold text-coffee-secondary">{label}</p>
      <p className={`mt-1 whitespace-pre-wrap leading-6 ${large ? "min-h-[64px] text-sm" : "text-base font-semibold"}`}>
        {value}
      </p>
    </div>
  );
}
