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
        // Using default Tailwind colors (indigo, slate, amber, etc.)
        // No custom colors needed - all defined in guidelines use standard Tailwind palette
      },
    },
  },
  plugins: [],
}

export default config
