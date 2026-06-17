export interface Article {
  slug: string
  title: string
  category: 'Diets' | 'Supplements' | 'Reviews' | 'Tips'
  description: string
  readTime: string
  date: string
}

export interface Product {
  rank: number
  name: string
  badge: string
  rating: number
  price: string
  description: string
  pros: string[]
  cons: string[]
  affiliateUrl: string
  buttonText: string
}
