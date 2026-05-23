import type { LocalizedText } from "@/lib/i18n";

export type Farm = {
  id: string;
  name: LocalizedText;
  country?: LocalizedText;
  region?: LocalizedText;
  producer?: LocalizedText;
  elevation?: string | null;
  story: LocalizedText;
  sourceUrl?: string | null;
  lastResearchedAt?: string;
  status?: "confirmed" | "needs_review";
};
