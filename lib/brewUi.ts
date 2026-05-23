import type { LocalizedText } from "@/lib/i18n";
import type { BrewDiagnosisResult, BrewPrescription, BrewProblem } from "@/types/brewDiagnosis";

export function text(ko: string, en: string, ja: string): LocalizedText {
  return { ko, en, ja };
}

export function formatSeconds(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safe / 60);
  const rest = Math.round(safe % 60);
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function calculateRatio(coffeeAmount: number, waterAmount: number) {
  if (!coffeeAmount || !waterAmount) {
    return "1:--";
  }

  const ratio = waterAmount / coffeeAmount;
  return `1:${ratio % 1 === 0 ? ratio : ratio.toFixed(1)}`;
}

export const brewProblemLabels: Record<BrewProblem, LocalizedText> = {
  too_sour: text("너무 시다", "Too sour", "酸っぱすぎる"),
  sharp_acidity: text("산미가 날카롭다", "Sharp acidity", "酸が鋭い"),
  weak: text("밍밍하다", "Weak", "薄い"),
  flat: text("단맛이 부족하다", "Low sweetness", "甘さが足りない"),
  bitter: text("쓰다", "Bitter", "苦い"),
  astringent: text("떫다", "Dry/astringent", "渋い"),
  muddy: text("탁하다", "Muddy", "濁る"),
  thin: text("바디가 약하다", "Thin body", "ボディが弱い"),
  heavy: text("무겁다", "Heavy", "重い"),
  low_aroma: text("향이 약하다", "Low aroma", "香りが弱い"),
  good: text("좋았다", "Good", "良かった")
};

export const likelyIssueLabels: Record<BrewDiagnosisResult["likelyIssue"], LocalizedText> = {
  under_extraction: text("과소추출 가능성", "Likely under-extraction", "過少抽出の可能性"),
  over_extraction: text("과다추출 가능성", "Likely over-extraction", "過抽出の可能性"),
  uneven_extraction: text("불균일 추출 가능성", "Likely uneven extraction", "不均一抽出の可能性"),
  recipe_mismatch: text("레시피 궁합 점검 필요", "Recipe fit needs review", "レシピ相性の確認が必要"),
  good_result: text("좋은 결과 가능성", "Likely good result", "良い結果の可能性"),
  needs_more_data: text("추가 기록 필요", "More data needed", "追加記録が必要")
};

export const confidenceLabels: Record<BrewDiagnosisResult["confidence"], LocalizedText> = {
  low: text("낮음", "Low", "低い"),
  medium: text("중간", "Medium", "中"),
  high: text("높음", "High", "高い")
};

export const prescriptionVariableLabels: Record<BrewPrescription["variable"], LocalizedText> = {
  grind_size: text("분쇄도", "Grind size", "挽き目"),
  water_temperature: text("물 온도", "Water temperature", "湯温"),
  brew_time: text("추출 시간", "Brew time", "抽出時間"),
  agitation: text("교반", "Agitation", "撹拌"),
  pouring_structure: text("푸어링 구조", "Pouring structure", "注湯構造"),
  ratio: text("비율", "Ratio", "比率"),
  dose: text("도징", "Dose", "ドーズ"),
  water_quality: text("물", "Water quality", "水質")
};

export function makeDefaultSteps(): { at: number; waterAmount: number; action: LocalizedText }[] {
  return [
    { at: 0, waterAmount: 45, action: text("블루밍", "Bloom", "ブルーム") },
    { at: 35, waterAmount: 140, action: text("1차 푸어", "First pour", "一投目") },
    { at: 85, waterAmount: 240, action: text("마무리 푸어", "Final pour", "仕上げの注湯") }
  ];
}
