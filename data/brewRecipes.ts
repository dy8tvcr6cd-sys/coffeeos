import type { LocalizedText } from "@/lib/i18n";
import type { BrewRecipe } from "@/types/brew";

function text(ko: string, en: string, ja: string): LocalizedText {
  return { ko, en, ja };
}

function step(
  id: string,
  at: number,
  duration: number,
  title: LocalizedText,
  cumulativeWaterAmount: number,
  stepWaterAmount: number,
  instruction: LocalizedText
) {
  return {
    id,
    at,
    duration,
    title,
    water: `${cumulativeWaterAmount} g`,
    cumulativeWaterAmount,
    stepWaterAmount,
    instruction
  };
}

function standardRecipe(id: string, beanId: string, intent: LocalizedText): BrewRecipe {
  return {
    id,
    beanId,
    brewer: "Hario V60",
    grindSize: "Medium",
    waterTemperature: "92 C",
    coffeeAmount: "15 g",
    waterAmount: "240 g",
    ratio: "1:16",
    totalTimeSeconds: 180,
    intent,
    status: "needs_review",
    steps: [
      step(
        `${id}-bloom`,
        0,
        35,
        text("블루밍", "Bloom", "ブルーム"),
        45,
        45,
        text("커피 전체를 고르게 적시고 가스를 빼 줍니다.", "Wet the bed evenly and let the bloom settle.", "粉全体を均一に湿らせ、ガスを抜きます。")
      ),
      step(
        `${id}-first`,
        35,
        35,
        text("1차", "First pour", "一投目"),
        140,
        95,
        text("중앙에서 바깥으로 천천히 원을 그리며 단맛을 만듭니다.", "Pour slowly in circles to build sweetness.", "中心から外側へゆっくり円を描き、甘さを引き出します。")
      ),
      step(
        `${id}-finish`,
        85,
        95,
        text("2차", "Second pour", "二投目"),
        240,
        100,
        text("부드럽게 마무리하고 드로우다운을 기다립니다.", "Finish gently and wait for a clean drawdown.", "やさしく注ぎ終え、きれいに落ち切るのを待ちます。")
      )
    ]
  };
}

export const brewRecipes: BrewRecipe[] = [
  standardRecipe(
    "brew-momos-honduras-coe-la-pena",
    "momos-honduras-coe-la-pena",
    text(
      "밝은 싱글오리진의 향과 단맛을 선명하게 여는 CoffeeOS 기본 필터 레시피입니다.",
      "A CoffeeOS default filter recipe designed to open clarity and sweetness in bright single origins.",
      "明るいシングルオリジンの香りと甘さをきれいに開くCoffeeOS標準フィルターレシピです。"
    )
  ),
  standardRecipe(
    "brew-momos-busan-blend",
    "momos-busan-blend",
    text("견과와 캐러멜 중심의 균형을 위한 기본 필터 레시피입니다.", "A default filter recipe for a nutty, caramel-centered balance.", "ナッツとキャラメルのバランスを狙う標準フィルターレシピです。")
  ),
  {
    ...standardRecipe(
      "brew-fritz-old-dog",
      "fritz-old-dog",
      text(
        "묵직한 블렌드의 단맛과 질감을 안정적으로 살리는 기본 레시피입니다.",
        "A default recipe for building stable sweetness and texture in a fuller blend.",
        "しっかりしたブレンドの甘さと質感を安定して引き出す標準レシピです。"
      )
    ),
    brewer: "Clever Dripper",
    grindSize: "Medium-coarse",
    totalTimeSeconds: 210
  },
  standardRecipe(
    "brew-center-may-day-blend",
    "center-may-day-blend",
    text("도매 페이지의 블렌드 구조를 바탕으로 단맛과 균형을 우선한 기본 레시피입니다.", "A sweetness-first default recipe informed by the blend structure on the wholesale page.", "卸ページのブレンド構成を参考に、甘さとバランスを重視した標準レシピです。")
  ),
  standardRecipe(
    "brew-center-ethiopia-guji-hambella-wate",
    "center-ethiopia-guji-hambella-wate",
    text(
      "밝은 싱글오리진의 산미와 향을 또렷하게 정리하는 기본 레시피입니다.",
      "A default recipe that keeps acidity and aromatics clear in a bright single origin.",
      "明るいシングルオリジンの酸と香りをきれいに整える標準レシピです。"
    )
  ),
  {
    id: "brew-coffee-libre-vertigo",
    beanId: "coffee-libre-vertigo",
    brewer: "French Press",
    grindSize: "Coarse",
    waterTemperature: "95 C",
    coffeeAmount: "18 g",
    waterAmount: "300 g",
    ratio: "1:16.7",
    totalTimeSeconds: 240,
    intent: text(
      "커피 리브레 공식 프렌치프레스 가이드의 범위를 참고한 간단한 레시피입니다.",
      "A simple recipe based on the range in Coffee Libre’s official French press guide.",
      "Coffee Libre公式フレンチプレスガイドの範囲を参考にしたシンプルなレシピです。"
    ),
    sourceUrl: "https://coffeelibre.kr/product/%ED%94%84%EB%A0%8C%EC%B9%98-%ED%94%84%EB%A0%88%EC%8A%A4/469/",
    status: "confirmed",
    steps: [
      {
        id: "libre-press-water",
        at: 0,
        duration: 20,
        title: text("물 붓기", "Add water", "湯を注ぐ"),
        water: "300 g",
        cumulativeWaterAmount: 300,
        stepWaterAmount: 300,
        instruction: text("굵게 분쇄한 원두에 물을 붓고 전체를 적십니다.", "Add water to the coarse grounds and wet everything evenly.", "粗挽きの粉に湯を注ぎ、全体を均一に湿らせます。")
      },
      {
        id: "libre-press-steep",
        at: 20,
        duration: 200,
        title: text("침출", "Steep", "浸漬"),
        water: "no pour",
        instruction: text("뚜껑을 올리고 4분에 가깝게 기다립니다.", "Place the lid on and steep close to four minutes.", "ふたを乗せ、4分近く浸漬します。")
      },
      {
        id: "libre-press-serve",
        at: 220,
        duration: 20,
        title: text("서빙", "Serve", "サーブ"),
        water: "press",
        instruction: text("천천히 눌러 컵이나 서버로 바로 옮깁니다.", "Press slowly and decant into a cup or server.", "ゆっくり押し下げ、カップまたはサーバーに移します。")
      }
    ]
  },
  {
    id: "brew-bean-brothers-peru-el-palmo",
    beanId: "bean-brothers-peru-el-palmo",
    brewer: "Kalita Wave",
    grindSize: "Ditting KR 804 / 7.25",
    waterTemperature: "90 C",
    coffeeAmount: "20 g",
    waterAmount: "320 g",
    ratio: "1:16",
    totalTimeSeconds: 155,
    intent: text(
      "빈브라더스 공식 커피위키의 필터 레시피를 요약해 적용했습니다.",
      "Summarized from Bean Brothers’ official Coffee Wiki filter recipe.",
      "Bean Brothers公式Coffee Wikiのフィルターレシピを要約して適用しました。"
    ),
    sourceUrl: "https://www.beanbrothers.co.kr/info/coffeewiki_detail?cateCd=006008001&cateNm=SEASONAL&goodsNo=1000001486",
    status: "confirmed",
    steps: [
      {
        id: "bb-el-palmo-bloom",
        at: 0,
        duration: 30,
        title: text("블루밍", "Bloom", "ブルーム"),
        water: "50 g",
        cumulativeWaterAmount: 50,
        stepWaterAmount: 50,
        instruction: text("50g으로 블루밍하고 커피층을 안정시킵니다.", "Bloom with 50 g and let the bed settle.", "50gでブルームし、粉床を落ち着かせます。")
      },
      {
        id: "bb-el-palmo-first",
        at: 30,
        duration: 35,
        title: text("1차", "First pour", "一投目"),
        water: "to 160 g",
        cumulativeWaterAmount: 160,
        stepWaterAmount: 110,
        instruction: text("중간 물줄기로 160g까지 올립니다.", "Use a medium stream and pour to 160 g.", "中くらいの湯量で160gまで注ぎます。")
      },
      {
        id: "bb-el-palmo-second",
        at: 65,
        duration: 90,
        title: text("2차", "Second pour", "二投目"),
        water: "to 320 g",
        cumulativeWaterAmount: 320,
        stepWaterAmount: 160,
        instruction: text("320g까지 올린 뒤 가볍게 스월링합니다.", "Pour to 320 g, then swirl lightly.", "320gまで注ぎ、軽くスワールします。")
      }
    ]
  },
  standardRecipe(
    "brew-bean-brothers-honduras-la-tina",
    "bean-brothers-honduras-la-tina",
    text(
      "시즌 싱글오리진의 산미와 단맛을 균형 있게 여는 기본 레시피입니다.",
      "A default recipe for balancing acidity and sweetness in a seasonal single origin.",
      "季節のシングルオリジンの酸と甘さをバランスよく引き出す標準レシピです。"
    )
  ),
  standardRecipe(
    "brew-namusairo-pino-alto-geisha-natural",
    "namusairo-pino-alto-geisha-natural",
    text("향이 강한 내추럴 게샤를 부드럽게 여는 기본 필터 레시피입니다.", "A gentle default filter recipe for an aromatic natural Geisha.", "香り高いナチュラルゲイシャをやわらかく開く標準フィルターレシピです。")
  ),
  standardRecipe(
    "brew-namusairo-picnic",
    "namusairo-picnic",
    text("블렌드의 일상적인 균형을 위한 기본 레시피입니다.", "A default recipe for daily balance in this blend.", "日常的なバランスを狙うブレンド向け標準レシピです。")
  ),
  {
    ...standardRecipe(
      "brew-on-m-blending",
      "on-m-blending",
      text("고소함과 단맛이 중심인 블렌드에 맞춘 기본 레시피입니다.", "A default recipe for a nutty, sweetness-led blend.", "ナッツ感と甘さを中心にしたブレンド向け標準レシピです。")
    ),
    brewer: "Espresso",
    grindSize: "Espresso fine",
    coffeeAmount: "18 g",
    waterAmount: "36 g",
    ratio: "1:2",
    totalTimeSeconds: 32
  },
  standardRecipe(
    "brew-peru-la-primavera-geisha-washed",
    "peru-la-primavera-geisha-washed",
    text(
      "워시드 게이샤의 플로럴한 향과 깨끗한 단맛을 중심에 둔 기본 필터 레시피입니다.",
      "A default filter recipe centered on the floral aromatics and clean sweetness of a washed Geisha.",
      "ウォッシュドゲイシャのフローラルな香りときれいな甘さを中心にした標準フィルターレシピです。"
    )
  )
];

export function getRecipeById(id: string) {
  return brewRecipes.find((recipe) => recipe.id === id);
}

export function getRecipeByBeanId(beanId: string) {
  return brewRecipes.find((recipe) => recipe.beanId === beanId);
}
