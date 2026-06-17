import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import { articles } from '@/lib/articles'

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-display font-black text-4xl mb-2">All Articles</h1>
        <p className="text-gray-400 mb-12">Science-backed guides to help you eat better and feel great.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
