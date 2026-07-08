import AffiliateButton from "./AffiliateButton";

export default function OfferStrip({
  source = "offer-strip",
}: {
  source?: string;
}) {
  return (
    <section className="bg-bark text-white py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-leaf-300 text-xs font-bold uppercase tracking-widest mb-1">
            Exclusive offers
          </div>
          <div className="font-display font-bold text-xl">
            Shop supplements with our tracked discount links
          </div>
          <p className="text-white/60 text-sm mt-1">
            iHerb vitamins & wellness · MyProtein protein & sports nutrition
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <AffiliateButton
            partner="iherb"
            source={`${source}-iherb`}
            variant="solid"
            className="!bg-leaf-500 hover:!bg-leaf-600"
          >
            🌿 iHerb Deals
          </AffiliateButton>
          <AffiliateButton
            partner="myprotein"
            source={`${source}-myprotein`}
            variant="outline"
            className="!border-white/40 !text-white hover:!bg-white/10 !bg-transparent"
          >
            🥤 MyProtein Code
          </AffiliateButton>
        </div>
      </div>
    </section>
  );
}
