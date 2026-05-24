import type { LocalizedText } from "@/lib/i18n";
import { getLocalizedText, type Locale } from "@/lib/i18n";
import type { BrewStep } from "@/types/brew";
import type { BrewLogStep } from "@/types/brewDiagnosis";

type RecipeLikeStep = BrewStep | BrewLogStep;

export function createLocalizedTextFromPrimary(ko: string, en = "", ja = ""): LocalizedText {
  return { ko, en, ja };
}

export function parseGramAmount(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (!value) {
    return null;
  }

  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!match) {
    return null;
  }

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getStepCumulativeWater(step: RecipeLikeStep) {
  if ("cumulativeWaterAmount" in step && typeof step.cumulativeWaterAmount === "number") {
    return step.cumulativeWaterAmount;
  }

  if ("waterAmount" in step && typeof step.waterAmount === "number") {
    return step.waterAmount;
  }

  if ("water" in step) {
    return parseGramAmount(step.water);
  }

  return null;
}

export function getStepWaterAmount(steps: RecipeLikeStep[], index: number) {
  const currentStep = steps[index];
  const current = getStepCumulativeWater(currentStep);

  if (typeof currentStep.stepWaterAmount === "number") {
    return currentStep.stepWaterAmount;
  }

  if (current === null) {
    return null;
  }

  const previous = index > 0 ? getStepCumulativeWater(steps[index - 1]) : 0;
  if (previous === null || current < previous) {
    return null;
  }

  return current - previous;
}

export function formatStepWaterDisplay(steps: RecipeLikeStep[], index: number) {
  const step = steps[index];
  const cumulative = getStepCumulativeWater(step);
  const stepWater = getStepWaterAmount(steps, index);

  if (cumulative !== null && stepWater !== null) {
    return `${formatGram(cumulative)}g (${formatGram(stepWater)}g)`;
  }

  if (cumulative !== null) {
    return `${formatGram(cumulative)}g`;
  }

  if ("water" in step && step.water) {
    return step.water;
  }

  return "";
}

export function formatRecipeStepDisplay(steps: BrewStep[], index: number, locale: Locale) {
  const step = steps[index];
  const water = formatStepWaterDisplay(steps, index);
  const title = getLocalizedText(step.title, locale);
  return water ? `${title} ${water}` : title;
}

export function formatBrewLogStepDisplay(steps: BrewLogStep[], index: number, locale: Locale) {
  const step = steps[index];
  const water = formatStepWaterDisplay(steps, index);
  const title = getLocalizedText(step.action, locale);
  return water ? `${title} ${water}` : title;
}

function formatGram(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
