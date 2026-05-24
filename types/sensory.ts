export type SensoryMode = "beginner" | "professional";

export type SensoryScores = {
  aroma: number;
  flavor: number;
  acidity: number;
  sweetness?: number;
  body: number;
  balance: number;
  aftertaste: number;
  overall: number;
};

export type ProfessionalCvaRecord = {
  sampleInfo?: string;
  sampleNumber?: string;
  evaluator?: string;
  cuppingDate?: string;
  dryAroma?: string;
  wetAroma?: string;
  flavorDescription?: string;
  sweetness?: number;
  defects?: string;
  finalSummary?: string;
  finalScore?: number;
};

export type SensoryRecord = {
  id: string;
  beanId: string;
  beanName: string;
  roasteryName: string;
  mode: SensoryMode;
  descriptors: string[];
  scores: SensoryScores;
  memo: string;
  professional?: ProfessionalCvaRecord;
  createdAt: string;
};
