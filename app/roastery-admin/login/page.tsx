"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { canAccessRoasteryAdmin, isSupabaseConfigured, login } from "@/lib/auth";
import { useLocale } from "@/lib/useLocale";

export default function RoasteryAdminLoginPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = login({ email, password });
    if (!result.ok) {
      setError(errorMessage(result.error, t));
      return;
    }
    if (canAccessRoasteryAdmin(result.user.role)) {
      router.push("/roastery-admin/dashboard");
      return;
    }
    if (result.user.role === "pending_roastery") {
      setPending(true);
      return;
    }
    setError(t("roasteryAdminOnlyDescription"));
  }

  return (
    <>
      <PageHeader
        title={t("roasteryAdminLogin")}
        eyebrow={t("roasteryAdmin")}
        description={t("roasteryAdminLoginDescription")}
        backHref="/"
      />
      <form onSubmit={submit} className="space-y-5 px-5">
        {!isSupabaseConfigured() && (
          <SectionCard title={t("localPrototypeAuth")}>
            <p className="text-sm leading-6 text-coffee-secondary">{t("localPrototypeAuthDescription")}</p>
          </SectionCard>
        )}

        <SectionCard title={t("adminAccessRequired")}>
          <div className="grid place-items-center rounded-lg bg-coffee-background p-6 text-coffee-secondary">
            <LockKeyhole size={28} />
            <p className="mt-3 text-center text-sm leading-6">{t("adminAccessDescription")}</p>
          </div>
          <div className="mt-4 grid gap-3">
            <Field label={t("email")} type="email" value={email} onChange={setEmail} />
            <Field label={t("password")} type="password" value={password} onChange={setPassword} />
          </div>
          {pending && (
            <p className="mt-4 rounded-lg bg-coffee-background p-3 text-sm font-semibold leading-6 text-coffee-secondary">
              {t("adminApprovalPending")}
            </p>
          )}
          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <button
            type="submit"
            className="focus-ring mt-4 inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {t("login")}
          </button>
          <Link
            href="/roastery-admin/signup"
            className="focus-ring mt-2 inline-flex h-12 w-full items-center justify-center rounded-lg border border-coffee-border bg-coffee-card px-4 text-sm font-semibold text-coffee-primary"
          >
            {t("roasteryAdminSignup")}
          </Link>
          <Link
            href="/"
            className="focus-ring mt-2 inline-flex h-12 w-full items-center justify-center rounded-lg border border-coffee-border bg-coffee-card px-4 text-sm font-semibold text-coffee-secondary"
          >
            {t("backToCustomerApp")}
          </Link>
        </SectionCard>
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
    <label className="block text-left">
      <span className="mb-2 block text-sm font-semibold text-coffee-primary">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className="focus-ring h-12 w-full rounded-lg border border-coffee-border bg-coffee-background px-3 text-base text-coffee-primary"
      />
    </label>
  );
}

function errorMessage(error: string, t: (key: keyof typeof import("@/data/translations").translations) => string) {
  const key = error as keyof typeof import("@/data/translations").translations;
  return t(key) || t("signupFailed");
}
