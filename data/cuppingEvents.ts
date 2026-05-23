import type { LocalizedText } from "@/lib/i18n";

function text(ko: string, en: string, ja: string): LocalizedText {
  return { ko, en, ja };
}

export type CuppingEvent = {
  id: string;
  roasteryId: string;
  title: LocalizedText;
  date: string;
  location: LocalizedText;
  seats: number;
  focus: LocalizedText;
  sourceUrl?: string | null;
  status: "confirmed" | "needs_review";
};

export const cuppingEvents: CuppingEvent[] = [
  {
    id: "coffeeos-temperature-lab",
    roasteryId: "momos-coffee",
    title: text("CoffeeOS 온도별 컵 노트 랩", "CoffeeOS temperature note lab", "CoffeeOS 温度別ノートラボ"),
    date: "2026-06-12",
    location: text("로컬 프로토타입", "Local prototype", "ローカル試作"),
    seats: 8,
    focus: text(
      "온도 변화에 따라 향미가 어떻게 이동하는지 함께 기록하는 CoffeeOS 커핑 세션입니다.",
      "A CoffeeOS cupping session for recording how flavor moves as temperature changes.",
      "温度変化によって香味がどう移るかを一緒に記録するCoffeeOSカッピングセッションです。"
    ),
    sourceUrl: null,
    status: "needs_review"
  },
  {
    id: "coffeeos-blend-table",
    roasteryId: "bean-brothers",
    title: text("블렌드와 싱글오리진 비교 테이블", "Blend and single-origin comparison table", "ブレンドとシングルオリジン比較テーブル"),
    date: "2026-06-22",
    location: text("로컬 프로토타입", "Local prototype", "ローカル試作"),
    seats: 10,
    focus: text(
      "저장된 감각 기록과 추천 로직을 확인하기 위한 프로토타입 커핑입니다.",
      "A prototype cupping to test saved sensory records and recommendation logic.",
      "保存された感覚記録とおすすめロジックを確認するための試作カッピングです。"
    ),
    sourceUrl: null,
    status: "needs_review"
  }
];
