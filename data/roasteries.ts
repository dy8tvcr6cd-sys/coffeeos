import type { LocalizedText } from "@/lib/i18n";
import type { Roastery } from "@/types/roastery";

const researchedAt = "2026-05-23";

function text(ko: string, en: string, ja: string): LocalizedText {
  return { ko, en, ja };
}

export const roasteries: Roastery[] = [
  {
    id: "momos-coffee",
    slug: "momos-coffee",
    name: text("모모스커피", "MOMOS COFFEE", "MOMOS COFFEE"),
    logoUrl: "/logos/momos-coffee.png",
    logoAlt: "MOMOS COFFEE logo",
    logoStatus: "local_test_only",
    officialWebsiteUrl: "https://momos.co.kr/",
    location: text("부산 영도", "Yeongdo, Busan", "釜山・影島"),
    description: text(
      "부산을 기반으로 운영되는 스페셜티 로스터리입니다. 생산자와 소비자 사이의 연결을 중요하게 다루며, 온라인몰에서 시즌 싱글오리진과 블렌드를 함께 소개합니다.",
      "A Busan-based specialty roaster with a strong focus on connection across the coffee chain. Its shop presents seasonal single origins alongside accessible blends.",
      "釜山を拠点にするスペシャルティロースター。生産者から飲み手までのつながりを大切にし、季節のシングルオリジンとブレンドを展開しています。"
    ),
    philosophy: text(
      "스페셜티 커피의 가치를 더 많은 사람에게 자연스럽게 전달하는 방향성을 갖고 있습니다.",
      "MOMOS frames specialty coffee as something valuable and approachable for everyone in the chain.",
      "スペシャルティコーヒーの価値を、関わる人すべてに自然に届ける姿勢を持っています。"
    ),
    roastingStyle: text("확인 필요", "Needs review", "確認が必要"),
    representativeBeanIds: ["momos-honduras-coe-la-pena", "momos-busan-blend"],
    beanIds: ["momos-honduras-coe-la-pena", "momos-busan-blend"],
    purchaseUrl: "https://momos.co.kr/",
    sourceUrl: "https://momos.co.kr/",
    lastResearchedAt: researchedAt,
    status: "confirmed"
  },
  {
    id: "kook-coffee-roasters",
    slug: "kook-coffee-roasters",
    name: text("쿡커피로스터즈", "KOOK COFFEE ROASTERS", "KOOK COFFEE ROASTERS"),
    logoUrl: "/logos/kook-coffee-roasters.png",
    logoAlt: "KOOK COFFEE ROASTERS logo",
    logoStatus: "local_test_only",
    officialWebsiteUrl: null,
    location: text("전북 익산, 확인 필요", "Iksan, Korea, needs review", "益山・韓国、確認が必要"),
    description: text(
      "공식 웹사이트와 최신 온라인 원두 라인업은 확인되지 않았습니다. CoffeeOS에서는 로스터리 엔트리를 유지하되 세부 정보는 검증 대기 상태로 표시합니다.",
      "An official website and current public bean lineup were not confirmed. CoffeeOS keeps the roastery entry visible while marking details for review.",
      "公式サイトと最新のオンライン豆ラインナップは確認できませんでした。CoffeeOSでは項目を残し、詳細は確認待ちとして扱います。"
    ),
    philosophy: text("확인 필요", "Needs review", "確認が必要"),
    roastingStyle: text("확인 필요", "Needs review", "確認が必要"),
    representativeBeanIds: ["peru-la-primavera-geisha-washed"],
    beanIds: ["peru-la-primavera-geisha-washed"],
    purchaseUrl: null,
    sourceUrl: null,
    lastResearchedAt: researchedAt,
    status: "needs_review"
  },
  {
    id: "on-roastery",
    slug: "on-roastery",
    name: text("온로스터리", "ON ROASTERY", "ON ROASTERY"),
    logoUrl: "/logos/on-roastery.png",
    logoAlt: "ON ROASTERY logo",
    logoStatus: "local_test_only",
    officialWebsiteUrl: null,
    location: text("충남 금산, 확인 필요", "Geumsan, Korea, needs review", "錦山・韓国、確認が必要"),
    description: text(
      "공식 자체 웹사이트는 확인되지 않았고, 공개 B2B 상품 페이지에서 블렌드 정보 일부만 확인됩니다. 로컬 프로토타입에서는 검증 필요 데이터로 표시합니다.",
      "A standalone official website was not confirmed. Public B2B product pages expose limited blend information, so CoffeeOS marks this data for review.",
      "独自の公式サイトは確認できず、公開B2B商品ページで一部のブレンド情報のみ確認できます。試作では確認待ちデータとして扱います。"
    ),
    philosophy: text("단맛을 설계하는 블렌딩 방향성을 공개 상품 설명에서 확인할 수 있습니다.", "Public product copy points to a sweetness-led blending approach.", "公開商品説明では、甘さを軸にしたブレンド設計が示されています。"),
    roastingStyle: text("미디엄다크 블렌드 정보 확인", "Medium-dark blend information confirmed", "ミディアムダークのブレンド情報を確認"),
    representativeBeanIds: ["on-m-blending"],
    beanIds: ["on-m-blending"],
    purchaseUrl: "https://biz.koke.kr/products/6522",
    sourceUrl: "https://biz.koke.kr/products/6522",
    lastResearchedAt: researchedAt,
    status: "needs_review"
  },
  {
    id: "new-wave-coffee-roasters",
    slug: "new-wave-coffee-roasters",
    name: text("뉴웨이브 커피 로스터스", "NEW WAVE COFFEE ROASTERS", "NEW WAVE COFFEE ROASTERS"),
    logoUrl: "/logos/new-wave-coffee-roasters.png",
    logoAlt: "NEW WAVE COFFEE ROASTERS logo",
    logoStatus: "local_test_only",
    officialWebsiteUrl: "https://smartstore.naver.com/newwavecoffeeroasters/",
    location: text("서울 양천구", "Yangcheon-gu, Seoul", "ソウル・陽川区"),
    description: text(
      "서울 목동 기반 로스터리로, 공개 프로필에서는 아카데미와 원두 판매를 중심으로 운영해 온 흐름이 확인됩니다.",
      "A Seoul-based roaster associated with education and roasted coffee sales, according to public profile information.",
      "ソウルを拠点に、教育と焙煎豆販売を軸に展開してきたロースターとして公開プロフィールで確認できます。"
    ),
    philosophy: text("좋은 밸런스와 클린컵을 지향하는 소개가 공개 자료에서 확인됩니다.", "Public profiles emphasize balance and clean-cup quality.", "公開プロフィールでは、バランスとクリーンカップを重視する姿勢が示されています。"),
    roastingStyle: text("확인 필요", "Needs review", "確認が必要"),
    representativeBeanIds: [],
    beanIds: [],
    purchaseUrl: "https://smartstore.naver.com/newwavecoffeeroasters/",
    sourceUrl: "https://typica.coffee/ko/locations/new-wave-coffee-roasters/",
    lastResearchedAt: researchedAt,
    status: "needs_review"
  },
  {
    id: "coffee-temple",
    slug: "coffee-temple",
    name: text("커피템플", "COFFEE TEMPLE", "COFFEE TEMPLE"),
    logoUrl: "/logos/coffee-temple.png",
    logoAlt: "COFFEE TEMPLE logo",
    logoStatus: "local_test_only",
    officialWebsiteUrl: "https://www.coffeetemple.co.kr/",
    location: text("대구 로스터리 / 제주 매장", "Daegu roastery / Jeju cafe", "大邱ロースタリー / 済州店舗"),
    description: text(
      "공식 사이트는 에스프레소와 공간 경험을 전면에 두고 있으며, 상세 온라인 원두 라인업은 제한적으로 확인됩니다.",
      "The official site foregrounds espresso and cafe experience, while detailed online bean data is limited.",
      "公式サイトではエスプレッソと店舗体験を前面に出しており、オンライン上の豆詳細は限定的です。"
    ),
    philosophy: text("커피로 감정과 삶의 이야기를 전한다는 브랜드 문맥이 확인됩니다.", "The brand presents coffee as a way to express story, mood, and everyday life.", "コーヒーを通じて感情や日常の物語を伝える姿勢が見られます。"),
    roastingStyle: text("확인 필요", "Needs review", "確認が必要"),
    representativeBeanIds: [],
    beanIds: [],
    purchaseUrl: "https://www.coffeetemple.co.kr/",
    sourceUrl: "https://www.coffeetemple.co.kr/",
    lastResearchedAt: researchedAt,
    status: "needs_review"
  },
  {
    id: "fritz-coffee-company",
    slug: "fritz-coffee-company",
    name: text("프릳츠 커피 컴퍼니", "FRITZ COFFEE COMPANY", "FRITZ COFFEE COMPANY"),
    logoUrl: "/logos/fritz-coffee-company.png",
    logoAlt: "FRITZ COFFEE COMPANY logo",
    logoStatus: "local_test_only",
    officialWebsiteUrl: "https://fritz.co.kr/",
    location: text("서울 / 제주", "Seoul / Jeju", "ソウル / 済州"),
    description: text(
      "서울을 대표하는 로스터리 중 하나로, 공식몰에서 블렌드, 싱글오리진, 캡슐과 교육 프로그램을 운영합니다.",
      "A well-known Korean roaster with an official shop covering blends, single origins, capsules, and classes.",
      "韓国を代表するロースターの一つで、公式ショップではブレンド、シングルオリジン、カプセル、クラスを展開しています。"
    ),
    philosophy: text("신선한 원두 판매와 매장/교육 경험을 함께 운영합니다.", "Fritz combines fresh roasted coffee sales with cafe and education experiences.", "新鮮な焙煎豆販売と店舗・教育体験を組み合わせています。"),
    roastingStyle: text("블렌드와 싱글오리진을 폭넓게 운영", "Broad blend and single-origin range", "ブレンドとシングルオリジンを幅広く展開"),
    representativeBeanIds: ["fritz-old-dog"],
    beanIds: ["fritz-old-dog"],
    purchaseUrl: "https://fritz.co.kr/",
    sourceUrl: "https://fritz.co.kr/",
    lastResearchedAt: researchedAt,
    status: "confirmed"
  },
  {
    id: "center-coffee",
    slug: "center-coffee",
    name: text("센터커피", "CENTER COFFEE", "CENTER COFFEE"),
    logoUrl: "/logos/center-coffee.png",
    logoAlt: "CENTER COFFEE logo",
    logoStatus: "local_test_only",
    officialWebsiteUrl: "https://www.centercoffee.co.kr/",
    location: text("서울 성수", "Seongsu, Seoul", "ソウル・聖水"),
    description: text(
      "공식몰에서 에스프레소 블렌드, 필터 싱글오리진, 드립백, 콜드브루 등 다양한 제품군을 운영합니다.",
      "Center Coffee’s official shop covers espresso blends, filter single origins, drip bags, cold brew, and gifts.",
      "公式ショップでは、エスプレッソブレンド、フィルター向けシングルオリジン、ドリップバッグ、コールドブリューなどを展開しています。"
    ),
    philosophy: text("당신에게 집중하는 마음이라는 브랜드 문구 아래, 일상 속 편안한 커피 경험을 제안합니다.", "Its brand language centers on attentive, everyday coffee experiences.", "「あなたに集中する心」というブランド文脈で、日常に寄り添うコーヒー体験を提案しています。"),
    roastingStyle: text("에스프레소 블렌드와 필터용 싱글오리진을 분리 운영", "Separate espresso blend and filter single-origin ranges", "エスプレッソブレンドとフィルター向けシングルオリジンを分けて展開"),
    representativeBeanIds: ["center-may-day-blend", "center-ethiopia-guji-hambella-wate"],
    beanIds: ["center-may-day-blend", "center-ethiopia-guji-hambella-wate"],
    purchaseUrl: "https://www.centercoffee.co.kr/shop",
    b2bInquiryUrl: "https://www.centercoffee.co.kr/coffeewholesale",
    sourceUrl: "https://www.centercoffee.co.kr/",
    lastResearchedAt: researchedAt,
    status: "confirmed"
  },
  {
    id: "namusairo-coffee",
    slug: "namusairo-coffee",
    name: text("나무사이로", "NAMUSAIRO COFFEE", "NAMUSAIRO COFFEE"),
    logoUrl: "/logos/namusairo-coffee.png",
    logoAlt: "NAMUSAIRO COFFEE logo",
    logoStatus: "local_test_only",
    officialWebsiteUrl: "https://namusairo.com/",
    location: text("서울 / 성남 물류 정보 확인", "Seoul brand, Seongnam fulfillment information", "ソウル発、城南の運営情報を確認"),
    description: text(
      "2002년 서울에서 시작한 로스터리로, 산지 방문과 품질관리를 바탕으로 다양한 커피의 매력을 소개합니다.",
      "Founded in Seoul in 2002, Namusairo presents a broad range of coffees through origin contact and careful quality control.",
      "2002年にソウルで始まったロースター。産地との対話と品質管理を通じて、多様なコーヒーの魅力を紹介しています。"
    ),
    philosophy: text("자연스러운 스페셜티, 생각하는 손, 함께하는 즐거움을 중요한 가치로 제시합니다.", "Its public values include natural specialty, thoughtful craft, and shared enjoyment.", "自然なスペシャルティ、考える手仕事、共に楽しむことを大切な価値として掲げています。"),
    roastingStyle: text("확인 필요", "Needs review", "確認が必要"),
    representativeBeanIds: ["namusairo-pino-alto-geisha-natural", "namusairo-picnic"],
    beanIds: ["namusairo-pino-alto-geisha-natural", "namusairo-picnic"],
    purchaseUrl: "https://namusairo.com/",
    sourceUrl: "https://namusairo.com/",
    lastResearchedAt: researchedAt,
    status: "confirmed"
  },
  {
    id: "coffee-libre",
    slug: "coffee-libre",
    name: text("커피 리브레", "COFFEE LIBRE", "COFFEE LIBRE"),
    logoUrl: "/logos/coffee-libre.png",
    logoAlt: "COFFEE LIBRE logo",
    logoStatus: "local_test_only",
    officialWebsiteUrl: "https://coffeelibre.kr/",
    location: text("서울 / 파주 물류", "Seoul / Paju logistics", "ソウル / 坡州物流"),
    description: text(
      "공식몰에서 신선한 원두 판매, 드립백, 생두, 도매 지원을 함께 운영하는 국내 스페셜티 로스터리입니다.",
      "A Korean specialty roaster with an official shop for roasted coffee, drip bags, green coffee, and wholesale support.",
      "焙煎豆、ドリップバッグ、生豆、卸向け支援を公式ショップで展開する韓国のスペシャルティロースターです。"
    ),
    philosophy: text("신선한 판매 정책과 도매 세미나 등 품질 관리 중심의 운영 정보가 확인됩니다.", "Public information highlights freshness policies and wholesale technical support.", "鮮度方針や卸向け技術支援など、品質管理を重視する運営情報が確認できます。"),
    roastingStyle: text("중강배전 블렌드부터 다양한 드립백 구성 운영", "Ranges from medium-dark blends to drip-bag selections", "中深煎りブレンドからドリップバッグまで幅広く展開"),
    representativeBeanIds: ["coffee-libre-vertigo"],
    beanIds: ["coffee-libre-vertigo"],
    purchaseUrl: "https://coffeelibre.kr/",
    b2bInquiryUrl: "https://coffeelibre.kr/category/%ED%9A%8C%EC%82%AC%EC%86%8C%EA%B0%9C/82/",
    sourceUrl: "https://coffeelibre.kr/",
    lastResearchedAt: researchedAt,
    status: "confirmed"
  },
  {
    id: "bean-brothers",
    slug: "bean-brothers",
    name: text("빈브라더스", "BEAN BROTHERS", "BEAN BROTHERS"),
    logoUrl: "/logos/bean-brothers.png",
    logoAlt: "BEAN BROTHERS logo",
    logoStatus: "local_test_only",
    officialWebsiteUrl: "https://beanbrothers.co.kr/main/index.php",
    location: text("서울 상수", "Sangsu, Seoul", "ソウル・上水"),
    description: text(
      "시즌 원두와 연중 운영 블렌드, 커피 구독과 비즈니스 납품을 함께 제공하는 로스터리입니다.",
      "A roaster offering seasonal coffees, year-round blends, subscriptions, and business coffee services.",
      "季節の豆、定番ブレンド、サブスクリプション、ビジネス向けサービスを展開するロースターです。"
    ),
    philosophy: text("커피 선택의 부담을 줄이고 일상 속 커피 경험을 지속시키는 서비스 흐름이 강합니다.", "Bean Brothers focuses on making coffee selection easier and everyday coffee more consistent.", "豆選びの負担を減らし、日常のコーヒー体験を続けやすくするサービス設計が特徴です。"),
    roastingStyle: text("시즌 싱글오리진과 연중 블렌드를 병행", "Seasonal single origins alongside year-round blends", "季節のシングルオリジンと定番ブレンドを並行展開"),
    representativeBeanIds: ["bean-brothers-peru-el-palmo", "bean-brothers-honduras-la-tina"],
    beanIds: ["bean-brothers-peru-el-palmo", "bean-brothers-honduras-la-tina"],
    purchaseUrl: "https://beanbrothers.co.kr/main/index.php",
    b2bInquiryUrl: "https://beanbrothers.co.kr/main/index.php",
    sourceUrl: "https://beanbrothers.co.kr/main/index.php",
    lastResearchedAt: researchedAt,
    status: "confirmed"
  }
];

export function getRoasteryById(id: string) {
  return roasteries.find((roastery) => roastery.id === id);
}

export function getRoasteryBySlug(slug: string) {
  return roasteries.find((roastery) => roastery.slug === slug);
}
