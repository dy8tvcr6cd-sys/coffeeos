"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Roastery } from "@/types/roastery";
import type { Bean } from "@/types/bean";
import { getLocalizedText } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";
import { RoasteryLogo } from "@/components/RoasteryLogo";

type RoasteryCardProps = {
  roastery: Roastery;
  beans: Bean[];
};

export function RoasteryCard({ roastery, beans }: RoasteryCardProps) {
  const { locale, t } = useLocale();
  const name = getLocalizedText(roastery.name, locale);
  const location = getLocalizedText(roastery.location, locale);
  const philosophy = getLocalizedText(roastery.philosophy ?? roastery.description, locale);
  const style = getLocalizedText(roastery.roastingStyle, locale);

  return (
    <motion.article
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18 }}
      className="rounded-lg border border-coffee-border bg-coffee-card shadow-soft"
    >
      <Link href={`/roasteries/${roastery.id}`} className="block p-5">
        <div className="flex items-start justify-between gap-4">
          <RoasteryLogo
            name={roastery.name}
            logoUrl={roastery.logoUrl}
            logoAlt={roastery.logoAlt}
            logoStatus={roastery.logoStatus}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase text-coffee-accent">
              {location}
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-snug text-coffee-primary">{name}</h2>
          </div>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-coffee-border text-coffee-secondary">
            <ArrowRight size={17} />
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-coffee-secondary">{philosophy}</p>
        <div className="mt-4 flex items-center justify-between border-t border-coffee-border pt-4">
          <span className="text-sm text-coffee-secondary">
            {beans.length} {t("beans")}
          </span>
          <span className="text-sm font-semibold text-coffee-primary">{style || t("needsReview")}</span>
        </div>
      </Link>
    </motion.article>
  );
}
