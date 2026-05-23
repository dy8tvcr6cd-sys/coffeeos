import type { LocalizedText } from "@/lib/i18n";
import type { BrewDiagnosisResult, BrewLog, BrewPrescription } from "@/types/brewDiagnosis";

function text(ko: string, en: string, ja: string): LocalizedText {
  return { ko, en, ja };
}

function includesAny<T extends string>(values: T[], targets: T[]) {
  return targets.some((target) => values.includes(target));
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

function baseRecipe(log: BrewLog): Partial<BrewLog["recipe"]> {
  return {
    coffeeAmount: log.recipe.coffeeAmount,
    waterAmount: log.recipe.waterAmount,
    ratio: log.recipe.ratio,
    waterTemperature: log.recipe.waterTemperature,
    grindSize: log.recipe.grindSize,
    totalTimeSeconds: log.recipe.totalTimeSeconds,
    steps: log.recipe.steps
  };
}

export function analyzeBrewLog(log: BrewLog): BrewDiagnosisResult {
  const problems = log.result.selectedProblems;
  const hasTasteSignal = problems.length > 0 || typeof log.result.satisfaction === "number";
  const hasCoreRecipe =
    Boolean(log.recipe.grindSize.trim()) &&
    log.recipe.waterTemperature > 0 &&
    log.recipe.totalTimeSeconds > 0 &&
    log.recipe.coffeeAmount > 0 &&
    log.recipe.waterAmount > 0;

  if (!hasTasteSignal || !hasCoreRecipe) {
    return {
      summary: text(
        "처방을 내리기에는 핵심 기록이 부족합니다. 총 추출 시간, 분쇄도, 물 온도, 맛 결과를 함께 남겨주세요.",
        "There is not enough core data for a useful prescription. Record total time, grind size, water temperature, and taste result.",
        "有用な処方には記録が不足しています。総抽出時間、挽き目、湯温、味の結果を一緒に記録してください。"
      ),
      likelyIssue: "needs_more_data",
      confidence: "low",
      reasons: [
        text(
          "맛 문제와 핵심 추출 변수가 함께 있어야 원인 가능성을 좁힐 수 있습니다.",
          "Taste symptoms and core brew variables are needed together to narrow the likely cause.",
          "味の症状と主要な抽出変数がそろうと、原因の可能性を絞れます。"
        )
      ],
      prescriptions: [
        prescription(
          1,
          "brew_time",
          text("총 추출 시간을 반드시 기록하기", "Record total brew time", "総抽出時間を必ず記録する"),
          text(
            "시간은 과소추출과 과다추출을 나누는 가장 기본적인 근거입니다.",
            "Brew time is a core clue for separating under- and over-extraction.",
            "時間は過少抽出と過抽出を分ける基本的な手がかりです。"
          ),
          text(
            "다음 처방의 신뢰도가 올라갑니다.",
            "The next prescription will be more reliable.",
            "次の処方の信頼度が上がります。"
          )
        )
      ]
    };
  }

  const isShort = log.recipe.totalTimeSeconds < 165;
  const isLong = log.recipe.totalTimeSeconds > 225;
  const lowTemp = log.recipe.waterTemperature < 91;
  const highTemp = log.recipe.waterTemperature > 94;
  const sourWeak = includesAny(problems, ["too_sour", "sharp_acidity", "weak"]);
  const bitterDry = includesAny(problems, ["bitter", "astringent"]);
  const muddyDryWithAcidity =
    includesAny(problems, ["muddy"]) &&
    (bitterDry || sourWeak || (log.result.acidity ?? 0) >= 7) &&
    ((log.result.bitterness ?? 0) >= 6 || (log.result.astringency ?? 0) >= 6);

  if (problems.includes("good") || ((log.result.satisfaction ?? 0) >= 8 && !bitterDry && !sourWeak)) {
    return {
      summary: text(
        "현재 결과는 좋은 추출일 가능성이 높습니다. 바로 바꾸기보다 한 번 더 반복해 재현성을 확인해보세요.",
        "This is likely a good result. Repeat it once before changing variables to check consistency.",
        "現在の結果は良い抽出である可能性が高いです。変数を変える前に一度繰り返して再現性を確認しましょう。"
      ),
      likelyIssue: "good_result",
      confidence: problems.includes("good") && (log.result.satisfaction ?? 0) >= 8 ? "high" : "medium",
      reasons: [
        text(
          "사용자가 좋은 결과를 선택했고 만족도도 높게 기록되었습니다.",
          "The result was marked as good and satisfaction was recorded as high.",
          "良い結果として選択され、満足度も高く記録されています。"
        )
      ],
      prescriptions: [
        prescription(
          1,
          "brew_time",
          text("같은 레시피로 한 번 더 추출하기", "Repeat the same recipe once", "同じレシピでもう一度抽出する"),
          text(
            "좋은 추출은 맛뿐 아니라 반복 안정성까지 확인해야 레시피로 저장할 가치가 생깁니다.",
            "A good recipe is worth saving when it is repeatable, not only when it tastes good once.",
            "良いレシピは、一度おいしいだけでなく再現できてこそ保存する価値があります。"
          ),
          text(
            "레시피의 안정성을 판단할 수 있습니다.",
            "You can judge the recipe’s stability.",
            "レシピの安定性を判断できます。"
          )
        ),
        prescription(
          2,
          "pouring_structure",
          text("레시피를 저장하고 다른 원두와 비교하기", "Save the recipe and compare with another bean", "レシピを保存し、別の豆と比較する"),
          text(
            "좋았던 레시피는 원두 궁합을 판단하는 기준점이 됩니다.",
            "A liked recipe becomes a useful reference for recipe-bean matching.",
            "気に入ったレシピは、豆との相性を判断する基準になります。"
          ),
          text(
            "내 취향에 맞는 원두 스타일을 더 빠르게 찾을 수 있습니다.",
            "You can identify bean styles that match your taste faster.",
            "自分の好みに合う豆のスタイルをより早く見つけられます。"
          )
        )
      ],
      nextTestRecipe: baseRecipe(log)
    };
  }

  if (muddyDryWithAcidity) {
    return {
      summary: text(
        "탁함, 떫음, 쓴맛과 높은 산미가 함께 나타나 균일하지 않은 추출 가능성이 높습니다.",
        "Muddiness, dryness, bitterness, and high acidity together point to likely uneven extraction.",
        "濁り、渋み、苦味、高い酸が同時に出ているため、不均一抽出の可能性が高いです。"
      ),
      likelyIssue: "uneven_extraction",
      confidence: "high",
      reasons: [
        text(
          "과소추출 신호와 과다추출 신호가 동시에 기록되었습니다.",
          "Signals of under- and over-extraction were recorded at the same time.",
          "過少抽出と過抽出のサインが同時に記録されています。"
        ),
        text(
          "이 조합은 분쇄 균일도, 물줄기, 과한 교반 문제에서 자주 나타납니다.",
          "This pattern often comes from grind inconsistency, pouring inconsistency, or excessive agitation.",
          "この組み合わせは、挽き目のばらつき、注湯の不安定さ、過度な撹拌でよく起こります。"
        )
      ],
      prescriptions: [
        prescription(
          1,
          "pouring_structure",
          text("중앙만 강하게 붓지 말고 작은 원으로 균일하게 붓기", "Pour evenly in small circles instead of a strong center pour", "中心だけに強く注がず、小さな円で均一に注ぐ"),
          text(
            "강한 중앙 물줄기는 일부는 과다추출, 일부는 과소추출이 되기 쉽습니다.",
            "A strong center pour can over-extract some areas while under-extracting others.",
            "強い中心注湯は、一部を過抽出、一部を過少抽出にしやすいです。"
          ),
          text(
            "탁함과 떫은맛이 줄고 산미가 더 둥글어질 가능성이 있습니다.",
            "Muddiness and dryness may decrease while acidity becomes rounder.",
            "濁りと渋みが減り、酸がより丸くなる可能性があります。"
          )
        ),
        prescription(
          2,
          "agitation",
          text("스월링과 젓기를 줄이고 드로우다운을 안정시키기", "Reduce swirling/stirring and stabilize drawdown", "スワールや撹拌を減らし、落ち切りを安定させる"),
          text(
            "과한 교반은 미분 이동을 늘려 후반부 쓴맛과 떫음을 키울 수 있습니다.",
            "Too much agitation can move fines and increase late bitterness and dryness.",
            "過度な撹拌は微粉を動かし、後半の苦味や渋みを強めることがあります。"
          ),
          text(
            "클린컵과 여운이 정돈될 가능성이 있습니다.",
            "Clarity and finish may become cleaner.",
            "クリーンさと余韻が整う可能性があります。"
          )
        )
      ],
      nextTestRecipe: {
        ...baseRecipe(log),
        totalTimeSeconds: Math.max(150, log.recipe.totalTimeSeconds - 5)
      }
    };
  }

  if (sourWeak && (isShort || lowTemp || (log.result.sweetness ?? 5) <= 4)) {
    return {
      summary: text(
        "산미가 날카롭거나 맛이 약하고 추출이 빠른 편이라 과소추출 가능성이 높습니다.",
        "Sharp acidity or weakness with a fast brew points to likely under-extraction.",
        "鋭い酸や弱さがあり抽出が速い場合、過少抽出の可能性が高いです。"
      ),
      likelyIssue: "under_extraction",
      confidence: isShort && sourWeak ? "high" : "medium",
      reasons: [
        text(
          "신맛, 날카로운 산미, 약함은 충분히 녹지 않았을 때 자주 나타납니다.",
          "Sourness, sharp acidity, and weakness often appear when extraction is insufficient.",
          "酸っぱさ、鋭い酸、弱さは、成分が十分に溶けていない時によく出ます。"
        ),
        text(
          `총 추출 시간이 ${log.recipe.totalTimeSeconds}초로 짧은 편입니다.`,
          `The total brew time was relatively short at ${log.recipe.totalTimeSeconds} seconds.`,
          `総抽出時間が${log.recipe.totalTimeSeconds}秒で短めです。`
        )
      ],
      prescriptions: [
        prescription(
          1,
          "grind_size",
          text("지금보다 한 단계 곱게 분쇄하기", "Grind one step finer", "今より一段細かく挽く"),
          text(
            "분쇄를 조금 곱게 하면 물과 커피의 접촉 면적이 늘어 단맛 추출이 올라갈 수 있습니다.",
            "A slightly finer grind increases contact area and can lift sweetness extraction.",
            "少し細かくすると接触面積が増え、甘さの抽出が上がる可能性があります。"
          ),
          text(
            "단맛과 질감이 올라오고 산미가 둥글어질 가능성이 있습니다.",
            "Sweetness and texture may increase while acidity becomes rounder.",
            "甘さと質感が上がり、酸が丸くなる可能性があります。"
          )
        ),
        prescription(
          2,
          "brew_time",
          text("총 추출 시간을 10-20초 늘리기", "Increase total brew time by 10-20 seconds", "総抽出時間を10〜20秒伸ばす"),
          text(
            "짧은 추출에서는 단맛과 바디가 충분히 나오기 전에 끝날 수 있습니다.",
            "A short brew can finish before sweetness and body fully develop.",
            "短い抽出では、甘さとボディが出る前に終わることがあります。"
          ),
          text(
            "밋밋함이 줄고 컵의 중심이 더 생길 가능성이 있습니다.",
            "Weakness may decrease and the cup may gain more center.",
            "薄さが減り、カップの中心が出る可能性があります。"
          )
        ),
        ...(lowTemp
          ? [
              prescription(
                3,
                "water_temperature",
                text("물 온도를 1도 올리기", "Raise water temperature by 1 C", "湯温を1度上げる"),
                text(
                  "낮은 온도는 추출 속도를 늦춰 단맛과 향을 약하게 만들 수 있습니다.",
                  "Lower temperature can slow extraction and weaken sweetness and aromatics.",
                  "低い湯温は抽出を遅くし、甘さと香りを弱くすることがあります。"
                ),
                text(
                  "향과 단맛의 선명도가 조금 올라올 가능성이 있습니다.",
                  "Aromatics and sweetness may become a little clearer.",
                  "香りと甘さの輪郭が少し上がる可能性があります。"
                )
              )
            ]
          : [])
      ],
      nextTestRecipe: {
        ...baseRecipe(log),
        waterTemperature: lowTemp ? log.recipe.waterTemperature + 1 : log.recipe.waterTemperature,
        totalTimeSeconds: log.recipe.totalTimeSeconds + 15,
        grindSize: `${log.recipe.grindSize} · 한 단계 곱게`
      }
    };
  }

  if (bitterDry && (isLong || highTemp || (log.result.bitterness ?? 0) >= 7 || (log.result.astringency ?? 0) >= 7)) {
    return {
      summary: text(
        "쓴맛과 떫은맛이 강하고 추출 시간이 긴 편이라 과다추출 가능성이 높습니다.",
        "Strong bitterness or dryness with a long brew points to likely over-extraction.",
        "強い苦味や渋みがあり抽出が長い場合、過抽出の可能性が高いです。"
      ),
      likelyIssue: "over_extraction",
      confidence: isLong && bitterDry ? "high" : "medium",
      reasons: [
        text(
          "쓴맛과 떫은맛은 후반부 추출이 과해졌을 때 자주 커집니다.",
          "Bitterness and dryness often increase when late-stage extraction goes too far.",
          "苦味と渋みは、後半の抽出が進みすぎた時に強くなりやすいです。"
        ),
        text(
          `총 추출 시간이 ${log.recipe.totalTimeSeconds}초로 긴 편입니다.`,
          `The total brew time was relatively long at ${log.recipe.totalTimeSeconds} seconds.`,
          `総抽出時間が${log.recipe.totalTimeSeconds}秒で長めです。`
        )
      ],
      prescriptions: [
        prescription(
          1,
          "grind_size",
          text("지금보다 한 단계 굵게 분쇄하기", "Grind one step coarser", "今より一段粗く挽く"),
          text(
            "굵게 분쇄하면 후반부 쓴맛과 떫은맛 추출을 줄일 수 있습니다.",
            "A coarser grind can reduce late bitterness and dryness.",
            "粗く挽くと、後半の苦味と渋みを抑えられます。"
          ),
          text(
            "쓴맛이 줄고 단맛의 위치가 더 깨끗해질 가능성이 있습니다.",
            "Bitterness may decrease and sweetness may sit cleaner.",
            "苦味が減り、甘さの位置がよりきれいになる可能性があります。"
          )
        ),
        prescription(
          2,
          "agitation",
          text("후반 푸어와 스월링을 더 부드럽게 하기", "Make the final pour and swirl gentler", "後半の注湯とスワールをより穏やかにする"),
          text(
            "후반부 강한 물줄기와 교반은 쓴맛과 떫은맛을 끌어올릴 수 있습니다.",
            "Aggressive late pouring and agitation can lift bitterness and dryness.",
            "後半の強い注湯と撹拌は、苦味と渋みを引き上げることがあります。"
          ),
          text(
            "여운이 더 부드럽게 끝날 가능성이 있습니다.",
            "The finish may become softer.",
            "余韻がより柔らかく終わる可能性があります。"
          )
        ),
        prescription(
          3,
          "water_temperature",
          text("물 온도를 1도 낮추기", "Lower water temperature by 1 C", "湯温を1度下げる"),
          text(
            "높은 온도는 쓴맛 성분까지 빠르게 끌어낼 수 있습니다.",
            "Higher temperature can extract bitter compounds more quickly.",
            "高い湯温は苦味成分まで速く引き出すことがあります。"
          ),
          text(
            "쓴맛의 날카로움이 완화될 가능성이 있습니다.",
            "The sharpness of bitterness may soften.",
            "苦味の鋭さが和らぐ可能性があります。"
          )
        )
      ],
      nextTestRecipe: {
        ...baseRecipe(log),
        waterTemperature: Math.max(86, log.recipe.waterTemperature - 1),
        totalTimeSeconds: Math.max(120, log.recipe.totalTimeSeconds - 15),
        grindSize: `${log.recipe.grindSize} · 한 단계 굵게`
      }
    };
  }

  return {
    summary: text(
      "한 가지 추출 문제로 단정하기보다는 레시피와 원두 스타일의 궁합을 다시 볼 필요가 있습니다.",
      "This does not point to one extraction fault clearly; recipe-bean fit should be checked.",
      "一つの抽出問題とは断定しにくく、レシピと豆の相性を見直す必要があります。"
    ),
    likelyIssue: "recipe_mismatch",
    confidence: "low",
    reasons: [
      text(
        "기록된 맛 문제가 과소추출이나 과다추출의 전형적인 조합으로 모이지 않았습니다.",
        "The recorded symptoms do not cluster into a classic under- or over-extraction pattern.",
        "記録された症状が典型的な過少抽出・過抽出の組み合わせにまとまっていません。"
      )
    ],
    prescriptions: [
      prescription(
        1,
        "ratio",
        text("비율은 유지하고 분쇄도 또는 시간 중 하나만 바꿔보기", "Keep the ratio and change only grind or time", "比率は固定し、挽き目か時間のどちらか一つだけ変える"),
        text(
          "여러 변수를 동시에 바꾸면 어떤 변화가 맛을 만든 것인지 판단하기 어렵습니다.",
          "Changing several variables at once makes it hard to identify what changed the cup.",
          "複数の変数を同時に変えると、何が味を変えたのか判断しにくくなります。"
        ),
        text(
          "다음 기록에서 원인을 더 정확히 좁힐 수 있습니다.",
          "The next log can narrow the cause more accurately.",
          "次の記録で原因をより正確に絞れます。"
        )
      )
    ],
    nextTestRecipe: baseRecipe(log)
  };
}
