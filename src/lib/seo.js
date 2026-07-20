/** Shared SEO helpers for NutriGuide promotion & indexing */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nutri-guide-indol.vercel.app";

export const SITE_NAME = "NutriGuide";

export const DEFAULT_DESCRIPTION =
  "Science-backed reviews of diets, supplements, and nutrition programs. Compare top picks, then shop iHerb and MyProtein with tracked discount links.";

export function absoluteUrl(path = "") {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * @param {{
 *   title: string,
 *   description: string,
 *   path: string,
 *   type?: string,
 *   imagePath?: string,
 * }} opts
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  imagePath,
}) {
  const url = absoluteUrl(path);
  const image = absoluteUrl(imagePath || "/og/default");
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo.svg"),
    description: DEFAULT_DESCRIPTION,
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleJsonLd({ title, description, date, url, image, category }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    articleSection: category,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.svg"),
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image,
  };
}

export function productJsonLd(product, { siteUrl = SITE_URL } = {}) {
  const brandName =
    String(product.name || "")
      .split(",")[0]
      ?.trim() || "NutriGuide Pick";
  const price = String(product.price || "").replace(/[^0-9.]/g, "");
  const offerUrl = product.affiliateUrl?.startsWith("http")
    ? product.affiliateUrl
    : product.affiliateUrl
      ? `${siteUrl}${product.affiliateUrl}`
      : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    brand: { "@type": "Brand", name: brandName },
  };

  if (product.imageUrl?.startsWith("/")) {
    schema.image = absoluteUrl(product.imageUrl);
  } else if (product.imageUrl?.startsWith("http")) {
    schema.image = product.imageUrl;
  }

  const reviewText = [
    product.description,
    ...(product.pros || []),
    ...(product.cons || []),
  ].join(" ");
  const reviewMatch = reviewText.match(
    /([\d,]+)\+?\s*(?:customer\s*)?reviews?/i,
  );
  if (product.rating && reviewMatch) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(product.rating),
      bestRating: "5",
      worstRating: "1",
      ratingCount: reviewMatch[1].replace(/,/g, ""),
    };
  }

  if (offerUrl && price) {
    schema.offers = {
      "@type": "Offer",
      url: offerUrl,
      price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    };
  }

  return schema;
}

export function itemListJsonLd({ name, description, items }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
