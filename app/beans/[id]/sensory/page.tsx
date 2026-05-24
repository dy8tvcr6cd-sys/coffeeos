"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Timer } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { SensoryForm } from "@/components/SensoryForm";
import { getBeanById } from "@/data/beans";
import { getLocalizedText } from "@/lib/i18n";
import { getBeanByIdClient, getSensoryRecords } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { Bean } from "@/types/bean";
import type { SensoryRecord } from "@/types/sensory";

export default function SensoryPage() {
  const { locale, t } = useLocale();
  const params = useParams<{ id: string }>();
  const [clientBean, setClientBean] = useState<Bean | undefined>();
  const [records, setRecords] = useState<SensoryRecord[]>([]);

  useEffect(() => {
    setClientBean(getBeanByIdClient(params.id));
    setRecords(getSensoryRecords().filter((record) => record.beanId === params.id));
  }, [params.id]);

  const bean = clientBean ?? getBeanById(params.id);

  if (!bean) {
    return (
      <>
        <PageHeader title={t("pageNotFound")} backHref="/beans" />
        <div className="px-5">
          <Link
            href="/beans"
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {t("beans")}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={t("sensoryRecord")}
        eyebrow={getLocalizedText(bean.name, locale)}
        description={t("archiveDescription")}
        backHref={`/beans/${bean.id}`}
        action={
          <Link
            href={`/beans/${bean.id}/brew`}
            aria-label={t("timer")}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-coffee-border bg-coffee-card text-coffee-primary"
          >
            <Timer size={18} />
          </Link>
        }
      />
      <div className="space-y-5 px-5">
        <SectionCard title={t("savedSensoryRecords")}>
          {records.length ? (
            <div className="grid gap-2">
              {records.map((record) => (
                <Link
                  key={record.id}
                  href={`/sensory/${record.id}`}
                  className="focus-ring rounded-lg border border-coffee-border bg-coffee-background p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-coffee-primary">
                        {new Date(record.createdAt).toLocaleDateString("ko-KR")} · {t(record.mode)}
                      </p>
                      <p className="mt-1 text-xs text-coffee-secondary">
                        {record.memo ? record.memo.slice(0, 48) : t("memoPreview")}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-coffee-accent">
                      {record.scores.overall.toFixed(1)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-coffee-background p-4 text-sm leading-6 text-coffee-secondary">
              {t("noRecordsYet")}
            </p>
          )}
        </SectionCard>

        <SectionCard title={t("newSensoryRecord")}>
          <p className="text-sm leading-6 text-coffee-secondary">{t("archiveDescription")}</p>
        </SectionCard>
        <SensoryForm bean={bean} />
      </div>
    </>
  );
}
