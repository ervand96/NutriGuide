import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import RelatedArticles from "../../../../components/RelatedArticles";
import ArticleShopCta from "../../../../components/ArticleShopCta";
import ArticleBottomShop from "../../../../components/ArticleBottomShop";
import MobileShopBar from "../../../../components/MobileShopBar";
import { notFound } from "next/navigation";
import { getPostBySlug } from "../../../../lib/posts";
import ProductCard from "../../../../components/ProductCard";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nutri-guide-indol.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  const articleUrl = `${siteUrl}/category/${params.category}/${params.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: articleUrl,
      type: "article",
      images: [
        {
          url: `${siteUrl}/og/${params.slug}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${siteUrl}/og/${params.slug}`],
    },
  };
}

function quickAnswerLines(products: any[]) {
  if (!products?.length) {
    return [
      "🥇 Compare top-rated picks in our product cards below",
      "💰 Check iHerb and MyProtein for current prices",
      "🧠 Read the full guide before starting any supplement",
    ];
  }
  const sorted = [...products].sort(
    (a, b) => (a.rank || 99) - (b.rank || 99),
  );
  const lines: string[] = [];
  const top = sorted.find((p) => p.highlight) || sorted[0];
  if (top) lines.push(`🥇 Best Overall: ${top.name}${top.badge ? ` (${top.badge})` : ""}`);
  const budget = sorted.find((p) =>
    String(p.badge || "").toLowerCase().includes("budget"),
  );
  if (budget) lines.push(`💰 Best Budget: ${budget.name}`);
  else if (sorted[1]) lines.push(`💰 Also consider: ${sorted[1].name}`);
  lines.push("🧠 Always consult a healthcare professional before starting");
  return lines;
}

export default async function ArticlePage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const post = getPostBySlug(params.slug);

  if (!post) return notFound();

  if (post.category.toLowerCase() !== params.category.toLowerCase()) {
    return notFound();
  }

  const contentHtml = (
    await remark().use(remarkHtml).process(post.content)
  ).toString();

  const articleUrl = `${siteUrl}/category/${params.category}/${params.slug}`;
  const categoryUrl = `${siteUrl}/category/${params.category}`;
  const products = post.products ?? [];
  const quickLines = quickAnswerLines(products);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: post.category,
          item: categoryUrl,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: articleUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        "@type": "Organization",
        name: "NutriGuide",
      },
      publisher: {
        "@type": "Organization",
        name: "NutriGuide",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": articleUrl,
      },
      image: `${siteUrl}/og/${params.slug}`,
    },
    ...products.map((product: any) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      brand: {
        "@type": "Brand",
        name: product.name,
      },
      offers: {
        "@type": "Offer",
        url: product.affiliateUrl?.startsWith("http")
          ? product.affiliateUrl
          : `${siteUrl}${product.affiliateUrl}`,
        price: product.price?.replace(/[^0-9.]/g, "") || "0",
        priceCurrency: "USD",
      },
    })),
  ];

  return (
    <>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 pb-24 md:pb-14">
        <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <a href="/" className="hover:text-leaf-500">
              Home
            </a>
            <span>/</span>
            <a href={categoryUrl} className="hover:text-leaf-500">
              {post.category}
            </a>
            <span>/</span>
            <span className="text-gray-700 line-clamp-2">{post.title}</span>
          </div>
        </nav>

        <div className="mb-8 sm:mb-10">
          <span className="category-badge mb-3 sm:mb-4 inline-block">
            {post.category}
          </span>

          <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-bark mb-3 sm:mb-4">
            {post.title}
          </h1>

          <div className="text-gray-400 text-sm font-body">
            ⏱ {post.readTime} · Updated {post.date}
          </div>
        </div>

        <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 font-body">
          {post.description}
        </p>

        <div className="bg-leaf-50 border border-leaf-100 rounded-2xl p-6 mb-10">
          <div className="font-bold text-leaf-600 text-sm uppercase tracking-wider mb-3">
            ⚡ Quick Answer
          </div>
          <ul className="space-y-1 text-sm text-gray-600">
            {quickLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div
          className="article-content mb-10"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <ArticleShopCta slug={params.slug} />

        {products.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display font-black text-2xl mb-6">
              Our Top Picks
            </h2>
            {products.map((product: any) => (
              <ProductCard
                key={product.rank}
                product={product}
                slug={params.slug}
              />
            ))}
          </section>
        )}

        <ArticleBottomShop slug={params.slug} category={post.category} />

        <RelatedArticles
          currentSlug={post.slug}
          category={post.category}
        />

        <div className="mt-12 bg-gray-50 border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-gray-500">Affiliate Disclosure:</strong>{" "}
            This article may contain affiliate links to iHerb and MyProtein.
            We may earn a commission at no extra cost to you.
          </p>
        </div>
      </main>

      <MobileShopBar slug={params.slug} category={post.category} />
      <Footer />
    </>
  );
}
