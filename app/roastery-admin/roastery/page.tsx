"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { RoasteryAdminGate } from "@/components/RoasteryAdminGate";
import { RoasteryLogo } from "@/components/RoasteryLogo";
import { SectionCard } from "@/components/SectionCard";
import { roasteries } from "@/data/roasteries";
import { getLocalizedText } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

export default function RoasteryAdminProfilePage() {
  const { locale, t } = useLocale();

  return (
    <RoasteryAdminGate>
      <PageHeader
        title={t("roasteryProfile")}
        eyebrow={t("roasteryAdmin")}
        description={t("roasteryProfileDescription")}
        backHref="/roastery-admin/dashboard"
      />
      <div className="space-y-4 px-5">
        {roasteries.map((roastery) => (
          <SectionCard key={roastery.id}>
            <div className="flex items-start gap-4">
              <RoasteryLogo
                name={roastery.name}
                logoUrl={roastery.logoUrl}
                logoAlt={roastery.logoAlt}
                logoStatus={roastery.logoStatus}
              />
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-coffee-primary">{getLocalizedText(roastery.name, locale)}</h2>
                <p className="mt-1 text-sm leading-6 text-coffee-secondary">
                  {getLocalizedText(roastery.description, locale)}
                </p>
              </div>
            </div>
            <Link
              href={`/roasteries/${roastery.id}`}
              className="focus-ring mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg border border-coffee-border bg-coffee-card px-3 text-sm font-semibold text-coffee-primary"
            >
              {t("publicPreview")}
            </Link>
          </SectionCard>
        ))}
      </div>
    </RoasteryAdminGate>
  );
}
