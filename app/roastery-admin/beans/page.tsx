"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { BeanCard } from "@/components/BeanCard";
import { PageHeader } from "@/components/PageHeader";
import { RoasteryAdminGate } from "@/components/RoasteryAdminGate";
import { SectionCard } from "@/components/SectionCard";
import { getAllBeansClient } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { Bean } from "@/types/bean";

export default function RoasteryAdminBeansPage() {
  const { t } = useLocale();
  const [beans, setBeans] = useState<Bean[]>([]);

  useEffect(() => {
    setBeans(getAllBeansClient());
  }, []);

  return (
    <RoasteryAdminGate>
      <PageHeader
        title={t("registeredBeanManagement")}
        eyebrow={t("roasteryAdmin")}
        description={t("registeredBeanManagementDescription")}
        backHref="/roastery-admin/dashboard"
      />
      <div className="space-y-5 px-5">
        <Link
          href="/roastery-admin/beans/new"
          className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
        >
          <Plus size={16} />
          {t("createNewBean")}
        </Link>

        {beans.length ? (
          <div className="space-y-4">
            {beans.map((bean) => (
              <BeanCard key={bean.id} bean={bean} />
            ))}
          </div>
        ) : (
          <SectionCard title={t("noBeansListed")}>
            <p className="text-sm leading-6 text-coffee-secondary">{t("adminDescription")}</p>
          </SectionCard>
        )}
      </div>
    </RoasteryAdminGate>
  );
}
