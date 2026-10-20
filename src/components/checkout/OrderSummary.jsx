import React from 'react';
import { Banknote, Bike, CreditCard, FileText, Smartphone, Store } from 'lucide-react';
import { formatPrice } from '../../data/restaurantConfig.js';
import ImageWithFallback from '../common/ImageWithFallback.jsx';

export default function OrderSummary({ items, subtotal, deliveryFee, total, formData }) {
  const ModeIcon = formData.orderMode === 'delivery' ? Bike : Store;
  const modeLabel = formData.orderMode === 'delivery' ? 'Livraison' : 'Retrait sur place';
  const PaymentIcon = formData.paymentMethod === 'cash'
    ? Banknote
    : formData.paymentMethod === 'mobileMoney'
    ? Smartphone
    : formData.paymentMethod === 'card'
    ? CreditCard
    : null;
  const paymentLabel = formData.paymentMethod === 'cash'
    ? 'Espèces'
    : formData.paymentMethod === 'mobileMoney'
    ? 'Mobile Money'
    : formData.paymentMethod === 'card'
    ? 'Carte bancaire'
    : formData.paymentMethod;

  const optionLabels = (selectedOptions) => {
    if (!selectedOptions) return [];
    return Object.values(selectedOptions)
      .flat()
      .map(o => o?.label)
      .filter(Boolean);
  };

  return (
    <div className="order-summary">
      {/* Articles */}
      <section className="order-summary__section">
        <h4 className="order-summary__section-title">Articles</h4>
        <ul className="order-summary__items">
          {items.map(item => (
            <li key={item.cartKey} className="order-summary__item">
              <div className="order-summary__item-img">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  width="48"
                  height="48"
                  sizes="48px"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="order-summary__item-info">
                <p className="order-summary__item-name">
                  <strong>{item.quantity}×</strong> {item.name}
                </p>
                {optionLabels(item.selectedOptions).length > 0 && (
                  <p className="order-summary__item-opts">
                    {optionLabels(item.selectedOptions).join(' · ')}
                  </p>
                )}
                {item.note && (
                  <p className="order-summary__item-note"><FileText size={13} aria-hidden="true" /> {item.note}</p>
                )}
              </div>
              <span className="order-summary__item-price">{formatPrice(item.totalPrice)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Détails client */}
      <section className="order-summary__section">
        <h4 className="order-summary__section-title">Coordonnées</h4>
        <div className="order-summary__details">
          <div className="order-summary__detail-row">
            <span>Nom</span>
            <span>{formData.name}</span>
          </div>
          <div className="order-summary__detail-row">
            <span>Téléphone</span>
            <span>{formData.phone}</span>
          </div>
          {formData.address && (
            <div className="order-summary__detail-row">
              <span>Adresse</span>
              <span>{formData.address}{formData.neighborhood ? `, ${formData.neighborhood}` : ''}</span>
            </div>
          )}
          {formData.instructions && (
            <div className="order-summary__detail-row">
              <span>Instructions</span>
              <span>{formData.instructions}</span>
            </div>
          )}
          <div className="order-summary__detail-row">
            <span>Réception</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><ModeIcon size={14} aria-hidden="true" />{modeLabel}</span>
          </div>
          <div className="order-summary__detail-row">
            <span>Paiement</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>{PaymentIcon && <PaymentIcon size={14} aria-hidden="true" />}{paymentLabel}</span>
          </div>
        </div>
      </section>

      {/* Totaux */}
      <section className="order-summary__totals">
        <div className="order-summary__total-row">
          <span>Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="order-summary__total-row">
            <span>Frais de livraison</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
        )}
        {deliveryFee === 0 && formData.orderMode === 'delivery' && (
          <div className="order-summary__total-row order-summary__total-row--free">
            <span>Livraison</span>
            <span>Gratuit</span>
          </div>
        )}
        <div className="order-summary__total-row order-summary__total-row--final">
          <span>Total à payer</span>
          <span>{formatPrice(total)}</span>
        </div>
      </section>
    </div>
  );
}

