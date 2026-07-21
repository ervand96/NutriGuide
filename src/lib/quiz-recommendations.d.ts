export const QUIZ_STORAGE_KEY: string;

export const STACK_MAP: Record<string, string[]>;

export type QuizAnswers = {
  goal: string;
  gut: string;
  budget: string;
  alreadySupplementing: string;
  whichSupplements?: string;
  savedAt: string;
  shareKeys?: string[];
  fromShare?: boolean;
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

export type QuizMappedResult = {
  picks: QuizPick[];
  keys: string[];
  goal: string;
  guide: { title: string; href: string };
  headline: string;
  stackTotal: string;
  partners: string[];
};

export function parsePriceNumber(price?: string): number;
export function formatStackTotal(picks?: QuizPick[]): string;
export function partnersForPicks(picks?: QuizPick[]): string[];
export function picksFromKeys(keys?: string[]): QuizPick[];
export function stackKeysForGoal(
  goal: string,
  opts?: { gut?: string; budget?: string },
): string[];
export function mapQuizToPicks(answers: Partial<QuizAnswers>): QuizMappedResult;
export function mapSharedToPicks(answers: QuizAnswers): QuizMappedResult;
export function answersFromShareParams(params: {
  goal?: string | null;
  stack?: string | null;
  product?: string | null;
}): QuizAnswers | null;
export function buildResultsSharePath(goal: string, keys?: string[]): string;
export function quizPrefillForSlug(slug?: string): string | null;

export function saveQuizAnswers(
  answers: Omit<QuizAnswers, "savedAt">,
): QuizAnswers;
export function loadQuizAnswers(): QuizAnswers | null;
export function clearQuizAnswers(): void;
