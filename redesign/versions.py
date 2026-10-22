"""Сборка архива версий сайта из истории git для сравнения.

Две серии: первый лендинг (index.html в корне, LANDING, папки lN) и редизайн (redesign/index.html, VERSIONS, папки vN).
Каждая версия = коммит. Скрипт кладёт в OUT:
  versions/index.html          — список всех версий
  versions/vN/index.html       — снимок страницы на момент коммита (с плашкой версии); lN — для лендинга
  versions/assets/<sha>.<ext>  — картинки из того же коммита (одинаковые файлы хранятся один раз)
Открыть версию: ссылка на сайт + #vN или #lN, список версий: + #versions.

Запуск: python3 redesign/versions.py OUT_DIR
"""
import hashlib
import html
import os
import re
import subprocess
import sys

# (коммит, дата, что изменилось) — по порядку; новая правка добавляется в конец
VERSIONS = [
    ("6be35dd", "20.10", "Первая версия в стиле референса"),
    ("a95f910", "22.10", "Секции видны сразу, липкая шапка"),
    ("5dbb951", "22.10", "Строгая палитра: белый, серый, графит"),
    ("d7119a2", "22.10", "Стиль Momentous, реальные фото продукта"),
    ("e87a105", "22.10", "Фото блистеров циклов 1–3, надпись на коробке"),
    ("8087b7c", "22.10", "Нежно-серые блоки вместо чёрных, чистые карточки блистеров"),
    ("a55ebf9", "22.10", "Баннеры, чат поддержки, бирюзовые кнопки, варианты шрифта"),
    ("caad8cf", "22.10", "Анимированная капсула вместо знака, шрифт Manrope"),
    ("a9de72b", "22.10", "Яркая анимация, вертикальные капсулы в «Четырёх составах»"),
    ("b22e51c", "22.10", "Плитка «15 дней — полный курс» как раньше"),
]

# первый лендинг (одна страница в корне репозитория)
LANDING = [
    ("2cb810f", "08.10", "Первый лендинг"),
    ("29a3108", "09.10", "Данные о продукте и компании из документов"),
    ("54d2847", "09.10", "Схема приёма с упаковки"),
    ("ca95475", "09.10", "Палитра упаковки, новый телефон, слоган, цена"),
    ("1e777cf", "09.10", "Палитра подарочной коробки: жемчуг, золото, синий"),
    ("2f719fa", "09.10", "Доставка, оплата, возврат, контакты, юридические черновики"),
    ("d7119a2", "22.10", "Название «Ленпалон Фэмили»"),
]

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def git(*args):
    return subprocess.run(["git", "-C", ROOT, *args], check=True, capture_output=True).stdout


BADGE_CSS = """<style>
.ver-badge{position:fixed;left:calc(12px + env(safe-area-inset-left,0px));bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:9999;display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;max-width:calc(100% - 24px);padding:10px 14px;border-radius:12px;background:#22404C;color:#fff;font:600 14px/1.3 system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.2)}
.ver-badge a{color:#7FD4E2;text-decoration:underline;text-underline-offset:3px}
</style>"""


def badge(k, n, total, date, note, title):
    nav = []
    if n > 1:
        nav.append(f'<a href="../{k}{n - 1}/index.html">← {k}{n - 1}</a>')
    if n < total:
        nav.append(f'<a href="../{k}{n + 1}/index.html">{k}{n + 1} →</a>')
    nav.append('<a href="../index.html">Все версии</a>')
    nav.append('<a href="../../index.html">Текущая</a>')
    return (f'<div class="ver-badge" role="note"><span>{title} {n} · {date} · {html.escape(note)}</span>'
            + "".join(nav) + "</div>")


def series(out, assets, k, src, items, title, current):
    total = len(items)
    rows = []
    for n, (rev, date, note) in enumerate(items, 1):
        page = git("show", f"{rev}:{src}").decode("utf8")
        imgs = git("ls-tree", "--name-only", rev, "redesign/img/").decode().split() if k == "v" else []

        def put(name):
            data = git("show", f"{rev}:redesign/img/{name}")
            ext = os.path.splitext(name)[1]
            key = hashlib.sha1(data).hexdigest()[:16] + ext
            path = os.path.join(assets, key)
            if not os.path.exists(path):
                with open(path, "wb") as f:
                    f.write(data)
            return "../assets/" + key

        names = {os.path.basename(p) for p in imgs}
        page = re.sub(r'(["(])img/([\w.-]+)', lambda m: m.group(1) + (put(m.group(2)) if m.group(2) in names else "img/" + m.group(2)), page)
        if k == "v":
            page = page.replace('href="../', 'href="../../')
        else:
            page = re.sub(r'href="(privacy|consent|offer)\.html', r'href="../../\1.html', page)
        page = page.replace("</head>", BADGE_CSS + "\n</head>", 1)
        page = page.replace("</body>", badge(k, n, total, date, note, title) + "\n</body>", 1)
        d = os.path.join(out, "versions", f"{k}{n}")
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "index.html"), "w", encoding="utf8") as f:
            f.write(page)
        cur = " · текущая" if current and n == total else ""
        rows.append(f'<li><a href="{k}{n}/index.html"><b>{title} {n}</b><span>{date}{cur} · #{k}{n}</span><em>{html.escape(note)}</em></a></li>')
    rows.reverse()
    return rows


def build(out):
    assets = os.path.join(out, "versions", "assets")
    os.makedirs(assets, exist_ok=True)
    rows = series(out, assets, "v", "redesign/index.html", VERSIONS, "Редизайн", True)
    lrows = series(out, assets, "l", "index.html", LANDING, "Лендинг", False)
    index = f"""<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Версии сайта Ленпалон Фэмили</title>
<style>
:root{{--bg:#fff;--ink:#22404C;--ink-2:#4E6670;--line:#D5D9DE;--sky:#7FD4E2;--soft:#F3F6F8;color-scheme:light}}
body{{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,sans-serif;padding:40px max(16px,env(safe-area-inset-right,0px)) 48px max(16px,env(safe-area-inset-left,0px))}}
main{{max-width:720px;margin:0 auto}}
h1{{font-size:32px;margin:0 0 8px;letter-spacing:-.02em}}
h2{{font-size:22px;margin:32px 0 12px}}
p{{margin:0 0 24px;color:var(--ink-2)}}
ul{{list-style:none;margin:0;padding:0;display:grid;gap:10px}}
a{{color:inherit}}
li a{{display:grid;grid-template-columns:auto 1fr;gap:2px 16px;padding:14px 18px;border:1px solid var(--line);border-radius:12px;text-decoration:none;background:var(--soft)}}
li a:hover,li a:focus-visible{{border-color:var(--sky);outline:none}}
li b{{font-size:18px}} li span{{color:var(--ink-2);align-self:center}} li em{{grid-column:1/-1;font-style:normal}}
.top{{display:inline-block;margin-bottom:20px;color:var(--ink-2)}}
</style></head><body><main>
<a class="top" href="../index.html">← Текущая версия сайта</a>
<h1>Версии сайта</h1>
<p>Каждая правка сохраняется отдельной версией. Внизу каждой версии есть плашка с переходом к соседним.</p>
<h2>Редизайн</h2>
<ul>
{chr(10).join(rows)}
</ul>
<h2>Первый лендинг</h2>
<ul>
{chr(10).join(lrows)}
</ul>
</main></body></html>
"""
    with open(os.path.join(out, "versions", "index.html"), "w", encoding="utf8") as f:
        f.write(index)


if __name__ == "__main__":
    build(sys.argv[1])
