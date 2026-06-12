/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brandPrimary: '#0d9488',
        brandPrimaryDark: '#0f766e',
        brandAccent: '#f59e0b',
        brandAccentLight: '#fef3c7',
        brandBg: '#fdfbf7',
        brandSoftGreen: '#f0fdf4',
        brandSoftPink: '#fff1f2',
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
