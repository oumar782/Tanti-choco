import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { UIProvider } from './context/UIContext.jsx';

import './styles/tokens.css';
import './styles/global.css';
import './styles/components.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <UIProvider>
        <App />
      </UIProvider>
    </CartProvider>
  </React.StrictMode>
);
