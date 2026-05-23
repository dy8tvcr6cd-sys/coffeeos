import type { LocalizedText } from "@/lib/i18n";

export type RoastLevel = "light" | "light-medium" | "medium" | "medium-dark" | "dark" | "unknown";

export type CupNoteCategory =
  | "floral"
  | "fruit"
  | "berry"
  | "citrus"
  | "tea"
  | "chocolate"
  | "nutty"
  | "spice"
  | "sweet"
  | "unknown";

export type CupNote = {
  name: LocalizedText;
  intensity: number;
  color: string;
  category: CupNoteCategory;
};

export type CupNoteStage = {
  stage: "HOT" | "WARM" | "COLD";
  notes: CupNote[];
  description: LocalizedText;
};

export type Bean = {
  id: string;
  slug: string;
  roasteryId: string;
  name: LocalizedText;
  farmId?: string | null;
  country?: LocalizedText;
  region?: LocalizedText;
  farm?: LocalizedText;
  producer?: LocalizedText;
  variety?: string | null;
  altitude?: string | null;
  process?: LocalizedText;
  roastLevel: RoastLevel;
  harvestPeriod?: string | null;
  moisture?: string | null;
  density?: string | null;
  cupNotes: CupNoteStage[];
  roastingIntent?: LocalizedText;
  farmStory?: LocalizedText;
  recommendedBrewIds?: string[];
  purchaseUrl?: string | null;
  sourceUrl?: string | null;
  price?: number | null;
  tags: string[];
  similarBeanIds: string[];
  status?: "confirmed" | "needs_review";
  lastResearchedAt?: string;
};
