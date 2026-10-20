import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RESTAURANT_CONFIG from '../../data/restaurantConfig.js';
import PAGE_META from '../../data/seoPages.json';

const SITE_URL = (import.meta.env.VITE_SITE_URL || '').trim().replace(/\/+$/, '');
const SOCIAL_IMAGE = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=630&fit=crop&auto=format&q=85';

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    link?.remove();
    return;
  }
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setRestaurantStructuredData(pathname) {
  const existing = document.getElementById('restaurant-structured-data');
  if (pathname !== '/') {
    existing?.remove();
    return;
  }

  const { address, contact, social } = RESTAURANT_CONFIG;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: RESTAURANT_CONFIG.name,
    description: RESTAURANT_CONFIG.description,
    image: SOCIAL_IMAGE,
    address: {
      '@type': 'PostalAddress',
      addressLocality: address.city,
      addressCountry: 'ML',
    },
  };

  if (SITE_URL) data.url = SITE_URL;
  if (address.street) data.address.streetAddress = address.street;
  if (contact.phone) data.telephone = contact.phone;
  if (contact.email) data.email = contact.email;
  const sameAs = Object.values(social).filter(Boolean);
  if (sameAs.length) data.sameAs = sameAs;

  const script = existing || document.createElement('script');
  script.id = 'restaurant-structured-data';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  if (!existing) document.head.appendChild(script);
}

export default function SEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = PAGE_META[pathname];
    const title = page?.title || 'Page introuvable | Chez Tanti Choco';
    const description = page?.description || 'Cette page est introuvable. Retrouvez la carte et les informations de Chez Tanti Choco à Bamako.';
    const canonical = SITE_URL && page ? `${SITE_URL}${pathname === '/' ? '/' : pathname}` : '';

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', page ? 'index, follow' : 'noindex, follow');
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', RESTAURANT_CONFIG.name);
    setMeta('property', 'og:locale', 'fr_ML');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', SOCIAL_IMAGE);
    setMeta('property', 'og:image:alt', 'Ambiance chaleureuse de restaurant');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', SOCIAL_IMAGE);
    setMeta('name', 'twitter:image:alt', 'Ambiance chaleureuse de restaurant');
    if (canonical) setMeta('property', 'og:url', canonical);
    else document.head.querySelector('meta[property="og:url"]')?.remove();
    setCanonical(canonical);
    setRestaurantStructuredData(pathname);
  }, [pathname]);

  return null;
}
