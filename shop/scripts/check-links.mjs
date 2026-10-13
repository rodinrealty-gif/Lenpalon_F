// Проверяет, что все внутренние ссылки (href="/…") в dist/ ведут на существующие страницы и якоря.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });
}
const pages = walk(DIST);
const idsOf = new Map(pages.map((p) => [p, new Set([...readFileSync(p, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));

function resolve(path) {
  const clean = decodeURI(path).replace(/\/$/, '');
  for (const c of [join(DIST, clean, 'index.html'), join(DIST, `${clean}.html`), join(DIST, clean)]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

let bad = 0;
let checked = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    checked++;
    const [pathAndQuery, hash] = href.split('#');
    const path = (pathAndQuery ?? '').split('?')[0];
    const target = path ? resolve(path) : page;
    const from = '/' + relative(DIST, page);
    if (!target) {
      console.log(`✗ ${from}: ${href} — нет страницы`);
      bad++;
    } else if (hash && !idsOf.get(target)?.has(hash)) {
      console.log(`✗ ${from}: ${href} — нет якоря #${hash}`);
      bad++;
    }
  }
}
console.log(`Проверено ссылок: ${checked}, битых: ${bad}`);
process.exit(bad ? 1 : 0);
