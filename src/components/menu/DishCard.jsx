import React, { useState } from 'react';
import { Plus, Minus, X, Info } from 'lucide-react';
import { MAX_ITEM_QUANTITY, useCart } from '../../context/CartContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { formatPrice } from '../../data/restaurantConfig.js';
import ImageWithFallback from '../common/ImageWithFallback.jsx';
import './DishCard.css';

export default function DishCard({ item }) {
  const { items: cartItems, addItem } = useCart();
  const { showToast } = useUI();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    if (!item.options) return {};
    const defaults = {};
    item.options.forEach(opt => {
      if (opt.required && opt.choices.length > 0) {
        defaults[opt.id] = opt.multiple ? [opt.choices[0]] : opt.choices[0];
      }
    });
    return defaults;
  });
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const [adding, setAdding] = useState(false);

  // Calcul prix avec options
  const extraPrice = Object.values(selectedOptions).reduce((sum, choice) => {
    const choices = Array.isArray(choice) ? choice : [choice];
    return sum + choices.reduce((s, c) => s + (c?.price || 0), 0);
  }, 0);
  const unitPrice = item.price + extraPrice;

  const handleOptionChange = (optId, choice, isMultiple, isRequired) => {
    setSelectedOptions(prev => {
      if (isMultiple) {
        const current = Array.isArray(prev[optId]) ? prev[optId] : [];
        const exists = current.some(c => c.id === choice.id);
        if (exists && isRequired && current.length === 1) return prev;
        return {
          ...prev,
          [optId]: exists
            ? current.filter(c => c.id !== choice.id)
            : [...current, choice],
        };
      }
      return { ...prev, [optId]: choice };
    });
  };

  const handleAdd = async () => {
    if (!item.available) return;
    const missingRequiredOption = item.options?.find((option) => {
      if (!option.required) return false;
      const selected = selectedOptions[option.id];
      return Array.isArray(selected) ? selected.length === 0 : !selected;
    });
    if (missingRequiredOption) {
      showToast(`Veuillez choisir : ${missingRequiredOption.label}.`, 'error');
      return;
    }
    const existingQuantity = cartItems.find(cartItem =>
      cartItem.id === item.id &&
      JSON.stringify(cartItem.selectedOptions) === JSON.stringify(selectedOptions) &&
      (cartItem.note || '').trim() === note.trim()
    )?.quantity || 0;
    const quantityToAdd = Math.min(quantity, MAX_ITEM_QUANTITY - existingQuantity);
    if (quantityToAdd <= 0) {
      showToast(`La limite de ${MAX_ITEM_QUANTITY} unités est atteinte pour ce plat et ces options.`, 'error');
      return;
    }
    setAdding(true);
    addItem(item, quantityToAdd, selectedOptions, note);
    showToast(
      quantityToAdd === quantity
        ? `${item.name} ajouté au panier ✓`
        : `${quantityToAdd} unité(s) ajoutée(s), limite de ${MAX_ITEM_QUANTITY} atteinte.`,
      'success'
    );
    setTimeout(() => {
      setAdding(false);
      setQuantity(1);
      setNote('');
    }, 600);
  };

  const isOptionSelected = (optId, choiceId) => {
    const sel = selectedOptions[optId];
    if (!sel) return false;
    if (Array.isArray(sel)) return sel.some(c => c.id === choiceId);
    return sel.id === choiceId;
  };

  return (
    <article className={`dish-card${!item.available ? ' dish-card--unavailable' : ''}`}>
      {/* Image */}
      <div className="dish-card__img-wrap">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="dish-card__img"
          loading="lazy"
          width="400"
          height="260"
        />
        {!item.available && (
          <div className="dish-card__unavailable-badge">Indisponible</div>
        )}
        {item.tags?.length > 0 && item.available && (
          <div className="dish-card__tags" aria-hidden="true">
            {item.tags.slice(0, 1).map(tag => (
              <span key={tag} className="badge badge--orange">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="dish-card__body">
        <div className="dish-card__info">
          <h3 className="dish-card__name">{item.name}</h3>
          <p className="dish-card__desc">{item.description}</p>
        </div>

        {/* Options */}
        {item.options && item.available && (
          <div className="dish-card__options">
            {item.options.map(opt => (
              <div key={opt.id} className="dish-option">
                <p className="dish-option__label">
                  {opt.label}
                  {opt.required && <span className="dish-option__required" aria-label="obligatoire"> *</span>}
                </p>
                <div className="dish-option__choices">
                  {opt.choices.map(choice => (
                    <button
                      key={choice.id}
                      className={`dish-option__choice${isOptionSelected(opt.id, choice.id) ? ' dish-option__choice--selected' : ''}`}
                      onClick={() => handleOptionChange(opt.id, choice, opt.multiple, opt.required)}
                      aria-pressed={isOptionSelected(opt.id, choice.id)}
                    >
                      {choice.label}
                      {choice.price > 0 && (
                        <span className="dish-option__choice-price">+{formatPrice(choice.price)}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Note */}
        {item.available && (
          <div className="dish-card__note-wrap">
            <button
              className="dish-card__note-toggle"
              onClick={() => setNoteOpen(v => !v)}
              aria-expanded={noteOpen}
            >
              <Info size={14} />
              {noteOpen ? 'Masquer la note' : 'Ajouter une note'}
            </button>
            {noteOpen && (
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Allergies, cuisson, instructions spéciales…"
                className="dish-card__note-input"
                rows={2}
                maxLength={200}
                aria-label="Note pour la cuisine"
              />
            )}
          </div>
        )}

        {/* Footer : prix + quantité + ajouter */}
        <div className="dish-card__footer">
          <div className="dish-card__price-wrap">
            <span className="price">{formatPrice(unitPrice)}</span>
            {extraPrice > 0 && (
              <span className="dish-card__base-price">{formatPrice(item.price)}</span>
            )}
          </div>

          {item.available ? (
            <div className="dish-card__add-row">
              <div className="qty-control">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Diminuer la quantité"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-display" aria-label={`Quantité : ${quantity}`}>{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => Math.min(MAX_ITEM_QUANTITY, q + 1))}
                  disabled={quantity >= MAX_ITEM_QUANTITY}
                  aria-label="Augmenter la quantité"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                className={`btn btn--primary btn--sm dish-card__add-btn${adding ? ' btn--loading' : ''}`}
                onClick={handleAdd}
                disabled={adding}
                aria-label={`Ajouter ${quantity} ${item.name} au panier`}
              >
                {!adding && <Plus size={16} />}
                {!adding && 'Ajouter'}
              </button>
            </div>
          ) : (
            <span className="badge badge--red">Indisponible</span>
          )}
        </div>
      </div>
    </article>
  );
}

