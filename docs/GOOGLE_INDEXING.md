# Get NutriGuide into Google (do this now — 10 minutes)

Google **cannot** be notified by ping anymore (deprecated 2023).  
Only **you** can push indexing via Search Console. The site is already verified.

## Step 1 — Open Search Console
https://search.google.com/search-console?resource_id=https%3A%2F%2Fnutri-guide-indol.vercel.app%2F

## Step 2 — Submit sitemaps (Sitemaps → add)
1. Delete old broken `/sitemap.xml` entry if it still shows errors
2. Submit: `sitemap.txt`
3. Also submit: `sitemap.xml`
4. Wait — status may stay “processing” for hours/days on vercel.app

## Step 3 — Request indexing (URL Inspection) — paste one by one, Request indexing
Priority URLs:
1. https://nutri-guide-indol.vercel.app/
2. https://nutri-guide-indol.vercel.app/best-picks
3. https://nutri-guide-indol.vercel.app/quiz
4. https://nutri-guide-indol.vercel.app/category/reviews
5. https://nutri-guide-indol.vercel.app/category/supplements
6. https://nutri-guide-indol.vercel.app/category/diets
7. https://nutri-guide-indol.vercel.app/site-map
8. Pick 3 strong articles (creatine, magnesium, mediterranean)

Daily limit ~10–20 requests — don’t spam.

## Step 4 — Check in 2–7 days
Search: `site:nutri-guide-indol.vercel.app`  
Then: `best creatine site:nutri-guide-indol.vercel.app`

## Already done in code
- Verified meta tag in layout
- robots.txt + sitemaps
- HTML sitemap at `/site-map`
- IndexNow for Bing/Yandex: `npm run indexnow` (after deploy)

## Biggest boost later
Buy a real domain (not vercel.app) → faster trust & indexing.
