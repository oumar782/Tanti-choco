import React, { useState, useCallback, useEffect, useRef } from 'react';

const UIContext = React.createContext(null);

export function UIProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const toggleCart = useCallback(() => setCartOpen(v => !v), []);

  const showToast = useCallback((message, type = 'default', duration = 3000) => {
    window.clearTimeout(toastTimer.current);
    setToast({ message, type, id: Date.now() });
    toastTimer.current = window.setTimeout(() => setToast(null), duration);
  }, []);

  const value = { cartOpen, openCart, closeCart, toggleCart, toast, showToast };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = React.useContext(UIContext);
  if (!ctx) throw new Error('useUI doit être utilisé dans un UIProvider');
  return ctx;
}

