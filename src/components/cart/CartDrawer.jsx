import React, { useEffect, useRef } from 'react';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { formatPrice } from '../../data/restaurantConfig.js';
import CartItem from './CartItem.jsx';
import './CartDrawer.css';

export default function CartDrawer({ onCheckout }) {
  const { items, subtotal, isEmpty, itemCount } = useCart();
  const { cartOpen, closeCart } = useUI();
  const drawerRef = useRef(null);
  const firstFocusableRef = useRef(null);

  // Focus trap & fermeture clavier
  useEffect(() => {
    if (!cartOpen) return;
    const el = drawerRef.current;
    if (!el) return;
    const previouslyFocused = document.activeElement;
    firstFocusableRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeCart();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = [...el.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter(node => node.getAttribute('aria-hidden') !== 'true');
      if (focusable.length === 0) {
        e.preventDefault();
        el.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === el)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) previouslyFocused.focus();
    };
  }, [cartOpen, closeCart]);

  // Bloquer le scroll du body
  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  const handleCheckout = () => {
    closeCart();
    onCheckout?.();
    const el = document.getElementById('commande');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Tiroir */}
      <aside
        ref={drawerRef}
        className={`cart-drawer${cartOpen ? ' cart-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Votre panier"
        aria-hidden={!cartOpen}
        inert={!cartOpen ? 'true' : undefined}
        tabIndex={-1}
      >
        {/* En-tête */}
        <div className="cart-drawer__header">
          <div className="cart-drawer__title-wrap">
            <ShoppingBag size={20} />
            <h2 className="cart-drawer__title">
              Votre panier
              {itemCount > 0 && (
                <span className="cart-drawer__count">{itemCount}</span>
              )}
            </h2>
          </div>
          <button
            ref={firstFocusableRef}
            className="cart-drawer__close"
            onClick={closeCart}
            aria-label="Fermer le panier"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenu */}
        <div className="cart-drawer__body">
          {isEmpty ? (
            <div className="cart-drawer__empty">
              <ShoppingBag className="cart-drawer__empty-icon" size={30} aria-hidden="true" />
              <h3 className="cart-drawer__empty-title">Votre panier est vide</h3>
              <p className="cart-drawer__empty-text">
                Parcourez notre carte et choisissez vos plats favoris.
              </p>
              <Link
                to="/menu"
                className="btn btn--primary"
                onClick={closeCart}
              >
                Découvrir la carte
              </Link>
            </div>
          ) : (
            <ul className="cart-drawer__list" aria-label="Articles dans le panier">
              {items.map(item => (
                <CartItem key={item.cartKey} item={item} />
              ))}
            </ul>
          )}
        </div>

        {/* Pied du panier */}
        {!isEmpty && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__subtotal">
              <span className="cart-drawer__subtotal-label">Sous-total</span>
              <span className="cart-drawer__subtotal-price">{formatPrice(subtotal)}</span>
            </div>
            <p className="cart-drawer__subtotal-note">
              Les frais de livraison éventuels seront calculés à l’étape suivante.
            </p>
            <button
              className="btn btn--primary btn--lg"
              style={{ width: '100%' }}
              onClick={handleCheckout}
            >
              Passer la commande
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

