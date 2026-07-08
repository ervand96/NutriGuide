# NutriGuide

Affiliate nutrition site — honest diet & supplement reviews. Monetized via **iHerb** and **MyProtein** only.

**Live:** https://nutri-guide-indol.vercel.app

---

## Quick Start

```bash
npm install
npm run dev          # → http://localhost:3000
npm test             # unit + integration tests
npm run generate     # create 3 articles via Cursor AI agent
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Homepage
│   ├── quiz/page.tsx                     # Diet quiz + email capture
│   ├── category/[category]/              # Category listing
│   ├── category/[category]/[slug]/       # Article pages
│   └── go/[partner]/                     # Affiliate redirects (iherb, myprotein)
├── content/posts/
│   ├── diets/ | reviews/ | supplements/  # Markdown articles + YAML frontmatter
├── components/
├── lib/
│   ├── posts.js                          # Content loader
│   ├── affiliate.js                      # Partner URL builder
│   └── affiliate-clicks.js               # Click/lead tracking (KV + logs)
└── scripts/
    ├── generate-post.js                  # Batch content generator
    └── lib/ai-agent.js                   # Cursor SDK multi-step writer
```

---

## Environment Variables

Copy `.env.example` → `.env`:

| Variable | Required | Purpose |
|----------|----------|---------|
| `IHERB_RCODE` | Yes | iHerb affiliate code |
| `MY_PROTEIN_RCODE` | Yes | MyProtein referral code |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL (sitemap, OG) |
| `CURSOR_API_KEY` | For generate | Cursor SDK — [dashboard/integrations](https://cursor.com/dashboard/integrations) |
| `KV_REST_API_URL` | Production | Vercel KV / Upstash — persistent click analytics |
| `KV_REST_API_TOKEN` | Production | KV auth token |
| `PINTEREST_*` | Optional | Pinterest auto-pins |

---

## Content Generation

Uses **Cursor SDK** (Composer) — 4 small agent calls per article (~700+ words + 3 products):

```bash
npm run generate              # Diets + Reviews + Supplements
npm run generate Reviews      # one category only
```

Products auto-link to `/go/iherb` or `/go/myprotein` based on product name/category.

---

## Affiliate Programs

| Store | Commission | Sign up |
|-------|-----------|---------|
| iHerb | 5–10% | [iherb.com/info/affiliates](https://www.iherb.com/info/affiliates) |
| MyProtein | 8–10% | [myprotein.com/referrals](https://www.myprotein.com/c/referrals/) |

All links must go through `/go/iherb` or `/go/myprotein` — never direct retailer URLs in content.

---

## Deploy (Vercel)

```bash
vercel --prod
```

Set env vars in Vercel Dashboard. For click tracking in production, connect **Vercel KV** (or Upstash Redis) and add `KV_REST_API_URL` + `KV_REST_API_TOKEN`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm test` | All tests |
| `npm run test:unit` | Unit tests only (fast) |
| `npm run generate` | AI content batch |
| `npm run pinterest:auto` | Pinterest pin automation |
