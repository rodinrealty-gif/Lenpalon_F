// Перечисляет оставшиеся плейсхолдеры вида [ЦЕНА], [СРОК], [КОНТЕНТ: …] в собранном сайте (dist/).
// Запуск: npm run build && npm run check:placeholders
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const RE = /\[(?:[A-ZА-ЯЁ][A-ZА-ЯЁ0-9 ]*[A-ZА-ЯЁ0-9]|[А-ЯЁ][^\]<]{2,120}?|N)(?::[^\]<]*)?\]/g;

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });
}
const text = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

const totals = new Map();
for (const file of walk(DIST)) {
  const found = new Map();
  for (const m of text(readFileSync(file, 'utf8')).matchAll(RE)) found.set(m[0], (found.get(m[0]) ?? 0) + 1);
  if (!found.size) continue;
  console.log(`\n/${relative(DIST, file).replace(/index\.html$/, '')}`);
  for (const [k, n] of found) {
    console.log(`  ${k}${n > 1 ? `  ×${n}` : ''}`);
    totals.set(k, (totals.get(k) ?? 0) + n);
  }
}
const site = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
if (site.includes('example.com')) console.log('\n! PUBLIC_SITE_URL не задан: в sitemap example.com');
console.log(
  `\nИтого уникальных плейсхолдеров: ${totals.size}, вхождений: ${[...totals.values()].reduce((a, b) => a + b, 0)}`,
);
