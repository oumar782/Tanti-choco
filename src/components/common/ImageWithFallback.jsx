import React, { useEffect, useState } from 'react';

function responsiveUnsplashSrcSet(src) {
  try {
    const url = new URL(src);
    if (url.hostname !== 'images.unsplash.com') return undefined;
    return [360, 540, 720, 960, 1200].map((width) => {
      const candidate = new URL(url);
      candidate.searchParams.set('w', String(width));
      candidate.searchParams.set('auto', 'format');
      return `${candidate.href} ${width}w`;
    }).join(', ');
  } catch {
    return undefined;
  }
}

/**
 * Image avec fallback en cas d'erreur de chargement
 */
export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = null,
  className = '',
  ...props
}) {
  const [error, setError] = useState(false);

  useEffect(() => setError(false), [src]);

  const defaultFallback = fallbackSrc || generatePlaceholder(alt);

  return (
    <img
      src={error ? defaultFallback : src}
      srcSet={error ? undefined : (props.srcSet || responsiveUnsplashSrcSet(src))}
      sizes={props.sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
      decoding={props.decoding || 'async'}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}

/**
 * Génère un SVG data-URI en guise de placeholder
 */
function generatePlaceholder(alt = '') {
  const safeAlt = String(alt).slice(0, 24).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  })[character]);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="#FFF7ED"/>
    <rect x="160" y="100" width="80" height="80" rx="8" fill="#EADFD4"/>
    <text x="200" y="220" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#78675B">${safeAlt}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

