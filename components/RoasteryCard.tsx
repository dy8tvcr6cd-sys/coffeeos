"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Globe } from "lucide-react";
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
  const description = getLocalizedText(roastery.description, locale);
  const registeredBeans = beans.slice(0, 2);

  return (
    <motion.article
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18 }}
      className="rounded-lg border border-coffee-border bg-coffee-card shadow-soft"
    >
      <div className="p-5">
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
        </div>
        <p className="mt-4 text-sm leading-6 text-coffee-secondary">{description}</p>

        <div className="mt-4 rounded-lg bg-coffee-background p-3">
          <p className="text-xs font-semibold uppercase text-coffee-secondary">{t("registeredBeans")}</p>
          {registeredBeans.length ? (
            <div className="mt-2 grid gap-2">
              {registeredBeans.map((bean) => (
                <Link
                  key={bean.id}
                  href={`/beans/${bean.id}`}
                  className="focus-ring rounded-lg bg-coffee-card px-3 py-2 text-sm font-semibold leading-5 text-coffee-primary"
                >
                  {getLocalizedText(bean.name, locale)}
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-coffee-secondary">{t("noBeansListed")}</p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-coffee-border pt-4">
          {roastery.officialWebsiteUrl ? (
            <a
              href={roastery.officialWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-card px-3 text-sm font-semibold text-coffee-primary"
            >
              <Globe size={15} />
              {t("officialWebsite")}
              <ExternalLink size={13} />
            </a>
          ) : (
            <span className="inline-flex h-11 items-center justify-center rounded-lg border border-coffee-border bg-coffee-background px-3 text-sm font-semibold text-coffee-secondary">
              {t("officialWebsite")}
            </span>
          )}
          <Link
            href={`/roasteries/${roastery.id}`}
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-coffee-dark px-3 text-sm font-semibold text-white"
          >
            {t("viewRoastery")}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
