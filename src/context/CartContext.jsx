import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { MENU_ITEMS } from '../data/menuData.js';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'tanti_choco_cart';
export const MAX_ITEM_QUANTITY = 20;

// ─────────────────────────────────────────────
// Fonctions utilitaires panier
// ─────────────────────────────────────────────

/**
 * Calcule le prix unitaire d'un item (options incluses)
 */
function computeUnitPrice(basePrice, selectedOptions) {
  let extra = 0;
  if (selectedOptions) {
    Object.values(selectedOptions).forEach(choices => {
      (Array.isArray(choices) ? choices : [choices]).forEach(c => {
        extra += Number.isFinite(c?.price) ? c.price : 0;
      });
    });
  }
  return basePrice + extra;
}

function normalizeSelectedOptions(item, selectedOptions = {}) {
  const normalized = {};
  (item.options || []).forEach((option) => {
    const raw = selectedOptions?.[option.id];
    const rawChoices = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const selectedIds = rawChoices.map(choice => typeof choice === 'object' && choice ? choice.id : choice);
    const choices = option.choices.filter(choice => selectedIds.includes(choice.id));
    if (choices.length > 0) {
      normalized[option.id] = option.multiple ? choices : choices[0];
    } else if (option.required && option.choices.length > 0) {
      normalized[option.id] = option.multiple ? [option.choices[0]] : option.choices[0];
    }
  });
  return normalized;
}

/**
 * Crée une clé unique pour un item + ses options
 */
function buildCartKey(itemId, selectedOptions, note = '') {
  const optStr = selectedOptions
    ? JSON.stringify(Object.entries(selectedOptions).sort())
    : '';
  return `${itemId}__${optStr}__${note.trim()}`;
}

function normalizeStoredItems(value) {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item.id !== 'string') return [];
    const menuItem = MENU_ITEMS.find(candidate => candidate.id === item.id && candidate.available);
    const quantity = Number(item.quantity);
    if (!menuItem || !Number.isFinite(quantity) || quantity < 1) return [];
    const selectedOptions = normalizeSelectedOptions(menuItem, item.selectedOptions);
    const note = typeof item.note === 'string' ? item.note : '';
    const safeQuantity = Math.min(MAX_ITEM_QUANTITY, Math.floor(quantity));
    const unitPrice = computeUnitPrice(menuItem.price, selectedOptions);

    return [{
      ...item,
      cartKey: buildCartKey(menuItem.id, selectedOptions, note),
      id: menuItem.id,
      name: menuItem.name,
      image: menuItem.image,
      basePrice: menuItem.price,
      selectedOptions,
      note,
      quantity: safeQuantity,
      unitPrice,
      totalPrice: safeQuantity * unitPrice,
    }];
  });
}

// ─────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────

function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD_ITEM': {
      const { item, quantity, selectedOptions, note } = action.payload;
      const requestedQuantity = Math.floor(Number(quantity));
      const menuItem = item && MENU_ITEMS.find(candidate => candidate.id === item.id && candidate.available);
      if (!menuItem || !Number.isFinite(requestedQuantity) || requestedQuantity < 1) return state;
      const safeOptions = normalizeSelectedOptions(menuItem, selectedOptions);
      const safeNote = typeof note === 'string' ? note : '';
      const key = buildCartKey(menuItem.id, safeOptions, safeNote);
      const unitPrice = computeUnitPrice(menuItem.price, safeOptions);
      if (!Number.isFinite(unitPrice)) return state;
      const existing = state.items.find(i => i.cartKey === key);

      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.cartKey === key
              ? {
                  ...i,
                  quantity: Math.min(MAX_ITEM_QUANTITY, i.quantity + requestedQuantity),
                  name: menuItem.name,
                  image: menuItem.image,
                  basePrice: menuItem.price,
                  unitPrice,
                  totalPrice: Math.min(MAX_ITEM_QUANTITY, i.quantity + requestedQuantity) * unitPrice,
                }
              : i
          ),
        };
      }

      const newItem = {
        cartKey: key,
        id: menuItem.id,
        name: menuItem.name,
        image: menuItem.image,
        basePrice: menuItem.price,
        selectedOptions: safeOptions,
        note: safeNote,
        quantity: Math.min(MAX_ITEM_QUANTITY, requestedQuantity),
        unitPrice,
        totalPrice: Math.min(MAX_ITEM_QUANTITY, requestedQuantity) * unitPrice,
      };

      return { ...state, items: [...state.items, newItem] };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(i => i.cartKey !== action.payload.cartKey),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { cartKey, quantity } = action.payload;
      const safeQuantity = Math.floor(Number(quantity));
      if (!Number.isFinite(safeQuantity) || safeQuantity <= 0) {
        return {
          ...state,
          items: state.items.filter(i => i.cartKey !== cartKey),
        };
      }
      return {
        ...state,
        items: state.items.map(i =>
            i.cartKey === cartKey
              ? { ...i, quantity: Math.min(MAX_ITEM_QUANTITY, safeQuantity), totalPrice: Math.min(MAX_ITEM_QUANTITY, safeQuantity) * i.unitPrice }
            : i
        ),
      };
    }

    case 'UPDATE_NOTE': {
      const { cartKey } = action.payload;
      const note = typeof action.payload.note === 'string' ? action.payload.note : '';
      const item = state.items.find(i => i.cartKey === cartKey);
      if (!item) return state;
      const nextCartKey = buildCartKey(item.id, item.selectedOptions, note);
      const matchingItem = state.items.find(i => i.cartKey === nextCartKey && i.cartKey !== cartKey);
      if (matchingItem) {
        const quantity = Math.min(MAX_ITEM_QUANTITY, matchingItem.quantity + item.quantity);
        return {
          ...state,
          items: state.items
            .filter(i => i.cartKey !== cartKey)
            .map(i => i.cartKey === nextCartKey ? { ...i, quantity, totalPrice: quantity * i.unitPrice } : i),
        };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.cartKey === cartKey ? { ...i, cartKey: nextCartKey, note } : i
        ),
      };
    }

    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }

    case 'LOAD_CART': {
      return { ...state, items: action.payload.items };
    }

    default:
      return state;
  }
}

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: 'LOAD_CART', payload: { items: normalizeStoredItems(parsed) } });
      }
    } catch {
      // Panier corrompu, on ignore
    }
  }, []);

  // Persister le panier dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Quota dépassé ou mode privé strict, on ignore
    }
  }, [state.items]);

  // Actions
  const addItem = useCallback((item, quantity = 1, selectedOptions = {}, note = '') => {
    dispatch({ type: 'ADD_ITEM', payload: { item, quantity, selectedOptions, note } });
  }, []);

  const removeItem = useCallback((cartKey) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { cartKey } });
  }, []);

  const updateQuantity = useCallback((cartKey, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartKey, quantity } });
  }, []);

  const updateNote = useCallback((cartKey, note) => {
    dispatch({ type: 'UPDATE_NOTE', payload: { cartKey, note } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  // Calculs dérivés
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.totalPrice, 0);
  const isEmpty = state.items.length === 0;

  const value = {
    items: state.items,
    itemCount,
    subtotal,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    updateNote,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans un CartProvider');
  return ctx;
}

