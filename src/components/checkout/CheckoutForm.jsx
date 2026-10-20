import React, { useState } from 'react';
import { AlertTriangle, Banknote, Bike, CircleCheck, CircleX, CreditCard, ShoppingBag, Smartphone, Store } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import RESTAURANT_CONFIG, { formatPrice } from '../../data/restaurantConfig.js';
import { buildOrder, calculateDeliveryFee, submitOrder, getWhatsAppOrderUrl } from '../../services/orderService.js';
import OrderSummary from './OrderSummary.jsx';
import './CheckoutForm.css';

const STEPS = ['Mode', 'Coordonnées', 'Paiement', 'Récapitulatif'];

function getDefaultOrderMode(orderModes) {
  if (orderModes.pickup) return 'pickup';
  if (orderModes.delivery) return 'delivery';
  return '';
}

function getDefaultPaymentMethod(paymentMethods) {
  return ['cash', 'mobileMoney', 'card'].find(method => paymentMethods[method]) || '';
}

function validateStep1(data, orderModes) {
  const errors = {};
  if (!data.orderMode || orderModes[data.orderMode] !== true) errors.orderMode = 'Veuillez choisir un mode de réception disponible.';
  return errors;
}

function validateStep2(data) {
  const errors = {};
  if (!data.name.trim()) errors.name = 'Votre nom est requis.';
  const phone = data.phone.trim();
  if (!phone) errors.phone = 'Votre numéro de téléphone est requis.';
  else if (!/^\+?[\d\s().-]+$/.test(phone) || phone.replace(/\D/g, '').length < 8 || phone.replace(/\D/g, '').length > 15)
    errors.phone = 'Numéro de téléphone invalide.';
  if (data.orderMode === 'delivery' && !data.address.trim())
    errors.address = 'Votre adresse est requise pour la livraison.';
  return errors;
}

function validateStep3(data, paymentMethods) {
  const errors = {};
  if (!data.paymentMethod || paymentMethods[data.paymentMethod] !== true) errors.paymentMethod = 'Veuillez choisir un mode de paiement disponible.';
  return errors;
}

export default function CheckoutForm() {
  const { items, subtotal, isEmpty, clearCart } = useCart();
  const cfg = RESTAURANT_CONFIG;

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    orderMode: getDefaultOrderMode(cfg.orderModes),
    name: '',
    phone: '',
    address: '',
    neighborhood: '',
    instructions: '',
    paymentMethod: getDefaultPaymentMethod(cfg.paymentMethods),
    note: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success, orderId, isDemo, message, order }

  const deliveryFee = calculateDeliveryFee(subtotal, formData.orderMode, cfg);
  const total = subtotal + deliveryFee;

  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const goNext = () => {
    let errs = {};
    if (step === 0) errs = validateStep1(formData, cfg.orderModes);
    if (step === 1) errs = validateStep2(formData);
    if (step === 2) errs = validateStep3(formData, cfg.paymentMethods);

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(s => s + 1);
    const checkoutSection = document.getElementById('commande');
    if (checkoutSection) {
      const top = checkoutSection.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  };

  const goBack = () => {
    setErrors({});
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const order = buildOrder({
      cartItems: items,
      orderMode: formData.orderMode,
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        neighborhood: formData.neighborhood,
        instructions: formData.instructions,
      },
      paymentMethod: formData.paymentMethod,
      note: formData.note,
    });

    try {
      const res = await submitOrder(order);
      setResult({ ...res, order });
      if (res.success) clearCart();
    } catch (e) {
      setResult({ success: false, message: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  // --- État résultat ---
  if (result) {
    const waUrl = result.order ? getWhatsAppOrderUrl(result.order) : null;
    return (
      <div className="checkout-result">
        <div className={`checkout-result__card${result.success ? ' checkout-result__card--success' : ' checkout-result__card--error'}`}>
          <span className="checkout-result__icon" aria-hidden="true">
            {result.success ? <CircleCheck size={34} /> : <CircleX size={34} />}
          </span>
          <h2 className="checkout-result__title">
            {result.success ? 'Commande enregistrée !' : 'Erreur'}
          </h2>
          {result.orderId && (
            <p className="checkout-result__order-id">N° {result.orderId}</p>
          )}
          <p className="checkout-result__message">{result.message}</p>

          {result.isDemo && (
            <div className="checkout-result__demo-notice">
              <strong>Mode démonstration</strong> — Cette commande n'a pas été transmise
              au restaurant. Aucun paiement n'a été effectué.
            </div>
          )}

          {cfg.contact.whatsappEnabled && waUrl && (
            <a
              href={waUrl}
              className="btn btn--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Envoyer sur WhatsApp
            </a>
          )}

          <button
            className="btn btn--secondary"
            onClick={() => {
              setResult(null);
              setStep(0);
              setFormData({
                orderMode: getDefaultOrderMode(cfg.orderModes),
                name: '', phone: '', address: '', neighborhood: '',
                instructions: '', paymentMethod: getDefaultPaymentMethod(cfg.paymentMethods),
                note: '',
              });
            }}
          >
            Nouvelle commande
          </button>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="checkout-empty">
        <ShoppingBag size={28} aria-hidden="true" />
        <h3>Votre panier est vide</h3>
        <p>Ajoutez des plats depuis notre carte pour passer commande.</p>
        <a href="#familles-de-plats" className="btn btn--primary">Voir la carte</a>
      </div>
    );
  }

  return (
    <div className="checkout">
      {/* Indicateur d'étapes */}
      <div className="checkout__steps" aria-label="Étapes de la commande">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`checkout__step${i === step ? ' checkout__step--active' : ''}${i < step ? ' checkout__step--done' : ''}`}
            aria-current={i === step ? 'step' : undefined}
          >
            <span className="checkout__step-num" aria-hidden="true">
              {i < step ? '✓' : i + 1}
            </span>
            <span className="checkout__step-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="checkout__body">
        <div className="checkout__form-wrap">
          {/* --- Étape 0 : Mode de réception --- */}
          {step === 0 && (
            <fieldset className="checkout__fieldset">
              <legend className="checkout__section-title">Mode de réception</legend>
              <div className="checkout__options">
                {cfg.orderModes.pickup && (
                  <label className={`checkout__option${formData.orderMode === 'pickup' ? ' checkout__option--selected' : ''}`}>
                    <input
                      type="radio"
                      name="orderMode"
                      value="pickup"
                      checked={formData.orderMode === 'pickup'}
                      onChange={() => update('orderMode', 'pickup')}
                      className="sr-only"
                    />
                    <span className="checkout__option-icon" aria-hidden="true"><Store size={20} /></span>
                    <div>
                      <p className="checkout__option-title">Retrait sur place</p>
                      <p className="checkout__option-desc">Venez chercher votre commande au restaurant.</p>
                    </div>
                  </label>
                )}
                {cfg.orderModes.delivery && (
                  <label className={`checkout__option${formData.orderMode === 'delivery' ? ' checkout__option--selected' : ''}`}>
                    <input
                      type="radio"
                      name="orderMode"
                      value="delivery"
                      checked={formData.orderMode === 'delivery'}
                      onChange={() => update('orderMode', 'delivery')}
                      className="sr-only"
                    />
                    <span className="checkout__option-icon" aria-hidden="true"><Bike size={20} /></span>
                    <div>
                      <p className="checkout__option-title">Livraison</p>
                      <p className="checkout__option-desc">
                        Frais : {cfg.delivery.fee === 0 ? 'Gratuit' : formatPrice(cfg.delivery.fee)}
                        {cfg.delivery.freeAbove != null && ` (gratuit dès ${formatPrice(cfg.delivery.freeAbove)})`}
                      </p>
                    </div>
                  </label>
                )}
                {!cfg.orderModes.pickup && !cfg.orderModes.delivery && (
                  <p className="checkout__info-text">Aucun mode de réception n'est configuré pour le moment.</p>
                )}
              </div>
              {errors.orderMode && <p className="checkout__error" role="alert">{errors.orderMode}</p>}
            </fieldset>
          )}

          {/* --- Étape 1 : Coordonnées --- */}
          {step === 1 && (
            <fieldset className="checkout__fieldset">
              <legend className="checkout__section-title">Vos coordonnées</legend>

              <div className="checkout__field">
                <label htmlFor="name" className="checkout__label">Nom complet *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={e => update('name', e.target.value)}
                  className={`checkout__input${errors.name ? ' checkout__input--error' : ''}`}
                  placeholder="Votre nom"
                  autoComplete="name"
                />
                {errors.name && <p className="checkout__error" role="alert">{errors.name}</p>}
              </div>

              <div className="checkout__field">
                <label htmlFor="phone" className="checkout__label">Téléphone *</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={e => update('phone', e.target.value)}
                  className={`checkout__input${errors.phone ? ' checkout__input--error' : ''}`}
                  placeholder="+223 70 00 00 00"
                  autoComplete="tel"
                />
                {errors.phone && <p className="checkout__error" role="alert">{errors.phone}</p>}
              </div>

              {formData.orderMode === 'delivery' && (
                <>
                  <div className="checkout__field">
                    <label htmlFor="address" className="checkout__label">Adresse de livraison *</label>
                    <input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={e => update('address', e.target.value)}
                      className={`checkout__input${errors.address ? ' checkout__input--error' : ''}`}
                      placeholder="Rue, numéro…"
                      autoComplete="street-address"
                    />
                    {errors.address && <p className="checkout__error" role="alert">{errors.address}</p>}
                  </div>
                  <div className="checkout__field">
                    <label htmlFor="neighborhood" className="checkout__label">Quartier / Repère</label>
                    <input
                      id="neighborhood"
                      type="text"
                      value={formData.neighborhood}
                      onChange={e => update('neighborhood', e.target.value)}
                      className="checkout__input"
                      placeholder="Ex: Hamdallaye, ACI 2000…"
                    />
                  </div>
                </>
              )}

              <div className="checkout__field">
                <label htmlFor="instructions" className="checkout__label">Instructions (optionnel)</label>
                <textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={e => update('instructions', e.target.value)}
                  className="checkout__input checkout__input--textarea"
                  placeholder="Informations utiles pour votre commande ou livraison…"
                  rows={3}
                  maxLength={400}
                />
              </div>
            </fieldset>
          )}

          {/* --- Étape 2 : Paiement --- */}
          {step === 2 && (
            <fieldset className="checkout__fieldset">
              <legend className="checkout__section-title">Mode de paiement</legend>
              <div className="checkout__options">
                {cfg.paymentMethods.cash && (
                  <label className={`checkout__option${formData.paymentMethod === 'cash' ? ' checkout__option--selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={() => update('paymentMethod', 'cash')}
                      className="sr-only"
                    />
                    <span className="checkout__option-icon" aria-hidden="true"><Banknote size={20} /></span>
                    <div>
                      <p className="checkout__option-title">Espèces</p>
                      <p className="checkout__option-desc">Paiement à la livraison ou au retrait.</p>
                    </div>
                  </label>
                )}
                {cfg.paymentMethods.mobileMoney && (
                  <label className={`checkout__option${formData.paymentMethod === 'mobileMoney' ? ' checkout__option--selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobileMoney"
                      checked={formData.paymentMethod === 'mobileMoney'}
                      onChange={() => update('paymentMethod', 'mobileMoney')}
                      className="sr-only"
                    />
                    <span className="checkout__option-icon" aria-hidden="true"><Smartphone size={20} /></span>
                    <div>
                      <p className="checkout__option-title">Mobile Money</p>
                      <p className="checkout__option-desc">Orange Money, Moov Money…</p>
                    </div>
                  </label>
                )}
                {cfg.paymentMethods.card && (
                  <label className={`checkout__option${formData.paymentMethod === 'card' ? ' checkout__option--selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => update('paymentMethod', 'card')}
                      className="sr-only"
                    />
                    <span className="checkout__option-icon" aria-hidden="true"><CreditCard size={20} /></span>
                    <div>
                      <p className="checkout__option-title">Carte bancaire</p>
                      <p className="checkout__option-desc">Paiement par carte, si disponible au restaurant.</p>
                    </div>
                  </label>
                )}
              </div>
              {errors.paymentMethod && <p className="checkout__error" role="alert">{errors.paymentMethod}</p>}

              <div className="checkout__field" style={{ marginTop: 'var(--space-5)' }}>
                <label htmlFor="order-note" className="checkout__label">Note générale (optionnel)</label>
                <textarea
                  id="order-note"
                  value={formData.note}
                  onChange={e => update('note', e.target.value)}
                  className="checkout__input checkout__input--textarea"
                  placeholder="Instructions ou remarques pour le restaurant…"
                  rows={2}
                  maxLength={300}
                />
              </div>
            </fieldset>
          )}

          {/* --- Étape 3 : Récapitulatif --- */}
          {step === 3 && (
            <div>
              <h3 className="checkout__section-title">Récapitulatif de votre commande</h3>
              <OrderSummary
                items={items}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                formData={formData}
              />
              {RESTAURANT_CONFIG.isDemo && (
                <div className="checkout__demo-notice">
                  <strong><AlertTriangle size={15} aria-hidden="true" /> Mode démonstration</strong> — Votre commande sera simulée et
                  non transmise au restaurant. Aucun article ne vous sera préparé.
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="checkout__nav">
            {step > 0 && (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={goBack}
                disabled={loading}
              >
                Retour
              </button>
            )}
            {step < 3 && (
              <button
                type="button"
                className="btn btn--primary"
                onClick={goNext}
                style={{ marginLeft: 'auto' }}
              >
                Continuer
              </button>
            )}
            {step === 3 && (
              <button
                type="button"
                className={`btn btn--primary${loading ? ' btn--loading' : ''}`}
                onClick={handleSubmit}
                disabled={loading}
                style={{ marginLeft: 'auto' }}
              >
                {!loading && 'Confirmer la commande'}
              </button>
            )}
          </div>
        </div>

        {/* Résumé latéral */}
        <aside className="checkout__sidebar" aria-label="Résumé de la commande">
          <div className="checkout__sidebar-inner">
            <h3 className="checkout__sidebar-title">Votre commande</h3>
            <div className="checkout__sidebar-items">
              {items.map(item => (
                <div key={item.cartKey} className="checkout__sidebar-item">
                  <span className="checkout__sidebar-qty">{item.quantity}×</span>
                  <span className="checkout__sidebar-name">{item.name}</span>
                  <span className="checkout__sidebar-price">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>
            <div className="checkout__sidebar-totals">
              <div className="checkout__sidebar-row">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {formData.orderMode === 'delivery' && (
                <div className="checkout__sidebar-row">
                  <span>Livraison</span>
                  <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : 'Gratuite'}</span>
                </div>
              )}
              <div className="checkout__sidebar-row checkout__sidebar-row--total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

