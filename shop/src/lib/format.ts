const rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });

/** 9700 → «9 700 ₽»; null → «[ЦЕНА] ₽» (плейсхолдер из данных) */
export function formatPrice(price: number | null, placeholder = '[ЦЕНА]'): string {
  return `${price === null ? placeholder : rub.format(price)} ₽`;
}

/** Цена со скидкой подписки, если и цена, и скидка заданы */
export function subscriptionPrice(price: number | null, discount: number | null): number | null {
  if (price === null || discount === null) return price;
  return Math.round(price * (1 - discount / 100));
}
