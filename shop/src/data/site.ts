/** Общие данные сайта. Плейсхолдеры в квадратных скобках заполняет заказчик. */
export const site = {
  brand: 'Ленпалон Фемили',
  /** Промо-полоса над шапкой (в макете: «Бесплатная доставка от [СУММА] ₽») */
  promo: 'Бесплатная доставка по всей России — от одной упаковки',
  /** Срок отправки, рабочих дней (в макете: [СРОК]) */
  shipDays: '[СРОК]',
  /** Срок доставки по России (FAQ) */
  deliveryTime: '[СРОК]',
  legal: {
    name: 'ООО «Биофлора»',
    fullName: 'Общество с ограниченной ответственностью «Биофлора»',
    inn: '7736377369',
    ogrn: '1267700197511',
    address: '119311, г. Москва, ул. Строителей, д. 6, корп. 5',
    /** Год в © — если null, подставляется текущий год при сборке */
    year: null as number | null,
    disclaimer: '«Ленпалон Фемили» — функциональная пищевая добавка, не является лекарственным средством.',
  },
  contacts: {
    phone: '+7 (926) 955-59-35',
    phoneHref: 'tel:+79269555935',
    email: 'BioFloraLenpalon@ya.ru',
    telegram: 'https://t.me/lenpalon-family',
  },
  defaultDescription: 'Чистые формулы и независимые тесты каждой партии.',
  tagline: 'добавки с проверяемым составом',
} as const;

export interface NavItem {
  label: string;
  href: string;
  /** Ключ раздела для aria-current */
  key: 'catalog' | 'goals' | 'lab' | 'about';
}

export const mainNav: NavItem[] = [
  { label: 'Каталог', href: '/catalog', key: 'catalog' },
  { label: 'Цели', href: '/#goals', key: 'goals' },
  { label: 'Лаборатория', href: '/lab', key: 'lab' },
  { label: 'О бренде', href: '/about', key: 'about' },
];

export const footerNav = [
  {
    title: 'Магазин',
    links: [
      { label: 'Каталог', href: '/catalog' },
      { label: 'Подбор', href: '/#quiz' },
    ],
  },
  {
    title: 'Помощь',
    links: [
      { label: 'Доставка и оплата', href: '/delivery' },
      { label: 'Возврат', href: '/returns' },
      { label: 'Контакты', href: '/contacts' },
    ],
  },
];

export const legalLinks = [
  { label: 'Политика конфиденциальности', href: '/privacy' },
  { label: 'Оферта', href: '/offer' },
];
