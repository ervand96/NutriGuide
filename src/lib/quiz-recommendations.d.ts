export const QUIZ_STORAGE_KEY: string;

export type QuizAnswers = {
  goal: string;
  gut: string;
  budget: string;
  alreadySupplementing: string;
  whichSupplements?: string;
  savedAt: string;
};

export type QuizPick = {
  rank: number;
  name: string;
  badge: string;
  rating: number;
  price: string;
  description: string;
  pros: string[];
  cons: string[];
  affiliateUrl: string;
  buttonText: string;
  highlight?: boolean;
  imageUrl?: string;
};

export function mapQuizToPicks(answers: QuizAnswers): {
  picks: QuizPick[];
  guide: { title: string; href: string };
  headline: string;
};

export function saveQuizAnswers(
  answers: Omit<QuizAnswers, "savedAt">,
): QuizAnswers;
export function loadQuizAnswers(): QuizAnswers | null;
export function clearQuizAnswers(): void;
