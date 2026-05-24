import type { LocalizedText } from "@/lib/i18n";
import type { Bean } from "@/types/bean";

export type BrewLogStep = {
  at: number;
  waterAmount: number;
  cumulativeWaterAmount?: number;
  stepWaterAmount?: number;
  action: LocalizedText;
};

export type BrewProblem =
  | "too_sour"
  | "sharp_acidity"
  | "weak"
  | "flat"
  | "bitter"
  | "astringent"
  | "muddy"
  | "thin"
  | "heavy"
  | "low_aroma"
  | "good";

export type BrewPrescriptionVariable =
  | "grind_size"
  | "water_temperature"
  | "brew_time"
  | "agitation"
  | "pouring_structure"
  | "ratio"
  | "dose"
  | "water_quality";

export type BrewPrescription = {
  priority: number;
  variable: BrewPrescriptionVariable;
  action: LocalizedText;
  reason: LocalizedText;
  expectedResult: LocalizedText;
};

export type BrewDiagnosisResult = {
  summary: LocalizedText;
  likelyIssue:
    | "under_extraction"
    | "over_extraction"
    | "uneven_extraction"
    | "recipe_mismatch"
    | "good_result"
    | "needs_more_data";
  confidence: "low" | "medium" | "high";
  reasons: LocalizedText[];
  prescriptions: BrewPrescription[];
  nextTestRecipe?: Partial<BrewLog["recipe"]>;
};

export type BrewLog = {
  id: string;
  beanId: string;
  roasteryId?: string;
  createdAt: string;
  updatedAt?: string;
  beanName: LocalizedText;
  roasteryName?: LocalizedText;
  equipment: {
    brewer: string;
    filter?: string;
    grinder?: string;
    kettle?: string;
  };
  recipe: {
    coffeeAmount: number;
    waterAmount: number;
    ratio: string;
    waterTemperature: number;
    grindSize: string;
    totalTimeSeconds: number;
    steps: BrewLogStep[];
  };
  result: {
    perceivedStrength?: number;
    sweetness?: number;
    acidity?: number;
    bitterness?: number;
    astringency?: number;
    body?: number;
    clarity?: number;
    aroma?: number;
    aftertaste?: number;
    satisfaction?: number;
    selectedProblems: BrewProblem[];
    memo?: string;
  };
  measurements?: {
    tds?: number;
    extractionYield?: number;
    beverageWeight?: number;
  };
  diagnosis?: BrewDiagnosisResult;
};

export type BrewLogDraft = {
  beanId?: string;
  fromRecipeId?: string;
  recipe?: SavedRecipe["recipe"];
  equipment?: SavedRecipe["equipment"];
};

export type SavedRecipe = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  lastUsedAt?: string;
  name: LocalizedText;
  purpose?: LocalizedText;
  targetBeanStyle?: {
    roastLevels?: string[];
    processes?: string[];
    flavorDirection?: string[];
  };
  equipment: {
    brewer: string;
    filter?: string;
    grinder?: string;
  };
  recipe: {
    coffeeAmount: number;
    waterAmount: number;
    ratio: string;
    waterTemperature: number;
    grindSize: string;
    totalTimeSeconds: number;
    steps: BrewLogStep[];
  };
  notes?: LocalizedText;
  likedBeanIds?: string[];
  dislikedBeanIds?: string[];
};

export type RecipeMatchResult = {
  fit: "high" | "medium" | "low" | "needs_more_data";
  summary: LocalizedText;
  reasons: LocalizedText[];
  suggestedAdjustments: BrewPrescription[];
};

export type RecipeBeanMatchInput = {
  recipe: SavedRecipe;
  bean: Bean;
};
