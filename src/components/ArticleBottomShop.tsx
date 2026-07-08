import Link from "next/link";
import AffiliateButton from "./AffiliateButton";

const categoryQueries: Record<string, { iherb: string; myprotein: string }> = {
  diets: {
    iherb: "diet supplements vitamins omega",
    myprotein: "protein snacks nutrition",
  },
  supplements: {
    iherb: "vitamins minerals supplements",
    myprotein: "protein creatine sports",
  },
  reviews: {
    iherb: "supplements vitamins",
    myprotein: "protein creatine best sellers",
  },
};

export default function ArticleBottomShop({
  slug,
  category,
}: {
  slug: string;
  category: string;
}) {
  const cat = category.toLowerCase();
  const queries = categoryQueries[cat] || categoryQueries.supplements;

  return (
    <section className="my-10 sm:my-12 bg-white border-2 border-leaf-100 rounded-2xl p-5 sm:p-8">
      <div className="text-center mb-6">
        <div className="text-leaf-500 text-xs font-bold uppercase tracking-widest mb-2">
          Where to buy
        </div>
        <h2 className="font-display font-black text-xl sm:text-2xl text-bark mb-2">
          Shop both of our trusted stores
        </h2>
        <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
          Vitamins, herbs, and wellness on{" "}
          <strong className="text-bark">iHerb</strong> — protein, creatine, and
          sports nutrition on{" "}
          <strong className="text-bark">MyProtein</strong>. Your discount code
          applies on both.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div className="bg-leaf-50 border border-leaf-100 rounded-xl p-5 flex flex-col">
          <div className="text-2xl mb-2">🌿</div>
          <div className="font-display font-bold text-bark mb-1">iHerb</div>
          <p className="text-gray-500 text-xs sm:text-sm mb-4 flex-1">
            Multivitamins, omega-3, magnesium, herbs — ships worldwide.
          </p>
          <AffiliateButton
            partner="iherb"
            source={`article-bottom-${slug}`}
            query={queries.iherb}
            className="w-full !py-3 !text-sm"
          >
            Shop iHerb →
          </AffiliateButton>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex flex-col">
          <div className="text-2xl mb-2">🥤</div>
          <div className="font-display font-bold text-bark mb-1">MyProtein</div>
          <p className="text-gray-500 text-xs sm:text-sm mb-4 flex-1">
            Whey protein, creatine, pre-workout, snacks — code pre-applied.
          </p>
          <AffiliateButton
            partner="myprotein"
            source={`article-bottom-${slug}`}
            query={queries.myprotein}
            variant="outline"
            className="w-full !py-3 !text-sm"
          >
            Shop MyProtein →
          </AffiliateButton>
        </div>
      </div>

      <p className="text-center text-gray-400 text-xs mt-5">
        Not sure which store?{" "}
        <Link href="/" className="text-leaf-600 font-semibold no-underline hover:underline">
          Use our store picker on the homepage
        </Link>
      </p>
    </section>
  );
}
