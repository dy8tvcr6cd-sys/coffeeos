"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { RoasteryAdminGate } from "@/components/RoasteryAdminGate";
import { SectionCard } from "@/components/SectionCard";
import { getLocalizedText } from "@/lib/i18n";
import { getAllBeansClient } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { Bean } from "@/types/bean";

export default function RoasteryAdminQrPage() {
  const { locale, t } = useLocale();
  const [beans, setBeans] = useState<Bean[]>([]);
  const [selectedBeanId, setSelectedBeanId] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const nextBeans = getAllBeansClient();
    setBeans(nextBeans);
    setSelectedBeanId(nextBeans[0]?.id ?? "");
  }, []);

  const qrUrl = useMemo(() => {
    if (!selectedBeanId || typeof window === "undefined") {
      return "";
    }
    return `${window.location.origin}/beans/${selectedBeanId}`;
  }, [selectedBeanId]);

  async function copyQrUrl() {
    if (!qrUrl) {
      return;
    }

    await window.navigator.clipboard.writeText(qrUrl);
    setCopied(true);
  }

  return (
    <RoasteryAdminGate>
      <PageHeader
        title={t("qrGeneration")}
        eyebrow={t("roasteryAdmin")}
        description={t("qrGenerationDescription")}
        backHref="/roastery-admin/dashboard"
      />
      <div className="space-y-5 px-5">
        <SectionCard title={t("selectBean")}>
          <select
            value={selectedBeanId}
            onChange={(event) => {
              setSelectedBeanId(event.target.value);
              setCopied(false);
            }}
            className="focus-ring h-12 w-full rounded-lg border border-coffee-border bg-coffee-background px-3 text-base text-coffee-primary"
          >
            {beans.map((bean) => (
              <option key={bean.id} value={bean.id}>
                {getLocalizedText(bean.name, locale)}
              </option>
            ))}
          </select>
        </SectionCard>

        <SectionCard title={t("qrUrl")}>
          <p className="break-all rounded-lg bg-coffee-background p-4 text-sm leading-6 text-coffee-secondary">
            {qrUrl || t("noBeansListed")}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={copyQrUrl}
              disabled={!qrUrl}
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-card px-3 text-sm font-semibold text-coffee-primary disabled:opacity-50"
            >
              <Copy size={16} />
              {copied ? t("saved") : t("copyQrUrl")}
            </button>
            <Link
              href={selectedBeanId ? `/beans/${selectedBeanId}` : "/roastery-admin/beans/new"}
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-coffee-dark px-3 text-sm font-semibold text-white"
            >
              {t("publicPreview")}
              <ExternalLink size={14} />
            </Link>
          </div>
        </SectionCard>
      </div>
    </RoasteryAdminGate>
  );
}
