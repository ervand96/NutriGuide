import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import { articles } from '@/lib/articles'

export default function ReviewsPage() {
  const reviews = articles.filter(a => a.category === 'Reviews' || a.category === 'Supplements')
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-display font-black text-4xl mb-2">Product Reviews</h1>
        <p className="text-gray-400 mb-12">Honest reviews of supplements, programs, and apps — tested by our team.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
