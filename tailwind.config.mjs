/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A1F1D',        // near-black text
        slate: {
          50: '#F7F8F7',
          100: '#EEF0EF',
          200: '#DDE1DF',
          300: '#C3C9C6',
          400: '#9BA39F',
          500: '#6E766F',
          600: '#4E564F',
          700: '#373D38',
          800: '#252A26',
        },
        teal: {
          DEFAULT: '#1D9E75',
          dark: '#085041',
          light: '#E6F5EF',
        },
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Helvetica Neue"', 'sans-serif'],
        body: ['"Public Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
}
