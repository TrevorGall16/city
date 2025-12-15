import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: "class",
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Using default Tailwind colors
      },
      // ✅ ADDED FONTS HERE
      fontFamily: {
        sans: ['var(--font-sans)'], // Default font (Inter)
        
        // City Personalities
        tokyo: ['var(--font-tokyo)'],
        bangkok: ['var(--font-bangkok)'],
        paris: ['var(--font-paris)'],
        rome: ['var(--font-rome)'],
        la: ['var(--font-la)'],
        ny: ['var(--font-ny)'],
        berlin: ['var(--font-berlin)'],
        london: ['var(--font-london)'],
        istanbul: ['var(--font-istanbul)'],
        dubai: ['var(--font-dubai)'],
        hk: ['var(--font-hk)'],
      },
    },
  },
  plugins: [],
}

export default config