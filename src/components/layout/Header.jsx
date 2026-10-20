import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, UtensilsCrossed, ArrowUpRight } from 'lucide-react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import { useCart } from '../../context/CartContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import './Header.css';

const EASE = [0.22, 1, 0.36, 1];

const NAV_LINKS = [
  { id: 'home', label: 'Accueil', to: '/' },
  { id: 'about', label: 'À propos', to: '/about' },
  { id: 'specialites', label: 'Spécialités', to: '/specialites' },
  { id: 'menu', label: 'Nos plats', to: '/menu' },
  { id: 'contact', label: 'Contact', to: '/contact' },
];

const menuVariants = {
  hidden: { opacity: 0, y: -18, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: EASE,
      when: 'beforeChildren',
      staggerChildren: 0.06,
    },
  },
  exit: { opacity: 0, y: -12, scale: 0.98, transition: { duration: 0.28, ease: EASE } },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
};

export default function Header() {
  const { itemCount } = useCart();
  const { openCart } = useUI();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(null);

  const mobileMenuRef = useRef(null);
  const burgerRef = useRef(null);
  const lastY = useRef(0);
  const firstMount = useRef(true);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  const isHome = location.pathname === '/';
  const isScrolled = scrolled || !isHome;

  useEffect(() => {
    firstMount.current = false;
  }, []);

  /* Scroll : état « scrolled » + masquage en descendant, retour en remontant */
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y > 480 && y > lastY.current + 6) setHidden(true);
      else if (y < lastY.current - 6 || y <= 480) setHidden(false);
      lastY.current = y;
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Fermer le menu : clic extérieur + Échap */
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const handleClickOutside = (e) => {
      const inMenu = mobileMenuRef.current && mobileMenuRef.current.contains(e.target);
      const inBurger = burgerRef.current && burgerRef.current.contains(e.target);
      if (!inMenu && !inBurger) setMobileOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [mobileOpen]);

  /* Verrouille le scroll quand le menu est ouvert */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  /* Ferme le menu à chaque changement de page */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleHomeOrder = () => {
    setMobileOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('commande');
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  const springTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 420, damping: 34 };

  const hideHeader = hidden && !mobileOpen;

  return (
    <>
      <motion.header
        className={`header${isScrolled ? ' header--scrolled' : ''}${isHome ? ' header--hero' : ''}${hideHeader ? ' header--hidden' : ''}`}
        role="banner"
        initial={reduceMotion ? false : { y: '-120%', opacity: 0 }}
        animate={{ y: hideHeader ? '-120%' : '0%', opacity: 1 }}
        transition={{
          duration: 0.75,
          ease: EASE,
          delay: firstMount.current && !reduceMotion ? (isHome ? 1.5 : 0.1) : 0,
        }}
      >
        <div className="header__inner container">
          <Link
            to="/"
            className="header__logo"
            aria-label="Chez Tanti Choco — Accueil"
            onClick={() => setMobileOpen(false)}
          >
            <span className="header__logo-icon" aria-hidden="true">
              <UtensilsCrossed size={18} />
            </span>
            <span className="header__logo-text">
              Chez <em>Tanti</em> Choco
            </span>
          </Link>

          <nav className="header__nav" aria-label="Navigation principale">
            <ul
              className="header__nav-list"
              onMouseLeave={() => setHovered(null)}
            >
              {NAV_LINKS.map((link) => (
                <li
                  key={link.id}
                  onMouseEnter={() => setHovered(link.id)}
                  onFocus={() => setHovered(link.id)}
                  onBlur={() => setHovered(null)}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `header__nav-link${isActive ? ' header__nav-link--active' : ''}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="header-active"
                            className="header__nav-active"
                            transition={springTransition}
                          />
                        )}
                        {!isActive && hovered === link.id && (
                          <motion.span
                            layoutId="header-hover"
                            className="header__nav-hover"
                            transition={springTransition}
                          />
                        )}
                        <span className="header__nav-label">{link.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__actions">
            <button
              className="cart-btn"
              onClick={openCart}
              aria-label={`Ouvrir le panier${itemCount > 0 ? ` — ${itemCount} article${itemCount > 1 ? 's' : ''}` : ''}`}
            >
              <ShoppingBag size={18} />
              <span className="header__cart-label">Panier</span>
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    className="cart-badge"
                    aria-hidden="true"
                    initial={reduceMotion ? false : { scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.3, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 14 }}
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <Link
              to="/menu"
              className="btn btn--primary btn--sm header__cta"
              onClick={handleHomeOrder}
            >
              <span className="header__cta-label">Commander</span>
              <span className="header__cta-icon" aria-hidden="true">
                <ArrowUpRight size={15} strokeWidth={2} />
              </span>
            </Link>

            <button
              ref={burgerRef}
              className={`header__burger${mobileOpen ? ' header__burger--open' : ''}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span className="header__burger-line header__burger-line--1" />
              <span className="header__burger-line header__burger-line--2" />
              <span className="header__burger-line header__burger-line--3" />
            </button>
          </div>

          <motion.span
            className="header__progress"
            aria-hidden="true"
            style={{ scaleX: progress }}
          />
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="overlay"
            className="mobile-overlay"
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {mobileOpen && (
          <motion.nav
            key="menu"
            id="mobile-menu"
            className="mobile-menu mobile-menu--open"
            ref={mobileMenuRef}
            aria-label="Menu mobile"
            variants={menuVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate="show"
            exit="exit"
          >
            <ul className="mobile-menu__list">
              {NAV_LINKS.map((link, i) => (
                <motion.li key={link.id} variants={menuItemVariants}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `mobile-menu__link${isActive ? ' mobile-menu__link--active' : ''}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="mobile-menu__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mobile-menu__label">{link.label}</span>
                    <span className="mobile-menu__arrow" aria-hidden="true">
                      <ArrowUpRight size={18} strokeWidth={1.75} />
                    </span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            <motion.div className="mobile-menu__footer" variants={menuItemVariants}>
              <button
                className="btn btn--primary mobile-menu__cart"
                onClick={() => {
                  setMobileOpen(false);
                  openCart();
                }}
              >
                <ShoppingBag size={18} />
                Voir le panier
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </button>
              <p className="mobile-menu__tagline">Bamako · Mali · Cuisine à partager</p>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
