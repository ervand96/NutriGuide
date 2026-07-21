import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import RelatedArticles from "../../../../components/RelatedArticles";
import ArticleShopCta from "../../../../components/ArticleShopCta";
import ArticleMidCta from "../../../../components/ArticleMidCta";
import QuizPromptCTA from "../../../../components/QuizPromptCTA";
import ArticleBottomShop from "../../../../components/ArticleBottomShop";
import ProductComparisonTable from "../../../../components/ProductComparisonTable";
import HowWeTest from "../../../../components/HowWeTest";
import DosageCalculator from "../../../../components/DosageCalculator";
import { dosageKeyForSlug } from "@/lib/dosage.js";
import { quizPrefillForSlug } from "@/lib/quiz-recommendations.js";
import FaqAccordion from "../../../../components/FaqAccordion";
import NewsletterStrip from "../../../../components/NewsletterStrip";
import EmailCapturePopup from "../../../../components/EmailCapturePopup";
import MobileShopBar from "../../../../components/MobileShopBar";
import CategoryNavStrip from "../../../../components/CategoryNavStrip";
import OfferStrip from "../../../../components/OfferStrip";
import { notFound } from "next/navigation";
import { getPostBySlug } from "../../../../lib/posts";
import {
  splitHtmlAtMidpoint,
  splitHtmlAtChooseHeading,
  formatArticleDate,
  buildArticleFaqs,
} from "../../../../lib/article-content";
import { SITE_CONTAINER } from "@/lib/layout.js";
import {
  SITE_URL,
  articleJsonLd,
  breadcrumbJsonLd,
  productJsonLd,
} from "@/lib/seo.js";
import ProductCard from "../../../../components/ProductCard";
import ShareButtons from "../../../../components/ShareButtons";
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

  const articleUrl = `${SITE_URL}/category/${params.category}/${params.slug}`;
  const canonicalUrl = post.canonicalSlug
    ? `${SITE_URL}/category/${String(post.category).toLowerCase()}/${post.canonicalSlug}`
    : articleUrl;

  return {
    title: post.title,
    description: post.description,
    robots: post.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: `${SITE_URL}/og/${params.slug}`,
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
      images: [`${SITE_URL}/og/${params.slug}`],
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
  if (top) lines.push(`🥇 Best Overall: ${top.name}${top.badge ? ` (${top.badge})` : ""}${top.price ? ` — ${top.price}` : ""}`);
  const budget = sorted.find((p) =>
    String(p.badge || "").toLowerCase().includes("budget"),
  );
  if (budget) lines.push(`💰 Best Budget: ${budget.name}${budget.price ? ` — ${budget.price}` : ""}`);
  else if (sorted[1]) lines.push(`💰 Also consider: ${sorted[1].name}${sorted[1].price ? ` — ${sorted[1].price}` : ""}`);
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
  const dosageKey = dosageKeyForSlug(params.slug);
  const doseSplit = dosageKey
    ? splitHtmlAtChooseHeading(contentHtml)
    : { before: contentHtml, heading: "", after: "", found: false };
  // Mid-article CTA splits the body after the dose heading (or full HTML).
  const bodyForMid = doseSplit.found ? doseSplit.after : contentHtml;
  const { before: contentBefore, after: contentAfter } =
    splitHtmlAtMidpoint(bodyForMid);

  const articleUrl = `${SITE_URL}/category/${params.category}/${params.slug}`;
  const categoryUrl = `${SITE_URL}/category/${params.category}`;
  const products = post.products ?? [];
  const quickLines = quickAnswerLines(products);
  const updatedLabel = formatArticleDate(post.updated || post.date);
  const faqs = buildArticleFaqs(post);
  const midQuery =
    products[0]?.name?.split(",")[0]?.trim() ||
    post.title.split(":")[0].trim();

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: post.category, url: categoryUrl },
      { name: post.title, url: articleUrl },
    ]),
    articleJsonLd({
      title: post.title,
      description: post.description,
      date: post.date,
      updated: post.updated || post.date,
      url: articleUrl,
      image: `${SITE_URL}/og/${params.slug}`,
      category: post.category,
    }),
    ...products.map((product: any) =>
      productJsonLd(product, { siteUrl: SITE_URL }),
    ),
    ...(faqs.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f: { q: string; a: string }) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <Navbar />
      <CategoryNavStrip
        active={
          ["diets", "reviews", "supplements"].includes(
            params.category.toLowerCase(),
          )
            ? (params.category.toLowerCase() as
                | "diets"
                | "reviews"
                | "supplements")
            : undefined
        }
      />
      <OfferStrip source={`article-${params.slug}`} hideOnMobile />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="pb-24 md:pb-14">
        <div className={`${SITE_CONTAINER} py-10 sm:py-14`}>
          <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <a href="/" className="hover:text-leaf-500">
              Home
            </a>
            <span>/</span>
            <a
              href={`/category/${params.category}`}
              className="hover:text-leaf-500"
            >
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
              ⏱ {post.readTime} · Updated {updatedLabel}
            </div>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8 font-body">
            {post.description}
          </p>

          <div className="bg-leaf-50 border border-leaf-100 rounded-2xl p-5 sm:p-8 mb-8 sm:mb-10">
            <div className="font-bold text-leaf-600 text-sm uppercase tracking-wider mb-3">
              ⚡ Quick Answer
            </div>
            <ul className="space-y-2 text-sm sm:text-base text-gray-600">
              {quickLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          {products.length > 0 && (
            <section className="mb-10">
              <h2 className="font-display font-black text-2xl mb-2">
                Full Product Reviews
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Detailed pros, cons, and why we picked each product.
              </p>
              {products.map((product: any) => (
                <ProductCard
                  key={product.rank}
                  product={product}
                  slug={params.slug}
                />
              ))}
            </section>
          )}

          <HowWeTest category={post.category} />

          {products.length > 0 && (
            <ProductComparisonTable products={products} slug={params.slug} />
          )}

          {doseSplit.found ? (
            <>
              <div
                className="article-content mb-2"
                dangerouslySetInnerHTML={{
                  __html: doseSplit.before + doseSplit.heading,
                }}
              />
              {dosageKey ? (
                <DosageCalculator
                  supplement={dosageKey}
                  source={`article-dose-${params.slug}`}
                />
              ) : null}
              {contentAfter ? (
                <>
                  <div
                    className="article-content mb-2"
                    dangerouslySetInnerHTML={{ __html: contentBefore }}
                  />
                  <ArticleMidCta slug={params.slug} query={midQuery} />
                  <div
                    className="article-content mb-10"
                    dangerouslySetInnerHTML={{ __html: contentAfter }}
                  />
                </>
              ) : (
                <div
                  className="article-content mb-10"
                  dangerouslySetInnerHTML={{ __html: contentBefore }}
                />
              )}
            </>
          ) : (
            <>
              {dosageKey ? (
                <DosageCalculator
                  supplement={dosageKey}
                  source={`article-dose-${params.slug}`}
                />
              ) : null}
              {contentAfter ? (
                <>
                  <div
                    className="article-content mb-2"
                    dangerouslySetInnerHTML={{ __html: contentBefore }}
                  />
                  <ArticleMidCta slug={params.slug} query={midQuery} />
                  <div
                    className="article-content mb-10"
                    dangerouslySetInnerHTML={{ __html: contentAfter }}
                  />
                </>
              ) : (
                <div
                  className="article-content mb-10"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              )}
            </>
          )}

          <ShareButtons title={post.title} url={articleUrl} />

          <ArticleShopCta slug={params.slug} />

          <QuizPromptCTA topic={quizPrefillForSlug(params.slug)} />

          {faqs.length > 0 && (
            <section className="mb-10">
              <h2 className="font-display font-black text-2xl mb-2">
                Frequently asked questions
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Quick answers before you buy — based on this guide.
              </p>
              <FaqAccordion faqs={faqs} />
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
        </div>

        <NewsletterStrip />
      </main>

      <MobileShopBar slug={params.slug} category={post.category} />
      <EmailCapturePopup />
      <Footer />
    </>
  );
}
