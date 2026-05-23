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
      "공식 이벤트가 아닌 CoffeeOS 내부 검증용 세션입니다.",
      "An internal CoffeeOS prototype session, not an official roastery event.",
      "公式イベントではなく、CoffeeOS内部検証用セッションです。"
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
