/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDF8E7',
          100: '#FDF0D4',
          200: '#FCE0A8',
          300: '#F9C872',
          400: '#D4AF37',
          500: '#C5A059',
          600: '#AA7C11',
          700: '#8B6309',
          800: '#6B4C08',
          900: '#4A3605',
        },
        ivory: {
          50: '#FDFBF7',
          100: '#FAF6EF',
          200: '#F5EDE0',
          300: '#EFE0C7',
          400: '#E6D0A5',
          500: '#DCC083',
          600: '#CFAE66',
          700: '#BE9553',
          800: '#A67C45',
          900: '#8E6639',
        },
        charcoal: '#1A1A1A',
        softgray: '#4A4A4A',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 8px 30px rgb(0, 0, 0, 0.04)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.3)',
      },
    },
  },
  plugins: [],
}
