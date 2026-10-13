import type { APIRoute } from 'astro';
import { products } from '../data/products';

const paths = [
  '/',
  '/catalog',
  ...products.map((p) => `/product/${p.slug}`),
  '/lab',
  '/about',
  '/delivery',
  '/returns',
  '/contacts',
  '/privacy',
  '/offer',
  '/consent',
];

export const GET: APIRoute = ({ site }) => {
  const urls = paths.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
