import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';

// Sprawdzamy, czy aplikacja jest uruchomiona w trybie deweloperskim
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  output: 'static',
  site: 'https://eduacademy.pl',
  // Ładujemy integrację Keystatic TYLKO podczas lokalnej pracy.
  // Podczas 'npm run build' zostanie ona pominięta, więc Astro
  // zbuduje czysty, statyczny kod bez żądania adaptera Node.js.
  integrations: [
    tailwind(),
    sitemap(),
    react(),
    markdoc(),
    ...(isDev ? [keystatic()] : [])
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },
});