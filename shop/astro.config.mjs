// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

export default defineConfig({
  site: PUBLIC_SITE_URL || 'https://lenpalonfamily.ru',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  // class-стратегия: scoped-классы родителя доходят до корня дочернего компонента через проп class
  scopedStyleStrategy: 'class',
});
