import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import AffiliateButton from "@/components/AffiliateButton";
import ShopByGoal from "@/components/ShopByGoal";
import OfferStrip from "@/components/OfferStrip";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import StarterStacks from "@/components/StarterStacks";
import StorePicker from "@/components/StorePicker";
import DietComparisonCards from "@/components/DietComparisonCards";
import ProductShelf from "@/components/ProductShelf";
import HowItWorks from "@/components/HowItWorks";
import FaqAccordion from "@/components/FaqAccordion";
import NewsletterStrip from "@/components/NewsletterStrip";
import TrustBar from "@/components/TrustBar";
import QuickPaths from "@/components/QuickPaths";
import CategoryGuides from "@/components/CategoryGuides";
import CategoryNavStrip from "@/components/CategoryNavStrip";
import StartHereStrip from "@/components/StartHereStrip";
import HeroCarousel from "@/components/HeroCarousel";
import { getAllPosts } from "@/lib/posts";
import {
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo.js";
import {
  IHERB_DISCOUNT_TAG,
  MYPROTEIN_DISCOUNT_TAG,
} from "@/lib/affiliate.js";
import Link from "next/link";

const deals = [
  {
    partner: "iherb" as const,
    emoji: "🌿",
    title: "iHerb",
    desc: "Vitamins, supplements & natural products shipped worldwide. Use our link for the best available discount at checkout.",
    tag: IHERB_DISCOUNT_TAG,
  },
  {
    partner: "myprotein" as const,
    emoji: "🥤",
    title: "MyProtein",
    desc: "Protein powders, snacks & sports nutrition. Our code is pre-applied automatically when you click through.",
    tag: MYPROTEIN_DISCOUNT_TAG,
  },
];

const trustPoints = [
  {
    emoji: "🔬",
    title: "Evidence-based",
    desc: "Every claim we make is checked against peer-reviewed studies and official nutrition guidelines — not fitness-influencer trends.",
  },
  {
    emoji: "🧪",
    title: "We test before we recommend",
    desc: "We look at ingredient lists, third-party testing, and real user feedback before a product earns a spot on NutriGuide.",
  },
  {
    emoji: "🤝",
    title: "Transparent about affiliate links",
    desc: "Some links on this site are affiliate links, meaning we may earn a small commission at no extra cost to you. It never affects our rankings.",
  },
  {
    emoji: "🔄",
    title: "Updated regularly",
    desc: "Nutrition science and product formulas change. We revisit and update our top guides as new information comes in.",
  },
];

const dietComparison = [
  {
    name: "Mediterranean",
    difficulty: "Easy",
    bestFor: "Long-term heart health",
    avgCost: "$",
    href: "/category/diets/the-mediterranean-diet-your-path-to-a-healthier-happier-life-03601",
  },
  {
    name: "Keto",
    difficulty: "Hard",
    bestFor: "Fast initial weight loss",
    avgCost: "$$",
    shop: { partner: "iherb" as const, q: "keto supplements", source: "diet-table-keto" },
  },
  {
    name: "Intermittent Fasting",
    difficulty: "Medium",
    bestFor: "Simplicity, no food rules",
    avgCost: "$",
    shop: { partner: "iherb" as const, q: "intermittent fasting", source: "diet-table-if" },
  },
  {
    name: "High Protein",
    difficulty: "Medium",
    bestFor: "Muscle & satiety",
    avgCost: "$$",
    shop: { partner: "myprotein" as const, q: "whey protein", source: "diet-table-protein" },
  },
];

const faqs = [
  {
    q: "How does NutriGuide choose what to review?",
    a: "We prioritize products and diets that readers ask about most, then evaluate them against ingredient quality, third-party testing, price per serving, and independent user reviews.",
  },
  {
    q: "Do you get paid to write positive reviews?",
    a: "No. Brands cannot pay for placement or a better rating. We do earn a commission if you buy through some of our links, which helps keep the site free.",
  },
  {
    q: "Which diet is best for beginners?",
    a: "It depends on your goals, schedule, and food preferences. Take our 2-minute quiz below and we'll point you to the guide that fits you best.",
  },
  {
    q: "Why only iHerb and MyProtein?",
    a: "We focus on two stores so every link stays tracked and discount-ready: iHerb for vitamins & wellness, MyProtein for protein and sports nutrition. Fewer partners means clearer picks and fewer fake “deals.”",
  },
  {
    q: "Will I pay more if I click your link?",
    a: "No. You pay the same retail price — often less when a discount is applied. Our commission comes from the store, not from an extra fee on your order.",
  },
];

export default function Home() {
  const allPosts = getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const featuredPosts = allPosts.filter((p) => p.featured).slice(0, 3);
  const rest = allPosts.filter((p) => !featuredPosts.some((f) => f.slug === p.slug));
  const posts = [...featuredPosts, ...rest].slice(0, 6);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const siteSchema = [organizationJsonLd(), websiteJsonLd(), faqSchema];

  const dietPosts = allPosts
    .filter((p) => p.category === "Diets")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const reviewPosts = allPosts
    .filter((p) => p.category === "Reviews")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const supplementPosts = allPosts
    .filter((p) => p.category === "Supplements")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Names already featured in CategoryGuides shelves — keep Top Rated distinct
  const featuredGuideNames = new Set(
    [...dietPosts.slice(0, 3), ...reviewPosts.slice(0, 3), ...supplementPosts.slice(0, 3)]
      .map((p) => String(p.products?.[0]?.name || "").toLowerCase().trim())
      .filter(Boolean),
  );

  const seenTopNames = new Set<string>();
  const topProducts = allPosts
    .flatMap((post) =>
      (post.products || []).map((p) => ({
        ...p,
        postSlug: post.slug,
        postCategory: post.category,
      })),
    )
    .filter((p) => p.rating)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .filter((p) => {
      const key = String(p.name || "")
        .toLowerCase()
        .trim();
      if (!key || featuredGuideNames.has(key) || seenTopNames.has(key)) {
        return false;
      }
      seenTopNames.add(key);
      return true;
    })
    .slice(0, 6);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
      />
      <Navbar />
      <main>
        <HeroCarousel />

        <TrustBar reviewsCount={allPosts.length} />

        <CategoryNavStrip />

        <OfferStrip source="home-top" />

        <StartHereStrip />

        <CategoryGuides category="diets" posts={dietPosts} limit={3} />

        <CategoryGuides category="reviews" posts={reviewPosts} limit={3} />

        <CategoryGuides category="supplements" posts={supplementPosts} limit={3} />

        <HowItWorks />

        <QuickPaths />

        <ShopByGoal />

        <StorePicker />

        <StarterStacks />

        {/* TOP RATED PRODUCTS */}
        {topProducts.length > 0 && (
          <section className="relative overflow-hidden border-y border-leaf-100 py-14 sm:py-20">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf-50 via-cream to-leaf-100/40"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-leaf-500/10 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-28 -left-10 h-80 w-80 rounded-full bg-leaf-600/10 blur-3xl"
              aria-hidden
            />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
              <ProductShelf
                title="Top Rated Products"
                subtitle="Six editor picks — tap a card to check live prices on iHerb or MyProtein."
                products={topProducts.map((p, i) => ({
                  rank: i + 1,
                  name: p.name || "",
                  badge: p.badge || "",
                  rating: p.rating || 4.5,
                  price: p.price || "",
                  description: p.description || "",
                  pros: p.pros || [],
                  cons: p.cons || [],
                  affiliateUrl: p.affiliateUrl || "",
                  buttonText: p.buttonText || "",
                  imageUrl: p.imageUrl,
                  highlight: i === 0,
                }))}
                slugPrefix="home"
                compact
              />
            </div>
          </section>
        )}

        {/* FEATURED DEALS */}
        <section className="bg-leaf-50/60 py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <AnimateOnScroll animation="fade-up">
              <h2 className="font-display font-black text-2xl sm:text-3xl mb-2">
                Featured Deals
              </h2>
              <p className="text-gray-500 mb-6 sm:mb-8 max-w-2xl text-sm sm:text-base">
                Our current top picks for where to actually buy your
                supplements and nutrition products, with the best discount we
                could find.
              </p>
            </AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {deals.map((d) => (
                <div
                  key={d.partner}
                  className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{d.emoji}</span>
                    <div>
                      <div className="font-display font-bold text-xl text-bark">
                        {d.title}
                      </div>
                      <span className="inline-block bg-leaf-100 text-leaf-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        {d.tag}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                    {d.desc}
                  </p>
                  <AffiliateButton
                    partner={d.partner}
                    source={`deals-card-${d.partner}`}
                    className="w-full"
                  >
                    Get the Deal →
                  </AffiliateButton>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LATEST ARTICLES */}
        <section className="relative overflow-hidden border-y border-leaf-100 py-14 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf-50 via-cream to-leaf-100/30"
            aria-hidden
          />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8">
              <div>
                <p className="text-leaf-600 text-xs font-bold uppercase tracking-[0.16em] mb-2">
                  Editor shelf
                </p>
                <h2 className="font-display font-black text-2xl sm:text-4xl text-bark tracking-tight mb-1">
                  Latest Articles
                </h2>
                <p className="text-gray-500 text-sm sm:text-base">
                  Honest guides to help you eat better — with shop links on every card.
                </p>
              </div>
              <Link
                href="/category/reviews"
                className="text-leaf-500 font-bold text-sm hover:underline no-underline shrink-0"
              >
                View all →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0 md:items-stretch">
              {posts.map((post, i) => (
                <ArticleCard key={post.slug} article={post} rank={i + 1} />
              ))}
            </div>
          </div>
        </section>

        {/* WHY TRUST US */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <h2 className="font-display font-black text-2xl sm:text-3xl mb-2">
            Why Trust NutriGuide
          </h2>
          <p className="text-gray-400 mb-6 sm:mb-8 max-w-2xl text-sm sm:text-base">
            We built NutriGuide because most nutrition advice online is
            either paid promotion or unverified opinion. Here&apos;s how we&apos;re
            different.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {trustPoints.map((t) => (
              <div
                key={t.title}
                className="flex gap-3 sm:gap-4 bg-white border border-gray-100 rounded-2xl p-5 sm:p-6"
              >
                <span className="text-3xl">{t.emoji}</span>
                <div>
                  <div className="font-display font-bold text-lg text-bark mb-1">
                    {t.title}
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DIET COMPARISON */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <AnimateOnScroll animation="fade-up">
            <h2 className="font-display font-black text-2xl sm:text-3xl mb-2">
              Compare Popular Diets at a Glance
            </h2>
            <p className="text-gray-400 mb-6 sm:mb-8 max-w-2xl text-sm sm:text-base">
              A quick-reference overview. Read the full guide for each before
              starting — individual results vary.
            </p>
          </AnimateOnScroll>

          <DietComparisonCards diets={dietComparison} />

          <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 mt-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-leaf-50">
                  <th className="px-6 py-4 font-display font-bold text-bark text-sm">
                    Diet
                  </th>
                  <th className="px-6 py-4 font-display font-bold text-bark text-sm">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 font-display font-bold text-bark text-sm">
                    Best For
                  </th>
                  <th className="px-6 py-4 font-display font-bold text-bark text-sm">
                    Typical Cost
                  </th>
                  <th className="px-6 py-4 font-display font-bold text-bark text-sm">
                    Shop
                  </th>
                </tr>
              </thead>
              <tbody>
                {dietComparison.map((d, i) => (
                  <tr
                    key={d.name}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    <td className="px-6 py-4 font-bold text-bark text-sm">
                      {"href" in d && d.href ? (
                        <Link href={d.href} className="text-leaf-600 hover:underline no-underline">
                          {d.name}
                        </Link>
                      ) : (
                        d.name
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {d.difficulty}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {d.bestFor}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {d.avgCost}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {"shop" in d && d.shop ? (
                        <Link
                          href={`/go/${d.shop.partner}?source=${d.shop.source}&q=${encodeURIComponent(d.shop.q)}`}
                          target="_blank"
                          rel="nofollow sponsored noopener"
                          className="text-leaf-600 font-semibold hover:underline no-underline whitespace-nowrap"
                        >
                          Shop →
                        </Link>
                      ) : (
                        <Link href="/quiz" className="text-leaf-600 font-semibold no-underline">
                          Quiz →
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <h2 className="font-display font-black text-2xl sm:text-3xl mb-6 sm:mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <FaqAccordion faqs={faqs} />
        </section>

        <NewsletterStrip />

        {/* CTA BANNER */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <AnimateOnScroll animation="scale-in">
            <div className="bg-bark rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center">
              <h2 className="font-display font-black text-2xl sm:text-3xl mb-3">
                Not sure where to start?
              </h2>
              <p className="text-white/70 mb-6 max-w-md mx-auto text-sm sm:text-base">
                Take our 2-minute quiz and we&apos;ll match you with the best diet
                for your goals and lifestyle — or jump straight to our top
                supplement picks.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
              <Link
                href="/quiz"
                className="inline-block bg-leaf-500 hover:bg-leaf-600 text-white font-bold px-8 py-4 rounded-xl transition-colors no-underline"
              >
                Find My Diet →
              </Link>
              <AffiliateButton
                partner="iherb"
                source="cta-banner"
                variant="outline"
                className="!bg-transparent !border-white/40 !text-white hover:!bg-white/10"
              >
                🌿 Shop iHerb →
              </AffiliateButton>
              <AffiliateButton
                partner="myprotein"
                source="cta-banner"
                variant="outline"
                className="!bg-transparent !border-white/40 !text-white hover:!bg-white/10"
              >
                🥤 Shop MyProtein →
              </AffiliateButton>
              </div>
            </div>
          </AnimateOnScroll>
        </section>
      </main>
      <Footer />
    </>
  );
}
