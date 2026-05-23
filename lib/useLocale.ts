"use client";

import { useEffect, useMemo, useState } from "react";
import { translations } from "@/data/translations";
import { defaultLocale, detectLocale, getLocalizedText, setLocale, type Locale } from "@/lib/i18n";

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const detected = detectLocale();
    setLocaleState(detected);
    document.documentElement.lang = detected;

    const syncLocale = () => setLocaleState(detectLocale());
    const handleLocaleChange = (event: Event) => {
      const next = (event as CustomEvent<Locale>).detail;
      setLocaleState(next ?? detectLocale());
    };

    window.addEventListener("storage", syncLocale);
    window.addEventListener("coffeeos:locale-change", handleLocaleChange);

    return () => {
      window.removeEventListener("storage", syncLocale);
      window.removeEventListener("coffeeos:locale-change", handleLocaleChange);
    };
  }, []);

  const t = useMemo(
    () => (key: keyof typeof translations) => getLocalizedText(translations[key], locale),
    [locale]
  );

  return {
    locale,
    setLocale,
    t
  };
}

