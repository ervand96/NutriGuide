import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import ProductCard from "@/components/ProductCard";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://www.nutriguide.com/category/${params.category}/${params.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.nutriguide.com/category/${params.category}/${params.slug}`,
      type: "article",
      images: [
        {
          url: `https://www.nutriguide.com/og/${params.slug}`,
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
      images: [`https://www.nutriguide.com/og/${params.slug}`],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const post = getPostBySlug(params.slug);

  if (!post) return notFound();

  // 🔥 защита от неправильной категории

  if (post.category.toLowerCase() !== params.category.toLowerCase()) {
    return notFound();
  }

  // Конвертируем markdown статьи (post.content) в HTML —
  // раньше этот текст вообще никуда не выводился.
  const contentHtml = (
    await remark().use(remarkHtml).process(post.content)
  ).toString();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.nutriguide.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: post.category,
          item: `https://www.nutriguide.com/category/${params.category}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: `https://www.nutriguide.com/category/${params.category}/${params.slug}`,
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
        "@id": `https://www.nutriguide.com/category/${params.category}/${params.slug}`,
      },
      image: `https://www.nutriguide.com/og/${params.slug}`,
    },
    ...(post.products ?? []).map((product: any) => ({
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
        url: product.affiliateUrl,
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

      <main className="max-w-3xl mx-auto px-6 py-14">
        {/* HEADER */}
        <div className="mb-10">
          <span className="category-badge mb-4 inline-block">
            {post.category}
          </span>

          <h1 className="font-display font-black text-4xl md:text-5xl leading-none tracking-tight text-bark mb-4">
            {post.title}
          </h1>

          <div className="text-gray-400 text-sm font-body">
            ⏱ {post.readTime} · Updated {post.date}
          </div>
        </div>
        {/* PRODUCTS */}
        {(post.products ?? []).map((product: any) => (
          <ProductCard key={product.rank} product={product} />
        ))}

        {/* DESCRIPTION */}
        <p className="text-lg text-gray-600 leading-relaxed mb-8 font-body">
          {post.description}
        </p>

        {/* QUICK ANSWER */}
        <div className="bg-leaf-50 border border-leaf-100 rounded-2xl p-6 mb-10">
          <div className="font-bold text-leaf-600 text-sm uppercase tracking-wider mb-3">
            ⚡ Quick Answer
          </div>

          <ul className="space-y-1 text-sm text-gray-600">
            <li>🥇 Best Overall option</li>
            <li>💰 Best Budget option</li>
            <li>🧠 Best Strategy option</li>
          </ul>
        </div>

        {/* FULL ARTICLE CONTENT (раньше не рендерился вообще) */}
        <div
          className="article-content mb-10"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* DISCLAIMER */}
        <div className="mt-12 bg-gray-50 border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-gray-500">Affiliate Disclosure:</strong>{" "}
            This article may contain affiliate links.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
