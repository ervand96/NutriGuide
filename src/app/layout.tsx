import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NutriGuide — Honest Diet & Supplement Reviews',
  description: 'Science-backed reviews of diets, supplements, and nutrition programs to help you make the right choice.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
