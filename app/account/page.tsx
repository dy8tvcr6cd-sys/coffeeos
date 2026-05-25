"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { AuthPrompt } from "@/components/AuthPrompt";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { canAccessRoasteryAdmin, getCurrentUser, logout } from "@/lib/auth";
import { getBrewLogs, getSavedRecipes, getSensoryRecords } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";
import type { UserProfile } from "@/types/user";

export default function AccountPage() {
  const { t } = useLocale();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [counts, setCounts] = useState({ sensory: 0, brewLogs: 0, recipes: 0 });

  useEffect(() => {
    setUser(getCurrentUser());
    setCounts({
      sensory: getSensoryRecords().length,
      brewLogs: getBrewLogs().length,
      recipes: getSavedRecipes().length
    });
  }, []);

  function signOut() {
    logout();
    setUser(null);
  }

  if (!user) {
    return (
      <>
        <PageHeader title={t("account")} eyebrow="CoffeeOS" description={t("accountDescription")} backHref="/" />
        <div className="px-5">
          <AuthPrompt returnTo="/account" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={t("account")} eyebrow="CoffeeOS" description={t("accountDescription")} backHref="/" />
      <div className="space-y-5 px-5">
        <SectionCard title={user.displayName || user.email}>
          <div className="grid gap-2">
            <InfoTile label={t("email")} value={user.email} />
            <InfoTile label={t("displayName")} value={user.displayName || "-"} />
            <InfoTile label={t("role")} value={roleLabel(user.role, t)} />
          </div>
        </SectionCard>

        {user.role === "pending_roastery" && (
          <SectionCard title={t("pendingApproval")}>
            <p className="text-sm leading-6 text-coffee-secondary">{t("adminApprovalPending")}</p>
          </SectionCard>
        )}

        <SectionCard title={t("records")}>
          <div className="grid grid-cols-3 gap-2">
            <InfoTile label={t("sensoryRecord")} value={String(counts.sensory)} />
            <InfoTile label={t("newBrewLog")} value={String(counts.brewLogs)} />
            <InfoTile label={t("myRecipes")} value={String(counts.recipes)} />
          </div>
        </SectionCard>

        {canAccessRoasteryAdmin(user.role) && (
          <Link
            href="/roastery-admin/dashboard"
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {t("goToRoasteryAdmin")}
          </Link>
        )}

        <button
          type="button"
          onClick={signOut}
          className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-card px-4 text-sm font-semibold text-coffee-primary"
        >
          <LogOut size={16} />
          {t("logout")}
        </button>
      </div>
    </>
  );
}

function roleLabel(role: UserProfile["role"], t: (key: keyof typeof import("@/data/translations").translations) => string) {
  const labels = {
    customer: "roleCustomer",
    pro: "rolePro",
    pending_roastery: "rolePendingRoastery",
    roastery_owner: "roleRoasteryOwner",
    roastery_staff: "roleRoasteryStaff",
    admin: "roleAdmin"
  } satisfies Record<UserProfile["role"], keyof typeof import("@/data/translations").translations>;

  return t(labels[role]);
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-coffee-background p-3">
      <p className="text-xs font-semibold uppercase text-coffee-secondary">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-5 text-coffee-primary">{value}</p>
    </div>
  );
}
