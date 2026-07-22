import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_CONTAINER } from "@/lib/layout.js";
import { getAllPosts } from "@/lib/posts";
import { pageMetadata } from "@/lib/seo.js";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Sitemap — All NutriGuide Pages",
  description:
    "Complete list of NutriGuide diet guides, supplement reviews, and shopping pages for easy browsing and search discovery.",
  path: "/site-map",
});

export default function HtmlSitemapPage() {
  const posts = getAllPosts();
  const byCat: Record<string, typeof posts> = {
    Diets: [],
    Reviews: [],
    Supplements: [],
  };
  for (const p of posts) {
    const key = p.category in byCat ? p.category : "Reviews";
    byCat[key].push(p);
  }

  return (
    <>
      <Navbar />
      <main className={`${SITE_CONTAINER} py-12 sm:py-16`}>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-bark mb-3">
          All pages
        </h1>
        <p className="text-gray-500 mb-10 max-w-2xl">
          Browse every indexable NutriGuide guide. Prefer starting at{" "}
          <Link href="/best-picks" className="text-leaf-600 font-semibold">
            Best Picks
          </Link>{" "}
          or the{" "}
          <Link href="/quiz" className="text-leaf-600 font-semibold">
            diet quiz
          </Link>{" "}
          or{" "}
          <Link href="/promo-codes" className="text-leaf-600 font-semibold">
            promo codes
          </Link>
          .
        </p>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(byCat).map(([cat, list]) => (
            <section key={cat}>
              <h2 className="font-display font-bold text-xl text-bark mb-4">
                <Link
                  href={`/category/${cat.toLowerCase()}`}
                  className="no-underline text-bark hover:text-leaf-600"
                >
                  {cat}
                </Link>
              </h2>
              <ul className="space-y-2 text-sm">
                {list.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/category/${p.category.toLowerCase()}/${p.slug}`}
                      className="text-gray-600 hover:text-leaf-600 no-underline leading-snug"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4 text-sm font-bold">
          <Link href="/best-picks" className="text-leaf-600 no-underline hover:underline">
            Best Picks →
          </Link>
          <Link href="/quiz" className="text-leaf-600 no-underline hover:underline">
            Quiz →
          </Link>
          <Link href="/promo-codes" className="text-leaf-600 no-underline hover:underline">
            Promo Codes →
          </Link>
          <Link href="/about" className="text-leaf-600 no-underline hover:underline">
            About →
          </Link>
          <a
            href="/feed/sitemap.xml"
            className="text-leaf-600 no-underline hover:underline"
          >
            XML sitemap →
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
