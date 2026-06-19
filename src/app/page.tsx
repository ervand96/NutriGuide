import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

const stats = [
  { value: "100+", label: "Reviews published" },
  { value: "50k", label: "Readers per month" },
  { value: "100%", label: "Independent opinions" },
  { value: "0", label: "Paid placements" },
];

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

export default function Home() {
  const posts = getAllPosts()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    .slice(0, 6);
  return (
    <>
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

        {/* LATEST ARTICLES */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
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
              href="/category/diets"
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

        {/* CTA BANNER */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-bark rounded-3xl p-10 text-white text-center">
            <h2 className="font-display font-black text-3xl mb-3">
              Not sure where to start?
            </h2>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              Take our 2-minute quiz and we'll match you with the best diet for
              your goals and lifestyle.
            </p>
            <Link
              href="/quiz"
              className="inline-block bg-leaf-500 hover:bg-leaf-600 text-white font-bold px-8 py-4 rounded-xl transition-colors no-underline"
            >
              Find My Diet →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
