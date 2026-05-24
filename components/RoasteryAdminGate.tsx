"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { useLocale } from "@/lib/useLocale";

export const ROASTERY_ADMIN_SESSION_KEY = "coffeeos_roastery_admin_session";

export function RoasteryAdminGate({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAllowed(window.localStorage.getItem(ROASTERY_ADMIN_SESSION_KEY) === "active");
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <PageHeader
        title={t("roasteryAdmin")}
        eyebrow={t("adminAccessRequired")}
        description={t("adminAccessDescription")}
        backHref="/"
      />
    );
  }

  if (!allowed) {
    return (
      <>
        <PageHeader
          title={t("roasteryAdmin")}
          eyebrow={t("adminAccessRequired")}
          description={t("adminAccessDescription")}
          backHref="/"
        />
        <div className="px-5">
          <SectionCard title={t("roasteryAdminLogin")}>
            <div className="grid place-items-center rounded-lg bg-coffee-background p-5 text-coffee-secondary">
              <LockKeyhole size={24} />
              <p className="mt-3 text-center text-sm leading-6">{t("roasteryAdminLoginDescription")}</p>
            </div>
            <Link
              href="/roastery-admin/login"
              className="focus-ring mt-4 inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
            >
              {t("goToLogin")}
            </Link>
          </SectionCard>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
