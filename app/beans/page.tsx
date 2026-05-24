"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BeanCard } from "@/components/BeanCard";
import { PageHeader } from "@/components/PageHeader";
import { beans as staticBeans } from "@/data/beans";
import { roasteries } from "@/data/roasteries";
import { getAllBeansClient } from "@/lib/storage";
import type { Bean } from "@/types/bean";
import { getLocalizedText } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

export default function BeansPage() {
  const { locale, t } = useLocale();
  const [beans, setBeans] = useState<Bean[]>(staticBeans);
  const [query, setQuery] = useState("");
  const [roasteryId, setRoasteryId] = useState("all");

  useEffect(() => {
    setBeans(getAllBeansClient());
  }, []);

  const filteredBeans = useMemo(() => {
    return beans.filter((bean) => {
      const matchesRoastery = roasteryId === "all" || bean.roasteryId === roasteryId;
      const haystack = [
        getLocalizedText(bean.name, locale),
        getLocalizedText(bean.country, locale),
        getLocalizedText(bean.region, locale),
        getLocalizedText(bean.farm, locale),
        bean.variety,
        getLocalizedText(bean.process, locale),
        ...bean.tags
      ]
        .join(" ")
        .toLowerCase();
      return matchesRoastery && haystack.includes(query.toLowerCase());
    });
  }, [beans, locale, query, roasteryId]);

  return (
    <>
      <PageHeader
        title={t("beans")}
        eyebrow={t("beanCatalog")}
        description={t("qrFlowDescription")}
      />
      <div className="space-y-4 px-5">
        <div className="rounded-lg border border-coffee-border bg-coffee-card p-3 shadow-soft">
          <label className="flex items-center gap-2 rounded-lg bg-coffee-background px-3">
            <Search size={17} className="text-coffee-secondary" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`${t("country")}, ${t("process")}, ${t("cupNoteTimeline")}`}
              className="focus-ring h-12 min-w-0 flex-1 bg-transparent text-base text-coffee-primary placeholder:text-coffee-secondary/70"
            />
          </label>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setRoasteryId("all")}
              className={`focus-ring shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold ${
                roasteryId === "all"
                  ? "border-coffee-dark bg-coffee-dark text-white"
                  : "border-coffee-border text-coffee-secondary"
              }`}
            >
              {t("viewAll")}
            </button>
            {roasteries.map((roastery) => (
              <button
                key={roastery.id}
                type="button"
                onClick={() => setRoasteryId(roastery.id)}
                className={`focus-ring shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold ${
                  roasteryId === roastery.id
                    ? "border-coffee-dark bg-coffee-dark text-white"
                    : "border-coffee-border text-coffee-secondary"
                }`}
              >
                {getLocalizedText(roastery.name, locale)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredBeans.map((bean) => (
            <BeanCard key={bean.id} bean={bean} />
          ))}
        </div>
      </div>
    </>
  );
}
