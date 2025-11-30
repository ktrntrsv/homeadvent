Набор статических страниц адвента.

**Структура**
- `src/pages/*.html` — содержимое страниц с фронт-маттером (`title`, опционально `slug`, `aliases` для дополнительных копий, `layout: raw` для самостоятельного HTML как `homebience`). Плейсхолдер `{{base}}` внутри страниц/шаблона подставляется сборщиком (путь к ассетам).
- `src/layouts/base.html` — общий каркас, куда вставляется контент страниц.
- `src/styles/style.css` и `src/assets/**/*` — стили, шрифты и фавикон; на выходе копируются в `dist/assets`.
- `dist/` — результат сборки (`npm run build`).

**Сборка и просмотр**
- `npm run build` — собирает HTML в `dist/`. По умолчанию пути к ассетам относительные (`BASE_PATH=.`), так что страницы открываются и с диска, и с локального сервера.
- Для продакшена под путём `/advent` прогоняйте `BASE_PATH=/advent npm run build` перед выкладкой.
- Локально открыть `dist`: `npm run build && python3 -m http.server 4173 --directory dist` и зайти на `http://localhost:4173/main.html` (или нужную страницу).

**Опубликованные ссылки**
- https://homebience.ru/
- https://homebience.ru/advent/
- https://homebience.ru/advent/wrapping
- https://homebience.ru/advent/cookies
- https://homebience.ru/advent/candles
- https://homebience.ru/advent/letter
- https://homebience.ru/advent/decoration
- https://homebience.ru/advent/laying
- https://homebience.ru/advent/gifts
- https://homebience.ru/advent/dinner
- https://homebience.ru/advent/spa
- https://homebience.ru/advent/lighter
