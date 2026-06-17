import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import markdoc from '@astrojs/markdoc';

export default defineConfig({
  output: 'static',
  site: 'https://eduacademy.pl',
  integrations: [
    tailwind(),
    sitemap(),
    markdoc(),
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