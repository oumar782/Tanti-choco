import React from 'react';

/**
 * Composant bouton réutilisable
 *
 * @param {'primary'|'secondary'|'ghost'|'white'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading - Affiche un spinner et désactive le bouton
 * @param {boolean} icon - Style carré pour bouton icône seule
 * @param {string} className - Classes supplémentaires
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon = false,
  className = '',
  as: Tag = 'button',
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'sm' && 'btn--sm',
    size === 'lg' && 'btn--lg',
    icon && 'btn--icon',
    loading && 'btn--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      className={classes}
      disabled={loading || props.disabled}
      aria-disabled={loading || props.disabled || undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}

