# NutriGuide promotion kit (manual)

Use these after deploy. Prefer value-first posts — never spam affiliate codes as the first line.

## Content strategy (already applied in repo)
- Thin duplicate protein/collagen/generic guides are `noindex` + canonical to the strongest article
- Homepage removed redundant Browse by Topic / Trending / StoreGuide blocks
- Prefer one strong article per topic over near-duplicates

## Live URLs
- Home: https://nutri-guide-indol.vercel.app
- Best picks: https://nutri-guide-indol.vercel.app/best-picks
- Quiz: https://nutri-guide-indol.vercel.app/quiz
- Sitemap: https://nutri-guide-indol.vercel.app/sitemap.xml
- RSS: https://nutri-guide-indol.vercel.app/rss.xml

## Google Search Console (do this once)
1. Open Search Console for the verified property
2. Submit sitemap: `sitemap.xml` (or full URL)
3. If status is **"Couldn't fetch" / "Не получено"** or **"Could not process" / "Не удалось обработать"**:
   - Open https://nutri-guide-indol.vercel.app/sitemap.xml — you should see a URL list (browser style warning is normal)
   - Delete the old sitemap entry in GSC, then submit **`sitemap.txt`** (plain URL list — often works when XML processing fails)
   - Or resubmit `sitemap.xml` after deploy (dates are now `YYYY-MM-DD` only)
   - Wait 1–7 days; GSC on `*.vercel.app` is often slow
4. Request indexing for `/`, `/best-picks`, `/quiz`, and 3 top articles
5. Check Coverage / Page indexing weekly

Sitemaps are generated at build time (`npm run sitemap`) into `public/sitemap.xml` and `public/sitemap.txt`.

## Reddit (manual — API blocked for new apps)
Pick 1–2 relevant subs (e.g. r/Supplements, r/nutrition, r/Fitness). Lead with advice, end with one link.

### Template A — creatine
Title: Honest takeaways after comparing creatine monohydrate options

Body:
I put together a short comparison of creatine picks with prices you can check live (iHerb / MyProtein). If you’re starting out: 3–5g daily monohydrate is usually enough — fancy blends are optional.

Guide: https://nutri-guide-indol.vercel.app/best-picks

### Template B — diet confusion
Title: Mediterranean vs keto when you want something sustainable

Body:
If you want long-term adherence more than a 2-week crash: Mediterranean is usually easier. Keto can work for short cuts if you tolerate it.

Quiz (2 min): https://nutri-guide-indol.vercel.app/quiz

### Template C — vitamin D / magnesium
Title: Which basics are actually worth buying?

Body:
Most people don’t need 12 bottles. Start with gaps you can measure (D, magnesium, omega-3) and skip stacks with 40 mystery blends.

https://nutri-guide-indol.vercel.app/category/supplements

## Pinterest
Pin OG images from `/og/{slug}` with titles like “Best creatine picks 2026” → article URL.
Existing script: `npm run pinterest:auto` (if credentials configured).

## Weekly rhythm
Mon: 1 Reddit value post  
Wed: share 1 guide on X/Facebook via on-page Share buttons  
Fri: check Search Console impressions + fix thin pages if needed
