"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { canAccessRoasteryAdmin, getCurrentUser } from "@/lib/auth";
import { useLocale } from "@/lib/useLocale";
import type { UserProfile } from "@/types/user";

export function RoasteryAdminGate({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setReady(true);

    const sync = () => setUser(getCurrentUser());
    window.addEventListener("coffeeos:auth-change", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("coffeeos:auth-change", sync);
      window.removeEventListener("storage", sync);
    };
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

  if (!user) {
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
            <div className="mt-4 grid gap-2">
              <Link
                href="/roastery-admin/login"
                className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
              >
                {t("goToLogin")}
              </Link>
              <Link
                href="/roastery-admin/signup"
                className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg border border-coffee-border bg-coffee-card px-4 text-sm font-semibold text-coffee-primary"
              >
                {t("roasteryAdminSignup")}
              </Link>
            </div>
          </SectionCard>
        </div>
      </>
    );
  }

  if (user.role === "pending_roastery") {
    return (
      <>
        <PageHeader
          title={t("pendingApproval")}
          eyebrow={t("roasteryAdmin")}
          description={t("adminApprovalPending")}
          backHref="/"
        />
        <div className="px-5">
          <SectionCard title={t("pendingApproval")}>
            <p className="text-sm leading-6 text-coffee-secondary">{t("adminApprovalPending")}</p>
            <Link
              href="/account"
              className="focus-ring mt-4 inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
            >
              {t("account")}
            </Link>
          </SectionCard>
        </div>
      </>
    );
  }

  if (!canAccessRoasteryAdmin(user.role)) {
    return (
      <>
        <PageHeader
          title={t("adminAccessRequired")}
          eyebrow={t("roasteryAdmin")}
          description={t("roasteryAdminLoginDescription")}
          backHref="/"
        />
        <div className="px-5">
          <SectionCard title={t("roasteryAdminOnly")}>
            <p className="text-sm leading-6 text-coffee-secondary">{t("roasteryAdminOnlyDescription")}</p>
            <Link
              href="/roastery-admin/signup"
              className="focus-ring mt-4 inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
            >
              {t("roasteryAdminSignup")}
            </Link>
          </SectionCard>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
