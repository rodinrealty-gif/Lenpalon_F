# PLAN — магазин «Ваш бренд» (Astro)

Проект живёт в `shop/` (корень репозитория занят лендингом Lenpalon). Макет: `shop/design/*.html` — источник правды по визуалу.

## Стек
Astro 5 + TS (strict), SSG, ванильный TS в `<script>` компонентов. Чистый CSS: `src/styles/tokens.css`, `src/styles/base.css`, scoped-стили компонентов. Шрифты `@fontsource/onest` (400/500/600/700), `@fontsource/jetbrains-mono` (400/500). ESLint (flat, typescript-eslint + eslint-plugin-astro) + Prettier (prettier-plugin-astro). Проверки: `npm run build`, `astro check`, `eslint`, `check:placeholders`, `check:links`.

## Факты из макета (читать макет повторно не нужно)
- `:root` токены: bg #FFFFFF, surface #F3F7FD, ink #0E1A2B, muted #4F5F76, line #D9E3F2, tint #E3EDFB, accent #1F5FD6, on-accent #FFFFFF, r 14px, ease cubic-bezier(0.16,1,0.3,1). `color-scheme: light`.
- Общие классы (одинаковый `<style>` во всех 3 файлах): `.skip .wrap(1360/40px→16px) .mono .i(20px mask) .btn(52px, 0 28px, 16px/600, pill) .btn-primary .btn-ghost .btn-ink .btn-sm(44px, 0 20px, 15px) .navlink(44px, 15/500, border-bottom 2px; hover/aria-current=ink) .iconbtn(44px, hover tint, active scale .94) .chip(44px, 0 20px, 15/500, line border; pressed=ink) .chip-lg(48px, 0 22px) .opt(radio card, 18px 20px, r; checked=surface+ink ring) .slot(tint, dashed line outline, 13px muted, padding 16) .lift .arrow(translate 3,-3) .qbtn(56px, 17/500, r; selected tint/600) .tile .name(underline grow) .snap(gap 24, 280px, scroll-snap) .field(52px pill, surface)`. `.rise .d1/.d2/.d3` (rise .9s, 18px) только в `prefers-reduced-motion: no-preference`. `≤1023`: `.grid4`→2 кол. `≤767`: wrap 16px, `.nav` wrap+auto height+12px pad, nav order 3/100% gap 4px 20px, `.bento`/`.stack-md` 1 кол, `.sticky-md` static, `.hero-h` 42px. `h1,h2{text-wrap:balance}`.
- Промо-полоса: tint, 14px, 12px 16px, «Бесплатная доставка от [СУММА] ₽».
- Шапка: 72px, border-bottom line, бренд 24/700 -0.03em, nav gap 32 (Каталог, Цели, Лаборатория, О бренде), справа iconbtn: поиск, кабинет, корзина (padding 0 12px, счётчик). Иконки 22px.
- Подвал: pt 72 pb 40, сетка 6/3/3 gap 48; бренд 24/700; форма «Новинки и скидки на почту» (label 15/600, input 52px pill surface + btn-ink «Подписаться»); «Магазин»: Каталог, Подбор; «Помощь»: Доставка и оплата, Возврат, Контакты; низ: mt 64, pt 24, border-top, 14px muted: «© [ГОД] [ЮРЛИЦО]», Политика конфиденциальности, Оферта (underline); «БАД не является лекарственным средством. [ЮРИДИЧЕСКИЙ ДИСКЛЕЙМЕР]» max 560px.
- Заголовки секций h2: clamp(34px,3.6vw,48px)/600/-0.035em/1.05. Секции: padding 112px (товар: 104/96).
- Главная: hero pt56 pb72, сетка 7/5 gap 64; h1 clamp(44px,4.9vw,70px) -0.04em lh 1.02; p 19px muted max 440 pretty; кнопки primary «Смотреть каталог»+i-right, ghost «Пройти подбор»; slot 4:5 min-h 480 «Фото 4:5, 1600 на 2000. Баночка добавок на каменной полке, утренний свет у окна». Клиенты: border-top/bottom, py 32, «Среди клиентов» 15 muted; 5 логотипов (А Атлет круг, Б Бегущий город r8, К Клуб 24 r 50/50/50/4, Р Рельеф r 4/50/4/50, Н Норд Фитнес обводка 2px) 17/600 muted, знак 28px. Цели: бенто 12 кол, ряды 300/300, gap 16: «Сон и стресс» 1/6×2 ряда (фото + подпись 22/600 + стрелка 24), «Спорт и восстановление» 6/13 ряд1 (текст | фото 1:1), «Иммунитет» 6/10 ряд2 accent, i-shieldplus 40, «Мужское здоровье» 10/13 ряд2 tint, i-male 40. Принципы: surface, 5/7, «Прозрачность на каждом шаге» + «Протоколы лаборатории»; 4 пункта (кружок 52 tint, иконка 26, h3 21/600, p 16 muted 52ch): flask/shield/leaf/truck. Линейка для спорта: slot 21:9 min-h 460 + панель abs left/bottom 32, max 440, surface, p36, gap 18, h2 34px, кнопка ink sm «Выбрать для спорта». Популярное: шапка + «Весь каталог»; бенто 12 кол gap 48/24: товар 1/8 (slot 1:1 min-h 360, h3 26px, описание 16 muted, цена 22/600, btn primary sm «В корзину»), справа 8/13 два компактных (slot 150×150 p10 11px; h3 19px; описание 15; цена 17/600). Подбор `#quiz`: accent, r, p64, 6/5 gap 48, label «Ваша цель», input 56px pill surface, btn-ink «Пройти подбор». FAQ: border-top, h2 mb 48, 5/7: tablist (qbtn + i-right), панель surface p40 min-h 200, h3 26px, p 17 muted 60ch. 4 вопроса (тексты в `faq.ts`).
- Каталог: крошки 14px muted (underline ссылки, «/» aria-hidden), h1 clamp(44px,5.4vw,76px) lh 1 m 32/0/40; панель border-top ink, py20: чипы (Все, Спорт, Сон, Иммунитет, Мужское здоровье) + счётчик (aria-live) + label «Сортировка» + select.field 44px; сетка 4 кол gap 56/24 (pb 120). Плитка: slot 1:1, h2 18px name, категория 14 muted, цена 17/600, btn ghost sm «В корзину». Промо span 2: tint p40, i-sparkle 40, h2 34px «Не знаете, с чего начать?», btn-ink «Пройти подбор». Empty: surface p 72/32, i-sparkle 40 muted, h2 28px «В этой категории пока пусто», p, btn primary «Показать все товары». Товары: 1 Спорт «Банка с белой крышкой», 2 Сон «Тёмная стеклянная бутылка», 3 Спорт «Пакет с порошком», 4 Иммунитет «Банка капсул», 5 Сон «Флакон с пипеткой», 6 Иммунитет «Банка с мерной ложкой».
- Товар: крошки; 7/5 gap 64; слева slot 4:5 min-h 480 + 2× slot 1:1 («Капсулы на ладони», «Банка рядом со стаканом воды»); справа sticky top 24, gap 28: категория 15 muted, h1 clamp(36px,3.8vw,54px), описание 17 muted 44ch; цена 34/600 + note 15 muted; «Упаковка» chips-lg 60/120/180 капсул ([ЦЕНА 1..3] ₽), по умолчанию 120; radiogroup opt: «Разовая покупка / Оплата один раз, без обязательств», «Подписка со скидкой [N]% / Доставка каждые [ПЕРИОД], отмена в любой момент»; степпер 56px pill surface, кнопки 52; btn primary 56px «Добавить в корзину» / «Добавлено в корзину»; 3 пункта с i-check accent. Состав (surface, 104): 12 кол: 1/7 accent p36 min-h 240 «Основное вещество» mono clamp(44,5vw,72) «[N] мг»; 7/10 tint p28 clamp(32,3.2vw,44); 10/13 bg+line. Кнопка ghost «Полный состав» → 3 колонки (Действующие вещества / Вспомогательные / Аллергены). Как принимать: max 65ch, p 18 muted, p 14 «Перед применением проконсультируйтесь со специалистом. [ПРОТИВОПОКАЗАНИЯ ПО ТРЕБОВАНИЯМ ЗАКОНА]». С этим покупают: border-top, pt 96 pb 112, .snap, плитки h3 18 + цена.

## Структура
```
src/
  styles/ tokens.css base.css
  icons/ *.svg (Phosphor из data-URI макета)
  data/ site.ts products.ts categories.ts faq.ts principles.ts clients.ts goals.ts
  lib/ cart.ts plural.ts format.ts newsletter.ts quiz.ts search-index.ts
  components/ Layout Header Footer Breadcrumbs Button Chip Icon PhotoSlot ProductTile PromoTile BentoCard PrincipleItem FaqTabs QuizCta SizePicker PurchaseModeRadio QtyStepper CompositionBento ProductRail SearchDialog NewsletterForm StubPage
  pages/ index catalog product/[slug] lab about delivery returns contacts privacy offer account cart 404 sitemap.xml robots.txt
scripts/ check-placeholders.mjs check-links.mjs
```

## Решения
- Цена в данных: `price: number | null`; `null` выводится как плейсхолдер `[ЦЕНА …] ₽`. Сортировка по числу, товары без цены — в конце в исходном порядке.
- «Цели» → `/#goals` (бенто на главной), «Лаборатория» → `/lab`, «О бренде» → `/about`. Кабинет → `/account`, корзина → `/cart` (заглушки).
- `aria-current="page"`: каталог и товары — «Каталог»; `/lab`, `/about` — свои пункты; на главной нет (там нет своего пункта).
- Каталог рендерится на сервере целиком; JS только фильтрует/сортирует/переставляет промо.
- `site` URL — из `PUBLIC_SITE_URL` (по умолчанию `https://example.com`, check:placeholders предупреждает).

## Этапы
1. [x] План (этот файл)
2. [x] Каркас, токены, base.css, Layout/Header/Footer, иконки, шрифты
3. [ ] Данные и компоненты
4. [ ] Страницы: главная → каталог → товар → заглушки, 404
5. [ ] Логика: корзина, каталог, FAQ, поиск, подписка, подбор, опции товара
6. [ ] A11y, SEO (JSON-LD, sitemap, robots), перф, проверки, скриншоты макет vs реализация, README, NOTES

## Журнал
- Этап 2: Astro 5.18, strictest TS, `scopedStyleStrategy: 'class'` (scoped-классы родителя доходят до корня дочернего компонента через `class`). Иконки — инлайн SVG через `<Icon>`. Добавлен токен `--danger` (ошибки форм; в макете нет). Данные: Ленпалон там, где есть (бренд, юрлицо, контакты, промо, товар 1), остальное — плейсхолдеры макета; добавлена категория «Пищеварение» (digestion).
