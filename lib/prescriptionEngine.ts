import type {
  BrewPrescription,
  BrewPrescriptionAdjustment,
  BrewPrescriptionInput,
  BrewVariable
} from "@/types/prescription";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function valueFor(variable: BrewVariable, input: BrewPrescriptionInput) {
  switch (variable) {
    case "temperatureC":
      return `${input.temperatureC}C`;
    case "grindSize":
      return `${input.grindSize}/10`;
    case "targetTimeSeconds":
      return formatSeconds(input.targetTimeSeconds);
    case "bloomSeconds":
      return `${input.bloomSeconds}s`;
    case "pourCount":
      return `${input.pourCount}`;
  }
}

function variableLabel(variable: BrewVariable) {
  const labels = {
    temperatureC: { ko: "물 온도", en: "Water temperature", ja: "湯温" },
    grindSize: { ko: "분쇄도", en: "Grind size", ja: "挽き目" },
    targetTimeSeconds: { ko: "목표 추출 시간", en: "Target brew time", ja: "目標抽出時間" },
    bloomSeconds: { ko: "블루밍", en: "Bloom", ja: "ブルーム" },
    pourCount: { ko: "푸어 차수", en: "Pour count", ja: "注湯回数" }
  };
  return labels[variable];
}

function adjustment(
  variable: BrewVariable,
  input: BrewPrescriptionInput,
  nextValue: string,
  deltaKo: string,
  deltaEn: string,
  deltaJa: string,
  reasonKo: string,
  reasonEn: string,
  reasonJa: string,
  evidenceIds: string[]
): BrewPrescriptionAdjustment {
  return {
    variable,
    label: variableLabel(variable),
    currentValue: valueFor(variable, input),
    nextValue,
    delta: { ko: deltaKo, en: deltaEn, ja: deltaJa },
    reason: { ko: reasonKo, en: reasonEn, ja: reasonJa },
    evidenceIds
  };
}

function holdExcept(variable: BrewVariable): BrewVariable[] {
  return (["temperatureC", "grindSize", "targetTimeSeconds", "bloomSeconds", "pourCount"] as const).filter(
    (item) => item !== variable
  );
}

export function prescribeBrew(input: BrewPrescriptionInput): BrewPrescription {
  const timeDelta = input.actualTimeSeconds - input.targetTimeSeconds;
  const absDelta = Math.abs(timeDelta);
  const nextRecipe = {
    recipeStyle: input.recipeStyle,
    temperatureC: input.temperatureC,
    grindSize: input.grindSize,
    targetTimeSeconds: input.targetTimeSeconds,
    bloomSeconds: input.bloomSeconds,
    pourCount: input.pourCount
  };

  let primaryAdjustment: BrewPrescriptionAdjustment;
  let diagnosis = {
    ko: "현재 레시피는 큰 이탈 없이 안정 범위에 있습니다.",
    en: "The current recipe is inside a broadly stable operating window.",
    ja: "現在のレシピは大きなズレがなく、安定した範囲にあります。"
  };
  let expectedEffects = [
    {
      ko: "변수 하나만 바꿔 다음 컵과 비교할 수 있습니다.",
      en: "Only one variable changes, so the next cup can be compared clearly.",
      ja: "変数を一つだけ変えるため、次の一杯と比較しやすくなります。"
    }
  ];
  let cautions = [
    {
      ko: "맛 변화가 기대와 다르면 다음 처방에서 같은 입력값으로 다시 분석하세요.",
      en: "If the taste does not move as expected, run the next prescription from the updated recipe.",
      ja: "期待した変化が出ない場合は、更新後のレシピで再度処方してください。"
    }
  ];
  let evidenceIds = ["coffeeos-one-variable"];
  let confidence = 62;

  if (timeDelta <= -25) {
    const nextGrind = clamp(input.grindSize - 1, 1, 10);
    nextRecipe.grindSize = nextGrind;
    diagnosis = {
      ko: "실제 추출 시간이 목표보다 짧아 접촉 시간이 부족한 패턴입니다.",
      en: "The actual brew time is shorter than target, suggesting insufficient contact time.",
      ja: "実際の抽出時間が目標より短く、接触時間が不足しているパターンです。"
    };
    primaryAdjustment = adjustment(
      "grindSize",
      input,
      `${nextGrind}/10`,
      "1단계 곱게",
      "one step finer",
      "1段階細かく",
      "분쇄도를 곱게 하면 흐름 저항과 접촉 시간이 늘어 목표 추출 시간에 가까워질 가능성이 높습니다.",
      "A finer grind increases flow resistance and contact time, moving the brew closer to the target time.",
      "挽き目を細かくすると流れの抵抗と接触時間が増え、目標時間に近づく可能性があります。",
      ["ecbc-temperature-contact", "batali-residence-time", "coffeeos-one-variable"]
    );
    expectedEffects = [
      {
        ko: "단맛과 질감이 조금 더 올라올 가능성이 있습니다.",
        en: "Sweetness and texture are likely to increase slightly.",
        ja: "甘さと質感が少し増す可能性があります。"
      },
      {
        ko: "목표 시간에 가까워지면 이후 온도나 푸어 차수를 조정할 근거가 선명해집니다.",
        en: "Once time is closer to target, later temperature or pour-count adjustments become easier to interpret.",
        ja: "時間が目標に近づくと、その後の湯温や注湯回数の調整理由が読みやすくなります。"
      }
    ];
    cautions = [
      {
        ko: "이미 1-2단계로 매우 곱다면 분쇄도 대신 블루밍을 5-10초 늘리는 실험이 더 안전합니다.",
        en: "If the grind is already very fine, extending bloom by 5-10 seconds is the safer next experiment.",
        ja: "すでにかなり細かい場合は、挽き目ではなくブルームを5-10秒伸ばす方が安全です。"
      }
    ];
    evidenceIds = primaryAdjustment.evidenceIds;
    confidence = clamp(68 + Math.floor(absDelta / 5), 68, 90);
  } else if (timeDelta >= 35) {
    const nextGrind = clamp(input.grindSize + 1, 1, 10);
    nextRecipe.grindSize = nextGrind;
    diagnosis = {
      ko: "실제 추출 시간이 목표보다 길어 흐름 저항이 큰 패턴입니다.",
      en: "The actual brew time is longer than target, suggesting excessive flow resistance.",
      ja: "実際の抽出時間が目標より長く、流れの抵抗が大きいパターンです。"
    };
    primaryAdjustment = adjustment(
      "grindSize",
      input,
      `${nextGrind}/10`,
      "1단계 굵게",
      "one step coarser",
      "1段階粗く",
      "분쇄도를 굵게 하면 흐름이 빨라지고 긴 접촉 시간으로 인한 거친 후미를 줄일 수 있습니다.",
      "A coarser grind speeds flow and can reduce roughness from excessive contact time.",
      "挽き目を粗くすると流れが速くなり、長すぎる接触時間による荒さを抑えやすくなります。",
      ["ecbc-temperature-contact", "batali-residence-time", "coffeeos-one-variable"]
    );
    expectedEffects = [
      {
        ko: "후미의 건조함과 무거운 느낌이 줄어들 가능성이 있습니다.",
        en: "Dry finish and heaviness may decrease.",
        ja: "後味の乾きや重さが軽くなる可能性があります。"
      },
      {
        ko: "목표 시간에 맞춰지면 레시피 반복성이 좋아집니다.",
        en: "Moving closer to target time improves repeatability.",
        ja: "目標時間に近づくと、レシピの再現性が高まります。"
      }
    ];
    cautions = [
      {
        ko: "이미 9-10단계로 매우 굵다면 푸어 차수를 줄여 교란을 낮추는 방향을 먼저 확인하세요.",
        en: "If the grind is already very coarse, first reduce pour count to lower bed disturbance.",
        ja: "すでにかなり粗い場合は、まず注湯回数を減らしてベッドの乱れを抑えてください。"
      }
    ];
    evidenceIds = primaryAdjustment.evidenceIds;
    confidence = clamp(68 + Math.floor(absDelta / 6), 68, 90);
  } else if (input.temperatureC < 90) {
    const nextTemp = clamp(input.temperatureC + 1, 86, 96);
    nextRecipe.temperatureC = nextTemp;
    diagnosis = {
      ko: "추출 시간은 안정적이지만 온도가 일반적인 필터 추출 범위보다 낮습니다.",
      en: "Brew time is stable, but temperature is below a common filter-brewing operating range.",
      ja: "抽出時間は安定していますが、湯温が一般的なフィルター抽出の範囲より低めです。"
    };
    primaryAdjustment = adjustment(
      "temperatureC",
      input,
      `${nextTemp}C`,
      "+1C",
      "+1C",
      "+1C",
      "온도는 단독 해답이 아니므로 1C만 올려 반응을 확인합니다.",
      "Temperature is not a stand-alone answer, so CoffeeOS raises it by only 1C and checks the response.",
      "湯温だけで解決するものではないため、1Cだけ上げて反応を確認します。",
      ["ecbc-temperature-contact", "batali-temperature", "coffeeos-one-variable"]
    );
    expectedEffects = [
      {
        ko: "향의 개방감과 중간부 추출감이 조금 더 선명해질 수 있습니다.",
        en: "Aroma opening and mid-palate extraction may become slightly clearer.",
        ja: "香りの開きと中盤の抽出感が少し明確になる可能性があります。"
      }
    ];
    evidenceIds = primaryAdjustment.evidenceIds;
    confidence = 66;
  } else if (input.temperatureC > 96) {
    const nextTemp = clamp(input.temperatureC - 1, 86, 96);
    nextRecipe.temperatureC = nextTemp;
    diagnosis = {
      ko: "추출 시간은 안정적이지만 온도가 권장 범위를 넘어섭니다.",
      en: "Brew time is stable, but temperature is above the recommended operating range.",
      ja: "抽出時間は安定していますが、湯温が推奨範囲を超えています。"
    };
    primaryAdjustment = adjustment(
      "temperatureC",
      input,
      `${nextTemp}C`,
      "-1C",
      "-1C",
      "-1C",
      "온도 영향을 과대평가하지 않기 위해 1C만 낮추고 나머지 변수는 유지합니다.",
      "CoffeeOS lowers temperature by only 1C and holds the rest to avoid over-attributing the change to temperature.",
      "湯温の影響を過大評価しないよう、1Cだけ下げて他の変数は固定します。",
      ["ecbc-temperature-contact", "batali-temperature", "coffeeos-one-variable"]
    );
    expectedEffects = [
      {
        ko: "거친 후미와 무거운 인상이 줄어드는지 확인할 수 있습니다.",
        en: "This checks whether rough finish or heaviness decreases.",
        ja: "荒い後味や重さが減るかを確認できます。"
      }
    ];
    evidenceIds = primaryAdjustment.evidenceIds;
    confidence = 68;
  } else if (input.recipeStyle === "sweetness" && input.bloomSeconds < 45) {
    const nextBloom = clamp(input.bloomSeconds + 10, 20, 60);
    nextRecipe.bloomSeconds = nextBloom;
    primaryAdjustment = adjustment(
      "bloomSeconds",
      input,
      `${nextBloom}s`,
      "+10초",
      "+10 seconds",
      "+10秒",
      "시간과 온도가 안정적이므로 분쇄도보다 블루밍을 늘려 초기 포화와 가스 배출을 안정화합니다.",
      "Because time and temperature are stable, CoffeeOS extends bloom to stabilize early saturation before changing grind.",
      "時間と湯温が安定しているため、挽き目より先にブルームを伸ばして初期の湿潤を安定させます。",
      ["packed-bed-uniformity", "coffeeos-one-variable"]
    );
    expectedEffects = [
      {
        ko: "초반 포화가 안정되면 단맛과 밸런스가 더 잘 읽힐 수 있습니다.",
        en: "More stable early saturation can make sweetness and balance easier to read.",
        ja: "初期の湿潤が安定すると、甘さとバランスが読み取りやすくなります。"
      }
    ];
    evidenceIds = primaryAdjustment.evidenceIds;
    confidence = 60;
  } else if (input.recipeStyle === "clarity" && input.pourCount > 2) {
    const nextPourCount = clamp(input.pourCount - 1, 1, 5);
    nextRecipe.pourCount = nextPourCount;
    primaryAdjustment = adjustment(
      "pourCount",
      input,
      `${nextPourCount}`,
      "1차수 줄이기",
      "one fewer pour",
      "注湯を1回減らす",
      "시간이 안정적이고 선명도를 목표로 하므로 베드 교란을 줄이는 방향을 먼저 시험합니다.",
      "With time stable and clarity as the goal, CoffeeOS first tests a lower-disturbance pour structure.",
      "時間が安定し、透明感を狙うため、まずベッドの乱れを抑える注湯構成を試します。",
      ["packed-bed-uniformity", "coffeeos-one-variable"]
    );
    expectedEffects = [
      {
        ko: "향미의 윤곽이 더 깨끗해지는지 확인합니다.",
        en: "This checks whether flavor edges become cleaner.",
        ja: "フレーバーの輪郭がよりきれいになるかを確認します。"
      }
    ];
    cautions = [
      {
        ko: "푸어 차수 조정은 연구 근거보다 운영 가설에 가깝기 때문에 신뢰도를 낮게 표시합니다.",
        en: "Pour-count adjustment is treated as an operational hypothesis, so confidence is intentionally lower.",
        ja: "注湯回数の調整は研究根拠より運用仮説に近いため、信頼度は意図的に低く表示します。"
      }
    ];
    evidenceIds = primaryAdjustment.evidenceIds;
    confidence = 56;
  } else if (input.recipeStyle === "body") {
    const nextTime = clamp(input.targetTimeSeconds + 10, 120, 300);
    nextRecipe.targetTimeSeconds = nextTime;
    primaryAdjustment = adjustment(
      "targetTimeSeconds",
      input,
      formatSeconds(nextTime),
      "+10초",
      "+10 seconds",
      "+10秒",
      "추출 시간이 안정적이면 목표 시간을 소폭 늘려 접촉 시간을 먼저 검증합니다.",
      "When current time is stable, CoffeeOS tests a small increase in target contact time first.",
      "現在の時間が安定している場合、目標接触時間を少し伸ばして検証します。",
      ["batali-residence-time", "coffeeos-one-variable"]
    );
    expectedEffects = [
      {
        ko: "질감과 중심부 농도가 올라오는지 확인할 수 있습니다.",
        en: "This checks whether texture and mid-palate weight increase.",
        ja: "質感と中盤の厚みが増すかを確認できます。"
      }
    ];
    evidenceIds = primaryAdjustment.evidenceIds;
    confidence = 61;
  } else {
    const nextTime = clamp(input.targetTimeSeconds - 5, 120, 300);
    nextRecipe.targetTimeSeconds = nextTime;
    primaryAdjustment = adjustment(
      "targetTimeSeconds",
      input,
      formatSeconds(nextTime),
      "-5초",
      "-5 seconds",
      "-5秒",
      "모든 변수가 안정 범위에 있어 큰 수정 대신 목표 시간을 아주 작게 줄여 반복성을 확인합니다.",
      "All variables are in a stable window, so CoffeeOS makes a minimal target-time change to test repeatability.",
      "すべての変数が安定範囲にあるため、目標時間をわずかに短くして再現性を確認します。",
      ["batali-residence-time", "coffeeos-one-variable"]
    );
    expectedEffects = [
      {
        ko: "레시피가 이미 안정적인지, 작은 시간 변화에도 균형이 유지되는지 볼 수 있습니다.",
        en: "This reveals whether the recipe is already stable under a small time change.",
        ja: "小さな時間変化でもバランスが保たれるかを確認できます。"
      }
    ];
    evidenceIds = primaryAdjustment.evidenceIds;
    confidence = 55;
  }

  return {
    diagnosis,
    confidence,
    primaryAdjustment,
    holdVariables: holdExcept(primaryAdjustment.variable),
    expectedEffects,
    cautions,
    nextRecipe,
    evidenceIds
  };
}

