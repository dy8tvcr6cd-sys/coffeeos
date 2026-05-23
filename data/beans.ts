import type { LocalizedText } from "@/lib/i18n";
import type { Bean, CupNote, CupNoteCategory, CupNoteStage } from "@/types/bean";

const researchedAt = "2026-05-23";

function text(ko: string, en: string, ja: string): LocalizedText {
  return { ko, en, ja };
}

function note(
  ko: string,
  en: string,
  ja: string,
  category: CupNoteCategory,
  color: string,
  intensity = 3
): CupNote {
  return { name: text(ko, en, ja), category, color, intensity };
}

const unknownNote = note("로스터리 등록 예정", "To be registered", "登録予定", "unknown", "#A8A29E", 1);

function cupStages(hotNotes: CupNote[], hotDescription: LocalizedText): CupNoteStage[] {
  return [
    {
      stage: "HOT",
      notes: hotNotes.length ? hotNotes : [unknownNote],
      description: hotDescription
    },
    {
      stage: "WARM",
      notes: [unknownNote],
      description: text(
        "따뜻함이 내려가며 단맛과 질감의 변화를 기록할 수 있습니다.",
        "As the cup cools, sweetness and texture can be tracked more clearly.",
        "温度が下がるにつれて、甘さと質感の変化を記録できます。"
      )
    },
    {
      stage: "COLD",
      notes: [unknownNote],
      description: text(
        "식은 뒤에는 산미, 단맛, 여운의 균형을 중심으로 기록합니다.",
        "In the cooled cup, focus on acidity, sweetness, balance, and finish.",
        "冷めた後は、酸、甘さ、余韻のバランスを中心に記録します。"
      )
    }
  ];
}

export const beans: Bean[] = [
  {
    id: "momos-honduras-coe-la-pena",
    slug: "momos-honduras-coe-la-pena",
    roasteryId: "momos-coffee",
    name: text("온두라스 COE 라 페냐 파카스 워시드", "Honduras COE La Pena Pacas Washed", "ホンジュラス COE ラ・ペニャ パカス ウォッシュト"),
    farmId: "la-pena",
    country: text("온두라스", "Honduras", "ホンジュラス"),
    region: text("정보 없음", "Not available", "情報なし"),
    farm: text("라 페냐", "La Pena", "ラ・ペニャ"),
    producer: text("정보 없음", "Not available", "情報なし"),
    variety: "Pacas",
    altitude: null,
    process: text("워시드", "Washed", "ウォッシュト"),
    roastLevel: "unknown",
    harvestPeriod: null,
    moisture: null,
    density: null,
    cupNotes: cupStages(
      [
        note("아몬드", "almond", "アーモンド", "nutty", "#C8A45D", 3),
        note("사과", "apple", "りんご", "fruit", "#C85D5D", 3),
        note("맥아시럽", "malt syrup", "モルトシロップ", "sweet", "#B9813F", 3),
        note("배", "pear", "洋梨", "fruit", "#B8C77A", 2)
      ],
      text(
        "견과류의 단단함과 사과, 배 계열의 깨끗한 과일감이 차분하게 이어집니다.",
        "Almond-like structure carries clean apple and pear fruit with a malt-like sweetness.",
        "アーモンドの骨格に、りんごや洋梨のきれいな果実感、モルトのような甘さが続きます。"
      )
    ),
    roastingIntent: text(
      "견과의 구조와 과일의 투명한 단맛이 함께 보이도록 정돈한 프로파일입니다.",
      "A profile tuned to show both nut-like structure and transparent fruit sweetness.",
      "ナッツの骨格と透明感のある果実の甘さを一緒に見せるプロファイルです。"
    ),
    farmStory: text(
      "라 페냐 랏은 파카스 품종의 단단한 구조와 워시드 프로세스의 깨끗함을 중심으로 소개됩니다.",
      "La Pena is presented around the structured character of Pacas and the clean expression of washed processing.",
      "ラ・ペニャのロットは、パカスの骨格とウォッシュトプロセスの清潔感を中心に紹介されます。"
    ),
    recommendedBrewIds: ["brew-momos-honduras-coe-la-pena"],
    purchaseUrl: "https://momos.co.kr/product/%EC%9B%90%EB%91%90-%EC%98%A8%EB%91%90%EB%9D%BC%EC%8A%A4-coe-%EB%9D%BC-%ED%8E%98%EB%83%90-%ED%8C%8C%EC%B9%B4%EC%8A%A4-%EC%9B%8C%EC%8B%9C%EB%93%9C/2764/",
    sourceUrl: "https://momos.co.kr/product/%EC%9B%90%EB%91%90-%EC%98%A8%EB%91%90%EB%9D%BC%EC%8A%A4-coe-%EB%9D%BC-%ED%8E%98%EB%83%90-%ED%8C%8C%EC%B9%B4%EC%8A%A4-%EC%9B%8C%EC%8B%9C%EB%93%9C/2764/",
    price: 34000,
    tags: ["almond", "apple", "pear", "washed", "honduras"],
    similarBeanIds: ["bean-brothers-peru-el-palmo", "center-ethiopia-guji-hambella-wate", "momos-busan-blend"],
    status: "confirmed",
    lastResearchedAt: researchedAt
  },
  {
    id: "momos-busan-blend",
    slug: "momos-busan-blend",
    roasteryId: "momos-coffee",
    name: text("부산 블렌드", "Busan Blend", "釜山ブレンド"),
    farmId: null,
    country: text("브라질 · 에티오피아", "Brazil · Ethiopia", "ブラジル · エチオピア"),
    region: text("정보 없음", "Not available", "情報なし"),
    farm: text("블렌드", "Blend", "ブレンド"),
    producer: text("정보 없음", "Not available", "情報なし"),
    variety: null,
    altitude: null,
    process: text("로스터리 등록 예정", "To be registered", "登録予定"),
    roastLevel: "unknown",
    harvestPeriod: null,
    moisture: null,
    density: null,
    cupNotes: cupStages(
      [
        note("로스티드 넛", "roasted nut", "ローストナッツ", "nutty", "#9A6A3A", 3),
        note("카라멜", "caramel", "キャラメル", "sweet", "#C68B45", 3),
        note("건과일", "dried fruit", "ドライフルーツ", "fruit", "#B45D4E", 2)
      ],
      text(
        "고소한 견과와 캐러멜 중심의 안정적인 블렌드로, 은은한 건과일 인상이 뒤를 받칩니다.",
        "A steady blend built around roasted nuts and caramel, supported by a quiet dried-fruit impression.",
        "ローストナッツとキャラメルを軸に、ほのかなドライフルーツ感が支える安定したブレンドです。"
      )
    ),
    roastingIntent: text(
      "견과와 캐러멜의 안정적인 단맛을 매일 마시기 편한 균형으로 설계한 블렌드입니다.",
      "A daily blend shaped around steady nutty-caramel sweetness and easy balance.",
      "ナッツとキャラメルの安定した甘さを、毎日飲みやすいバランスに整えたブレンドです。"
    ),
    farmStory: text(
      "부산 블렌드는 산지의 개별성을 한 잔의 균형감으로 묶어내는 블렌드로 소개됩니다.",
      "Busan Blend presents multiple origins through one balanced, accessible cup.",
      "釜山ブレンドは、複数の産地を一杯のバランスとしてまとめるブレンドです。"
    ),
    recommendedBrewIds: ["brew-momos-busan-blend"],
    purchaseUrl: "https://momos.co.kr/product/detail.html?page_4=56&page_6=11&product_no=737",
    sourceUrl: "https://momos.co.kr/product/detail.html?page_4=56&page_6=11&product_no=737",
    price: 15000,
    tags: ["blend", "nutty", "caramel", "daily"],
    similarBeanIds: ["coffee-libre-vertigo", "fritz-old-dog", "on-m-blending"],
    status: "confirmed",
    lastResearchedAt: researchedAt
  },
  {
    id: "fritz-old-dog",
    slug: "fritz-old-dog",
    roasteryId: "fritz-coffee-company",
    name: text("올드독", "Old Dog", "オールドドッグ"),
    farmId: null,
    country: text("정보 없음", "Not available", "情報なし"),
    region: text("정보 없음", "Not available", "情報なし"),
    farm: text("블렌드", "Blend", "ブレンド"),
    producer: text("정보 없음", "Not available", "情報なし"),
    variety: null,
    altitude: null,
    process: text("로스터리 등록 예정", "To be registered", "登録予定"),
    roastLevel: "unknown",
    harvestPeriod: null,
    moisture: null,
    density: null,
    cupNotes: cupStages(
      [
        note("달콤쌉싸름함", "bittersweet", "ビタースイート", "chocolate", "#5B4636", 3),
        note("묵직한 바디", "full body", "しっかりしたボディ", "unknown", "#6B625A", 3)
      ],
      text(
        "달콤쌉싸름한 풍미와 묵직한 질감이 중심을 잡는 안정적인 블렌드입니다.",
        "A steady blend centered on bittersweet flavor and a full, weighty body.",
        "ビタースイートな風味としっかりした質感が中心の安定したブレンドです。"
      )
    ),
    roastingIntent: text(
      "에스프레소와 밀크 베이스 모두에서 묵직한 단맛이 남도록 설계된 블렌드입니다.",
      "A blend shaped to hold weighty sweetness across espresso and milk drinks.",
      "エスプレッソでもミルクでも、厚みのある甘さが残るように設計されたブレンドです。"
    ),
    farmStory: text(
      "올드독은 여러 산지의 질감과 단맛을 하나의 클래식한 블렌드 경험으로 묶습니다.",
      "Old Dog brings texture and sweetness from multiple origins into a classic blend experience.",
      "オールドドッグは、複数産地の質感と甘さをクラシックなブレンド体験としてまとめます。"
    ),
    recommendedBrewIds: ["brew-fritz-old-dog"],
    purchaseUrl: "https://fritz.co.kr/product/%ED%94%84%EB%A6%B3%EC%B8%A0-%EC%98%AC%EB%93%9C-%EB%8F%85-old-dog-fritz-blend-coffee-bean/91/",
    sourceUrl: "https://fritz.co.kr/product/%ED%94%84%EB%A6%B3%EC%B8%A0-%EC%98%AC%EB%93%9C-%EB%8F%85-old-dog-fritz-blend-coffee-bean/91/",
    price: 16000,
    tags: ["blend", "bittersweet", "body", "espresso"],
    similarBeanIds: ["coffee-libre-vertigo", "momos-busan-blend", "center-may-day-blend"],
    status: "confirmed",
    lastResearchedAt: researchedAt
  },
  {
    id: "center-may-day-blend",
    slug: "center-may-day-blend",
    roasteryId: "center-coffee",
    name: text("메이데이 블렌드", "May Day Blend", "メイデイブレンド"),
    farmId: null,
    country: text("과테말라 · 콜롬비아 · 에티오피아", "Guatemala · Colombia · Ethiopia", "グアテマラ · コロンビア · エチオピア"),
    region: text("Huehuetenango · Sierra Nevada · Yirgacheffe", "Huehuetenango · Sierra Nevada · Yirgacheffe", "ウエウエテナンゴ · シエラネバダ · イルガチェフェ"),
    farm: text("블렌드", "Blend", "ブレンド"),
    producer: text("정보 없음", "Not available", "情報なし"),
    variety: "Bourbon, Typica, Colombia, Heirloom",
    altitude: null,
    process: text("워시드 · 내추럴", "Washed · Natural", "ウォッシュト · ナチュラル"),
    roastLevel: "unknown",
    harvestPeriod: null,
    moisture: null,
    density: null,
    cupNotes: cupStages(
      [
        note("캐러멜", "caramel", "キャラメル", "sweet", "#C68B45", 3),
        note("복합 과일", "layered fruit", "複合的な果実感", "fruit", "#C85D5D", 3),
        note("견과", "nuts", "ナッツ", "nutty", "#9A6A3A", 2)
      ],
      text(
        "캐러멜 단맛과 과일감, 견과 질감이 균형을 이루는 편안한 블렌드입니다.",
        "A comfortable blend where caramel sweetness, layered fruit, and nutty texture stay in balance.",
        "キャラメルの甘さ、果実感、ナッツの質感が調和する心地よいブレンドです。"
      )
    ),
    roastingIntent: text(
      "일상 속 짧은 휴식처럼 느껴지는 단맛과 균형을 목표로 한 시그니처 블렌드입니다.",
      "A signature blend aimed at sweetness and balance that feels like a short pause in the day.",
      "日常の小さな休息のように感じられる甘さとバランスを目指したシグネチャーブレンドです。"
    ),
    farmStory: text(
      "과테말라, 콜롬비아, 에티오피아의 서로 다른 질감을 한 잔의 균형으로 묶어냅니다.",
      "Guatemala, Colombia, and Ethiopia bring different textures into one balanced cup.",
      "グアテマラ、コロンビア、エチオピアの異なる質感を、一杯のバランスとしてまとめています。"
    ),
    recommendedBrewIds: ["brew-center-may-day-blend"],
    purchaseUrl: "https://www.centercoffee.co.kr/shop",
    sourceUrl: "https://www.centercoffee.co.kr/coffeewholesale",
    price: 15000,
    tags: ["blend", "caramel", "fruit", "espresso"],
    similarBeanIds: ["fritz-old-dog", "coffee-libre-vertigo", "momos-busan-blend"],
    status: "confirmed",
    lastResearchedAt: researchedAt
  },
  {
    id: "center-ethiopia-guji-hambella-wate",
    slug: "center-ethiopia-guji-hambella-wate",
    roasteryId: "center-coffee",
    name: text("에티오피아 구지 함벨라 와테 허니 G1", "Ethiopia Guji Hambella Wate Honey G1", "エチオピア グジ ハンベラ ワテ ハニー G1"),
    farmId: "hambella-wate",
    country: text("에티오피아", "Ethiopia", "エチオピア"),
    region: text("Guji Hambella", "Guji Hambella", "グジ・ハンベラ"),
    farm: text("Wate", "Wate", "ワテ"),
    producer: text("로스터리 등록 예정", "To be registered", "登録予定"),
    variety: null,
    altitude: null,
    process: text("허니", "Honey", "ハニー"),
    roastLevel: "unknown",
    harvestPeriod: null,
    moisture: null,
    density: null,
    cupNotes: cupStages(
      [unknownNote],
      text(
        "허니 프로세스 특유의 단맛과 에티오피아 커피의 산뜻한 향을 중심으로 기록을 이어갈 수 있습니다.",
        "A honey-processed Ethiopia suited to tracking sweetness and lively aromatics in the cup.",
        "ハニープロセスらしい甘さとエチオピアらしい明るい香りを中心に記録できます。"
      )
    ),
    roastingIntent: text(
      "밝은 산미와 꿀 같은 단맛이 균형 있게 보이도록 설계하는 싱글오리진입니다.",
      "A single origin shaped to balance bright acidity with honeyed sweetness.",
      "明るい酸と蜜のような甘さがバランスよく見えるように設計されたシングルオリジンです。"
    ),
    farmStory: text(
      "함벨라 와테는 에티오피아 구지 지역의 산뜻한 향미를 CoffeeOS 기록으로 이어가기 좋은 랏입니다.",
      "Hambella Wate is a Guji, Ethiopia lot suited to building sensory records around lively aromatics.",
      "ハンベラ・ワテは、エチオピア・グジの明るい香味をCoffeeOSの記録につなげやすいロットです。"
    ),
    recommendedBrewIds: ["brew-center-ethiopia-guji-hambella-wate"],
    purchaseUrl: "https://www.centercoffee.co.kr/",
    sourceUrl: "https://www.centercoffee.co.kr/",
    price: 27000,
    tags: ["ethiopia", "honey", "single-origin", "needs-review"],
    similarBeanIds: ["momos-honduras-coe-la-pena", "bean-brothers-peru-el-palmo", "namusairo-pino-alto-geisha-natural"],
    status: "needs_review",
    lastResearchedAt: researchedAt
  },
  {
    id: "coffee-libre-vertigo",
    slug: "coffee-libre-vertigo",
    roasteryId: "coffee-libre",
    name: text("버티고", "Vertigo", "ヴァーティゴ"),
    farmId: null,
    country: text("인도 · 콜롬비아 · 온두라스", "India · Colombia · Honduras", "インド · コロンビア · ホンジュラス"),
    region: text("정보 없음", "Not available", "情報なし"),
    farm: text("블렌드", "Blend", "ブレンド"),
    producer: text("정보 없음", "Not available", "情報なし"),
    variety: null,
    altitude: null,
    process: text("로스터리 등록 예정", "To be registered", "登録予定"),
    roastLevel: "medium-dark",
    harvestPeriod: null,
    moisture: null,
    density: null,
    cupNotes: cupStages(
      [
        note("초콜릿", "chocolate", "チョコレート", "chocolate", "#5B4636", 4),
        note("너트", "nuts", "ナッツ", "nutty", "#9A6A3A", 3)
      ],
      text(
        "초콜릿과 고소한 견과류가 중심을 잡는 중강배전 블렌드입니다.",
        "A medium-dark blend centered on chocolate and nutty sweetness.",
        "チョコレートとナッツの甘さが中心の中深煎りブレンドです。"
      )
    ),
    roastingIntent: text(
      "부담 없는 가격대에서도 진한 단맛과 안정적인 바디가 느껴지도록 설계한 블렌드입니다.",
      "An accessible blend designed to deliver rich sweetness and dependable body.",
      "親しみやすい価格帯でも、濃い甘さと安定したボディを感じられるように設計されたブレンドです。"
    ),
    farmStory: text(
      "인도, 콜롬비아, 온두라스의 밀도와 단맛을 블렌드 구조 안에서 안정적으로 연결합니다.",
      "India, Colombia, and Honduras are connected through a stable blend structure of density and sweetness.",
      "インド、コロンビア、ホンジュラスの密度感と甘さを、安定したブレンド構造でつなげています。"
    ),
    recommendedBrewIds: ["brew-coffee-libre-vertigo"],
    purchaseUrl: "https://coffeelibre.kr/product/%EB%B2%84%ED%8B%B0%EA%B3%A0/793/",
    sourceUrl: "https://coffeelibre.kr/product/%EB%B2%84%ED%8B%B0%EA%B3%A0/793/",
    price: 13000,
    tags: ["blend", "chocolate", "nutty", "medium-dark"],
    similarBeanIds: ["fritz-old-dog", "momos-busan-blend", "center-may-day-blend"],
    status: "confirmed",
    lastResearchedAt: researchedAt
  },
  {
    id: "bean-brothers-peru-el-palmo",
    slug: "bean-brothers-peru-el-palmo",
    roasteryId: "bean-brothers",
    name: text("페루 엘 팔모", "Peru El Palmo", "ペルー エル・パルモ"),
    farmId: "el-palmo",
    country: text("페루", "Peru", "ペルー"),
    region: text("카하마르카", "Cajamarca", "カハマルカ"),
    farm: text("엘 팔모", "El Palmo", "エル・パルモ"),
    producer: text("마누엘 엘레라", "Manuel Herrera", "マヌエル・エレラ"),
    variety: "Caturra, Pache, Typica",
    altitude: "1,800-2,000 MASL",
    process: text("워시드", "Washed", "ウォッシュト"),
    roastLevel: "medium",
    harvestPeriod: "2026-04 release",
    moisture: null,
    density: null,
    cupNotes: cupStages(
      [
        note("홍로 사과", "sweet apple", "甘いりんご", "fruit", "#C85D5D", 3),
        note("감귤", "mandarin", "みかん", "citrus", "#E6A23C", 3),
        note("메이플 시럽", "maple syrup", "メープルシロップ", "sweet", "#B9813F", 3),
        note("바닐라", "vanilla", "バニラ", "sweet", "#E7DED2", 2)
      ],
      text(
        "사과와 감귤의 산뜻함 위에 메이플과 바닐라의 단맛이 정돈되게 이어집니다.",
        "Fresh apple and mandarin acidity are supported by maple and vanilla sweetness.",
        "りんごとみかんの爽やかさに、メープルとバニラの甘さが整って続きます。"
      )
    ),
    roastingIntent: text(
      "사과와 감귤의 산뜻함을 해치지 않으면서 메이플 같은 단맛을 길게 남기는 미디엄 프로파일입니다.",
      "A medium profile that preserves apple-citrus brightness while extending maple-like sweetness.",
      "りんごと柑橘の明るさを保ちつつ、メープルのような甘さを長く残すミディアムプロファイルです。"
    ),
    farmStory: text(
      "엘 팔모 랏은 높은 고도에서 자란 페루 커피의 선명한 과일감과 부드러운 단맛을 보여줍니다.",
      "El Palmo shows the clear fruit and soft sweetness of high-grown Peruvian coffee.",
      "エル・パルモは、高地で育ったペルーコーヒーの明るい果実感とやわらかな甘さを見せます。"
    ),
    recommendedBrewIds: ["brew-bean-brothers-peru-el-palmo"],
    purchaseUrl: "https://www.beanbrothers.co.kr/info/coffeewiki_detail?cateCd=006008001&cateNm=SEASONAL&goodsNo=1000001486",
    sourceUrl: "https://www.beanbrothers.co.kr/info/coffeewiki_detail?cateCd=006008001&cateNm=SEASONAL&goodsNo=1000001486",
    price: 20000,
    tags: ["peru", "apple", "citrus", "washed", "medium"],
    similarBeanIds: ["momos-honduras-coe-la-pena", "center-ethiopia-guji-hambella-wate", "namusairo-pino-alto-geisha-natural"],
    status: "confirmed",
    lastResearchedAt: researchedAt
  },
  {
    id: "bean-brothers-honduras-la-tina",
    slug: "bean-brothers-honduras-la-tina",
    roasteryId: "bean-brothers",
    name: text("온두라스 라 티나", "Honduras La Tina", "ホンジュラス ラ・ティナ"),
    farmId: "la-tina",
    country: text("온두라스", "Honduras", "ホンジュラス"),
    region: text("로스터리 등록 예정", "To be registered", "登録予定"),
    farm: text("라 티나", "La Tina", "ラ・ティナ"),
    producer: text("로스터리 등록 예정", "To be registered", "登録予定"),
    variety: null,
    altitude: null,
    process: text("로스터리 등록 예정", "To be registered", "登録予定"),
    roastLevel: "unknown",
    harvestPeriod: null,
    moisture: null,
    density: null,
    cupNotes: cupStages(
      [
        note("포도", "grape", "ぶどう", "fruit", "#7C3A6D", 3),
        note("패션프루트", "passion fruit", "パッションフルーツ", "fruit", "#E0A22F", 3),
        note("체리 초콜릿", "cherry chocolate", "チェリーチョコレート", "chocolate", "#8A3042", 3)
      ],
      text(
        "포도와 패션프루트의 새콤달콤함, 체리 초콜릿의 진한 단맛이 핵심입니다.",
        "Sweet-tart grape and passion fruit meet richer cherry-chocolate sweetness.",
        "ぶどうとパッションフルーツの甘酸っぱさに、チェリーチョコレートの濃い甘さが重なります。"
      )
    ),
    roastingIntent: text(
      "붉은 과일의 산미와 초콜릿 계열의 단맛이 함께 남도록 정리한 시즌 프로파일입니다.",
      "A seasonal profile arranged around red-fruit acidity and chocolate-like sweetness.",
      "赤い果実の酸とチョコレート系の甘さが一緒に残るように整えた季節のプロファイルです。"
    ),
    farmStory: text(
      "라 티나는 과일감이 선명한 온두라스 시즌 원두로, 추출 온도에 따른 산미 변화를 기록하기 좋습니다.",
      "La Tina is a fruit-forward seasonal Honduras coffee, well suited to tracking acidity across brew temperatures.",
      "ラ・ティナは果実感のはっきりしたホンジュラスの季節豆で、抽出温度による酸の変化を記録しやすいコーヒーです。"
    ),
    recommendedBrewIds: ["brew-bean-brothers-honduras-la-tina"],
    purchaseUrl: "https://beanbrothers.co.kr/main/index.php",
    sourceUrl: "https://beanbrothers.co.kr/main/index.php",
    price: 21000,
    tags: ["honduras", "grape", "passion-fruit", "chocolate"],
    similarBeanIds: ["bean-brothers-peru-el-palmo", "momos-honduras-coe-la-pena", "namusairo-pino-alto-geisha-natural"],
    status: "needs_review",
    lastResearchedAt: researchedAt
  },
  {
    id: "namusairo-pino-alto-geisha-natural",
    slug: "namusairo-pino-alto-geisha-natural",
    roasteryId: "namusairo-coffee",
    name: text("피노 알토 게샤 내추럴", "Pino Alto Geisha Natural", "ピノ・アルト ゲイシャ ナチュラル"),
    farmId: "pino-alto",
    country: text("로스터리 등록 예정", "To be registered", "登録予定"),
    region: text("로스터리 등록 예정", "To be registered", "登録予定"),
    farm: text("피노 알토", "Pino Alto", "ピノ・アルト"),
    producer: text("로스터리 등록 예정", "To be registered", "登録予定"),
    variety: "Geisha",
    altitude: null,
    process: text("내추럴", "Natural", "ナチュラル"),
    roastLevel: "unknown",
    harvestPeriod: null,
    moisture: null,
    density: null,
    cupNotes: cupStages(
      [
        note("리치", "lychee", "ライチ", "fruit", "#EAB8C8", 4),
        note("라즈베리", "raspberry", "ラズベリー", "berry", "#C83B5E", 4),
        note("레드와인", "red wine", "赤ワイン", "fruit", "#722F37", 3),
        note("건자두", "prune", "プルーン", "fruit", "#4D2D3A", 3)
      ],
      text(
        "리치와 라즈베리의 선명한 과실감에 레드와인과 건자두의 깊이가 더해집니다.",
        "Bright lychee and raspberry fruit are layered with red wine and prune depth.",
        "ライチとラズベリーの鮮やかな果実感に、赤ワインとプルーンの深みが重なります。"
      )
    ),
    roastingIntent: text(
      "내추럴 게이샤의 향을 크게 열되, 식을수록 과실감이 흐트러지지 않도록 정리한 프로파일입니다.",
      "A profile that opens natural Geisha aromatics while keeping the fruit focused as it cools.",
      "ナチュラルゲイシャの香りを大きく開き、冷めても果実感が崩れにくいように整えたプロファイルです。"
    ),
    farmStory: text(
      "피노 알토는 향의 개성이 강한 게이샤 랏으로, 감각 기록을 통해 온도별 변화가 잘 드러나는 커피입니다.",
      "Pino Alto is an expressive Geisha lot whose temperature changes become clear through sensory records.",
      "ピノ・アルトは香りの個性が強いゲイシャロットで、感覚記録によって温度ごとの変化が見えやすいコーヒーです。"
    ),
    recommendedBrewIds: ["brew-namusairo-pino-alto-geisha-natural"],
    purchaseUrl: "https://namusairo.com/",
    sourceUrl: "https://namusairo.com/",
    price: null,
    tags: ["geisha", "lychee", "raspberry", "natural"],
    similarBeanIds: ["bean-brothers-honduras-la-tina", "center-ethiopia-guji-hambella-wate", "momos-honduras-coe-la-pena"],
    status: "needs_review",
    lastResearchedAt: researchedAt
  },
  {
    id: "namusairo-picnic",
    slug: "namusairo-picnic",
    roasteryId: "namusairo-coffee",
    name: text("피크닉", "Picnic", "ピクニック"),
    farmId: null,
    country: text("콜롬비아 · 에티오피아", "Colombia · Ethiopia", "コロンビア · エチオピア"),
    region: text("정보 없음", "Not available", "情報なし"),
    farm: text("블렌드", "Blend", "ブレンド"),
    producer: text("정보 없음", "Not available", "情報なし"),
    variety: null,
    altitude: null,
    process: text("로스터리 등록 예정", "To be registered", "登録予定"),
    roastLevel: "unknown",
    harvestPeriod: null,
    moisture: null,
    density: null,
    cupNotes: cupStages(
      [
        note("피크닉 무드", "picnic mood", "ピクニックの印象", "unknown", "#C8A45D", 2)
      ],
      text(
        "콜롬비아와 에티오피아의 밝은 인상을 피크닉처럼 가볍고 편안한 무드로 엮은 블렌드입니다.",
        "A relaxed blend that brings Colombia and Ethiopia into a bright, picnic-like mood.",
        "コロンビアとエチオピアの明るい印象を、ピクニックのように軽やかで心地よいムードにまとめたブレンドです。"
      )
    ),
    roastingIntent: text(
      "밝은 과일감과 편안한 단맛을 일상적으로 즐길 수 있게 정리한 블렌드입니다.",
      "A blend arranged for everyday enjoyment of bright fruit and comfortable sweetness.",
      "明るい果実感と心地よい甘さを日常的に楽しめるように整えたブレンドです。"
    ),
    farmStory: text(
      "피크닉은 서로 다른 산지의 밝은 향을 편안한 블렌드 경험으로 연결합니다.",
      "Picnic connects bright aromatics from different origins into an easy blend experience.",
      "ピクニックは、異なる産地の明るい香りを心地よいブレンド体験としてつなげます。"
    ),
    recommendedBrewIds: ["brew-namusairo-picnic"],
    purchaseUrl: "https://namusairo.com/",
    sourceUrl: "https://namusairo.com/",
    price: 20500,
    tags: ["blend", "colombia", "ethiopia", "needs-review"],
    similarBeanIds: ["center-may-day-blend", "momos-busan-blend", "coffee-libre-vertigo"],
    status: "needs_review",
    lastResearchedAt: researchedAt
  },
  {
    id: "on-m-blending",
    slug: "on-m-blending",
    roasteryId: "on-roastery",
    name: text("ON M 블렌딩", "ON M Blending", "ON M ブレンド"),
    farmId: null,
    country: text("인도 · 브라질 · 콜롬비아", "India · Brazil · Colombia", "インド · ブラジル · コロンビア"),
    region: text("정보 없음", "Not available", "情報なし"),
    farm: text("블렌드", "Blend", "ブレンド"),
    producer: text("정보 없음", "Not available", "情報なし"),
    variety: null,
    altitude: null,
    process: text("로스터리 등록 예정", "To be registered", "登録予定"),
    roastLevel: "medium-dark",
    harvestPeriod: null,
    moisture: null,
    density: null,
    cupNotes: cupStages(
      [
        note("고소함", "nutty", "ナッツ感", "nutty", "#9A6A3A", 4),
        note("단맛", "sweetness", "甘さ", "sweet", "#C8A45D", 4)
      ],
      text(
        "견과류 인상과 단맛, 부드러운 질감이 중심을 이루는 블렌드입니다.",
        "A blend centered on nutty sweetness and a smooth texture.",
        "ナッツ感のある甘さと、なめらかな質感が中心のブレンドです。"
      )
    ),
    roastingIntent: text(
      "견과의 고소함과 설계된 단맛이 안정적으로 느껴지도록 구성한 미디엄다크 블렌드입니다.",
      "A medium-dark blend arranged for stable nutty sweetness and smooth structure.",
      "ナッツの香ばしさと設計された甘さが安定して感じられるミディアムダークブレンドです。"
    ),
    farmStory: text(
      "인도, 브라질, 콜롬비아의 단단한 질감을 부드러운 블렌드 경험으로 연결합니다.",
      "India, Brazil, and Colombia bring firm structure into a smooth blend experience.",
      "インド、ブラジル、コロンビアのしっかりした質感を、なめらかなブレンド体験につなげます。"
    ),
    recommendedBrewIds: ["brew-on-m-blending"],
    purchaseUrl: "https://biz.koke.kr/products/6522",
    sourceUrl: "https://biz.koke.kr/products/6522",
    price: null,
    tags: ["blend", "nutty", "sweet", "medium-dark", "needs-review"],
    similarBeanIds: ["coffee-libre-vertigo", "fritz-old-dog", "momos-busan-blend"],
    status: "needs_review",
    lastResearchedAt: researchedAt
  },
  {
    id: "peru-la-primavera-geisha-washed",
    slug: "peru-la-primavera-geisha-washed",
    roasteryId: "kook-coffee-roasters",
    name: text("페루 라 프리마베라 게이샤 워시드", "Peru La Primavera Geisha Washed", "ペルー ラ・プリマベーラ ゲイシャ ウォッシュト"),
    farmId: null,
    country: text("페루", "Peru", "ペルー"),
    region: text("로스터리 등록 예정", "To be registered", "登録予定"),
    farm: text("라 프리마베라", "La Primavera", "ラ・プリマベーラ"),
    producer: text("로스터리 등록 예정", "To be registered", "登録予定"),
    variety: "Geisha",
    altitude: null,
    process: text("워시드", "Washed", "ウォッシュト"),
    roastLevel: "unknown",
    harvestPeriod: null,
    moisture: null,
    density: null,
    cupNotes: cupStages(
      [unknownNote],
      text(
        "워시드 게이샤의 플로럴한 인상과 깨끗한 단맛을 중심으로 기록을 이어갈 수 있습니다.",
        "A washed Geisha profile suited to tracking floral aromatics and clean sweetness.",
        "ウォッシュドゲイシャのフローラルな印象ときれいな甘さを中心に記録できます。"
      )
    ),
    roastingIntent: text(
      "게이샤의 향을 맑게 열고 워시드 특유의 깨끗한 여운을 남기는 방향입니다.",
      "A profile that opens Geisha aromatics clearly and leaves a clean washed finish.",
      "ゲイシャの香りを澄んだ形で開き、ウォッシュトらしいきれいな余韻を残す方向です。"
    ),
    farmStory: text(
      "라 프리마베라 게이샤는 향의 투명도와 단맛의 선을 중심으로 경험을 쌓아가기 좋은 커피입니다.",
      "La Primavera Geisha is suited to building records around aromatic clarity and a clean line of sweetness.",
      "ラ・プリマベーラ ゲイシャは、香りの透明感と甘さの輪郭を中心に体験を積み重ねやすいコーヒーです。"
    ),
    recommendedBrewIds: ["brew-peru-la-primavera-geisha-washed"],
    purchaseUrl: null,
    sourceUrl: null,
    price: null,
    tags: ["prototype", "needs-review", "geisha"],
    similarBeanIds: ["momos-honduras-coe-la-pena", "bean-brothers-peru-el-palmo", "center-ethiopia-guji-hambella-wate"],
    status: "needs_review",
    lastResearchedAt: researchedAt
  }
];

export function getBeanById(id: string) {
  return beans.find((bean) => bean.id === id);
}

export function getBeansByRoastery(roasteryId: string) {
  return beans.filter((bean) => bean.roasteryId === roasteryId);
}
