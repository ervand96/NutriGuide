export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <div className="font-display font-black text-xl text-leaf-500 mb-2">🍎 NutriGuide</div>
            <p className="text-gray-400 text-sm max-w-xs">
              Honest, science-backed nutrition reviews to help you make better choices.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <div className="font-bold text-sm mb-3 text-bark">Content</div>
              <div className="flex flex-col gap-2">
                {['Diets', 'Supplements', 'Reviews'].map(item => (
                  <a key={item} href={`/${item.toLowerCase()}`} className="text-gray-400 hover:text-leaf-500 text-sm transition-colors no-underline">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="font-bold text-sm mb-3 text-bark">Legal</div>
              <div className="flex flex-col gap-2">
                {['Privacy Policy', 'Disclaimer', 'Affiliate Disclosure'].map(item => (
                  <a key={item} href="#" className="text-gray-400 hover:text-leaf-500 text-sm transition-colors no-underline">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6">
          <p className="text-gray-300 text-xs leading-relaxed">
            <strong className="text-gray-400">Affiliate Disclosure:</strong> NutriGuide earns commissions from affiliate links. This does not influence our editorial content. We only recommend products we believe in. Always consult a healthcare professional before starting any diet or supplement program.
          </p>
        </div>
      </div>
    </footer>
  )
}
