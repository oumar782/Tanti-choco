import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import RESTAURANT_CONFIG from '../src/data/restaurantConfig.js';

const distDir = resolve('dist');
const configuredUrl = (process.env.VITE_SITE_URL || '').trim();
const robotsPath = resolve(distDir, 'robots.txt');
const pageMeta = JSON.parse(await readFile(resolve('src/data/seoPages.json'), 'utf8'));
const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function updateMeta(html, attribute, key, content) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${escapedKey}["'][^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function renderPageHead(template, pathname, meta, siteUrl) {
  const title = meta?.title || 'Page introuvable | Chez Tanti Choco';
  const description = meta?.description || 'Cette page est introuvable. Retrouvez la carte et les informations de Chez Tanti Choco à Bamako.';
  const robots = meta ? 'index, follow' : 'noindex, follow';
  let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = updateMeta(html, 'name', 'description', description);
  html = updateMeta(html, 'name', 'robots', robots);
  html = updateMeta(html, 'property', 'og:title', title);
  html = updateMeta(html, 'property', 'og:description', description);
  html = updateMeta(html, 'property', 'og:image:alt', 'Ambiance chaleureuse de restaurant');
  html = updateMeta(html, 'name', 'twitter:title', title);
  html = updateMeta(html, 'name', 'twitter:description', description);
  html = updateMeta(html, 'name', 'twitter:image:alt', 'Ambiance chaleureuse de restaurant');
  if (siteUrl && meta) {
    const canonical = new URL(pathname === '/' ? '/' : pathname, siteUrl).href;
    html = html.replace('</head>', `    <link rel="canonical" href="${escapeHtml(canonical)}" />\n  </head>`);
    html = updateMeta(html, 'property', 'og:url', canonical);
  }
  if (pathname === '/') {
    const { address, contact, social } = RESTAURANT_CONFIG;
    const restaurant = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: RESTAURANT_CONFIG.name,
      description: RESTAURANT_CONFIG.description,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=630&fit=crop&auto=format&q=85',
      address: { '@type': 'PostalAddress', addressLocality: address.city, addressCountry: 'ML' },
    };
    if (siteUrl) restaurant.url = siteUrl.origin;
    if (address.street) restaurant.address.streetAddress = address.street;
    if (contact.phone) restaurant.telephone = contact.phone;
    if (contact.email) restaurant.email = contact.email;
    const sameAs = Object.values(social).filter(Boolean);
    if (sameAs.length) restaurant.sameAs = sameAs;
    const jsonLd = JSON.stringify(restaurant).replace(/</g, '\\u003c');
    html = html.replace('</head>', `    <script id="restaurant-structured-data" type="application/ld+json">${jsonLd}</script>\n  </head>`);
  }
  return html;
}

await mkdir(distDir, { recursive: true });

const template = await readFile(resolve(distDir, 'index.html'), 'utf8');
for (const [pathname, meta] of Object.entries(pageMeta)) {
  const routeDir = pathname === '/' ? distDir : resolve(distDir, pathname.slice(1));
  await mkdir(routeDir, { recursive: true });
  await writeFile(resolve(routeDir, 'index.html'), renderPageHead(template, pathname, meta, null));
}

if (!configuredUrl) {
  const publicRobots = await readFile(resolve('public/robots.txt'), 'utf8');
  await writeFile(robotsPath, publicRobots);
  console.warn('VITE_SITE_URL absent : pages pré-rendues, sitemap.xml et canonical absolus non générés. Configurez l’URL publique du site.');
  process.exit(0);
}

let siteUrl;
try {
  siteUrl = new URL(configuredUrl);
  if (!['https:', 'http:'].includes(siteUrl.protocol) || siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash) {
    throw new Error('VITE_SITE_URL doit être une origine publique, sans chemin, paramètres ni fragment.');
  }
} catch (error) {
  console.error(`URL publique invalide : ${error.message}`);
  process.exit(1);
}

const routes = ['/', '/menu', '/specialites', '/about', '/contact'];
for (const pathname of routes) {
  const routeDir = pathname === '/' ? distDir : resolve(distDir, pathname.slice(1));
  await writeFile(resolve(routeDir, 'index.html'), renderPageHead(template, pathname, pageMeta[pathname], siteUrl));
}
const xmlEscape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const urls = routes.map(route => `  <url><loc>${xmlEscape(new URL(route, siteUrl).href)}</loc></url>`).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

await writeFile(resolve(distDir, 'sitemap.xml'), sitemap);
await writeFile(robotsPath, `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', siteUrl).href}\n`);
console.log('Sitemap et robots.txt générés pour ' + siteUrl.origin);
