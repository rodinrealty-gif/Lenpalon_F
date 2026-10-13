# Ленпалон Фемили — интернет-магазин (Astro)

Сайт по дизайн-макету `design/` (`index.html`, `catalog.html`, `product.html`). Макет — источник правды по визуалу; данные отделены от разметки и лежат в `src/data/`.

## Запуск

```bash
npm install
cp .env.example .env      # адрес сайта и (необязательно) адрес подписки
npm run dev               # http://localhost:4321
npm run build             # статическая сборка в dist/
npm run preview           # просмотр сборки
```

Проверки:

| Команда                                   | Что делает                                              |
| ----------------------------------------- | ------------------------------------------------------- |
| `npm run verify`                          | всё ниже по очереди                                     |
| `npm run check`                           | `astro check` (строгий TypeScript)                      |
| `npm run lint`                            | ESLint, без предупреждений                              |
| `npm run format:check` / `npm run format` | Prettier                                                |
| `npm run check:links`                     | все внутренние ссылки и якоря в `dist/` существуют      |
| `npm run check:placeholders`              | список оставшихся плейсхолдеров `[…]` в собранном сайте |

Переменные окружения (`.env`):

- `PUBLIC_SITE_URL` — домен для canonical, Open Graph и `sitemap.xml` (по умолчанию `https://lenpalonfamily.ru`).
- `PUBLIC_NEWSLETTER_ENDPOINT` — URL для подписки (POST JSON `{ "email": "…" }`). Пусто — данные никуда не отправляются.

## Структура

```
design/              макет (не трогать)
src/
  styles/            tokens.css (токены 1:1 из :root макета), base.css (общие классы макета)
  icons/             SVG-иконки (Phosphor) — <Icon name="…" />, цвет = currentColor
  data/              site, products, categories, faq, principles, clients, goals
  lib/               cart (корзина), plural, format (цены), newsletter, quiz, icons
  components/        Layout, Header, Footer, Breadcrumbs, Button, Chip, Icon, PhotoSlot, ProductTile,
                     PromoTile, BentoCard, PrincipleItem, FaqTabs, QuizCta, SizePicker, PurchaseModeRadio,
                     QtyStepper, CompositionBento, ProductRail, SearchDialog, NewsletterForm, StubPage
  legal/             тексты политики, оферты и согласия (черновики)
  pages/             / · /catalog · /product/[slug] · /lab · /about · /delivery · /returns · /contacts
                     /privacy · /offer · /consent · /account · /cart · 404 · sitemap.xml · robots.txt
scripts/             check-links.mjs, check-placeholders.mjs
docs/visual-report.md  сравнение с макетом на 375/768/1024/1440
PLAN.md · NOTES.md   план работ и спорные решения
```

Стили: общие классы макета — в `base.css`, остальное — scoped-стили компонентов (`scopedStyleStrategy: 'class'`, поэтому класс, переданный компоненту через `class`, получает стили родителя).

## Как добавить товар

Добавьте объект в `src/data/products.ts` (тип `Product`):

```ts
{
  slug: 'omega-3',                       // адрес: /product/omega-3
  name: 'Омега-3',
  category: 'immunity',                  // slug из categories.ts
  shortDescription: '…',                 // плитки
  description: '…',                      // страница товара и meta description
  sizes: [{ label: '60 капсул', price: 1490, placeholder: '[ЦЕНА]' }],  // price: null — выводится placeholder
  subscription: { discountPercent: 10, period: 'месяц' },               // null — плейсхолдеры [N] / [ПЕРИОД]
  composition: { main, second, third, full: { active, excipients, allergens } },
  usage: '…', contraindications: '…', highlights: ['…'],
  photos: { tile, main, extra: [a, b] },
  related: ['product-2'],                // пусто — все остальные товары
}
```

Страница товара, плитки каталога, поиск, sitemap и JSON-LD обновятся автоматически. Упаковка по умолчанию — средняя из `sizes`. JSON-LD `offers` добавляется, только если цена задана.

Новая категория — в `src/data/categories.ts` (чип в каталоге появится сам) и ключевые слова для подбора — в `src/lib/quiz.ts`.

## Как поставить реальные фото

Все места под фото — компонент `PhotoSlot`. Без `src` он рисует пунктирную заглушку с подсказкой фотографу, с `src` — `<img>` с `object-fit: cover`, размерами и `loading="lazy"` (у главного фото — `fetchpriority="high"`).

1. Положите файл в `public/images/` (например, `public/images/lenpalon-main.jpg`). Размеры — как в подсказке заглушки (например, 4:5, 1600×2000).
2. Для товара пропишите путь в `products.ts`: `photos.main.src = '/images/lenpalon-main.jpg'` и осмысленный `alt`.
3. Для фото на главной (hero, цели, линейка для спорта) — проп `src` у `<PhotoSlot>` в `src/pages/index.astro` или поле `photo.src` в `src/data/goals.ts`.

## Корзина (API)

`src/lib/cart.ts`: позиции `{ slug, size, mode, qty }` в `localStorage` (fallback в памяти), события `cart:change` и `storage` (синхронизация вкладок).
`cart.items()`, `cart.count()`, `cart.add()`, `cart.setQty()`, `cart.remove()`, `cart.clear()`, `cart.subscribe(cb)`. Страница `/cart` пока заглушка.

## Оставшиеся плейсхолдеры

Актуальный список — `npm run build && npm run check:placeholders` (по страницам). На момент сдачи:

- `[N]`
- `[ДОБАВИТЬ: расчётный счёт, банк, БИК, корр. счёт]`
- `[ДОПОЛНИТЕ ОТВЕТ]`
- `[Информация об аллергенах]`
- `[КОНТЕНТ: вход и история заказов]`
- `[КОНТЕНТ: история бренда, команда, производство]`
- `[КОНТЕНТ: протоколы испытаний по партиям, лаборатории и методы]`
- `[КОНТЕНТ: сроки и стоимость доставки по регионам, реквизиты для перевода]`
- `[КОНТЕНТ: страница корзины и оформления заказа (API — src/lib/cart.ts)]`
- `[КОНТЕНТ: условия возврата — согласовать с юристом]`
- `[КОНТЕНТ: черновик — проверка юристом перед публикацией]`
- `[НАЗВАНИЕ СЕРТИФИКАТА]`
- `[ОПИСАНИЕ]`
- `[ПЕРИОД]`
- `[ПРОВЕРИТЬ ЮРИСТУ: при дистанционной продаже ст. 26.1 Закона «О защите прав потребителей» даёт покупателю`
- `[ПРОТИВОПОКАЗАНИЯ ПО ТРЕБОВАНИЯМ ЗАКОНА]`
- `[СРОК]`
- `[Состав капсулы и наполнители]`
- `[Список веществ с формой и дозировкой]`
- `[Схема приёма: дозировка, время суток, длительность курса.]`
- `[УСЛОВИЯ]`
- `[УТОЧНИТЬ: название банка или платёжного сервиса]`
- `[УТОЧНИТЬ: не ведётся / ведётся в страны… — зависит от сервиса AI-консультанта и аналитики]`
- `[УТОЧНИТЬ: подключены ли Яндекс Метрика или другая аналитика]`
- `[УТОЧНИТЬ: провайдер сервиса и где он хранит данные]`
- `[УТОЧНИТЬ: с НДС или без НДС]`
- `[УТОЧНИТЬ: сведения о документе соответствия на капсульную форму]`
- `[УТОЧНИТЬ: сервис рассылки]`
- `[УТОЧНИТЬ: только 100% предоплата?]`
- `[ЦЕНА 2]`
- `[ЦЕНА]`

Также: картинка для превью в соцсетях 1200×630 (проп `ogImage` у `Layout`); фотографии во всех `PhotoSlot`; проверка юристом черновиков `/privacy`, `/offer`, `/consent`. Открытые вопросы — в `NOTES.md`.
