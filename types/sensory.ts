export type SensoryMode = "beginner" | "professional";

export type SensoryScores = {
  aroma: number;
  flavor: number;
  acidity: number;
  body: number;
  balance: number;
  aftertaste: number;
  overall: number;
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
  createdAt: string;
};
