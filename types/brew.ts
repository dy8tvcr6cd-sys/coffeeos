import type { LocalizedText } from "@/lib/i18n";

export type BrewStep = {
  id: string;
  at: number;
  duration: number;
  title: LocalizedText;
  water: string;
  instruction: LocalizedText;
};

export type BrewRecipe = {
  id: string;
  beanId: string;
  brewer: string;
  grindSize: string;
  waterTemperature: string;
  coffeeAmount: string;
  waterAmount: string;
  ratio: string;
  totalTimeSeconds: number;
  intent: LocalizedText;
  steps: BrewStep[];
  sourceUrl?: string | null;
  status?: "confirmed" | "needs_review";
};
