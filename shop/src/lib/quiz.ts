/**
 * Подбор. Сейчас — один шаг: свободный текст → категория каталога по ключевым словам.
 * Чтобы сделать многошаговый квиз, расширьте QuizAnswers и resolveQuiz — разметка вызывает только их.
 * Реальных рекомендаций здесь нет: результат — переход в каталог с фильтром.
 */
import type { CategorySlug } from '../data/categories';

export interface QuizAnswers {
  goal: string;
}

const RULES: { cat: CategorySlug; stems: string[] }[] = [
  { cat: 'sleep', stems: ['сон', 'спат', 'сплю', 'засып', 'бессон', 'стресс', 'нерв', 'тревог', 'устал'] },
  { cat: 'sport', stems: ['спорт', 'трениров', 'мышц', 'восстанов', 'бег', 'зал', 'фитнес', 'выносл'] },
  { cat: 'immunity', stems: ['иммун', 'простуд', 'болею', 'вирус', 'защит'] },
  { cat: 'men', stems: ['мужск', 'мужчин'] },
  { cat: 'digestion', stems: ['пищевар', 'желуд', 'живот', 'жкт', 'кишеч', 'вздут', 'изжог', 'тяжест'] },
];

export function matchCategory(text: string): CategorySlug | null {
  const t = text.toLowerCase().replace(/ё/g, 'е');
  return RULES.find((r) => r.stems.some((s) => t.includes(s)))?.cat ?? null;
}

/** Куда вести после подбора */
export function resolveQuiz(answers: QuizAnswers): string {
  const cat = matchCategory(answers.goal);
  return cat ? `/catalog?cat=${cat}` : '/catalog';
}
