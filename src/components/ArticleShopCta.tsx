import AffiliateButton from "./AffiliateButton";

export default function ArticleShopCta({ slug }: { slug: string }) {
  return (
    <div className="my-8 sm:my-10 bg-gradient-to-r from-leaf-500 to-leaf-600 rounded-2xl p-5 sm:p-8 text-white text-center">
      <div className="text-leaf-100 text-xs font-bold uppercase tracking-widest mb-2">
        Ready to buy?
      </div>
      <h3 className="font-display font-black text-xl sm:text-2xl mb-2">
        Get the best price on our picks
      </h3>
      <p className="text-white/80 text-sm mb-5 sm:mb-6 max-w-md mx-auto">
        Our discount codes are applied automatically — shop vitamins on iHerb
        or protein on MyProtein.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <AffiliateButton
          partner="iherb"
          source={`article-${slug}`}
          variant="solid"
          className="!bg-white !text-leaf-600 hover:!bg-green-50 w-full sm:w-auto min-h-[48px]"
        >
          Shop iHerb
        </AffiliateButton>
        <AffiliateButton
          partner="myprotein"
          source={`article-${slug}`}
          variant="outline"
          className="!border-white/50 !text-white hover:!bg-white/10 !bg-transparent w-full sm:w-auto min-h-[48px]"
        >
          Shop MyProtein
        </AffiliateButton>
      </div>
    </div>
  );
}
