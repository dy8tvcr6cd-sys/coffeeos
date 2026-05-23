import type { LocalizedText } from "@/lib/i18n";
import type { Farm } from "@/types/farm";

const researchedAt = "2026-05-23";

function text(ko: string, en: string, ja: string): LocalizedText {
  return { ko, en, ja };
}

export const farms: Farm[] = [
  {
    id: "la-pena",
    name: text("라 페냐", "La Pena", "ラ・ペニャ"),
    country: text("온두라스", "Honduras", "ホンジュラス"),
    region: text("정보 없음", "Not available", "情報なし"),
    producer: text("정보 없음", "Not available", "情報なし"),
    elevation: null,
    story: text(
      "MOMOS 공식 상품 페이지에서 농장명과 품종, 가공 방식 일부만 확인됩니다.",
      "The MOMOS official product page confirms limited farm, variety, and process information.",
      "MOMOS公式商品ページでは、農園名・品種・精製方式の一部のみ確認できます。"
    ),
    sourceUrl: "https://momos.co.kr/product/%EC%9B%90%EB%91%90-%EC%98%A8%EB%91%90%EB%9D%BC%EC%8A%A4-coe-%EB%9D%BC-%ED%8E%98%EB%83%90-%ED%8C%8C%EC%B9%B4%EC%8A%A4-%EC%9B%8C%EC%8B%9C%EB%93%9C/2764/",
    lastResearchedAt: researchedAt,
    status: "confirmed"
  },
  {
    id: "hambella-wate",
    name: text("함벨라 와테", "Hambella Wate", "ハンベラ・ワテ"),
    country: text("에티오피아", "Ethiopia", "エチオピア"),
    region: text("구지 함벨라, 확인 필요", "Guji Hambella, needs review", "グジ・ハンベラ、確認が必要"),
    producer: text("정보 없음", "Not available", "情報なし"),
    elevation: null,
    story: text(
      "센터커피 공식 목록에서 상품명은 확인되지만 농장 상세 정보는 추가 검증이 필요합니다.",
      "Center Coffee’s official listing confirms the product name, but farm details need review.",
      "CENTER COFFEE公式一覧で商品名は確認できますが、農園詳細は追加確認が必要です。"
    ),
    sourceUrl: "https://www.centercoffee.co.kr/",
    lastResearchedAt: researchedAt,
    status: "needs_review"
  },
  {
    id: "el-palmo",
    name: text("엘 팔모", "El Palmo", "エル・パルモ"),
    country: text("페루", "Peru", "ペルー"),
    region: text("카하마르카", "Cajamarca", "カハマルカ"),
    producer: text("마누엘 엘레라", "Manuel Herrera", "マヌエル・エレラ"),
    elevation: "1,800-2,000 MASL",
    story: text(
      "빈브라더스 커피위키에서 엘 팔모 랏, 보스케스 데 카페 농장, 생산자 맥락이 확인됩니다.",
      "Bean Brothers Coffee Wiki confirms the El Palmo lot, Bosques de Cafe farm context, and producer information.",
      "Bean Brothers Coffee Wikiでエル・パルモのロット、Bosques de Cafe農園の文脈、生産者情報を確認できます。"
    ),
    sourceUrl: "https://www.beanbrothers.co.kr/info/coffeewiki_detail?cateCd=006008001&cateNm=SEASONAL&goodsNo=1000001486",
    lastResearchedAt: researchedAt,
    status: "confirmed"
  },
  {
    id: "la-tina",
    name: text("라 티나", "La Tina", "ラ・ティナ"),
    country: text("온두라스", "Honduras", "ホンジュラス"),
    region: text("확인 필요", "Needs review", "確認が必要"),
    producer: text("정보 없음", "Not available", "情報なし"),
    elevation: null,
    story: text(
      "빈브라더스 공식 메인 목록에서 원두명과 컵 노트는 확인되지만 상세 산지 정보는 확인 필요입니다.",
      "Bean Brothers’ official main listing confirms the coffee name and cup notes, while detailed origin data needs review.",
      "Bean Brothers公式メイン一覧で豆名とカップノートは確認できますが、詳細産地情報は確認が必要です。"
    ),
    sourceUrl: "https://beanbrothers.co.kr/main/index.php",
    lastResearchedAt: researchedAt,
    status: "needs_review"
  },
  {
    id: "pino-alto",
    name: text("피노 알토", "Pino Alto", "ピノ・アルト"),
    country: text("확인 필요", "Needs review", "確認が必要"),
    region: text("확인 필요", "Needs review", "確認が必要"),
    producer: text("정보 없음", "Not available", "情報なし"),
    elevation: null,
    story: text(
      "나무사이로 공식 메인 목록에서 원두명과 노트는 확인되지만 산지 상세 정보는 확인되지 않았습니다.",
      "Namusairo’s official main listing confirms the coffee name and notes, but detailed origin data was not confirmed.",
      "Namusairo公式メイン一覧で豆名とノートは確認できますが、詳細な産地情報は確認できませんでした。"
    ),
    sourceUrl: "https://namusairo.com/",
    lastResearchedAt: researchedAt,
    status: "needs_review"
  }
];

export function getFarmById(id: string) {
  return farms.find((farm) => farm.id === id);
}
