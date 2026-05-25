"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { createCustomerAccount, isSupabaseConfigured } from "@/lib/auth";
import { useLocale } from "@/lib/useLocale";

type SignupForm = {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
};

const initialForm: SignupForm = {
  email: "",
  password: "",
  confirmPassword: "",
  displayName: ""
};

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [form, setForm] = useState<SignupForm>(initialForm);
  const [error, setError] = useState("");
  const [nextPath, setNextPath] = useState("/account");

  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("next");
    setNextPath(next || "/account");
  }, []);

  function update(field: keyof SignupForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = createCustomerAccount(form);
    if (!result.ok) {
      setError(errorMessage(result.error, t));
      return;
    }
    router.push(nextPath);
  }

  return (
    <>
      <PageHeader
        title={t("startCoffeeOS")}
        eyebrow={t("signup")}
        description={t("signupDescription")}
        backHref="/"
      />
      <form onSubmit={submit} className="space-y-5 px-5">
        {!isSupabaseConfigured() && (
          <SectionCard title={t("localPrototypeAuth")}>
            <p className="text-sm leading-6 text-coffee-secondary">{t("localPrototypeAuthDescription")}</p>
          </SectionCard>
        )}

        <SectionCard title={t("createAccount")}>
          <div className="grid gap-3">
            <Field label={t("email")} type="email" value={form.email} onChange={(value) => update("email", value)} />
            <Field label={t("password")} type="password" value={form.password} onChange={(value) => update("password", value)} />
            <Field
              label={t("confirmPassword")}
              type="password"
              value={form.confirmPassword}
              onChange={(value) => update("confirmPassword", value)}
            />
            <Field label={t("displayName")} value={form.displayName} onChange={(value) => update("displayName", value)} />
          </div>
        </SectionCard>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

        <div className="grid gap-2">
          <button
            type="submit"
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {t("createAccount")}
          </button>
          <Link
            href={`/login?next=${encodeURIComponent(nextPath)}`}
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg border border-coffee-border bg-coffee-card px-4 text-sm font-semibold text-coffee-primary"
          >
            {t("alreadyHaveAccount")}
          </Link>
          <Link
            href={nextPath === "/account" ? "/" : nextPath}
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg border border-coffee-border bg-coffee-card px-4 text-sm font-semibold text-coffee-secondary"
          >
            {t("continueLater")}
          </Link>
        </div>
      </form>
    </>
  );
}

function Field({
  label,
  value,
  type = "text",
  onChange
}: {
  label: string;
  value: string;
  type?: "text" | "email" | "password";
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-coffee-primary">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-12 w-full rounded-lg border border-coffee-border bg-coffee-background px-3 text-base text-coffee-primary"
      />
    </label>
  );
}

function errorMessage(error: string, t: (key: keyof typeof import("@/data/translations").translations) => string) {
  const key = error as keyof typeof import("@/data/translations").translations;
  return t(key) || t("signupFailed");
}
