/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Główny niebieski pobrany na podstawie logo
        brandPrimary: '#0955B6',
        brandPrimaryDark: '#0955B6',
        // Błękit do delikatnych akcentów i podświetleń
        brandAccent: '#3b82f6',
        brandAccentLight: '#dbeafe',
        // Neutralne, czyste tła
        brandBg: '#ffffff',
        brandSoftBlue: '#eff6ff',
        brandSlate: '#f8fafc',
        // Kolory tekstu (granat dla nagłówków, szary dla treści)
        textMain: '#0f172a',
        textMuted: '#475569',
      },
      fontFamily: {
        // Zmiana na nowoczesny, geometryczny font pasujący do EdTech
        sans: ['Montserrat', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}