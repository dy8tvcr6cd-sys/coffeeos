"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Timer } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SensoryForm } from "@/components/SensoryForm";
import { getLocalizedText } from "@/lib/i18n";
import { getBeanByIdClient } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { Bean } from "@/types/bean";

export default function SensoryPage() {
  const { locale, t } = useLocale();
  const params = useParams<{ id: string }>();
  const [bean, setBean] = useState<Bean | undefined>();

  useEffect(() => {
    setBean(getBeanByIdClient(params.id));
  }, [params.id]);

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
      <div className="px-5">
        <SensoryForm bean={bean} />
      </div>
    </>
  );
}
