"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { BeanCard } from "@/components/BeanCard";
import { PageHeader } from "@/components/PageHeader";
import { RoasteryAdminGate } from "@/components/RoasteryAdminGate";
import { SectionCard } from "@/components/SectionCard";
import { getAllBeansClient } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { Bean } from "@/types/bean";

export default function RoasteryAdminPreviewPage() {
  const { t } = useLocale();
  const [beans, setBeans] = useState<Bean[]>([]);

  useEffect(() => {
    setBeans(getAllBeansClient());
  }, []);

  return (
    <RoasteryAdminGate>
      <PageHeader
        title={t("pagePreview")}
        eyebrow={t("roasteryAdmin")}
        description={t("previewDescription")}
        backHref="/roastery-admin/dashboard"
      />
      <div className="space-y-4 px-5">
        {beans.length ? (
          beans.map((bean) => (
            <div key={bean.id} className="space-y-2">
              <BeanCard bean={bean} />
              <Link
                href={`/beans/${bean.id}`}
                className="focus-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-card px-3 text-sm font-semibold text-coffee-primary"
              >
                {t("publicPreview")}
                <ExternalLink size={14} />
              </Link>
            </div>
          ))
        ) : (
          <SectionCard title={t("noBeansListed")}>
            <p className="text-sm leading-6 text-coffee-secondary">{t("adminDescription")}</p>
          </SectionCard>
        )}
      </div>
    </RoasteryAdminGate>
  );
}
