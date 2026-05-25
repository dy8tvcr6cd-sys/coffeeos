"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { createRoasterySignupRequest, isSupabaseConfigured } from "@/lib/auth";
import { useLocale } from "@/lib/useLocale";
import type { RoasteryAccessRequest } from "@/types/user";

type RoasterySignupForm = {
  roasteryName: string;
  managerName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contact: string;
  officialWebsite: string;
  instagram: string;
  roleInRoastery: RoasteryAccessRequest["roleInRoastery"];
};

const initialForm: RoasterySignupForm = {
  roasteryName: "",
  managerName: "",
  email: "",
  password: "",
  confirmPassword: "",
  contact: "",
  officialWebsite: "",
  instagram: "",
  roleInRoastery: "owner"
};

export default function RoasteryAdminSignupPage() {
  const { t } = useLocale();
  const [form, setForm] = useState<RoasterySignupForm>(initialForm);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function update(field: keyof RoasterySignupForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = createRoasterySignupRequest(form);
    if (!result.ok) {
      setError(errorMessage(result.error, t));
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <PageHeader
          title={t("roasterySignupSubmitted")}
          eyebrow={t("roasteryAdminSignup")}
          description={t("adminApprovalPending")}
          backHref="/roastery-admin/login"
        />
        <div className="space-y-3 px-5">
          <Link
            href="/account"
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {t("account")}
          </Link>
          <Link
            href="/"
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg border border-coffee-border bg-coffee-card px-4 text-sm font-semibold text-coffee-primary"
          >
            {t("backToCustomerApp")}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={t("roasteryAdminSignup")}
        eyebrow={t("roasteryAdmin")}
        description={t("roasteryAdminSignupDescription")}
        backHref="/roastery-admin/login"
      />
      <form onSubmit={submit} className="space-y-5 px-5">
        {!isSupabaseConfigured() && (
          <SectionCard title={t("localPrototypeAuth")}>
            <p className="text-sm leading-6 text-coffee-secondary">{t("localPrototypeAuthDescription")}</p>
          </SectionCard>
        )}

        <SectionCard title={t("roasteryAdminSignup")}>
          <div className="grid gap-3">
            <Field label={t("roasteryName")} value={form.roasteryName} onChange={(value) => update("roasteryName", value)} />
            <Field label={t("managerName")} value={form.managerName} onChange={(value) => update("managerName", value)} />
            <Field label={t("email")} type="email" value={form.email} onChange={(value) => update("email", value)} />
            <Field label={t("password")} type="password" value={form.password} onChange={(value) => update("password", value)} />
            <Field
              label={t("confirmPassword")}
              type="password"
              value={form.confirmPassword}
              onChange={(value) => update("confirmPassword", value)}
            />
            <Field label={t("contact")} value={form.contact} onChange={(value) => update("contact", value)} />
            <Field label={t("officialWebsite")} value={form.officialWebsite} onChange={(value) => update("officialWebsite", value)} />
            <Field label={t("instagram")} value={form.instagram} onChange={(value) => update("instagram", value)} />
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-coffee-primary">{t("roleInRoastery")}</span>
              <select
                value={form.roleInRoastery}
                onChange={(event) => update("roleInRoastery", event.target.value)}
                className="focus-ring h-12 w-full rounded-lg border border-coffee-border bg-coffee-background px-3 text-base text-coffee-primary"
              >
                <option value="owner">{t("owner")}</option>
                <option value="staff">{t("staff")}</option>
                <option value="bean_manager">{t("beanManager")}</option>
              </select>
            </label>
          </div>
        </SectionCard>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

        <button
          type="submit"
          className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
        >
          {t("roasteryAdminSignup")}
        </button>
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
