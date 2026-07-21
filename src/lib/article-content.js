/**
 * Split article HTML roughly in half at a paragraph boundary
 * so we can inject a mid-article CTA.
 */
export function splitHtmlAtMidpoint(html = "") {
  const text = String(html);
  if (!text.trim()) return { before: "", after: "" };

  const closeP = "</p>";
  const parts = text.split(closeP);
  if (parts.length < 3) {
    return { before: text, after: "" };
  }

  const mid = Math.floor(parts.length / 2);
  const before = parts.slice(0, mid).join(closeP) + closeP;
  const after = parts.slice(mid).join(closeP);
  return { before, after };
}

export function formatArticleDate(iso) {
  const raw = String(iso || "").trim();
  if (!raw) return "";
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T12:00:00` : raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function topicFromTitle(title = "") {
  return String(title)
    .replace(/^best\s+/i, "")
    .replace(/:\s*.*$/, "")
    .replace(/\s+reviewed.*$/i, "")
    .replace(/\s+guide.*$/i, "")
    .trim() || "this category";
}

/**
 * Use frontmatter faq when present; otherwise build useful defaults
 * from products + category so every article gets FAQ SEO.
 */
export function buildArticleFaqs(post) {
  if (Array.isArray(post?.faq) && post.faq.length > 0) {
    return post.faq
      .filter((f) => f && f.q && f.a)
      .map((f) => ({ q: String(f.q), a: String(f.a) }));
  }

  const products = Array.isArray(post?.products) ? [...post.products] : [];
  products.sort((a, b) => (a.rank || 99) - (b.rank || 99));
  const topic = topicFromTitle(post?.title);
  const category = String(post?.category || "").toLowerCase();
  const faqs = [];

  if (products[0]) {
    const top = products[0];
    faqs.push({
      q: `What is the best ${topic} pick right now?`,
      a: `Our top pick is ${top.name}${top.badge ? ` (${top.badge})` : ""}${
        top.price ? ` — about ${top.price}` : ""
      }. ${String(top.description || "")
        .slice(0, 180)
        .trim()}${top.description?.length > 180 ? "…" : ""}`,
    });
  }

  if (products.length >= 2) {
    faqs.push({
      q: `How do the top ${Math.min(products.length, 3)} options compare?`,
      a: products
        .slice(0, 3)
        .map(
          (p) =>
            `#${p.rank} ${p.name}${p.badge ? ` — ${p.badge}` : ""}${
              p.price ? ` (${p.price})` : ""
            }`,
        )
        .join(". ") +
        ". See the comparison table above for ratings and shop links.",
    });
  }

  if (category === "reviews" || category === "supplements") {
    faqs.push({
      q: "How do you choose which supplements to recommend?",
      a: "We score dosage form, label transparency, third-party testing when available, price per serving, and real-world reviews. Brands cannot pay for a higher ranking.",
    });
  } else {
    faqs.push({
      q: "Is this diet safe for beginners?",
      a: "Most people can start with a gradual version of the plan, but individual needs differ. Read the full guide, then check with a clinician if you have a medical condition or take medication.",
    });
  }

  faqs.push({
    q: "Will I pay more if I buy through your links?",
    a: "No. You pay the same retail price — often less when a store discount is applied. We may earn a commission from iHerb or MyProtein at no extra cost to you.",
  });

  return faqs.slice(0, 5);
}

export function normalizeFaqFrontmatter(faq) {
  if (!Array.isArray(faq)) return [];
  return faq
    .filter((f) => f && (f.q || f.question) && (f.a || f.answer))
    .map((f) => ({
      q: String(f.q || f.question),
      a: String(f.a || f.answer),
    }));
}
