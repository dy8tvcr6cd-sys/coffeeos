"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, ExternalLink, Globe } from "lucide-react";
import { BeanCard } from "@/components/BeanCard";
import { PageHeader } from "@/components/PageHeader";
import { RoasteryLogo } from "@/components/RoasteryLogo";
import { SectionCard } from "@/components/SectionCard";
import { getRoasteryById } from "@/data/roasteries";
import { customerText } from "@/lib/customerDisplay";
import { getAllBeansClient } from "@/lib/storage";
import type { Bean } from "@/types/bean";
import { getLocalizedText } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

export default function RoasteryDetailPage() {
  const { locale, t } = useLocale();
  const params = useParams<{ id: string }>();
  const roastery = getRoasteryById(params.id);
  const [allBeans, setAllBeans] = useState<Bean[]>([]);

  useEffect(() => {
    setAllBeans(getAllBeansClient());
  }, []);

  const roasteryBeans = useMemo(
    () => allBeans.filter((bean) => bean.roasteryId === params.id),
    [allBeans, params.id]
  );

  if (!roastery) {
    return (
      <>
        <PageHeader title={t("pageNotFound")} backHref="/roasteries" />
        <div className="px-5">
          <Link
            href="/roasteries"
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {t("roasteries")}
          </Link>
        </div>
      </>
    );
  }

  const roasteryName = getLocalizedText(roastery.name, locale);
  const location = customerText(getLocalizedText(roastery.location, locale), t("registeredSoon"));
  const description = getLocalizedText(roastery.description, locale);
  const philosophy = customerText(getLocalizedText(roastery.philosophy, locale), t("registeredSoon"));
  const roastingStyle = customerText(getLocalizedText(roastery.roastingStyle, locale), t("registeredSoon"));
  const hasLinks = Boolean(roastery.officialWebsiteUrl || roastery.purchaseUrl || roastery.b2bInquiryUrl);

  return (
    <>
      <PageHeader
        title={roasteryName}
        eyebrow={location}
        description={description}
        backHref="/roasteries"
      />
      <div className="space-y-5 px-5">
        <SectionCard>
          <div className="flex items-start gap-4">
            <RoasteryLogo
              name={roastery.name}
              logoUrl={roastery.logoUrl}
              logoAlt={roastery.logoAlt}
              logoStatus={roastery.logoStatus}
              size="lg"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-coffee-accent">{location}</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight text-coffee-primary">{roasteryName}</h2>
              <p className="mt-3 text-sm leading-6 text-coffee-secondary">{description}</p>
            </div>
          </div>
          {roastery.officialWebsiteUrl && (
            <a
              href={roastery.officialWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
            >
              <Globe size={16} />
              {t("officialWebsite")}
              <ExternalLink size={14} />
            </a>
          )}
        </SectionCard>

        <SectionCard title={t("about")}>
          <div className="grid gap-3">
            <InfoBlock label={t("philosophy")} value={philosophy} />
            <InfoBlock label={t("roastingStyle")} value={roastingStyle} />
            <InfoBlock label={t("brandIntroduction")} value={description} />
          </div>
        </SectionCard>

        <section className="space-y-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-coffee-primary">{t("registeredBeans")}</h2>
            <Link href="/beans" className="inline-flex items-center gap-1 text-sm font-semibold text-coffee-accent">
              {t("viewAll")}
              <ArrowRight size={15} />
            </Link>
          </div>
          {roasteryBeans.length ? (
            <div className="space-y-4">
              {roasteryBeans.map((bean) => (
                <BeanCard key={bean.id} bean={bean} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-coffee-border bg-coffee-card p-5 text-sm leading-6 text-coffee-secondary shadow-soft">
              {t("noBeansListed")}
            </div>
          )}
        </section>

        <SectionCard title={t("links")}>
          <div className="grid gap-2">
            {roastery.officialWebsiteUrl && (
              <ExternalLinkButton href={roastery.officialWebsiteUrl} label={t("officialWebsite")} />
            )}
            {roastery.purchaseUrl && (
              <ExternalLinkButton href={roastery.purchaseUrl} label={t("purchaseUrl")} />
            )}
            {roastery.b2bInquiryUrl && (
              <ExternalLinkButton href={roastery.b2bInquiryUrl} label="B2B" />
            )}
            {!hasLinks && (
              <p className="rounded-lg bg-coffee-background p-4 text-sm leading-6 text-coffee-secondary">
                {t("registeredSoon")}
              </p>
            )}
          </div>
        </SectionCard>
      </div>
    </>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-coffee-background p-4">
      <p className="text-sm text-coffee-secondary">{label}</p>
      <p className="mt-2 text-base font-semibold leading-7 text-coffee-primary">{value}</p>
    </div>
  );
}

function ExternalLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="focus-ring inline-flex h-12 items-center justify-between gap-3 rounded-lg border border-coffee-border bg-coffee-background px-4 text-sm font-semibold text-coffee-primary"
    >
      <span className="inline-flex items-center gap-2">
        <Globe size={15} />
        {label}
      </span>
      <ExternalLink size={14} />
    </a>
  );
}
