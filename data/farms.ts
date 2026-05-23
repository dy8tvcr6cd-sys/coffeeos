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
    region: text("로스터리 등록 예정", "To be registered", "登録予定"),
    producer: text("로스터리 등록 예정", "To be registered", "登録予定"),
    elevation: null,
    story: text(
      "섬세한 품종 특성과 워시드 프로세스의 깨끗한 인상을 중심으로 소개되는 랏입니다.",
      "A lot presented around delicate variety character and the clean impression of washed processing.",
      "繊細な品種特性とウォッシュドプロセスのクリーンな印象を中心に紹介されるロットです。"
    ),
    sourceUrl: "https://momos.co.kr/product/%EC%9B%90%EB%91%90-%EC%98%A8%EB%91%90%EB%9D%BC%EC%8A%A4-coe-%EB%9D%BC-%ED%8E%98%EB%83%90-%ED%8C%8C%EC%B9%B4%EC%8A%A4-%EC%9B%8C%EC%8B%9C%EB%93%9C/2764/",
    lastResearchedAt: researchedAt,
    status: "confirmed"
  },
  {
    id: "hambella-wate",
    name: text("함벨라 와테", "Hambella Wate", "ハンベラ・ワテ"),
    country: text("에티오피아", "Ethiopia", "エチオピア"),
    region: text("구지 함벨라", "Guji Hambella", "グジ・ハンベラ"),
    producer: text("로스터리 등록 예정", "To be registered", "登録予定"),
    elevation: null,
    story: text(
      "에티오피아 구지 지역의 산뜻한 향과 과일감을 기대할 수 있는 싱글오리진입니다.",
      "A single origin shaped around the lively aromatics and fruit character associated with Guji, Ethiopia.",
      "エチオピア・グジらしい明るい香りと果実感を楽しめるシングルオリジンです。"
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
      "엘 팔모 랏은 높은 고도에서 자란 페루 커피의 밀도감과 섬세한 단맛을 중심으로 소개됩니다.",
      "El Palmo is presented around the density and refined sweetness of high-grown Peruvian coffee.",
      "エル・パルモは、高地で育ったペルーコーヒーの密度感と繊細な甘さを中心に紹介されます。"
    ),
    sourceUrl: "https://www.beanbrothers.co.kr/info/coffeewiki_detail?cateCd=006008001&cateNm=SEASONAL&goodsNo=1000001486",
    lastResearchedAt: researchedAt,
    status: "confirmed"
  },
  {
    id: "la-tina",
    name: text("라 티나", "La Tina", "ラ・ティナ"),
    country: text("온두라스", "Honduras", "ホンジュラス"),
    region: text("로스터리 등록 예정", "To be registered", "登録予定"),
    producer: text("로스터리 등록 예정", "To be registered", "登録予定"),
    elevation: null,
    story: text(
      "라 티나는 시즌 원두로 등록된 랏입니다. 세부 산지 이야기는 로스터리 등록 정보가 업데이트되면 함께 확장됩니다.",
      "La Tina is a registered seasonal lot. Its detailed origin story can expand as roastery-submitted information grows.",
      "ラ・ティナは季節の登録ロットです。詳細な産地ストーリーは、ロースター登録情報に合わせて広がります。"
    ),
    sourceUrl: "https://beanbrothers.co.kr/main/index.php",
    lastResearchedAt: researchedAt,
    status: "needs_review"
  },
  {
    id: "pino-alto",
    name: text("피노 알토", "Pino Alto", "ピノ・アルト"),
    country: text("로스터리 등록 예정", "To be registered", "登録予定"),
    region: text("로스터리 등록 예정", "To be registered", "登録予定"),
    producer: text("로스터리 등록 예정", "To be registered", "登録予定"),
    elevation: null,
    story: text(
      "피노 알토는 향의 개성이 뚜렷한 내추럴 게이샤로 소개되는 랏입니다. CoffeeOS에서는 추출과 감각 기록을 통해 경험을 이어갑니다.",
      "Pino Alto is presented as an expressive natural Geisha. CoffeeOS connects that character with brewing and sensory records.",
      "ピノ・アルトは香りの個性がはっきりしたナチュラルゲイシャとして紹介されます。CoffeeOSでは抽出と感覚記録へつなげます。"
    ),
    sourceUrl: "https://namusairo.com/",
    lastResearchedAt: researchedAt,
    status: "needs_review"
  }
];

export function getFarmById(id: string) {
  return farms.find((farm) => farm.id === id);
}
