import AffiliateButton from "./AffiliateButton";
import { SITE_CONTAINER } from "@/lib/layout.js";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16 sm:mt-24 pb-[env(safe-area-inset-bottom)]">
      <div className={`${SITE_CONTAINER} py-10 sm:py-12`}>
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-8">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <img src="/logo.svg" alt="NutriGuide logo" className="h-7 w-7" />
              <span className="font-display font-black text-xl text-leaf-500">
                NutriGuide
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Honest, science-backed nutrition reviews to help you make better
              choices.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <AffiliateButton
                partner="iherb"
                source="footer"
                variant="outline"
                className="!px-4 !py-2.5 text-sm flex-1 sm:flex-none min-w-[140px]"
              >
                🌿 iHerb Deals
              </AffiliateButton>
              <AffiliateButton
                partner="myprotein"
                source="footer"
                variant="outline"
                className="!px-4 !py-2.5 text-sm flex-1 sm:flex-none min-w-[140px]"
              >
                🥤 MyProtein Deals
              </AffiliateButton>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
            <div>
              <div className="font-bold text-sm mb-3 text-bark">Content</div>
              <div className="flex flex-col gap-2.5">
                {["Diets", "Supplements", "Reviews"].map((item) => (
                  <a
                    key={item}
                    href={`/category/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-leaf-500 text-sm transition-colors no-underline py-0.5"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="font-bold text-sm mb-3 text-bark">Company</div>
              <div className="flex flex-col gap-2.5">
                <a
                  href="/about"
                  className="text-gray-400 hover:text-leaf-500 text-sm transition-colors no-underline py-0.5"
                >
                  About Us
                </a>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-leaf-500 text-sm transition-colors no-underline py-0.5"
                >
                  Contact
                </a>
                <a
                  href="/quiz"
                  className="text-gray-400 hover:text-leaf-500 text-sm transition-colors no-underline py-0.5"
                >
                  Diet Quiz
                </a>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="font-bold text-sm mb-3 text-bark">Legal</div>
              <div className="flex flex-col gap-2.5">
                <a
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-leaf-500 text-sm transition-colors no-underline py-0.5"
                >
                  Privacy Policy
                </a>
                <a
                  href="/affiliate-disclosure"
                  className="text-gray-400 hover:text-leaf-500 text-sm transition-colors no-underline py-0.5"
                >
                  Affiliate Disclosure
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-gray-300 text-xs leading-relaxed">
            <strong className="text-gray-400">Affiliate Disclosure:</strong>{" "}
            NutriGuide earns commissions from affiliate links. This does not
            influence our editorial content. We only recommend products we
            believe in. Always consult a healthcare professional before starting
            any diet or supplement program.
          </p>
        </div>
      </div>
    </footer>
  );
}
