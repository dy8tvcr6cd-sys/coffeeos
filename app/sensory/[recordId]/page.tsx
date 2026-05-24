"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Coffee, Printer } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
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

export default function SensoryRecordDetailPage() {
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
    return (
      <PageHeader
        title={t("sensoryDetail")}
        eyebrow={t("sensoryRecord")}
        description={t("archiveDescription")}
        backHref="/archive"
      />
    );
  }

  if (!record) {
    return (
      <>
        <PageHeader
          title={t("pageNotFound")}
          eyebrow={t("sensoryRecord")}
          description={t("noRecordsYet")}
          backHref="/archive"
        />
        <div className="px-5">
          <Link
            href="/archive"
            className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            {t("viewArchive")}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={record.beanName}
        eyebrow={t("sensoryDetail")}
        description={`${record.roasteryName} · ${new Date(record.createdAt).toLocaleDateString()}`}
        backHref="/archive"
      />
      <div className="space-y-5 px-5">
        <SectionCard title={t("sensoryMode")}>
          <div className="grid grid-cols-2 gap-2">
            <InfoTile label={t("roastery")} value={record.roasteryName} />
            <InfoTile label={t("sensoryMode")} value={t(record.mode)} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href={`/beans/${record.beanId}`}
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-background px-3 text-sm font-semibold text-coffee-primary"
            >
              <Coffee size={16} />
              {t("openBean")}
            </Link>
            {record.mode === "professional" && (
              <Link
                href={`/sensory/${record.id}/print`}
                className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-coffee-dark px-3 text-sm font-semibold text-white"
              >
                <Printer size={16} />
                {t("printRecord")}
              </Link>
            )}
          </div>
        </SectionCard>

        {!!record.descriptors.length && (
          <SectionCard title={record.mode === "professional" ? t("cvaDescriptors") : t("simpleDescriptors")}>
            <div className="flex flex-wrap gap-2">
              {record.descriptors.map((descriptor) => (
                <span
                  key={descriptor}
                  className="rounded-lg border border-coffee-border bg-coffee-background px-3 py-1.5 text-xs font-semibold text-coffee-secondary"
                >
                  {descriptor}
                </span>
              ))}
            </div>
          </SectionCard>
        )}

        <SectionCard title={t("score")}>
          <div className="grid grid-cols-2 gap-2">
            {visibleScores.map((key) => (
              <InfoTile key={key} label={t(key)} value={(record.scores[key] ?? 0).toFixed(1)} strong />
            ))}
          </div>
        </SectionCard>

        {record.professional && (
          <SectionCard title={t("professional")}>
            <div className="grid gap-2">
              <InfoTile label={t("sampleInformation")} value={record.professional.sampleInfo || "-"} />
              <div className="grid grid-cols-2 gap-2">
                <InfoTile label={t("sampleNumber")} value={record.professional.sampleNumber || "-"} />
                <InfoTile label={t("cuppingDate")} value={record.professional.cuppingDate || "-"} />
              </div>
              <InfoTile label={t("evaluator")} value={record.professional.evaluator || "-"} />
              <InfoTile label={t("dryAroma")} value={record.professional.dryAroma || "-"} />
              <InfoTile label={t("wetAroma")} value={record.professional.wetAroma || "-"} />
              <InfoTile label={t("flavorDescription")} value={record.professional.flavorDescription || "-"} />
              <InfoTile label={t("defects")} value={record.professional.defects || "-"} />
              <InfoTile label={t("finalSummary")} value={record.professional.finalSummary || "-"} />
              <InfoTile label={t("finalScore")} value={`${record.professional.finalScore ?? "-"}`} strong />
            </div>
          </SectionCard>
        )}

        {record.memo && (
          <SectionCard title={t("memo")}>
            <p className="text-sm leading-6 text-coffee-secondary">{record.memo}</p>
          </SectionCard>
        )}
      </div>
    </>
  );
}

function InfoTile({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-lg bg-coffee-background p-3">
      <p className="text-xs font-semibold text-coffee-secondary">{label}</p>
      <p className={`mt-1 leading-6 text-coffee-primary ${strong ? "text-lg font-semibold" : "text-sm font-medium"}`}>
        {value}
      </p>
    </div>
  );
}
