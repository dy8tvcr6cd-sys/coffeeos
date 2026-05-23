"use client";

import { PageHeader } from "@/components/PageHeader";
import { RoasteryCard } from "@/components/RoasteryCard";
import { beans } from "@/data/beans";
import { roasteries } from "@/data/roasteries";
import { useLocale } from "@/lib/useLocale";

export default function RoasteriesPage() {
  const { t } = useLocale();

  return (
    <>
      <PageHeader
        title={t("roasteries")}
        eyebrow={t("partnerRoasteries")}
        description={t("homeDescription")}
      />
      <div className="space-y-4 px-5">
        {roasteries.map((roastery) => (
          <RoasteryCard
            key={roastery.id}
            roastery={roastery}
            beans={beans.filter((bean) => bean.roasteryId === roastery.id)}
          />
        ))}
      </div>
    </>
  );
}
