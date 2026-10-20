import React, { useState, useMemo, useCallback, useRef } from 'react';
import { CakeSlice, CupSoda, Flame, Leaf, Search, Sandwich, Utensils, X } from 'lucide-react';
import { MENU_ITEMS, CATEGORIES, getAvailableCategories, searchMenu } from '../../data/menuData.js';
import DishCard from './DishCard.jsx';
import './MenuSection.css';

const CATEGORY_ICONS = {
  mains: Utensils,
  grillades: Flame,
  sides: Leaf,
  snacks: Sandwich,
  desserts: CakeSlice,
  drinks: CupSoda,
};

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  const categories = useMemo(() => getAvailableCategories(), []);

  const filteredItems = useMemo(() => {
    let items = searchQuery.trim()
      ? searchMenu(searchQuery)
      : MENU_ITEMS;

    if (activeCategory !== 'all') {
      items = items.filter(item => item.category === activeCategory);
    }

    return items;
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = useCallback((catId) => {
    setActiveCategory(catId);
    setSearchQuery('');
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    searchRef.current?.focus();
  }, []);

  return (
    <section className="menu section" id="carte" aria-labelledby="menu-title">
      <div className="container">

        {/* En-tête */}
        <div className="menu__header">
          <div>
            <p className="category-label"><Utensils size={15} aria-hidden="true" /> Notre carte</p>
            <h2 className="menu__title" id="menu-title">
              Composez votre repas,<br />
              <em>à votre façon.</em>
            </h2>
          </div>
          <p className="menu__intro">
            Choisissez parmi nos plats, ajoutez-les à votre panier
            et passez votre commande en quelques clics.
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="menu__search-wrap">
          <div className="menu__search">
            <Search size={18} className="menu__search-icon" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher un plat, une saveur…"
              className="menu__search-input"
              aria-label="Rechercher dans le menu"
            />
            {searchQuery && (
              <button
                className="menu__search-clear"
                onClick={handleClearSearch}
                aria-label="Effacer la recherche"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="menu__filters" role="tablist" aria-label="Filtrer par catégorie">
          <button
            className={`menu__filter-btn${activeCategory === 'all' ? ' menu__filter-btn--active' : ''}`}
            onClick={() => handleCategoryChange('all')}
            role="tab"
            aria-selected={activeCategory === 'all'}
            aria-controls="menu-items"
          >
            Tout voir
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`menu__filter-btn${activeCategory === cat.id ? ' menu__filter-btn--active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
              role="tab"
              aria-selected={activeCategory === cat.id}
              aria-controls="menu-items"
            >
              {(() => {
                const Icon = CATEGORY_ICONS[cat.id] || Utensils;
                return <Icon size={15} aria-hidden="true" />;
              })()}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Résultats */}
        <div
          id="menu-items"
          className="menu__grid"
          role="tabpanel"
          aria-label={`Plats — ${activeCategory === 'all' ? 'Toutes catégories' : CATEGORIES[activeCategory]?.label || ''}`}
        >
          {filteredItems.length === 0 ? (
            <div className="menu__empty">
              <Search className="menu__empty-icon" size={30} aria-hidden="true" />
              <p className="menu__empty-title">Aucun plat trouvé</p>
              <p className="menu__empty-text">
                Essayez un autre mot-clé ou parcourez toutes les catégories.
              </p>
              <button
                className="btn btn--secondary btn--sm"
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              >
                Réinitialiser
              </button>
            </div>
          ) : (
            filteredItems.map(item => (
              <DishCard key={item.id} item={item} />
            ))
          )}
        </div>

        {/* Compteur de résultats */}
        <p className="menu__count" aria-live="polite" aria-atomic="true">
          {filteredItems.length === 0
            ? ''
            : `${filteredItems.length} plat${filteredItems.length > 1 ? 's' : ''} disponible${filteredItems.length > 1 ? 's' : ''}`
          }
        </p>
      </div>
    </section>
  );
}

