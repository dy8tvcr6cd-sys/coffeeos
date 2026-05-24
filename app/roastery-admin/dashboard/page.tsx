"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Coffee, Eye, QrCode, Store } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { RoasteryAdminGate } from "@/components/RoasteryAdminGate";
import { SectionCard } from "@/components/SectionCard";
import { useLocale } from "@/lib/useLocale";

const adminLinks = [
  { href: "/roastery-admin/beans/new", titleKey: "beanRegistration", descriptionKey: "adminDescription", icon: Coffee },
  { href: "/roastery-admin/beans", titleKey: "registeredBeanManagement", descriptionKey: "registeredBeanManagementDescription", icon: Coffee },
  { href: "/roastery-admin/qr", titleKey: "qrGeneration", descriptionKey: "qrGenerationDescription", icon: QrCode },
  { href: "/roastery-admin/preview", titleKey: "pagePreview", descriptionKey: "previewDescription", icon: Eye },
  { href: "/roastery-admin/roastery", titleKey: "roasteryProfile", descriptionKey: "roasteryProfileDescription", icon: Store }
] as const;

export default function RoasteryAdminDashboardPage() {
  const { t } = useLocale();

  return (
    <RoasteryAdminGate>
      <PageHeader
        title={t("roasteryAdminDashboard")}
        eyebrow={t("roasteryAdmin")}
        description={t("roasteryAdminDashboardDescription")}
        backHref="/roastery-admin/login"
      />
      <div className="space-y-5 px-5">
        <SectionCard title={t("customerExperience")}>
          <p className="text-sm leading-6 text-coffee-secondary">{t("b2b2cLoop")}</p>
        </SectionCard>

        <div className="grid gap-3">
          {adminLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring flex items-center justify-between gap-4 rounded-lg border border-coffee-border bg-coffee-card p-4 shadow-soft"
              >
                <span className="flex min-w-0 items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-coffee-background text-coffee-accent">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-coffee-primary">{t(item.titleKey)}</span>
                    <span className="mt-1 block text-xs leading-5 text-coffee-secondary">{t(item.descriptionKey)}</span>
                  </span>
                </span>
                <ArrowRight size={16} className="shrink-0 text-coffee-secondary" />
              </Link>
            );
          })}
        </div>

        <SectionCard title={t("futureCustomerReactionAnalytics")}>
          <div className="flex items-start gap-3 rounded-lg bg-coffee-background p-4">
            <BarChart3 size={18} className="mt-0.5 shrink-0 text-coffee-accent" />
            <p className="text-sm leading-6 text-coffee-secondary">{t("customerReactionAnalyticsDescription")}</p>
          </div>
        </SectionCard>
      </div>
    </RoasteryAdminGate>
  );
}
