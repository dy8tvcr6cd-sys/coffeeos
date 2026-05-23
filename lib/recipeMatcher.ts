import type { LocalizedText } from "@/lib/i18n";
import type { Bean } from "@/types/bean";
import type { BrewPrescription, RecipeMatchResult, SavedRecipe } from "@/types/brewDiagnosis";

function text(ko: string, en: string, ja: string): LocalizedText {
  return { ko, en, ja };
}

function prescription(
  priority: number,
  variable: BrewPrescription["variable"],
  action: LocalizedText,
  reason: LocalizedText,
  expectedResult: LocalizedText
): BrewPrescription {
  return { priority, variable, action, reason, expectedResult };
}

function beanNoteNames(bean: Bean) {
  return bean.cupNotes
    .flatMap((stage) => stage.notes)
    .map((note) => `${note.category} ${note.name.ko} ${note.name.en}`.toLowerCase());
}

function localizedContains(value: LocalizedText | undefined, terms: string[]) {
  if (!value) {
    return false;
  }

  const body = `${value.ko} ${value.en} ${value.ja}`.toLowerCase();
  return terms.some((term) => body.includes(term.toLowerCase()));
}

function hasProcess(bean: Bean, terms: string[]) {
  return localizedContains(bean.process, terms);
}

function hasNotes(bean: Bean, terms: string[]) {
  const notes = beanNoteNames(bean).join(" ");
  return terms.some((term) => notes.includes(term.toLowerCase()));
}

function isBeanDataThin(bean: Bean) {
  const hasUsefulRoast = bean.roastLevel !== "unknown";
  const hasUsefulProcess = Boolean(bean.process && !bean.process.ko.includes("등록 예정"));
  const hasUsefulNotes = beanNoteNames(bean).some((note) => !note.includes("등록 예정") && !note.includes("unknown"));
  return !hasUsefulRoast && !hasUsefulProcess && !hasUsefulNotes;
}

export function matchRecipeToBean(recipe: SavedRecipe, bean: Bean): RecipeMatchResult {
  if (isBeanDataThin(bean)) {
    return {
      fit: "needs_more_data",
      summary: text(
        "정보가 더 필요합니다. 로스팅, 가공, 컵 노트 중 최소 하나가 더 등록되면 궁합 판단이 정확해집니다.",
        "More information is needed. Roast, process, or cup-note data would make the match more useful.",
        "情報がさらに必要です。焙煎、精製、カップノートのいずれかが登録されると相性判断がより正確になります。"
      ),
      reasons: [
        text(
          "현재 원두 데이터만으로는 레시피가 어떤 향미 방향에 맞는지 판단하기 어렵습니다.",
          "The current bean data is too thin to judge which flavor direction the recipe supports.",
          "現在の豆データだけでは、レシピがどの香味方向に合うか判断しにくいです。"
        )
      ],
      suggestedAdjustments: [
        prescription(
          1,
          "brew_time",
          text("먼저 기본 레시피로 한 번 기록하기", "Log one brew with the base recipe first", "まず基本レシピで一度記録する"),
          text(
            "첫 기록이 있어야 원두와 레시피의 실제 반응을 볼 수 있습니다.",
            "A first log shows how this bean actually responds to the recipe.",
            "最初の記録があると、この豆がレシピにどう反応するか見えます。"
          ),
          text(
            "다음 처방에서 조정 방향이 더 분명해집니다.",
            "The next prescription becomes more specific.",
            "次の処方がより具体的になります。"
          )
        )
      ]
    };
  }

  const reasons: LocalizedText[] = [];
  const suggestedAdjustments: BrewPrescription[] = [];
  let score = 2;

  const isLight = bean.roastLevel === "light" || bean.roastLevel === "light-medium";
  const isDark = bean.roastLevel === "medium-dark" || bean.roastLevel === "dark";
  const washed = hasProcess(bean, ["워시드", "washed", "ウォッシュト"]);
  const natural = hasProcess(bean, ["내추럴", "natural", "ナチュラル"]);
  const floralClear = hasNotes(bean, ["floral", "tea", "jasmine", "flower", "citrus", "플로럴", "차", "자스민"]);
  const fruitForward = hasNotes(bean, ["fruit", "berry", "wine", "lychee", "raspberry", "과일", "베리", "와인"]);
  const longHotRecipe = recipe.recipe.waterTemperature >= 94 || recipe.recipe.totalTimeSeconds >= 220;
  const lowTempShortRecipe = recipe.recipe.waterTemperature <= 90 || recipe.recipe.totalTimeSeconds <= 155;
  const manyPours = recipe.recipe.steps.length >= 4;
  const sweetnessPurpose = localizedContains(recipe.purpose, ["단맛", "sweet", "甘さ"]);

  if (isLight && washed && floralClear) {
    score += 2;
    reasons.push(
      text(
        "밝은 워시드 원두와 플로럴/차 계열 노트는 깨끗한 푸어링과 중고온 추출에 잘 맞는 편입니다.",
        "A light washed coffee with floral or tea-like notes often suits clean pouring and moderate-high temperature.",
        "明るいウォッシュトでフローラル/ティー系のノートがある豆は、きれいな注湯と中高温抽出に合いやすいです。"
      )
    );
    if (recipe.recipe.waterTemperature < 91) {
      score -= 1;
      suggestedAdjustments.push(
        prescription(
          1,
          "water_temperature",
          text("물 온도를 91-93도 범위로 올려 테스트하기", "Test with water at 91-93 C", "湯温を91〜93度に上げて試す"),
          text(
            "밝은 워시드 원두는 너무 낮은 온도에서 향과 단맛이 약하게 열릴 수 있습니다.",
            "A bright washed coffee may open weakly if the water temperature is too low.",
            "明るいウォッシュトは、湯温が低すぎると香りと甘さが弱く出ることがあります。"
          ),
          text(
            "향과 단맛의 선명도가 올라갈 가능성이 있습니다.",
            "Aromatics and sweetness may become clearer.",
            "香りと甘さの輪郭が上がる可能性があります。"
          )
        )
      );
    }
  }

  if (natural || fruitForward) {
    reasons.push(
      text(
        "과일감이 강한 원두는 과한 교반에서 탁함이 커질 수 있어 물줄기 안정성이 중요합니다.",
        "Fruit-forward coffees can become muddy with excessive agitation, so pouring stability matters.",
        "果実感の強い豆は過度な撹拌で濁りやすいため、注湯の安定性が重要です。"
      )
    );
    if (manyPours || longHotRecipe) {
      score -= 1;
      suggestedAdjustments.push(
        prescription(
          1,
          "agitation",
          text("푸어 차수를 줄이고 후반 물줄기를 부드럽게 하기", "Reduce pour count and soften the final pour", "注湯回数を減らし、後半の湯流を穏やかにする"),
          text(
            "과일향이 강한 원두는 강한 후반부 교반에서 탁함과 떫음이 올라올 수 있습니다.",
            "Fruit-forward coffees can show muddiness and dryness with strong late agitation.",
            "果実感の強い豆は、後半の強い撹拌で濁りと渋みが出ることがあります。"
          ),
          text(
            "과일감은 남기고 클린컵이 좋아질 가능성이 있습니다.",
            "Fruit character may remain while clarity improves.",
            "果実感を残しながら、クリーンさが上がる可能性があります。"
          )
        )
      );
    } else {
      score += 1;
    }
  }

  if (isDark && longHotRecipe) {
    score -= 2;
    reasons.push(
      text(
        "중강배전 이상 원두에 높은 온도와 긴 추출이 겹치면 쓴맛이 빠르게 커질 수 있습니다.",
        "For medium-dark or darker beans, high temperature and long brew time can quickly increase bitterness.",
        "中深煎り以上の豆では、高温と長い抽出が重なると苦味が速く強くなることがあります。"
      )
    );
    suggestedAdjustments.push(
      prescription(
        1,
        "water_temperature",
        text("물 온도를 1-2도 낮춰 테스트하기", "Test 1-2 C lower water temperature", "湯温を1〜2度下げて試す"),
        text(
          "짙은 로스팅은 낮은 온도에서도 성분이 충분히 빠르게 나올 수 있습니다.",
          "Darker roasts can extract enough even at slightly lower temperatures.",
          "深めの焙煎は、少し低い湯温でも十分に抽出されやすいです。"
        ),
        text(
          "쓴맛과 건조한 여운이 완화될 가능성이 있습니다.",
          "Bitterness and dry finish may soften.",
          "苦味と乾いた余韻が和らぐ可能性があります。"
        )
      )
    );
  }

  if (sweetnessPurpose && floralClear && longHotRecipe) {
    score -= 1;
    reasons.push(
      text(
        "단맛 중심 레시피가 섬세한 플로럴 원두에서는 향의 투명도를 누를 수 있습니다.",
        "A sweetness-focused recipe can mute aromatic transparency in delicate floral coffees.",
        "甘さ重視のレシピは、繊細なフローラル系の豆で香りの透明感を抑えることがあります。"
      )
    );
    suggestedAdjustments.push(
      prescription(
        2,
        "brew_time",
        text("총 추출 시간을 10초 짧게 테스트하기", "Test 10 seconds shorter total brew time", "総抽出時間を10秒短く試す"),
        text(
          "섬세한 향 중심 원두에서는 긴 추출보다 깨끗한 컵 구조가 더 중요할 수 있습니다.",
          "For delicate aromatic coffees, clean cup structure can matter more than a long extraction.",
          "繊細な香りの豆では、長い抽出よりきれいなカップ構造が重要な場合があります。"
        ),
        text(
          "향의 투명도와 여운의 선이 살아날 가능성이 있습니다.",
          "Aromatic clarity and finish may become more defined.",
          "香りの透明感と余韻の輪郭が出る可能性があります。"
        )
      )
    );
  }

  if (lowTempShortRecipe && isLight) {
    score -= 1;
    reasons.push(
      text(
        "밝은 로스팅에 낮은 온도와 짧은 시간은 단맛 부족으로 이어질 수 있습니다.",
        "Low temperature and short time on a light roast can lead to low sweetness.",
        "明るい焙煎に低温と短時間が重なると、甘さ不足につながることがあります。"
      )
    );
  }

  const fit = score >= 4 ? "high" : score >= 2 ? "medium" : "low";

  return {
    fit,
    summary:
      fit === "high"
        ? text(
            "적합도가 높습니다. 큰 변경보다 한 번 적용해보고 실제 맛 기록으로 미세 조정하세요.",
            "The fit looks high. Apply it once and fine-tune from the actual taste record.",
            "適合度は高めです。大きく変えず一度適用し、実際の味の記録で微調整しましょう。"
          )
        : fit === "medium"
          ? text(
              "주의가 필요합니다. 기본 구조는 사용할 수 있지만 한두 가지 변수는 원두에 맞춰 조정하는 편이 좋습니다.",
              "Use with care. The base structure may work, but one or two variables should be adjusted for this bean.",
              "注意が必要です。基本構造は使えますが、一つか二つの変数は豆に合わせて調整するとよいです。"
            )
          : text(
              "적합도가 낮을 가능성이 있습니다. 그대로 적용하기보다 먼저 조정안을 반영해 테스트하세요.",
              "The fit may be low. Apply the suggested adjustments before using it as-is.",
              "適合度が低い可能性があります。そのまま使うより、調整案を反映して試しましょう。"
            ),
    reasons,
    suggestedAdjustments:
      suggestedAdjustments.length > 0
        ? suggestedAdjustments
        : [
            prescription(
              1,
              "pouring_structure",
              text("첫 적용은 물줄기와 시간을 최대한 일정하게 유지하기", "Keep pouring and time as consistent as possible on first use", "初回適用では注湯と時間をできるだけ一定に保つ"),
              text(
                "궁합 판단은 레시피 자체의 차이를 보려면 실행 흔들림을 줄여야 합니다.",
                "To judge recipe fit, execution noise should be reduced.",
                "レシピ相性を判断するには、抽出のぶれを減らす必要があります。"
              ),
              text(
                "원두와 레시피의 실제 궁합을 더 명확히 볼 수 있습니다.",
                "The actual recipe-bean fit becomes clearer.",
                "豆とレシピの実際の相性がより明確に見えます。"
              )
            )
          ]
  };
}
