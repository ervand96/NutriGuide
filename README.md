# 🍎 NutriGuide — Affiliate Site Starter

Next.js 14 + TypeScript + Tailwind CSS

---

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel (free)

```bash
npm install -g vercel
vercel
```

Done! Your site is live.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              ← Homepage
│   ├── blog/
│   │   ├── page.tsx          ← All articles list
│   │   └── [slug]/page.tsx   ← Individual article (with affiliate products)
│   ├── reviews/page.tsx      ← Reviews page
│   └── diets/page.tsx        ← Diets page
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ArticleCard.tsx
├── lib/
│   └── articles.ts           ← Add your articles here
└── types/
    └── index.ts              ← TypeScript types
```

---

## How to Add a New Article

1. Add it to `src/lib/articles.ts`
2. Create `src/app/blog/YOUR-SLUG/page.tsx`
3. Copy the template from `src/app/blog/[slug]/page.tsx`
4. Replace affiliate links with your real links

---

## Affiliate Programs to Register (all free)

| Program | Commission | Link |
|---------|-----------|------|
| Amazon Associates | 4-8% | associates.amazon.com |
| MyProtein | 8-10% | myprotein.com/affiliates |
| iHerb | 5-10% | iherb.com/affiliates |
| Noom | $35-45/signup | impact.com → search "Noom" |
| HelloFresh | $30-40/signup | hellofresh.com/affiliates |

---

## Monthly Costs

- Domain: ~$10/year (namecheap.com)
- Hosting: $0 (Vercel free tier)
- **Total: ~$10/year**
