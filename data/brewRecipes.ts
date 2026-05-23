import type { LocalizedText } from "@/lib/i18n";
import type { BrewRecipe } from "@/types/brew";

function text(ko: string, en: string, ja: string): LocalizedText {
  return { ko, en, ja };
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
      {
        id: `${id}-bloom`,
        at: 0,
        duration: 35,
        title: text("블루밍", "Bloom", "ブルーム"),
        water: "45 g",
        instruction: text("커피 전체를 고르게 적시고 가스를 빼 줍니다.", "Wet the bed evenly and let the bloom settle.", "粉全体を均一に湿らせ、ガスを抜きます。")
      },
      {
        id: `${id}-first`,
        at: 35,
        duration: 35,
        title: text("첫 번째 푸어", "First pour", "一投目"),
        water: "to 140 g",
        instruction: text("중앙에서 바깥으로 천천히 원을 그리며 단맛을 만듭니다.", "Pour slowly in circles to build sweetness.", "中心から外側へゆっくり円を描き、甘さを引き出します。")
      },
      {
        id: `${id}-finish`,
        at: 85,
        duration: 95,
        title: text("마무리", "Finish", "仕上げ"),
        water: "to 240 g",
        instruction: text("부드럽게 마무리하고 드로우다운을 기다립니다.", "Finish gently and wait for a clean drawdown.", "やさしく注ぎ終え、きれいに落ち切るのを待ちます。")
      }
    ]
  };
}

export const brewRecipes: BrewRecipe[] = [
  standardRecipe(
    "brew-momos-honduras-coe-la-pena",
    "momos-honduras-coe-la-pena",
    text("공식 추출 레시피가 확인되지 않아 CoffeeOS 기본 필터 레시피를 제공합니다.", "Official brew recipe was not confirmed, so CoffeeOS provides a default filter recipe.", "公式抽出レシピは確認できないため、CoffeeOSの標準フィルターレシピを表示します。")
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
      text("공식 레시피가 확인되지 않아 묵직한 블렌드에 맞춘 기본 레시피를 제공합니다.", "Official recipe was not confirmed; this default profile supports a fuller blend.", "公式レシピは確認できないため、しっかりしたブレンド向けの標準レシピを表示します。")
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
    text("공식 레시피 확인 전까지 사용하는 밝은 싱글오리진용 기본 레시피입니다.", "A bright single-origin default until an official recipe is confirmed.", "公式レシピ確認前に使う、明るいシングルオリジン向け標準レシピです。")
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
        instruction: text("50g으로 블루밍하고 커피층을 안정시킵니다.", "Bloom with 50 g and let the bed settle.", "50gでブルームし、粉床を落ち着かせます。")
      },
      {
        id: "bb-el-palmo-first",
        at: 30,
        duration: 35,
        title: text("1차 푸어", "First pour", "一投目"),
        water: "to 160 g",
        instruction: text("중간 물줄기로 160g까지 올립니다.", "Use a medium stream and pour to 160 g.", "中くらいの湯量で160gまで注ぎます。")
      },
      {
        id: "bb-el-palmo-second",
        at: 65,
        duration: 90,
        title: text("2차 푸어", "Second pour", "二投目"),
        water: "to 320 g",
        instruction: text("320g까지 올린 뒤 가볍게 스월링합니다.", "Pour to 320 g, then swirl lightly.", "320gまで注ぎ、軽くスワールします。")
      }
    ]
  },
  standardRecipe(
    "brew-bean-brothers-honduras-la-tina",
    "bean-brothers-honduras-la-tina",
    text("상세 레시피 확인 전까지 사용하는 시즌 싱글오리진 기본 레시피입니다.", "A seasonal single-origin default until a detailed recipe is confirmed.", "詳細レシピ確認前に使う季節のシングルオリジン向け標準レシピです。")
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
    text("기존 프로토타입 원두용 기본 레시피입니다. 공식 KOOK 레시피는 확인 필요입니다.", "A default recipe for the retained prototype bean; official KOOK recipe needs review.", "既存プロトタイプ豆向けの標準レシピです。KOOK公式レシピは確認が必要です。")
  )
];

export function getRecipeById(id: string) {
  return brewRecipes.find((recipe) => recipe.id === id);
}

export function getRecipeByBeanId(beanId: string) {
  return brewRecipes.find((recipe) => recipe.beanId === beanId);
}
