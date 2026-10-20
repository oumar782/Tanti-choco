/**
 * CHEZ TANTI CHOCO — SERVICE DE COMMANDE
 *
 * Couche de service dédiée à la création et transmission des commandes.
 * Prépare l'intégration future avec un backend API.
 */

import RESTAURANT_CONFIG from '../data/restaurantConfig.js';

/**
 * Statuts de commande
 */
export const ORDER_STATUS = {
  PENDING:   'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY:     'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export function calculateDeliveryFee(subtotal, orderMode, config = RESTAURANT_CONFIG) {
  if (!Number.isFinite(subtotal) || subtotal < 0 || orderMode !== 'delivery' || !config.orderModes.delivery) return 0;
  const fee = Number(config.delivery.fee);
  if (!Number.isFinite(fee) || fee < 0) return 0;
  const freeAbove = config.delivery.freeAbove;
  return freeAbove != null && subtotal >= Number(freeAbove) ? 0 : fee;
}

/**
 * Crée un objet commande normalisé à partir du panier et des infos client
 * @param {Object} params
 * @returns {Object} Commande normalisée
 */
export function buildOrder({ cartItems, orderMode, customer, paymentMethod, note }) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) throw new Error('Le panier est vide.');
  if (RESTAURANT_CONFIG.orderModes[orderMode] !== true) throw new Error('Mode de réception indisponible.');
  if (RESTAURANT_CONFIG.paymentMethods[paymentMethod] !== true) throw new Error('Mode de paiement indisponible.');
  if (!customer || typeof customer.name !== 'string' || !customer.name.trim() || typeof customer.phone !== 'string' || !customer.phone.trim()) {
    throw new Error('Les coordonnées du client sont incomplètes.');
  }
  if (orderMode === 'delivery' && (typeof customer.address !== 'string' || !customer.address.trim())) {
    throw new Error('Une adresse est nécessaire pour la livraison.');
  }
  if (cartItems.some(item => !Number.isFinite(item.totalPrice) || item.totalPrice < 0 || !Number.isInteger(item.quantity) || item.quantity < 1)) {
    throw new Error('Un article du panier est invalide.');
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  if (!Number.isFinite(subtotal)) throw new Error('Le total de la commande est invalide.');
  const deliveryFee = calculateDeliveryFee(subtotal, orderMode);
  const total = subtotal + deliveryFee;

  return {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    status: ORDER_STATUS.PENDING,
    items: cartItems.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      selectedOptions: item.selectedOptions || {},
      note: item.note || '',
    })),
    orderMode,
    customer: {
      name: customer.name,
      phone: customer.phone,
      address: customer.address || null,
      neighborhood: customer.neighborhood || null,
      instructions: customer.instructions || null,
    },
    paymentMethod,
    pricing: {
      subtotal,
      deliveryFee,
      total,
    },
    note: note || '',
    isDemo: RESTAURANT_CONFIG.isDemo,
  };
}

/**
 * Génère un ID de commande simple (pour la démo)
 */
function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TC-${timestamp}-${random}`;
}

/**
 * Génère le message texte d'une commande pour WhatsApp
 * @param {Object} order
 * @returns {string} Message formaté
 */
export function buildWhatsAppMessage(order) {
  const lines = [
    `🍽️ *Nouvelle commande — Chez Tanti Choco*`,
    `N° ${order.id}`,
    ``,
    `*Articles commandés :*`,
    ...order.items.map(item => {
      let line = `• ${item.quantity}x ${item.name} — ${formatOrderPrice(item.totalPrice)}`;
      if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
        const opts = Object.values(item.selectedOptions)
          .flat()
          .map(o => o.label)
          .join(', ');
        line += ` (${opts})`;
      }
      if (item.note) line += `\n  📝 ${item.note}`;
      return line;
    }),
    ``,
    `*Sous-total :* ${formatOrderPrice(order.pricing.subtotal)}`,
    order.orderMode === 'delivery'
      ? `*Livraison :* ${order.pricing.deliveryFee > 0 ? formatOrderPrice(order.pricing.deliveryFee) : 'Gratuite'}`
      : null,
    `*Total :* ${formatOrderPrice(order.pricing.total)}`,
    ``,
    `*Mode de réception :* ${order.orderMode === 'delivery' ? '🛵 Livraison' : '🏪 Retrait sur place'}`,
    `*Paiement :* ${{
      cash: '💵 Espèces',
      mobileMoney: '📱 Mobile Money',
      card: '💳 Carte bancaire',
    }[order.paymentMethod] || order.paymentMethod}`,
    ``,
    `*Client :*`,
    `Nom : ${order.customer.name}`,
    `Tél : ${order.customer.phone}`,
    order.customer.address ? `Adresse : ${order.customer.address}` : null,
    order.customer.neighborhood ? `Quartier : ${order.customer.neighborhood}` : null,
    order.customer.instructions ? `Instructions : ${order.customer.instructions}` : null,
    order.note ? `\n📝 Note générale : ${order.note}` : null,
    ``,
    `_Commande passée depuis le site web_`,
  ];

  return lines.filter(l => l !== null).join('\n');
}

function formatOrderPrice(amount) {
  return `${amount.toLocaleString('fr-FR')} FCFA`;
}

/**
 * Génère l'URL WhatsApp pour envoyer la commande
 * @param {Object} order
 * @returns {string|null} URL WhatsApp ou null si non configuré
 */
export function getWhatsAppOrderUrl(order) {
  const phone = String(RESTAURANT_CONFIG.contact.whatsapp || '').replace(/\D/g, '');
  if (!RESTAURANT_CONFIG.contact.whatsappEnabled || !phone) return null;

  const message = buildWhatsAppMessage(order);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

/**
 * Soumet une commande.
 *
 * EN MODE DEMO : simule une réponse après 1,5s.
 * EN PRODUCTION : envoyer la commande à l'API backend.
 *
 * @param {Object} order - Commande normalisée (buildOrder)
 * @returns {Promise<{success: boolean, orderId: string, message: string}>}
 */
export async function submitOrder(order) {
  if (RESTAURANT_CONFIG.isDemo) {
    // Mode démonstration : simulation d'une latence réseau
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simule un succès (vous pouvez simuler une erreur ici pour tester)
    return {
      success: true,
      orderId: order.id,
      isDemo: true,
      message:
        'Votre commande a été enregistrée (mode démonstration). ' +
        'Dans la version finale, elle sera transmise directement au restaurant.',
    };
  }

  // --- INTÉGRATION BACKEND (à implémenter) ---
  // try {
  //   const response = await fetch('/api/orders', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(order),
  //   });
  //   if (!response.ok) throw new Error('Erreur serveur');
  //   const data = await response.json();
  //   return { success: true, orderId: data.orderId, message: 'Commande confirmée !' };
  // } catch (err) {
  //   return { success: false, orderId: null, message: 'Erreur lors de l\'envoi de la commande.' };
  // }

  throw new Error('Mode production non configuré. Activez isDemo ou intégrez un backend.');
}

