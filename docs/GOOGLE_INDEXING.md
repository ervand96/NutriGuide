# Google sitemap «Не получено» — это НЕ значит, что файл сломан

Твой sitemap **открывается** (HTTP 200). Googlebot тоже его видит.
В Search Console на `*.vercel.app` часто висит **старая ошибка в кэше** для `/sitemap.xml` и `/sitemap.txt`.

## Что поставить СЕЙЧАС (новый путь)

В поле «Добавьте файл Sitemap» вставь **ровно**:

```
sitemaps/pages.xml
```

Нажми **ОТПРАВИТЬ**.

Если снова ошибка — вторым:

```
sitemaps/pages.txt
```

Проверка в браузере:
- https://nutri-guide-indol.vercel.app/sitemaps/pages.xml
- https://nutri-guide-indol.vercel.app/sitemaps/pages.txt

## Старые записи

`/sitemap.xml` и `/sitemap.txt` со статусом «Не получено» можно **игнорировать** или удалить.
Не отправляй их снова — Google помнит неудачу по этому URL.

## Параллельно (важнее sitemap)

1. URL Inspection → главная → **Запросить индексирование**
2. То же для `/best-picks`, `/quiz`, 3 статей
3. Подожди 1–7 дней (на vercel.app бывает долго)

## Почему так

Google отключил ping. На Vercel «Couldn't fetch» часто = кэш GSC / задержка, а не 404.
Сайт при этом индексируется и через обычный краулинг + URL Inspection.
