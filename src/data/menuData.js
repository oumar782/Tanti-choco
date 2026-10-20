/**
 * CHEZ TANTI CHOCO — DONNÉES DU MENU
 *
 * ⚠️  DONNÉES DE DÉMONSTRATION
 * Ces plats sont des exemples provisoires.
 * Remplacez-les par les vrais plats du restaurant avant la mise en ligne.
 *
 * Structure d'un plat :
 * {
 *   id: string (unique, stable),
 *   name: string,
 *   description: string,
 *   price: number (en FCFA, numérique),
 *   category: string (correspond à une CATEGORIES key),
 *   image: string (URL),
 *   available: boolean,
 *   featured: boolean (apparaît dans la sélection accueil),
 *   tags: string[] (ex: ['épicé', 'populaire']),
 *   options: Option[] | null,
 * }
 *
 * Structure d'une option :
 * {
 *   id: string,
 *   label: string,
 *   required: boolean,
 *   multiple: boolean,
 *   choices: { id, label, price }[]
 * }
 */

export const CATEGORIES = {
  featured:       { id: 'featured',       label: 'Sélection' },
  mains:          { id: 'mains',          label: 'Plats principaux' },
  grillades:      { id: 'grillades',      label: 'Grillades' },
  sides:          { id: 'sides',          label: 'Accompagnements' },
  snacks:         { id: 'snacks',         label: 'Snacks' },
  desserts:       { id: 'desserts',       label: 'Desserts' },
  drinks:         { id: 'drinks',         label: 'Boissons' },
};

// Images culinaires africaines de haute qualité (Unsplash)
const IMAGES = {
  riz_sauce:   'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&q=80',
  poulet:      'https://images.unsplash.com/photo-1598514982901-dc78f4d78f1f?w=600&q=80',
  tieboudienne:'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80',
  poisson:     'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80',
  brochettes:  'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80',
  igname:      'https://images.unsplash.com/photo-1536304993881-ff86e0c9c785?w=600&q=80',
  salade:      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  beignet:     'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80',
  mangue:      'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80',
  bissap:      'https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?w=600&q=80',
  jus_fruit:   'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80',
  sandwich:    'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80',
};

export const MENU_ITEMS = [
  // --- PLATS PRINCIPAUX ---
  {
    id: 'riz-sauce-arachide',
    name: 'Riz sauce arachide',
    description: 'Riz parfumé nappé d\'une sauce arachide onctueuse, accompagné de légumes mijotés et de viande de votre choix.',
    price: 2500,
    category: 'mains',
    image: IMAGES.riz_sauce,
    available: true,
    featured: true,
    tags: ['populaire', 'complet'],
    options: [
      {
        id: 'viande',
        label: 'Choix de viande',
        required: true,
        multiple: false,
        choices: [
          { id: 'poulet', label: 'Poulet', price: 0 },
          { id: 'boeuf',  label: 'Bœuf',  price: 500 },
          { id: 'poisson',label: 'Poisson',price: 300 },
        ],
      },
    ],
  },
  {
    id: 'tieboudienne',
    name: 'Thiéboudienne',
    description: 'Le grand classique — riz au poisson et légumes cuits dans une sauce tomate riche et parfumée.',
    price: 3000,
    category: 'mains',
    image: IMAGES.tieboudienne,
    available: true,
    featured: true,
    tags: ['classique', 'populaire'],
    options: null,
  },
  {
    id: 'poulet-yassa',
    name: 'Poulet yassa',
    description: 'Poulet grillé mariné longuement dans les oignons caramélisés et le citron. Servi avec du riz blanc.',
    price: 3500,
    category: 'mains',
    image: IMAGES.poulet,
    available: true,
    featured: true,
    tags: ['populaire', 'signature'],
    options: null,
  },
  {
    id: 'poisson-braise',
    name: 'Poisson braisé',
    description: 'Poisson frais braisé au feu de bois, relevé d\'épices locales, servi avec du riz ou de l\'attiéké.',
    price: 3200,
    category: 'mains',
    image: IMAGES.poisson,
    available: true,
    featured: false,
    tags: ['frais'],
    options: [
      {
        id: 'accomp',
        label: 'Accompagnement',
        required: true,
        multiple: false,
        choices: [
          { id: 'riz',     label: 'Riz',     price: 0 },
          { id: 'attieke', label: 'Attiéké', price: 0 },
          { id: 'igname',  label: 'Igname',  price: 200 },
        ],
      },
    ],
  },

  // --- GRILLADES ---
  {
    id: 'brochettes-boeuf',
    name: 'Brochettes de bœuf',
    description: 'Morceaux de bœuf marinés et grillés à la flamme. Accompagnés de sauce piquante et d\'oignons frais.',
    price: 2000,
    category: 'grillades',
    image: IMAGES.brochettes,
    available: true,
    featured: true,
    tags: ['grillé', 'populaire'],
    options: [
      {
        id: 'quantite-brochettes',
        label: 'Nombre de brochettes',
        required: false,
        multiple: false,
        choices: [
          { id: 'x2', label: '2 brochettes',  price: 0 },
          { id: 'x4', label: '4 brochettes',  price: 2000 },
          { id: 'x6', label: '6 brochettes',  price: 4000 },
        ],
      },
    ],
  },
  {
    id: 'poulet-grille',
    name: 'Poulet grillé entier',
    description: 'Poulet entier mariné aux herbes et épices, grillé lentement. Idéal à partager.',
    price: 7000,
    category: 'grillades',
    image: IMAGES.poulet,
    available: true,
    featured: false,
    tags: ['à partager'],
    options: null,
  },

  // --- ACCOMPAGNEMENTS ---
  {
    id: 'igname-frites',
    name: 'Igname frites',
    description: 'Igname fraîche taillée en frites croustillantes, assaisonnée de sel et d\'épices.',
    price: 800,
    category: 'sides',
    image: IMAGES.igname,
    available: true,
    featured: false,
    tags: [],
    options: null,
  },
  {
    id: 'salade-fraiche',
    name: 'Salade fraîche',
    description: 'Salade de saison avec tomates, concombres et une vinaigrette maison légère.',
    price: 600,
    category: 'sides',
    image: IMAGES.salade,
    available: true,
    featured: false,
    tags: ['léger'],
    options: null,
  },

  // --- SNACKS ---
  {
    id: 'sandwich-poulet',
    name: 'Sandwich poulet grillé',
    description: 'Pain artisanal garni de poulet grillé émincé, salade, tomates et sauce maison.',
    price: 1500,
    category: 'snacks',
    image: IMAGES.sandwich,
    available: true,
    featured: false,
    tags: ['rapide'],
    options: null,
  },
  {
    id: 'beignets',
    name: 'Beignets de haricot (Accra)',
    description: 'Beignets croustillants à base de haricot, dorés à point. À déguster tels quels ou avec la sauce épicée.',
    price: 500,
    category: 'snacks',
    image: IMAGES.beignet,
    available: true,
    featured: false,
    tags: ['végétarien'],
    options: null,
  },

  // --- DESSERTS ---
  {
    id: 'mangue-fraiche',
    name: 'Mangue fraîche de saison',
    description: 'Mangues locales sélectionnées à la maturité, tranchées et présentées avec élégance.',
    price: 700,
    category: 'desserts',
    image: IMAGES.mangue,
    available: true,
    featured: false,
    tags: ['frais', 'saisonnier'],
    options: null,
  },

  // --- BOISSONS ---
  {
    id: 'bissap',
    name: 'Jus de bissap',
    description: 'Boisson rafraîchissante à base de fleurs d\'hibiscus, sucrée et légèrement citronnée.',
    price: 500,
    category: 'drinks',
    image: IMAGES.bissap,
    available: true,
    featured: true,
    tags: ['maison', 'sans alcool'],
    options: [
      {
        id: 'taille-boisson',
        label: 'Taille',
        required: false,
        multiple: false,
        choices: [
          { id: 'petit',  label: 'Petit (25cl)',   price: 0 },
          { id: 'grand',  label: 'Grand (50cl)',   price: 300 },
        ],
      },
    ],
  },
  {
    id: 'jus-de-gingembre',
    name: 'Jus de gingembre',
    description: 'Jus de gingembre frais, tonique et parfumé, légèrement sucré.',
    price: 500,
    category: 'drinks',
    image: IMAGES.jus_fruit,
    available: true,
    featured: false,
    tags: ['maison', 'sans alcool'],
    options: null,
  },
  {
    id: 'eau-plate',
    name: 'Eau minérale',
    description: 'Eau minérale en bouteille.',
    price: 300,
    category: 'drinks',
    image: IMAGES.jus_fruit,
    available: true,
    featured: false,
    tags: [],
    options: null,
  },
];

/**
 * Retourne les plats mis en avant (featured)
 */
export function getFeaturedItems() {
  return MENU_ITEMS.filter(item => item.featured && item.available);
}

/**
 * Retourne les plats d'une catégorie
 * @param {string} categoryId
 */
export function getItemsByCategory(categoryId) {
  if (categoryId === 'all') return MENU_ITEMS;
  return MENU_ITEMS.filter(item => item.category === categoryId);
}

/**
 * Retourne les catégories qui ont au moins un plat
 */
export function getAvailableCategories() {
  const used = new Set(MENU_ITEMS.map(i => i.category));
  return Object.values(CATEGORIES).filter(c =>
    c.id !== 'featured' && used.has(c.id)
  );
}

/**
 * Recherche dans le menu
 * @param {string} query
 */
export function searchMenu(query) {
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const q = normalize(query.trim());
  if (!q) return MENU_ITEMS;
  return MENU_ITEMS.filter(item =>
    normalize(item.name).includes(q) ||
    normalize(item.description).includes(q) ||
    (item.tags || []).some(tag => normalize(tag).includes(q))
  );
}

/**
 * Trouve un plat par son id
 * @param {string} id
 */
export function getItemById(id) {
  return MENU_ITEMS.find(item => item.id === id) || null;
}

