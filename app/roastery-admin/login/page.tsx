"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { ROASTERY_ADMIN_SESSION_KEY } from "@/components/RoasteryAdminGate";
import { useLocale } from "@/lib/useLocale";

export default function RoasteryAdminLoginPage() {
  const router = useRouter();
  const { t } = useLocale();

  function enterAdmin() {
    window.localStorage.setItem(ROASTERY_ADMIN_SESSION_KEY, "active");
    router.push("/roastery-admin/dashboard");
  }

  return (
    <>
      <PageHeader
        title={t("roasteryAdminLogin")}
        eyebrow={t("roasteryAdmin")}
        description={t("roasteryAdminLoginDescription")}
        backHref="/"
      />
      <div className="space-y-5 px-5">
        <SectionCard title={t("adminAccessRequired")}>
          <div className="grid place-items-center rounded-lg bg-coffee-background p-6 text-coffee-secondary">
            <LockKeyhole size={28} />
            <p className="mt-3 text-center text-sm leading-6">{t("adminAccessDescription")}</p>
          </div>
          <button
            type="button"
            onClick={enterAdmin}
            className="focus-ring mt-4 inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {t("enterRoasteryAdmin")}
          </button>
          <Link
            href="/"
            className="focus-ring mt-2 inline-flex h-12 w-full items-center justify-center rounded-lg border border-coffee-border bg-coffee-card px-4 text-sm font-semibold text-coffee-primary"
          >
            {t("backToCustomerApp")}
          </Link>
        </SectionCard>
      </div>
    </>
  );
}
