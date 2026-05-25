"use client";

import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { SectionCard } from "@/components/SectionCard";
import { useLocale } from "@/lib/useLocale";

type AuthPromptProps = {
  returnTo?: string;
  onLater?: () => void;
};

export function AuthPrompt({ returnTo, onLater }: AuthPromptProps) {
  const { t } = useLocale();
  const next = returnTo ?? (typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/");
  const query = `?returnTo=${encodeURIComponent(next)}`;

  return (
    <SectionCard title={t("loginRequiredToSave")}>
      <div className="flex items-start gap-3 rounded-lg bg-coffee-background p-4">
        <LockKeyhole size={18} className="mt-0.5 shrink-0 text-coffee-accent" />
        <p className="text-sm leading-6 text-coffee-secondary">{t("loginRequiredToSaveDescription")}</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Link
          href={`/login${query}`}
          className="focus-ring inline-flex h-11 items-center justify-center rounded-lg bg-coffee-dark px-3 text-sm font-semibold text-white"
        >
          {t("login")}
        </Link>
        <Link
          href={`/signup${query}`}
          className="focus-ring inline-flex h-11 items-center justify-center rounded-lg border border-coffee-border bg-coffee-card px-3 text-sm font-semibold text-coffee-primary"
        >
          {t("signup")}
        </Link>
        {onLater ? (
          <button
            type="button"
            onClick={onLater}
            className="focus-ring inline-flex h-11 items-center justify-center rounded-lg border border-coffee-border bg-coffee-card px-3 text-sm font-semibold text-coffee-primary"
          >
            {t("continueLater")}
          </button>
        ) : (
          <Link
            href="/"
            className="focus-ring inline-flex h-11 items-center justify-center rounded-lg border border-coffee-border bg-coffee-card px-3 text-sm font-semibold text-coffee-primary"
          >
            {t("continueLater")}
          </Link>
        )}
      </div>
    </SectionCard>
  );
}
