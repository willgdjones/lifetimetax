/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f6ff',
          100: '#e5edff',
          200: '#cddcff',
          300: '#abc0ff',
          400: '#879bff',
          500: '#6377f6',
          600: '#4f5fe1',
          700: '#414cbc',
          800: '#373f98',
          900: '#303775'
        }
      }
    }
  },
  plugins: []
};
