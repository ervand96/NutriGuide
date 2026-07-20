import AffiliateButton from "./AffiliateButton";
import { SITE_CONTAINER } from "@/lib/layout.js";

export default function OfferStrip({
  source = "offer-strip",
  hideOnMobile = false,
}: {
  source?: string;
  hideOnMobile?: boolean;
}) {
  return (
    <section
      className={`bg-bark text-white py-5 sm:py-8 ${hideOnMobile ? "hidden md:block" : ""}`}
    >
      <div className={`${SITE_CONTAINER} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6`}>
        <div>
          <div className="text-leaf-300 text-xs font-bold uppercase tracking-widest mb-1">
            Exclusive offers
          </div>
          <div className="font-display font-bold text-base sm:text-xl leading-snug">
            Shop supplements with our tracked discount links
          </div>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            iHerb vitamins & wellness · MyProtein protein & sports nutrition
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto shrink-0">
          <AffiliateButton
            partner="iherb"
            source={`${source}-iherb`}
            variant="solid"
            className="!bg-leaf-500 hover:!bg-leaf-600 w-full sm:w-auto min-h-[48px]"
          >
            iHerb Deals
          </AffiliateButton>
          <AffiliateButton
            partner="myprotein"
            source={`${source}-myprotein`}
            variant="outline"
            className="!border-white/40 !text-white hover:!bg-white/10 !bg-transparent w-full sm:w-auto min-h-[48px]"
          >
            MyProtein Code
          </AffiliateButton>
        </div>
      </div>
    </section>
  );
}
