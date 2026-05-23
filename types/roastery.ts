import type { LocalizedText } from "@/lib/i18n";

export type LogoStatus = "placeholder" | "local_test_only" | "approved";

export type Roastery = {
  id: string;
  slug: string;
  name: LocalizedText;
  logoUrl?: string | null;
  logoAlt?: string;
  logoStatus: LogoStatus;
  officialWebsiteUrl?: string | null;
  location?: LocalizedText;
  description: LocalizedText;
  philosophy?: LocalizedText;
  roastingStyle?: LocalizedText;
  representativeBeanIds?: string[];
  beanIds?: string[];
  purchaseUrl?: string | null;
  b2bInquiryUrl?: string | null;
  sourceUrl?: string | null;
  lastResearchedAt?: string;
  status?: "confirmed" | "needs_review";
};
