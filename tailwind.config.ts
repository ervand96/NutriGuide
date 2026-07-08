import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        leaf: {
          50:  '#f0faf1',
          100: '#d8f3db',
          500: '#2D7A3A',
          600: '#236030',
          700: '#1a4a25',
        },
        cream: '#FAFAF5',
        bark:  '#2C2416',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body:    ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
