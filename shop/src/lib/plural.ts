/** Русское склонение: plural(5, ['товар', 'товара', 'товаров']) → 'товаров' */
export function plural(n: number, forms: readonly [string, string, string]): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return forms[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return forms[1];
  return forms[2];
}
export const PRODUCT_FORMS = ['товар', 'товара', 'товаров'] as const;
export const productsCount = (n: number): string => `${n} ${plural(n, PRODUCT_FORMS)}`;
