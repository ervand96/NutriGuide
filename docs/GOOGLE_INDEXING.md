# Google Search Console — sitemaps

## Важно: «Не получено» на vercel.app

Если URL открывается в браузере с **HTTP 200** и валидным XML — **код сайта в порядке**.

На `*.vercel.app` Google Search Console часто показывает «Не получено» / Couldn't fetch **днями или неделями**, даже когда файл доступен. Это известная связка GSC + Vercel, не «сломанный sitemap».

### Что проверить у себя (1 минута)

1. Property в GSC = именно  
   `https://nutri-guide-indol.vercel.app`  
   (не `http://`, не другой поддомен).
2. В браузере открывается:  
   https://nutri-guide-indol.vercel.app/gsc-sitemap
3. **Не** добавляй trailing slash (`...xml/`) — на этом сайте он даёт **308 redirect**, GSC это часто считает «Не получено».

### Что отправить в GSC

Удали все старые записи sitemap. Добавь **только**:

```
gsc-sitemap
```

Запасной (nested Next.js path):

```
sitemap/sitemap.xml
```

Текстовый вариант:

```
gsc-urls
```

Статус может остаться «Не получено» ещё долго — это нормально для vercel.app.

### Индексация БЕЗ sitemap (делай сейчас)

Sitemap на preview-домене **не обязателен** для попадания в Google:

1. Search Console → **Проверка URL**
2. Вставь `https://nutri-guide-indol.vercel.app/`
3. **Запросить индексирование**
4. Повтори для `/best-picks`, `/quiz`, `/promo-codes`, 3–5 статей

Опционально: `npm run indexnow` (Bing/Yandex).

### Настоящее лекарство

Подключи **свой домен** к Vercel и заново добавь property в GSC. На кастомном домене sitemap обычно проходит нормально.
