import AffiliateButton from "./AffiliateButton";

export default function ArticleMidCta({
  slug,
  query,
}: {
  slug: string;
  query?: string;
}) {
  return (
    <aside className="my-8 sm:my-10 rounded-2xl border-2 border-leaf-200 bg-leaf-50/80 p-5 sm:p-6">
      <p className="text-leaf-600 text-xs font-bold uppercase tracking-widest mb-1">
        Shop our picks
      </p>
      <h3 className="font-display font-black text-lg sm:text-xl text-bark mb-2">
        Prefer to compare prices now?
      </h3>
      <p className="text-gray-500 text-sm mb-4 leading-relaxed">
        Jump to live prices on iHerb or MyProtein — codes apply automatically.
        Then keep reading for the full breakdown.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <AffiliateButton
          partner="iherb"
          source={`article-mid-${slug}`}
          query={query}
          className="w-full sm:w-auto min-h-[48px]"
        >
          Check iHerb price
        </AffiliateButton>
        <AffiliateButton
          partner="myprotein"
          source={`article-mid-${slug}`}
          query={query}
          variant="outline"
          className="w-full sm:w-auto min-h-[48px]"
        >
          Check MyProtein
        </AffiliateButton>
      </div>
    </aside>
  );
}
