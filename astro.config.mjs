import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://eduacademy.pl',
  integrations: [tailwind(), sitemap(), react()],
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
