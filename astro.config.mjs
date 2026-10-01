import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://maruo-works.github.io',
  integrations: [sitemap()],
});
