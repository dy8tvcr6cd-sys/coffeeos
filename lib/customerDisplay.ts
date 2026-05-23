import type { LocalizedText } from "@/lib/i18n";

const internalMissingValues = new Set([
  "확인 필요",
  "정보 없음",
  "Needs review",
  "Not available",
  "確認が必要",
  "情報なし",
  "unknown"
]);

const internalMissingFragments = [
  "확인 필요",
  "정보 없음",
  "확인되지",
  "확인 전",
  "검증",
  "needs review",
  "not available",
  "not confirmed",
  "until an official",
  "確認が必要",
  "情報なし",
  "確認でき",
  "確認前"
];

export function isInternalMissingValue(value: string | null | undefined) {
  if (!value) {
    return true;
  }

  const trimmed = value.trim();
  const normalized = trimmed.toLowerCase();

  return (
    internalMissingValues.has(trimmed) ||
    internalMissingFragments.some((fragment) => normalized.includes(fragment.toLowerCase()))
  );
}

export function customerText(value: string | null | undefined, fallback: string) {
  if (!value) {
    return fallback;
  }

  const cleaned = value
    .replace(/,\s*(확인 필요|needs review|確認が必要)/gi, "")
    .replace(/\s*(확인 필요|Needs review|確認が必要)\s*/g, "")
    .trim();

  if (cleaned && !isInternalMissingValue(cleaned)) {
    return cleaned;
  }

  return fallback;
}

export function hasLocalizedValue(value: LocalizedText | null | undefined) {
  return Boolean(value?.ko.trim() && value.en.trim() && value.ja.trim());
}
