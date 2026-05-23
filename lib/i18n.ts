export const supportedLocales = ["ko", "en", "ja"] as const;
export type Locale = (typeof supportedLocales)[number];

export type LocalizedText = {
  ko: string;
  en: string;
  ja: string;
};

export const defaultLocale: Locale = "ko";

const localeKey = "coffeeos_locale";

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function getLocalizedText(
  text: LocalizedText | string | null | undefined,
  locale: Locale
): string {
  if (!text) {
    return "";
  }
  if (typeof text === "string") {
    return text;
  }
  return text[locale] || text.ko || text.en || "";
}

export function detectLocale(): Locale {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  const stored = window.localStorage.getItem(localeKey);
  if (isSupportedLocale(stored)) {
    return stored;
  }

  const browserLocale = window.navigator.language.slice(0, 2);
  if (isSupportedLocale(browserLocale)) {
    return browserLocale;
  }

  return defaultLocale;
}

export function setLocale(locale: Locale) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(localeKey, locale);
  document.documentElement.lang = locale;
  window.dispatchEvent(new CustomEvent("coffeeos:locale-change", { detail: locale }));
}

export function getCurrentLocale(): Locale {
  return detectLocale();
}

