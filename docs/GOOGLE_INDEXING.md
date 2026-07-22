# Google Search Console — sitemaps

## What was broken

On Vercel, files under `public/*.xml` are served with:

```
Content-Disposition: inline; filename="sitemap.xml"
```

Google Search Console often **downloads** that file but then **fails to process** it. Duplicate children inside a sitemap index (same URLs listed 3×) also hurts processing.

## What to submit in GSC

After deploy, use **one** of these (prefer the first):

```
sitemap_index.xml
```

```
sitemap.xml
```

```
gsc-sitemap
```

These are App Router responses **without** `Content-Disposition`.

Do **not** submit `sitemaps/pages.xml` — that static backup still has the Vercel header.

## Verify

- https://nutri-guide-indol.vercel.app/sitemap_index.xml
- https://nutri-guide-indol.vercel.app/sitemap.xml
- https://nutri-guide-indol.vercel.app/robots.txt

`sitemap_index.xml` should list **only** `/sitemap.xml`.

## If GSC still says «Couldn't process»

Known quirk on `*.vercel.app`. Sitemap is then optional:

1. Search Console → **URL Inspection**
2. Request indexing for `/`, `/best-picks`, `/quiz`, `/promo-codes`, and a few articles

Best long-term fix: attach a **custom domain** (GSC + sitemaps usually work cleanly there).
