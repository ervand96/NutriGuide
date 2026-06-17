import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Product } from '@/types'

// ────────────────────────────────────────────
// Sample article — replace with your CMS / MDX
// ────────────────────────────────────────────
const sampleProducts: Product[] = [
  {
    rank: 1,
    name: 'MyProtein Impact Whey Protein',
    badge: '🏆 Best Overall',
    rating: 4.8,
    price: '$32',
    description: 'High-quality whey protein that keeps you full and helps preserve muscle while losing fat. 21g protein per serving with minimal calories.',
    pros: ['Excellent protein quality', 'Great value for money', '50+ flavors available'],
    cons: ['Contains dairy — not suitable for vegans'],
    affiliateUrl: 'https://www.myprotein.com/?ref=YOUR_ID',
    buttonText: 'Check Price on MyProtein',
  },
  {
    rank: 2,
    name: 'iHerb Garcinia Cambogia Extract',
    badge: '💰 Best Budget',
    rating: 4.5,
    price: '$18',
    description: 'Natural appetite suppressant studied to reduce cravings. Best used alongside a balanced diet and exercise routine.',
    pros: ['Natural ingredients', 'Very affordable', 'Easy to take daily'],
    cons: ['Results vary by person', 'Slower than stimulant-based options'],
    affiliateUrl: 'https://www.iherb.com/?rcode=YOUR_CODE',
    buttonText: 'Check Price on iHerb',
  },
  {
    rank: 3,
    name: 'Noom Weight Loss Program',
    badge: '🧠 Best App',
    rating: 4.6,
    price: '$70/mo',
    description: 'Psychology-based weight loss with real human coaches. Targets the habits and mindset behind overeating — not just calories.',
    pros: ['Real coaches', 'Proven methodology', 'Tracks food & habits'],
    cons: ['Monthly subscription required'],
    affiliateUrl: 'https://www.noom.com/?ref=YOUR_ID',
    buttonText: 'Try Noom Free for 14 Days',
  },
]

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400 text-lg">
      {'★'.repeat(Math.floor(rating))}
      {'☆'.repeat(5 - Math.floor(rating))}
      <span className="text-gray-400 text-sm ml-2">{rating}/5</span>
    </span>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-7 relative mt-6">
      {/* Rank badge */}
      <div className="absolute -top-4 left-6 bg-leaf-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">
        #{product.rank} {product.badge}
      </div>

      <div className="mt-2">
        <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
          <h2 className="font-display font-bold text-xl text-bark">{product.name}</h2>
          <span className="font-bold text-xl text-leaf-500">{product.price}</span>
        </div>

        <Stars rating={product.rating} />

        <p className="text-gray-500 text-sm leading-relaxed my-4">{product.description}</p>

        <div className="flex gap-8 mb-6 flex-wrap">
          <div>
            <div className="text-xs font-bold text-leaf-500 uppercase tracking-widest mb-2">✅ Pros</div>
            {product.pros.map(p => (
              <div key={p} className="text-sm text-gray-600 mb-1">• {p}</div>
            ))}
          </div>
          <div>
            <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">❌ Cons</div>
            {product.cons.map(c => (
              <div key={c} className="text-sm text-gray-600 mb-1">• {c}</div>
            ))}
          </div>
        </div>

        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="affiliate-btn"
        >
          {product.buttonText} →
        </a>
      </div>
    </div>
  )
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <span className="category-badge mb-4 inline-block">Supplements</span>
          <h1 className="font-display font-black text-4xl md:text-5xl leading-none tracking-tight text-bark mb-4">
            Top 5 Weight Loss Supplements That Actually Work (2026)
          </h1>
          <div className="text-gray-400 text-sm font-body">
            ⏱ 8 min read &nbsp;·&nbsp; Updated June 2026
          </div>
        </div>

        {/* Intro */}
        <p className="text-lg text-gray-600 leading-relaxed mb-8 font-body">
          With thousands of weight loss supplements on the market, it's almost impossible to know which ones are worth your money. We spent 3 months testing and researching the most popular options. Here are the ones backed by real science.
        </p>

        {/* Quick answer box */}
        <div className="bg-leaf-50 border border-leaf-100 rounded-2xl p-6 mb-10">
          <div className="font-bold text-leaf-600 text-sm uppercase tracking-wider mb-3">⚡ Quick Answer</div>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>🥇 <strong>Best Overall:</strong> MyProtein Impact Whey — high protein, low cost</li>
            <li>💰 <strong>Best Budget:</strong> iHerb Garcinia Cambogia — natural & affordable</li>
            <li>🧠 <strong>Best Program:</strong> Noom — targets the psychology of eating</li>
          </ul>
        </div>

        {/* Products */}
        {sampleProducts.map(product => (
          <ProductCard key={product.rank} product={product} />
        ))}

        {/* Affiliate disclaimer */}
        <div className="mt-12 bg-gray-50 border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-gray-500">Affiliate Disclosure:</strong> This article contains affiliate links. We may earn a small commission if you purchase through our links at no extra cost to you. All reviews and opinions are our own and are not influenced by affiliate relationships.
          </p>
        </div>

      </main>
      <Footer />
    </>
  )
}
