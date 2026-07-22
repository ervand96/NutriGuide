# Google Search Console — sitemaps

## Статус «Не получено» / Couldn't fetch

Это **не значит**, что файл битый. На `*.vercel.app` GSC часто кэширует неудачную попытку скачивания, даже когда URL открывается в браузере с HTTP 200.

### Что сделать сейчас (по шагам)

1. В Search Console → Sitemaps → удали старую запись `sitemap_index.xml` (три точки → Удалить).
2. Подожди ~2 минуты после деплоя.
3. Добавь **новый** путь (ещё не в кэше GSC):

```
feed/sitemap.xml
```

Проверка в браузере: https://nutri-guide-indol.vercel.app/feed/sitemap.xml

Если снова «Не получено», попробуй cache-bust варианты (John Mueller / Next.js community):

```
feed/sitemap.xml/
```

или

```
gsc-sitemap?v=2
```

4. Обнови страницу Sitemaps через несколько часов — статус меняется не мгновенно.

## Рабочие URL на сайте

| URL | Назначение |
|-----|------------|
| `/feed/sitemap.xml` | **Основной** для GSC (свежий путь) |
| `/sitemap.xml` | App Router urlset |
| `/gsc-sitemap` | Запасной urlset |
| `/sitemap_index.xml` | Index → указывает на `/feed/sitemap.xml` |

`robots.txt` объявляет только `/feed/sitemap.xml`.

## Если снова не проходит

На `vercel.app` sitemap часто **не критичен**. Индексация:

1. URL Inspection → главная → «Запросить индексирование»
2. То же для `/best-picks`, `/quiz`, `/promo-codes`, 2–3 статей

Надёжное лекарство позже: **свой домен** вместо `*.vercel.app`.
