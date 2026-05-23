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

const unknownNote = note("확인 필요", "Needs review", "確認が必要", "unknown", "#A8A29E", 1);

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
        "공식 자료에서 온도별 향미 변화는 확인되지 않았습니다.",
        "Temperature-stage changes were not confirmed in the official source.",
        "公式情報では温度ごとの味わい変化は確認できませんでした。"
      )
    },
    {
      stage: "COLD",
      notes: [unknownNote],
      description: text(
        "식은 뒤의 컵 노트는 현장 기록이 필요합니다.",
        "A cooled-cup profile needs an in-person sensory record.",
        "冷めた後のカップノートは実際の記録が必要です。"
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
        "공식 노트는 견과류의 단단함과 사과, 배 계열의 깨끗한 과일감을 제시합니다.",
        "Official notes point to almond structure, clean apple and pear fruit, and malt-like sweetness.",
        "公式ノートでは、アーモンドの骨格、りんごや洋梨の果実感、モルトのような甘さが示されています。"
      )
    ),
    roastingIntent: text("확인 필요", "Needs review", "確認が必要"),
    farmStory: text("공식 상품 페이지에서 농장 상세 스토리는 확인되지 않았습니다.", "Detailed farm story was not confirmed on the official product page.", "公式商品ページでは農園の詳細ストーリーは確認できませんでした。"),
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
    process: text("확인 필요", "Needs review", "確認が必要"),
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
    roastingIntent: text("확인 필요", "Needs review", "確認が必要"),
    farmStory: text("블렌드 구성 외 상세 산지 이야기는 확인되지 않았습니다.", "Detailed origin story beyond blend composition was not confirmed.", "ブレンド構成以外の産地ストーリーは確認できませんでした。"),
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
    process: text("확인 필요", "Needs review", "確認が必要"),
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
        "공식 설명에서 확인되는 방향은 달콤쌉싸름한 풍미와 묵직한 질감입니다.",
        "The official product page presents it as bittersweet with a full, weighty body.",
        "公式商品ページでは、ビタースイートな風味としっかりした質感が示されています。"
      )
    ),
    roastingIntent: text("확인 필요", "Needs review", "確認が必要"),
    farmStory: text("블렌드 산지 구성은 공식 페이지에서 확인되지 않았습니다.", "Blend origin composition was not confirmed on the official page.", "公式ページではブレンドの産地構成は確認できませんでした。"),
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
        "공식 도매 페이지의 구성 정보를 바탕으로, 캐러멜 단맛과 과일감, 견과 질감이 균형을 이루는 블렌드로 정리했습니다.",
        "Based on the official wholesale page, this blend reads as caramel-sweet, fruit-layered, and nutty in structure.",
        "公式卸ページの情報をもとに、キャラメルの甘さ、果実感、ナッツの質感が調和するブレンドとして整理しました。"
      )
    ),
    roastingIntent: text("휴식 같은 한 잔을 목표로 만든 시그니처 블렌드라는 공식 문맥이 확인됩니다.", "The official context frames it as a signature blend made to feel like a pause in the day.", "公式文脈では、一日の休息のようなシグネチャーブレンドとして紹介されています。"),
    farmStory: text("각 구성 산지의 세부 스토리는 공식 도매 페이지에 일부만 공개되어 있습니다.", "Component origin stories are partially available on the official wholesale page.", "構成産地の詳細ストーリーは公式卸ページで一部確認できます。"),
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
    region: text("Guji Hambella, 확인 필요", "Guji Hambella, needs review", "グジ・ハンベラ、確認が必要"),
    farm: text("Wate, 확인 필요", "Wate, needs review", "ワテ、確認が必要"),
    producer: text("정보 없음", "Not available", "情報なし"),
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
        "공식 목록에서 상품명과 가격은 확인되지만 세부 컵 노트는 추가 확인이 필요합니다.",
        "The official listing confirms the product name and price, but detailed cup notes need review.",
        "公式一覧で商品名と価格は確認できますが、詳細なカップノートは追加確認が必要です。"
      )
    ),
    roastingIntent: text("확인 필요", "Needs review", "確認が必要"),
    farmStory: text("확인 필요", "Needs review", "確認が必要"),
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
    process: text("확인 필요", "Needs review", "確認が必要"),
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
        "공식 정보 기준으로 초콜릿과 고소한 견과류가 중심인 중강배전 블렌드입니다.",
        "Official information frames Vertigo as a medium-dark blend centered on chocolate and nuts.",
        "公式情報では、チョコレートとナッツを中心にした中深煎りブレンドとして示されています。"
      )
    ),
    roastingIntent: text("합리적이면서도 설득력 있는 블렌드 맛을 목표로 한 공식 문맥이 확인됩니다.", "The official context presents it as a persuasive, accessible blend.", "公式文脈では、納得感のある親しみやすいブレンドとして紹介されています。"),
    farmStory: text("블렌드 구성 비율은 확인되지만 개별 농장 스토리는 공개되지 않았습니다.", "Blend composition is confirmed, but individual farm stories are not public.", "ブレンド比率は確認できますが、個別農園のストーリーは公開されていません。"),
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
    roastingIntent: text("미디엄 로스팅 정보는 확인되며, 세부 로스팅 의도 문구는 확인 필요입니다.", "Medium roast is confirmed; detailed roasting intent needs review.", "ミディアムローストは確認できますが、詳細な焙煎意図は確認が必要です。"),
    farmStory: text("빈브라더스 커피위키에서 엘 팔모 랏과 생산자 정보를 확인할 수 있습니다. CoffeeOS에서는 핵심만 요약했습니다.", "Bean Brothers Coffee Wiki confirms the El Palmo lot and producer context; CoffeeOS summarizes the essentials.", "Bean Brothers Coffee Wikiでエル・パルモのロットと生産者情報が確認できます。CoffeeOSでは要点のみ整理しています。"),
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
    region: text("확인 필요", "Needs review", "確認が必要"),
    farm: text("라 티나", "La Tina", "ラ・ティナ"),
    producer: text("정보 없음", "Not available", "情報なし"),
    variety: null,
    altitude: null,
    process: text("확인 필요", "Needs review", "確認が必要"),
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
        "공식 메인 목록 기준으로 포도와 패션프루트의 새콤달콤함, 체리 초콜릿의 진한 단맛이 핵심입니다.",
        "The official listing highlights sweet-tart grape and passion fruit with richer cherry-chocolate sweetness.",
        "公式一覧では、ぶどうとパッションフルーツの甘酸っぱさ、チェリーチョコレートの濃い甘さが中心です。"
      )
    ),
    roastingIntent: text("확인 필요", "Needs review", "確認が必要"),
    farmStory: text("공식 메인 목록에서 세부 산지 정보는 확인되지 않았습니다.", "Detailed origin information was not confirmed in the official main listing.", "公式メイン一覧では詳細な産地情報は確認できませんでした。"),
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
    country: text("확인 필요", "Needs review", "確認が必要"),
    region: text("확인 필요", "Needs review", "確認が必要"),
    farm: text("피노 알토", "Pino Alto", "ピノ・アルト"),
    producer: text("정보 없음", "Not available", "情報なし"),
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
        "공식 목록의 노트는 리치와 라즈베리의 선명한 과실감, 레드와인과 건자두의 깊이를 보여줍니다.",
        "Official notes suggest bright lychee and raspberry fruit with red wine and prune depth.",
        "公式ノートでは、ライチとラズベリーの鮮やかな果実感に、赤ワインとプルーンの深みが見られます。"
      )
    ),
    roastingIntent: text("확인 필요", "Needs review", "確認が必要"),
    farmStory: text("공식 메인 목록에서 상세 농장 정보는 확인되지 않았습니다.", "Detailed farm information was not confirmed in the official main listing.", "公式メイン一覧では詳細な農園情報は確認できませんでした。"),
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
    process: text("확인 필요", "Needs review", "確認が必要"),
    roastLevel: "unknown",
    harvestPeriod: null,
    moisture: null,
    density: null,
    cupNotes: cupStages(
      [
        note("피크닉 무드", "picnic mood", "ピクニックの印象", "unknown", "#C8A45D", 2)
      ],
      text(
        "공식 목록에서 콜롬비아와 에티오피아 구성, 피크닉이라는 콘셉트가 확인됩니다. 세부 노트는 확인 필요입니다.",
        "The official listing confirms Colombia and Ethiopia components and the Picnic concept; detailed notes need review.",
        "公式一覧ではコロンビアとエチオピアの構成、ピクニックというコンセプトを確認できます。詳細ノートは確認が必要です。"
      )
    ),
    roastingIntent: text("확인 필요", "Needs review", "確認が必要"),
    farmStory: text("확인 필요", "Needs review", "確認が必要"),
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
    process: text("확인 필요", "Needs review", "確認が必要"),
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
        "공개 B2B 상품 정보 기준으로 견과류 인상과 단맛, 부드러운 질감이 중심입니다.",
        "Public B2B product information points to nutty sweetness and a smooth profile.",
        "公開B2B商品情報では、ナッツ感のある甘さと滑らかな印象が中心です。"
      )
    ),
    roastingIntent: text("단맛을 디자인한다는 문구가 공개 상품 설명에서 확인됩니다.", "The public product page frames the blend around designed sweetness.", "公開商品説明では、甘さを設計するブレンドとして紹介されています。"),
    farmStory: text("개별 산지 스토리는 확인되지 않았습니다.", "Individual origin stories were not confirmed.", "個別産地のストーリーは確認できませんでした。"),
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
    region: text("확인 필요", "Needs review", "確認が必要"),
    farm: text("라 프리마베라, 확인 필요", "La Primavera, needs review", "ラ・プリマベーラ、確認が必要"),
    producer: text("정보 없음", "Not available", "情報なし"),
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
        "기존 프로토타입 원두입니다. 공식 KOOK 상품 출처가 확인되지 않아 세부 정보는 검증 대기입니다.",
        "This is retained from the prototype. Official KOOK product sourcing was not confirmed, so details need review.",
        "既存プロトタイプの豆です。KOOK公式の商品出典が確認できないため、詳細は確認待ちです。"
      )
    ),
    roastingIntent: text("확인 필요", "Needs review", "確認が必要"),
    farmStory: text("확인 필요", "Needs review", "確認が必要"),
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
