import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import AffiliateButton from "@/components/AffiliateButton";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

const categories = [
  {
    href: "/category/diets",
    emoji: "🥗",
    title: "Diets",
    desc: "Keto, IF, Mediterranean and more",
  },
  {
    href: "/category/reviews",
    emoji: "⭐",
    title: "Reviews",
    desc: "Honest product & program reviews",
  },
  {
    href: "/category/supplements",
    emoji: "💊",
    title: "Supplements",
    desc: "What actually works, what doesn't",
  },
];

const deals = [
  {
    partner: "iherb" as const,
    emoji: "🌿",
    title: "iHerb",
    desc: "Vitamins, supplements & natural products shipped worldwide. Use our link for the best available discount at checkout.",
    tag: "Up to 22% off",
  },
  {
    partner: "myprotein" as const,
    emoji: "🥤",
    title: "MyProtein",
    desc: "Protein powders, snacks & sports nutrition. Our code is pre-applied automatically when you click through.",
    tag: "Exclusive code applied",
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
  },
  {
    name: "Keto",
    difficulty: "Hard",
    bestFor: "Fast initial weight loss",
    avgCost: "$$",
  },
  {
    name: "Intermittent Fasting",
    difficulty: "Medium",
    bestFor: "Simplicity, no food rules",
    avgCost: "$",
  },
  {
    name: "Paleo",
    difficulty: "Medium",
    bestFor: "Cutting processed food",
    avgCost: "$$",
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
];

export default function Home() {
  const allPosts = getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const featuredPosts = allPosts.filter((p) => p.featured).slice(0, 3);
  const rest = allPosts.filter((p) => !featuredPosts.some((f) => f.slug === p.slug));
  const posts = [...featuredPosts, ...rest].slice(0, 6);

  const stats = [
    { value: String(allPosts.length), label: "Reviews published" },
    { value: "2", label: "Partner stores" },
    { value: "100%", label: "Independent opinions" },
    { value: "0", label: "Paid placements" },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const topProducts = allPosts
    .flatMap((post) =>
      (post.products || []).map((p) => ({ ...p, postSlug: post.slug, postCategory: post.category })),
    )
    .filter((p) => p.rating)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main>
        {/* HERO */}
        <section className="bg-gradient-to-br from-leaf-500 to-leaf-700 text-white py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-leaf-100 text-xs font-bold tracking-[4px] uppercase mb-6">
              Trusted Nutrition Reviews
            </p>
            <h1 className="font-display font-black text-5xl md:text-6xl leading-none tracking-tight mb-6">
              Find the Diet That
              <br />
              <span className="text-green-200">Actually Works</span>
            </h1>
            <p className="text-white/80 text-xl leading-relaxed max-w-xl mx-auto mb-10">
              Science-backed reviews of diets, supplements, and programs — so
              you stop guessing and start seeing results.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/category/reviews"
                className="bg-white text-leaf-600 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors no-underline"
              >
                Browse Reviews →
              </Link>
              <Link
                href="/quiz"
                className="border border-white/40 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors no-underline"
              >
                Take 2-Minute Quiz
              </Link>
              <AffiliateButton partner="iherb" source="hero" variant="ghost">
                🌿 Shop iHerb Deals →
              </AffiliateButton>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="bg-white border-b border-gray-100 py-6 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display font-black text-3xl text-leaf-500">
                  {s.value}
                </div>
                <div className="text-gray-400 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display font-black text-3xl mb-2">
            Browse by Topic
          </h2>
          <p className="text-gray-400 mb-8">Pick what you're looking for</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.href} href={cat.href} className="no-underline">
                <div className="bg-leaf-50 border border-leaf-100 rounded-2xl p-6 hover:bg-leaf-100 transition-colors cursor-pointer">
                  <div className="text-4xl mb-3">{cat.emoji}</div>
                  <div className="font-display font-bold text-xl text-bark mb-1">
                    {cat.title}
                  </div>
                  <div className="text-gray-500 text-sm">{cat.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* TOP RATED PRODUCTS */}
        {topProducts.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 pb-16">
            <h2 className="font-display font-black text-3xl mb-2">
              Top Rated Products
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl">
              Pulled from our latest reviews, ranked by rating — the
              individual picks our writers currently recommend first.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topProducts.map((p, i) => (
                <div
                  key={`${p.postSlug}-${i}`}
                  className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    {p.badge && (
                      <span className="inline-block bg-leaf-100 text-leaf-700 text-xs font-bold px-2 py-1 rounded-full">
                        {p.badge}
                      </span>
                    )}
                    {p.rating && (
                      <span className="text-amber-500 text-sm font-bold">
                        ★ {p.rating}
                      </span>
                    )}
                  </div>
                  <div className="font-display font-bold text-lg text-bark mb-1">
                    {p.name}
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3 flex-1">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display font-black text-leaf-600">
                      {p.price}
                    </span>
                    <Link
                      href={`/category/${p.postCategory.toLowerCase()}/${p.postSlug}`}
                      className="text-gray-400 hover:text-leaf-500 text-xs no-underline"
                    >
                      Read full review →
                    </Link>
                  </div>
                  <Link
                    href={p.affiliateUrl || "/go/iherb?source=top-products"}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="no-underline text-center bg-leaf-500 hover:bg-leaf-600 text-white font-bold px-4 py-3 rounded-xl transition-colors"
                  >
                    {p.buttonText || "Check Price →"}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FEATURED DEALS */}
        <section className="bg-leaf-50/60 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-black text-3xl mb-2">
              Featured Deals
            </h2>
            <p className="text-gray-500 mb-8 max-w-2xl">
              Our current top picks for where to actually buy your
              supplements and nutrition products, with the best discount we
              could find.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((d) => (
                <div
                  key={d.partner}
                  className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col"
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
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display font-black text-3xl mb-1">
                Latest Articles
              </h2>
              <p className="text-gray-400">
                Honest guides to help you eat better
              </p>
            </div>
            <Link
              href="/category/reviews"
              className="text-leaf-500 font-bold text-sm hover:underline no-underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post.slug} article={post} />
            ))}
          </div>
        </section>

        {/* WHY TRUST US */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="font-display font-black text-3xl mb-2">
            Why Trust NutriGuide
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl">
            We built NutriGuide because most nutrition advice online is
            either paid promotion or unverified opinion. Here's how we're
            different.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trustPoints.map((t) => (
              <div
                key={t.title}
                className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-6"
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
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="font-display font-black text-3xl mb-2">
            Compare Popular Diets at a Glance
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl">
            A quick-reference overview. Read the full guide for each before
            starting — individual results vary.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
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
                </tr>
              </thead>
              <tbody>
                {dietComparison.map((d, i) => (
                  <tr
                    key={d.name}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    <td className="px-6 py-4 font-bold text-bark text-sm">
                      {d.name}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <h2 className="font-display font-black text-3xl mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="bg-leaf-50 border border-leaf-100 rounded-2xl p-6"
              >
                <div className="font-display font-bold text-bark mb-2">
                  {f.q}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-bark rounded-3xl p-10 text-white text-center">
            <h2 className="font-display font-black text-3xl mb-3">
              Not sure where to start?
            </h2>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              Take our 2-minute quiz and we'll match you with the best diet
              for your goals and lifestyle — or jump straight to our top
              supplement picks.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
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
        </section>
      </main>
      <Footer />
    </>
  );
}
