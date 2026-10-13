export const categories = [
  { slug: 'sport', label: 'Спорт' },
  { slug: 'sleep', label: 'Сон' },
  { slug: 'immunity', label: 'Иммунитет' },
  { slug: 'men', label: 'Мужское здоровье' },
  { slug: 'digestion', label: 'Пищеварение' },
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];
export const ALL_LABEL = 'Все';

export function categoryLabel(slug: CategorySlug): string {
  return categories.find((c) => c.slug === slug)?.label ?? slug;
}
export function isCategory(value: string | null | undefined): value is CategorySlug {
  return categories.some((c) => c.slug === value);
}
