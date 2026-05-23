"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import type { Bean } from "@/types/bean";
import { getRoasteryById } from "@/data/roasteries";
import { formatPrice } from "@/lib/format";
import { getLocalizedText } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";
import { RoasteryLogo } from "@/components/RoasteryLogo";
import { customerText } from "@/lib/customerDisplay";

type BeanCardProps = {
  bean: Bean;
  compact?: boolean;
};

export function BeanCard({ bean, compact = false }: BeanCardProps) {
  const { locale, t } = useLocale();
  const roastery = getRoasteryById(bean.roasteryId);
  const topNotes = bean.cupNotes.flatMap((moment) => moment.notes).slice(0, 3);
  const beanName = getLocalizedText(bean.name, locale);
  const roasteryName = getLocalizedText(roastery?.name, locale);
  const country = getLocalizedText(bean.country, locale);
  const region = getLocalizedText(bean.region, locale);
  const process = getLocalizedText(bean.process, locale);
  const missing = t("registeredSoon");

  return (
    <motion.article
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18 }}
      className="rounded-lg border border-coffee-border bg-coffee-card shadow-soft"
    >
      <Link href={`/beans/${bean.id}`} className="block p-5">
        <div className="flex items-start justify-between gap-4">
          {roastery && (
            <RoasteryLogo
              name={roastery.name}
              logoUrl={roastery.logoUrl}
              logoAlt={roastery.logoAlt}
              logoStatus={roastery.logoStatus}
              size="sm"
            />
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-coffee-accent">
              {roasteryName || "CoffeeOS"}
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-snug text-coffee-primary">{beanName}</h2>
          </div>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-coffee-border text-coffee-secondary">
            <ArrowRight size={17} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-coffee-secondary">
          <MapPin size={15} />
          <span>
            {[customerText(country, ""), customerText(region, "")].filter(Boolean).join(", ") || missing}
          </span>
        </div>
        {!compact && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-coffee-background p-3">
              <p className="text-coffee-secondary">{t("process")}</p>
              <p className="mt-1 font-semibold text-coffee-primary">{customerText(process, missing)}</p>
            </div>
            <div className="rounded-lg bg-coffee-background p-3">
              <p className="text-coffee-secondary">{t("roastLevel")}</p>
              <p className="mt-1 font-semibold text-coffee-primary">{customerText(bean.roastLevel, missing)}</p>
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {topNotes.map((note) => (
            <span
              key={getLocalizedText(note.name, "ko")}
              className="rounded-lg border border-coffee-border bg-coffee-background px-3 py-1.5 text-xs font-medium text-coffee-secondary"
            >
              {customerText(getLocalizedText(note.name, locale), missing)}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-coffee-border pt-4">
          <span className="text-sm text-coffee-secondary">{customerText(bean.variety, missing)}</span>
          <span className="text-sm font-semibold text-coffee-primary">
            {bean.price ? formatPrice(bean.price) : missing}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
