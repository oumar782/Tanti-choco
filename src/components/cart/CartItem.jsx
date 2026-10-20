import React from 'react';
import { FileText, Plus, Minus, Trash2 } from 'lucide-react';
import { MAX_ITEM_QUANTITY, useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../data/restaurantConfig.js';
import ImageWithFallback from '../common/ImageWithFallback.jsx';
import './CartItem.css';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  const optionLabels = Object.values(item.selectedOptions || {})
    .flat()
    .map(o => o?.label)
    .filter(Boolean);

  return (
    <li className="cart-item">
      {/* Image */}
      <div className="cart-item__img-wrap" aria-hidden="true">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="cart-item__img"
          width="80"
          height="80"
          sizes="72px"
        />
      </div>

      {/* Infos */}
      <div className="cart-item__info">
        <p className="cart-item__name">{item.name}</p>

        {optionLabels.length > 0 && (
          <p className="cart-item__options">
            {optionLabels.join(' · ')}
          </p>
        )}

        {item.note && (
          <p className="cart-item__note"><FileText size={13} aria-hidden="true" /> {item.note}</p>
        )}

        <div className="cart-item__bottom">
          {/* Contrôle quantité */}
          <div className="qty-control">
            <button
              className="qty-btn qty-btn--sm"
              onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
              aria-label={`Diminuer la quantité de ${item.name}`}
            >
              {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
            </button>
            <span className="qty-display" aria-label={`Quantité : ${item.quantity}`}>
              {item.quantity}
            </span>
            <button
              className="qty-btn qty-btn--sm"
              onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
              disabled={item.quantity >= MAX_ITEM_QUANTITY}
              aria-label={`Augmenter la quantité de ${item.name}`}
            >
              <Plus size={12} />
            </button>
          </div>

          <span className="cart-item__price">{formatPrice(item.totalPrice)}</span>
        </div>
      </div>

      {/* Supprimer */}
      <button
        className="cart-item__remove"
        onClick={() => removeItem(item.cartKey)}
        aria-label={`Supprimer ${item.name} du panier`}
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
}

