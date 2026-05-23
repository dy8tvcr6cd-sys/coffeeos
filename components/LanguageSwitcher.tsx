"use client";

import { Globe2 } from "lucide-react";
import { supportedLocales, type Locale } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

const labels: Record<Locale, string> = {
  ko: "KR",
  en: "EN",
  ja: "JP"
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-coffee-border bg-coffee-card p-1 shadow-sm">
      <Globe2 size={15} className="ml-2 text-coffee-secondary" />
      {supportedLocales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          className={`focus-ring h-8 rounded-lg px-2 text-xs font-bold transition ${
            locale === item ? "bg-coffee-dark text-white" : "text-coffee-secondary"
          }`}
          aria-pressed={locale === item}
        >
          {labels[item]}
        </button>
      ))}
    </div>
  );
}
