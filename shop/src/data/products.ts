import type { CategorySlug } from './categories';

export interface Photo {
  /** Путь к реальному фото (public/ или импорт). Пусто — показывается заглушка. */
  src?: string;
  alt: string;
  /** Подсказка фотографу из макета — текст заглушки */
  placeholder: string;
}
export interface Size {
  label: string;
  /** Цена в рублях. null — цена не задана, выводится placeholder */
  price: number | null;
  placeholder: string;
}
export interface Amount {
  label: string;
  value: string;
}
export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;
  description: string;
  sizes: Size[];
  subscription: { discountPercent: number | null; period: string | null };
  composition: {
    main: Amount;
    second: Amount;
    third: Amount;
    full: { active: string; excipients: string; allergens: string };
  };
  usage: string;
  contraindications: string;
  highlights: string[];
  photos: { tile: Photo; main: Photo; extra: [Photo, Photo] };
  related: string[];
}

const placeholderComposition: Product['composition'] = {
  main: { label: 'Основное вещество', value: '[N] мг' },
  second: { label: 'Второй компонент', value: '[N] мг' },
  third: { label: 'Третий компонент', value: '[N] мг' },
  full: {
    active: '[Список веществ с формой и дозировкой]',
    excipients: '[Состав капсулы и наполнители]',
    allergens: '[Информация об аллергенах]',
  },
};
const placeholderSizes: Size[] = [
  { label: '60 капсул', price: null, placeholder: '[ЦЕНА 1]' },
  { label: '120 капсул', price: null, placeholder: '[ЦЕНА 2]' },
  { label: '180 капсул', price: null, placeholder: '[ЦЕНА 3]' },
];
const defaultHighlights = [
  'Тест каждой партии в независимой лаборатории',
  'Без красителей и лишних наполнителей',
  'Отправка за [СРОК] рабочих дня',
];
const extraPhotos = (name: string): [Photo, Photo] => [
  { alt: `${name}: капсулы на ладони`, placeholder: 'Фото 1:1. Капсулы на ладони' },
  { alt: `${name}: упаковка рядом со стаканом воды`, placeholder: 'Фото 1:1. Банка рядом со стаканом воды' },
];

function stub(n: number, category: CategorySlug, tilePhoto: string): Product {
  const name = `Название продукта ${n}`;
  return {
    slug: `product-${n}`,
    name,
    category,
    shortDescription: 'Короткое описание',
    description: 'Короткое описание: для кого продукт и что он даёт. [ОПИСАНИЕ]',
    sizes: placeholderSizes,
    subscription: { discountPercent: null, period: null },
    composition: placeholderComposition,
    usage: '[Схема приёма: дозировка, время суток, длительность курса.]',
    contraindications: '[ПРОТИВОПОКАЗАНИЯ ПО ТРЕБОВАНИЯМ ЗАКОНА]',
    highlights: defaultHighlights,
    photos: {
      tile: { alt: name, placeholder: `Фото 1:1. ${tilePhoto}` },
      main: {
        alt: name,
        placeholder: 'Фото 4:5, 1600 на 2000. Банка на светлой поверхности, без текста на этикетке',
      },
      extra: extraPhotos(name),
    },
    related: [],
  };
}

const lenpalon: Product = {
  slug: 'lenpalon-family',
  name: 'Ленпалон Фэмили',
  category: 'digestion',
  shortDescription: 'Курс на 15 дней: 4 состава, 18 капсул',
  description:
    'Функциональное питание: 4 состава с цветовой маркировкой, 3 цикла по 5 дней, 18 капсул. Схема приёма расписана по дням.',
  sizes: [{ label: '18 капсул · курс 15 дней', price: 9700, placeholder: '[ЦЕНА]' }],
  subscription: { discountPercent: null, period: null },
  composition: placeholderComposition,
  usage:
    'Курс 15 дней: 3 цикла по 5 дней, один блистер на цикл. День 1: утром капсула №1 за 30 минут до еды, вечером №1 через 30 минут после еды. День 2: утром №2 за 30 минут до еды, вечером №3 через 30 минут после еды. День 3: утром №2 за 30 минут до еды, вечером №4 через 30 минут после еды. Дни 4–5 — перерыв, затем следующий блистер.',
  contraindications: '[ПРОТИВОПОКАЗАНИЯ ПО ТРЕБОВАНИЯМ ЗАКОНА]',
  highlights: defaultHighlights,
  photos: {
    tile: {
      alt: 'Ленпалон Фэмили',
      placeholder: 'Фото 1:1. Коробка «Ленпалон Фэмили» на светлой поверхности',
    },
    main: {
      alt: 'Ленпалон Фэмили',
      placeholder:
        'Фото 4:5, 1600 на 2000. Коробка «Ленпалон Фэмили» и блистер с капсулами на светлой поверхности',
    },
    extra: [
      { alt: 'Капсулы четырёх цветов', placeholder: 'Фото 1:1. Четыре цветные капсулы на ладони' },
      { alt: 'Блистер рядом со стаканом воды', placeholder: 'Фото 1:1. Блистер рядом со стаканом воды' },
    ],
  },
  related: [],
};

const list: Product[] = [
  lenpalon,
  stub(2, 'sleep', 'Тёмная стеклянная бутылка'),
  stub(3, 'sport', 'Пакет с порошком'),
  stub(4, 'immunity', 'Банка капсул'),
  stub(5, 'sleep', 'Флакон с пипеткой'),
  stub(6, 'immunity', 'Банка с мерной ложкой'),
];
// «С этим покупают»: по умолчанию — все остальные товары
for (const p of list)
  if (!p.related.length) p.related = list.filter((o) => o.slug !== p.slug).map((o) => o.slug);

export const products = list;

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
/** Упаковка по умолчанию — средняя */
export function defaultSizeIndex(p: Product): number {
  return Math.floor(p.sizes.length / 2);
}
export function tilePrice(p: Product): number | null {
  return p.sizes[defaultSizeIndex(p)]?.price ?? null;
}
