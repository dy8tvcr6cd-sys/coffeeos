import type { LocalizedText } from "@/lib/i18n";

export type RecipeStyle = "clarity" | "sweetness" | "body" | "stability";

export type BrewSymptom =
  | "sharp_acidity"
  | "low_sweetness"
  | "thin_body"
  | "bitterness"
  | "dry_finish"
  | "muted_aroma"
  | "uneven_cups"
  | "fast_drawdown"
  | "slow_drawdown";

export type BrewVariable = "temperatureC" | "grindSize" | "targetTimeSeconds" | "bloomSeconds" | "pourCount";

export type BrewPrescriptionInput = {
  recipeStyle: RecipeStyle;
  temperatureC: number;
  grindSize: number;
  targetTimeSeconds: number;
  actualTimeSeconds: number;
  bloomSeconds: number;
  pourCount: number;
  symptoms: BrewSymptom[];
};

export type BrewPrescriptionAdjustment = {
  variable: BrewVariable;
  label: LocalizedText;
  currentValue: string;
  nextValue: string;
  delta: LocalizedText;
  reason: LocalizedText;
  evidenceIds: string[];
};

export type BrewPrescription = {
  diagnosis: LocalizedText;
  confidence: number;
  primaryAdjustment: BrewPrescriptionAdjustment;
  holdVariables: BrewVariable[];
  expectedEffects: LocalizedText[];
  cautions: LocalizedText[];
  nextRecipe: Pick<
    BrewPrescriptionInput,
    "recipeStyle" | "temperatureC" | "grindSize" | "targetTimeSeconds" | "bloomSeconds" | "pourCount"
  >;
  evidenceIds: string[];
};

