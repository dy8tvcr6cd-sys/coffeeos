import type { LocalizedText } from "@/lib/i18n";

export type BrewEvidence = {
  id: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  summary: LocalizedText;
};

export const brewEvidence: BrewEvidence[] = [
  {
    id: "ecbc-temperature-contact",
    title: "ECBC brewing temperature and contact time standards",
    sourceName: "European Coffee Brewing Centre",
    sourceUrl: "https://ecbc.coffee/overview/professional/certification-standards/",
    summary: {
      ko: "ECBC는 필터 브루어 평가에서 브루 바스켓 온도가 92-96C 범위에 머물러야 하며, 접촉 시간은 분쇄 입자 크기와 직접 연결된다고 설명합니다.",
      en: "ECBC certification guidance keeps brew basket temperature in the 92-96C range and links contact time directly to grind particle size.",
      ja: "ECBCは、抽出バスケット内の温度を92-96Cに保つこと、接触時間が挽き目と直接関係することを示しています。"
    }
  },
  {
    id: "batali-temperature",
    title: "Brew temperature at fixed strength and extraction",
    sourceName: "Batali, Ristenpart, Guinard, Scientific Reports 2020",
    sourceUrl: "https://www.nature.com/articles/s41598-020-73341-4",
    summary: {
      ko: "87-93C 범위에서 TDS와 추출수율을 맞추면 물 온도 자체의 감각 영향은 작았고, 연구진은 추출 동역학을 여러 변수 중 하나로 다루라고 결론냅니다.",
      en: "When TDS and extraction were controlled, 87-93C brew temperatures had little sensory impact; temperature should be treated as one control among several extraction variables.",
      ja: "TDSと抽出率をそろえた条件では、87-93Cの湯温差による官能差は小さく、湯温は複数の抽出変数の一つとして扱うべきだとされています。"
    }
  },
  {
    id: "batali-residence-time",
    title: "Residence time and extraction",
    sourceName: "Batali, Ristenpart, Guinard, Scientific Reports 2020",
    sourceUrl: "https://www.nature.com/articles/s41598-020-73341-4",
    summary: {
      ko: "동일 연구는 높은 추출수율이 일반적으로 더 긴 체류 시간과 연결된다고 설명합니다. 그래서 추출 시간이 목표보다 크게 벗어나면 분쇄도와 목표 시간을 우선 진단합니다.",
      en: "The same study reports that higher extraction is generally achieved through longer residence time, so large time deviations are diagnosed before changing secondary variables.",
      ja: "同研究では、高い抽出率は一般に長い滞留時間によって得られるとされます。そのため時間のズレを、他の変数より先に診断します。"
    }
  },
  {
    id: "packed-bed-uniformity",
    title: "Extraction uniformity in coffee beds",
    sourceName: "Moroney et al., PLOS ONE 2019",
    sourceUrl: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0219906",
    summary: {
      ko: "커피 베드 내부의 불균일 흐름과 채널링은 추출 균일도에 영향을 줍니다. CoffeeOS는 푸어 차수를 큰 폭으로 바꾸기보다 분쇄도와 시간 안정성을 먼저 조정합니다.",
      en: "Non-uniform flow and channeling affect extraction uniformity in a coffee bed. CoffeeOS therefore changes pour count conservatively after grind and time stability are considered.",
      ja: "コーヒーベッド内の不均一な流れやチャネリングは抽出の均一性に影響します。CoffeeOSでは挽き目と時間の安定を優先し、注湯回数は控えめに調整します。"
    }
  },
  {
    id: "coffeeos-one-variable",
    title: "CoffeeOS controlled experiment rule",
    sourceName: "CoffeeOS local operating model",
    sourceUrl: "/prescription",
    summary: {
      ko: "한 번에 여러 변수를 바꾸면 원인을 분리하기 어렵습니다. CoffeeOS는 처방마다 하나의 주요 변수만 바꾸고 나머지는 유지하도록 설계합니다.",
      en: "Changing many variables at once makes causality hard to read. CoffeeOS changes one primary variable per prescription and holds the others steady.",
      ja: "複数の変数を同時に変えると原因の切り分けが難しくなります。CoffeeOSは一回の処方で主変数を一つだけ変え、他は固定します。"
    }
  }
];

export function getBrewEvidenceById(id: string) {
  return brewEvidence.find((item) => item.id === id);
}

