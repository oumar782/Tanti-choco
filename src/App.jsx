import React, { Suspense, lazy } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/layout/Header.jsx';
import CartDrawer from './components/cart/CartDrawer.jsx';
import Footer from './components/layout/Footer.jsx';
import SEO from './components/common/SEO.jsx';
import { useUI } from './context/UIContext.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const MenuPage = lazy(() => import('./pages/MenuPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const SpecialtiesPage = lazy(() => import('./pages/SpecialtiesPage.jsx'));

function AppRoutes() {
  const { toast } = useUI();
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      let targetId = location.hash.slice(1);
      try {
        targetId = decodeURIComponent(targetId);
      } catch {
        // Garder le fragment brut si l'URL contient un encodage invalide.
      }
      document.getElementById(targetId)?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 280);

    return () => window.clearTimeout(timeout);
  }, [location.key, location.hash, reduceMotion]);

  const goToCheckout = () => {
    navigate('/menu#commande');
  };

  return (
    <>
      <SEO />
      <Header />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          className="route-transition"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
          transition={{ duration: reduceMotion ? 0 : 0.24, ease: 'easeOut' }}
        >
          <Suspense fallback={<main className="route-loading" aria-busy="true" aria-label="Chargement de la page" />}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/specialites" element={<SpecialtiesPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/reservation" element={<Navigate to="/menu#commande" replace />} />
              <Route path="*" element={<main className="not-found page-shell"><div className="container"><p className="category-label">Page introuvable</p><h1>Cette page n’existe pas.</h1><p>Le lien est peut-être incorrect ou la page a été déplacée.</p><Link className="btn btn--primary" to="/">Retour à l’accueil</Link></div></main>} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>

      <Footer />
      <CartDrawer onCheckout={goToCheckout} />

      {toast && (
        <div className={`toast toast--${toast.type || 'default'}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
