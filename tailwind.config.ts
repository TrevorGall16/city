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
      // ✅ MASTER AI OPTIMIZED FONTS
      fontFamily: {
        sans: ['var(--font-sans)'], // Default font (Inter)
        city: ['var(--font-city)', 'var(--font-sans)'], // Dynamic city font with Inter fallback
      },
    },
  },
  plugins: [],
}

export default config