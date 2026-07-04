import AffiliateButton from "./AffiliateButton";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/logo.svg" alt="NutriGuide logo" className="h-7 w-7" />
              <span className="font-display font-black text-xl text-leaf-500">
                NutriGuide
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs mb-4">
              Honest, science-backed nutrition reviews to help you make better
              choices.
            </p>
            <div className="flex flex-wrap gap-3">
              <AffiliateButton
                partner="iherb"
                source="footer"
                variant="outline"
                className="!px-4 !py-2 text-sm"
              >
                🌿 iHerb Deals
              </AffiliateButton>
              <AffiliateButton
                partner="myprotein"
                source="footer"
                variant="outline"
                className="!px-4 !py-2 text-sm"
              >
                🥤 MyProtein Deals
              </AffiliateButton>
            </div>
          </div>
          <div className="flex gap-16">
            <div>
              <div className="font-bold text-sm mb-3 text-bark">Content</div>
              <div className="flex flex-col gap-2">
                {["Diets", "Supplements", "Reviews"].map((item) => (
                  <a
                    key={item}
                    href={`/category/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-leaf-500 text-sm transition-colors no-underline"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="font-bold text-sm mb-3 text-bark">Legal</div>
              <div className="flex flex-col gap-2">
                <a
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-leaf-500 text-sm transition-colors no-underline"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-leaf-500 text-sm transition-colors no-underline"
                >
                  Disclaimer
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-leaf-500 text-sm transition-colors no-underline"
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
