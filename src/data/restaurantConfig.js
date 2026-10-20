/**
 * CHEZ TANTI CHOCO — CONFIGURATION DU RESTAURANT
 *
 * ⚠️  FICHIER DE CONFIGURATION ÉDITABLE
 * Toutes les informations ci-dessous sont provisoires.
 * Remplacez-les par les données réelles avant la mise en ligne.
 */

export const RESTAURANT_CONFIG = {
  name: 'Chez Tanti Choco',
  tagline: 'Les bonnes choses ont le goût du partage.',
  description:
    'Découvrez une cuisine généreuse, des saveurs qui rassemblent et le plaisir de bien manger.',

  // ⚠️  À compléter avec les informations réelles
  contact: {
    phone: null,              // Ex: '+223 70 00 00 00'
    email: null,              // Ex: 'contact@tanticho.co'
    whatsapp: null,           // Ex: '22370000000' (sans + ni espaces)
    whatsappEnabled: false,   // Mettre true quand le numéro est confirmé
  },

  // ⚠️  À compléter
  address: {
    street: null,             // Ex: 'Rue 42, Hamdallaye'
    neighborhood: null,       // Ex: 'ACI 2000'
    city: 'Bamako',
    country: 'Mali',
    googleMapsUrl: null,
  },

  // ⚠️  À compléter
  hours: {
    monday:    null,          // Ex: '09:00–22:00'
    tuesday:   null,
    wednesday: null,
    thursday:  null,
    friday:    null,
    saturday:  null,
    sunday:    null,
    note: null,               // Ex: 'Fermé les jours fériés'
  },

  // Modes de réception disponibles
  orderModes: {
    pickup: true,             // Retrait sur place
    delivery: false,          // Livraison (à activer quand disponible)
  },

  // Modes de paiement acceptés
  paymentMethods: {
    cash: true,
    mobileMoney: false,       // À activer (Orange Money, Moov Money, etc.)
    card: false,
  },

  // Frais de livraison (en FCFA), si la livraison est activée
  delivery: {
    fee: 0,
    freeAbove: null,          // Livraison gratuite au-dessus de ce montant
    zones: [],
  },

  // Réseaux sociaux — laisser null si non utilisé
  social: {
    facebook:  null,
    instagram: null,
    tiktok:    null,
  },

  // Monnaie
  currency: {
    code: 'FCFA',
    symbol: 'FCFA',
    locale: 'fr-ML',
  },

  // Mode démonstration
  isDemo: true, // Mettre false quand le restaurant est prêt à recevoir de vraies commandes
};

/**
 * Formate un montant en FCFA
 * @param {number} amount - Montant numérique
 * @returns {string} Montant formaté
 */
export function formatPrice(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return '— FCFA';
  return `${amount.toLocaleString('fr-FR')} FCFA`;
}

const WEEKDAYS = [
  ['monday', 'Lun.'],
  ['tuesday', 'Mar.'],
  ['wednesday', 'Mer.'],
  ['thursday', 'Jeu.'],
  ['friday', 'Ven.'],
  ['saturday', 'Sam.'],
  ['sunday', 'Dim.'],
];

export function formatOpeningHours(hours = {}) {
  return WEEKDAYS
    .filter(([key]) => hours[key])
    .map(([key, label]) => `${label} ${hours[key]}`)
    .join(' · ') || 'Horaires à confirmer';
}

export default RESTAURANT_CONFIG;

