/**
 * Корзина: позиции {slug, size, mode, qty} в localStorage (с fallback в памяти).
 * Изменения публикуются событием `cart:change` на window и синхронизируются между вкладками через `storage`.
 * Страницы корзины пока нет — API готов: items(), count(), add(), setQty(), remove(), clear(), subscribe().
 */
export type PurchaseMode = 'once' | 'subscription';
export interface CartItem {
  slug: string;
  size: string;
  mode: PurchaseMode;
  qty: number;
}

const KEY = 'cart:v1';
const EVENT = 'cart:change';
let memory: CartItem[] = [];

function isItem(v: unknown): v is CartItem {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.slug === 'string' &&
    typeof o.size === 'string' &&
    (o.mode === 'once' || o.mode === 'subscription') &&
    typeof o.qty === 'number' &&
    o.qty > 0
  );
}

function read(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return memory;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isItem) : [];
  } catch {
    return memory;
  }
}

function write(items: CartItem[]): void {
  memory = items;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* приватный режим или квота — остаёмся в памяти */
  }
  window.dispatchEvent(new CustomEvent<CartItem[]>(EVENT, { detail: items }));
}

const same = (a: CartItem, b: Pick<CartItem, 'slug' | 'size' | 'mode'>) =>
  a.slug === b.slug && a.size === b.size && a.mode === b.mode;

export const cart = {
  items: read,
  count(): number {
    return read().reduce((sum, i) => sum + i.qty, 0);
  },
  add(item: Omit<CartItem, 'qty'> & { qty?: number }): void {
    const qty = Math.max(1, Math.floor(item.qty ?? 1));
    const items = read();
    const found = items.find((i) => same(i, item));
    if (found) found.qty += qty;
    else items.push({ slug: item.slug, size: item.size, mode: item.mode, qty });
    write(items);
  },
  setQty(key: Pick<CartItem, 'slug' | 'size' | 'mode'>, qty: number): void {
    const items = read()
      .map((i) => (same(i, key) ? { ...i, qty: Math.floor(qty) } : i))
      .filter((i) => i.qty > 0);
    write(items);
  },
  remove(key: Pick<CartItem, 'slug' | 'size' | 'mode'>): void {
    write(read().filter((i) => !same(i, key)));
  },
  clear(): void {
    write([]);
  },
  /** Подписка на изменения (в т. ч. из других вкладок). Возвращает функцию отписки. */
  subscribe(cb: (items: CartItem[]) => void): () => void {
    const onLocal = () => cb(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY || e.key === null) cb(read());
    };
    window.addEventListener(EVENT, onLocal);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT, onLocal);
      window.removeEventListener('storage', onStorage);
    };
  },
};
