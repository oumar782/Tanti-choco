import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  CakeSlice,
  ClipboardList,
  CupSoda,
  Flame,
  Leaf,
  Search,
  Sandwich,
  Utensils,
  X,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CATEGORIES, MENU_ITEMS, searchMenu } from '../data/menuData.js';
import { formatPrice } from '../data/restaurantConfig.js';
import ImageWithFallback from '../components/common/ImageWithFallback.jsx';
import CheckoutForm from '../components/checkout/CheckoutForm.jsx';
import './MenuPage.css';

const CATEGORY_ICONS = {
  mains: Utensils,
  grillades: Flame,
  sides: Leaf,
  snacks: Sandwich,
  desserts: CakeSlice,
  drinks: CupSoda,
};

const MENU_ITEM_COUNT = MENU_ITEMS.length;
const MENU_CATEGORY_COUNT = Object.values(CATEGORIES)
  .filter(category => category.id !== 'featured' && MENU_ITEMS.some(item => item.category === category.id))
  .length;

const TICKER_WORDS = ['Cuisine maison', 'Produits frais', 'Bamako, Mali', 'À emporter', 'Sur place'];

export default function MenuPage() {
  const reduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const featuredItem = MENU_ITEMS.find(item => item.featured && item.available);

  const categories = useMemo(
    () =>
      Object.values(CATEGORIES)
        .filter(category => category.id !== 'featured')
        .map(category => ({
          ...category,
          items: (searchQuery.trim() ? searchMenu(searchQuery) : MENU_ITEMS).filter(
            item => item.category === category.id
          ),
          total: MENU_ITEMS.filter(item => item.category === category.id).length,
        }))
        .filter(
          category =>
            category.total > 0 && (category.items.length > 0 || !searchQuery.trim())
        ),
    [searchQuery]
  );

  const visibleCount = categories.reduce((total, category) => total + category.items.length, 0);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const sections = document.querySelectorAll('.dishes-category');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [categories]);

  return (
    <main className="menu-page page-shell">
      {/* ============================================================
          HERO — composition éditoriale + photo cinéma + index
          ============================================================ */}
      <section className="dishes-hero" aria-labelledby="dishes-title">
        <div className="dishes-hero__bg" aria-hidden="true">
          <span className="dishes-hero__bg-orbit dishes-hero__bg-orbit--1" />
          <span className="dishes-hero__bg-orbit dishes-hero__bg-orbit--2" />
          <span className="dishes-hero__bg-blob dishes-hero__bg-blob--1" />
          <span className="dishes-hero__bg-blob dishes-hero__bg-blob--2" />
          <span className="dishes-hero__bg-grain" />
        </div>

        <div className="dishes-hero__topline">
          <span className="dishes-hero__topline-left">
            <span className="dishes-hero__dot" aria-hidden="true" />
            Ouvert du mardi au dimanche
          </span>
          <span className="dishes-hero__topline-center">
            <span className="dishes-hero__topline-line" aria-hidden="true" />
            La carte de la maison
            <span className="dishes-hero__topline-line" aria-hidden="true" />
          </span>
          <span className="dishes-hero__topline-right">Bamako · Mali</span>
        </div>

        <div className="container dishes-hero__layout">
          <motion.div
            className="dishes-hero__editorial"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="dishes-hero__label">
              <span className="dishes-hero__label-rule" aria-hidden="true" />
              La carte de la maison
            </p>

            <h1 className="dishes-hero__title" id="dishes-title">
              <span className="dishes-hero__title-line">Nos plats,</span>
              <span className="dishes-hero__title-line dishes-hero__title-line--offset">
                <em className="dishes-hero__title-em">à partager.</em>
              </span>
            </h1>

            <p className="dishes-hero__description">
              Des recettes généreuses, des grillades aux douceurs, préparées pour le plaisir de se
              retrouver.
            </p>

            <div className="dishes-hero__ctas">
              <a className="dishes-hero__btn-primary" href="#familles-de-plats">
                <span className="dishes-hero__btn-primary-label">Explorer la carte</span>
                <span className="dishes-hero__btn-primary-icon" aria-hidden="true">
                  <ArrowDown size={16} />
                </span>
              </a>
              <a className="dishes-hero__text-link" href="#commande">
                Passer commande
                <span className="dishes-hero__text-link-arrow" aria-hidden="true">
                  <ArrowUpRight size={13} />
                </span>
              </a>
            </div>

            <div className="dishes-hero__meta">
              <div className="dishes-hero__meta-item">
                <span className="dishes-hero__meta-number">{MENU_ITEM_COUNT}</span>
                <span className="dishes-hero__meta-label">plats répertoriés</span>
              </div>
              <span className="dishes-hero__meta-divider" aria-hidden="true" />
              <div className="dishes-hero__meta-item">
                <span className="dishes-hero__meta-number">{MENU_CATEGORY_COUNT}</span>
                <span className="dishes-hero__meta-label">familles</span>
              </div>
              <span className="dishes-hero__meta-divider" aria-hidden="true" />
              <div className="dishes-hero__meta-item">
                <span className="dishes-hero__meta-label">
                  <span className="dishes-hero__stars" aria-hidden="true">✦</span>
                  Prix en FCFA
                </span>
              </div>
            </div>
          </motion.div>

          {featuredItem && (
            <motion.div
              className="dishes-hero__visual"
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="dishes-hero__stage">
                <figure className="dishes-hero__figure">
                  <span className="dishes-hero__figure-line" aria-hidden="true" />
                  <div className="dishes-hero__frame">
                    <ImageWithFallback
                      src={featuredItem.image}
                      alt={featuredItem.name}
                      width="900"
                      height="700"
                      loading="eager"
                      className="dishes-hero__img"
                    />
                    <span className="dishes-hero__frame-overlay" aria-hidden="true" />
                    <span className="dishes-hero__frame-shine" aria-hidden="true" />

                    <div className="dishes-hero__caption">
                      <span className="dishes-hero__tag">
                        <span className="dishes-hero__tag-dot" aria-hidden="true" />
                        À découvrir
                      </span>
                      <p className="dishes-hero__dish-title">{featuredItem.name}</p>
                      <p className="dishes-hero__dish-sub">{formatPrice(featuredItem.price)}</p>
                      <a
                        href={`#categorie-${featuredItem.category}`}
                        className="dishes-hero__dish-cta"
                      >
                        Voir la sélection
                        <span className="dishes-hero__dish-cta-arrow" aria-hidden="true">
                          <ArrowUpRight size={13} />
                        </span>
                      </a>
                    </div>
                  </div>

                  <span className="dishes-hero__stamp" aria-hidden="true">
                    <svg viewBox="0 0 120 120" className="dishes-hero__stamp-svg">
                      <defs>
                        <path
                          id="dishes-stamp-path"
                          d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                        />
                      </defs>
                      <g className="dishes-hero__stamp-rotor">
                        <text className="dishes-hero__stamp-text">
                          <textPath href="#dishes-stamp-path">
                            · Tanti Choco · Carte maison · Bamako ·
                          </textPath>
                        </text>
                      </g>
                    </svg>
                    <span className="dishes-hero__stamp-center">
                      <Utensils size={18} strokeWidth={1.8} />
                    </span>
                  </span>
                </figure>

                <aside className="dishes-hero__index" aria-label="Familles de plats">
                  {categories.slice(0, 3).map((cat, i) => {
                    const Icon = CATEGORY_ICONS[cat.id] || Utensils;
                    return (
                      <a
                        key={cat.id}
                        href={`#categorie-${cat.id}`}
                        className="dishes-hero__index-item"
                      >
                        <span className="dishes-hero__index-num">0{i + 1}</span>
                        <span className="dishes-hero__index-name">
                          <Icon size={14} aria-hidden="true" /> {cat.label}
                        </span>
                        <span className="dishes-hero__index-bar" aria-hidden="true">
                          <span
                            className="dishes-hero__index-fill"
                            style={{ animationDelay: `${i * 0.4}s` }}
                          />
                        </span>
                      </a>
                    );
                  })}
                </aside>
              </div>
            </motion.div>
          )}
        </div>

        <div className="container">
          <div className="hticker dishes-hero__ticker" aria-hidden="true">
            <div className="hticker__track">
              {[0, 1].map(setIndex => (
                <div className="hticker__set" key={setIndex}>
                  {TICKER_WORDS.map(word => (
                    <React.Fragment key={word}>
                      <span className="hticker__item">{word}</span>
                      <span className="hticker__sep">✦</span>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container dishes-hero__footer">
          <a href="#familles-de-plats" className="dishes-hero__scroll">
            <span className="dishes-hero__scroll-circle" aria-hidden="true">
              <ArrowDown size={14} />
            </span>
            Faire défiler
          </a>
          <span className="dishes-hero__signature">
            <span className="dishes-hero__signature-rule" aria-hidden="true" />
            L’équipe Tanti Choco
          </span>
        </div>
      </section>

      {/* ============================================================
          MENU — en-tête type .featured__header + grille bento
          ============================================================ */}
      <section
        className="dishes-menu section"
        id="familles-de-plats"
        aria-labelledby="families-title"
      >
        <span className="dishes-menu__bg-word" aria-hidden="true">Carte</span>

        <div className="container dishes-menu__container">
          <header className="dishes-menu__header">
            <div>
              <p className="category-label">À chacun ses envies</p>
              <h2 className="dishes-menu__title" id="families-title">
                La carte<br />
                <em className="dishes-menu__title-em">en détails.</em>
              </h2>
            </div>

            <div className="dishes-menu__side">
              <label className="dishes-search">
                <Search size={18} aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                  placeholder="Rechercher un plat…"
                  aria-label="Rechercher un plat dans la carte"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Effacer la recherche"
                  >
                    <X size={16} />
                  </button>
                )}
              </label>

              <span className="dishes-menu__count">
                <span className="dishes-menu__count-dot" aria-hidden="true" />
                {visibleCount} plat{visibleCount > 1 ? 's' : ''}
              </span>
            </div>
          </header>

          <nav className="dishes-category-nav" aria-label="Familles de plats">
            {categories.map(category => {
              const Icon = CATEGORY_ICONS[category.id] || Utensils;
              return (
                <a key={category.id} href={`#categorie-${category.id}`}>
                  <Icon size={16} aria-hidden="true" />
                  {category.label}
                </a>
              );
            })}
          </nav>

          <div className="dishes-categories">
            {categories.map(
              (category, index) =>
                category.items.length > 0 && (
                  <section
                    className="dishes-category"
                    id={`categorie-${category.id}`}
                    key={category.id}
                    aria-labelledby={`categorie-title-${category.id}`}
                  >
                    <span className="dishes-category__bg-word" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* En-tête calqué sur .featured__header */}
                    <header className="dishes-category__header">
                      <div>
                        <p className="dishes-category__label">
                          <span className="dishes-category__icon">
                            {(() => {
                              const Icon = CATEGORY_ICONS[category.id] || Utensils;
                              return <Icon size={14} strokeWidth={1.7} />;
                            })()}
                          </span>
                          Sélection {String(index + 1).padStart(2, '0')}
                        </p>
                        <h3
                          className="dishes-category__title"
                          id={`categorie-title-${category.id}`}
                        >
                          {category.label}
                        </h3>
                      </div>
                      <div className="dishes-category__side">
                        <span className="dishes-category__count">
                          <span className="dishes-category__count-dot" aria-hidden="true" />
                          {category.items.length} proposition
                          {category.items.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </header>

                    {/* Grille bento — 1ʳᵉ carte grande sur la 1ʳᵉ catégorie */}
                    <div
                      className={`dishes-category__grid${
                        index === 0 && category.items.length >= 3
                          ? ' dishes-category__grid--bento'
                          : ''
                      }`}
                    >
                      {category.items.map((item, itemIndex) => {
                        const isLarge =
                          index === 0 && category.items.length >= 3 && itemIndex === 0;
                        return (
                          <motion.article
                            key={item.id}
                            className={`dishes__item${isLarge ? ' dishes__item--large' : ''}`}
                            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.12 }}
                            transition={{
                              duration: 0.55,
                              delay: Math.min(itemIndex * 0.07, 0.21),
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            <article className={`dishes-card${isLarge ? ' dishes-card--large' : ''}`}>
                              <div className="dishes-card__img-wrap">
                                <div className="dishes-card__media">
                                  <ImageWithFallback
                                    src={item.image}
                                    alt={item.name}
                                    width="640"
                                    height="440"
                                    loading="lazy"
                                    className="dishes-card__img"
                                  />
                                </div>
                                <span className="dishes-card__shade" aria-hidden="true" />
                                {item.tags?.[0] && (
                                  <div className="dishes-card__tags">
                                    <span className="badge">{item.tags[0]}</span>
                                  </div>
                                )}
                              </div>

                              <span className="dishes-card__num">
                                {String(itemIndex + 1).padStart(2, '0')}
                              </span>

                              <div className="dishes-card__body">
                                <div className="dishes-card__info">
                                  <h4 className="dishes-card__name">{item.name}</h4>
                                  <p className="dishes-card__desc">{item.description}</p>
                                </div>
                                <div className="dishes-card__footer">
                                  <span className="dishes-card__price">
                                    <span className="price">{formatPrice(item.price)}</span>
                                  </span>
                                  <span className="dishes-card__discover">
                                    <span className="dishes-card__discover-text">
                                      Ajouter
                                    </span>
                                    <span className="dishes-card__go" aria-hidden="true">
                                      <ArrowUpRight size={15} />
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </article>
                          </motion.article>
                        );
                      })}
                    </div>
                  </section>
                )
            )}
          </div>

          {visibleCount === 0 && (
            <div className="dishes-empty" role="status">
              <span aria-hidden="true">⌕</span>
              <h3>Aucun plat ne correspond</h3>
              <p>Essayez un autre nom ou une autre saveur.</p>
              <button
                className="btn btn--secondary btn--sm"
                onClick={() => setSearchQuery('')}
              >
                Voir toute la carte
              </button>
            </div>
          )}

          {/* CTA bas — pilule .featured__cta-wrap */}
          <div className="dishes-menu__cta-wrap">
            <a href="#commande" className="dishes-menu__cta">
              <span className="dishes-menu__cta-label">Passer commande</span>
              <span className="dishes-menu__cta-icon" aria-hidden="true">
                <ArrowUpRight size={17} />
              </span>
            </a>
            <Link to="/specialites" className="dishes-menu__order-link">
              Voir les spécialités
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          COMMANDE
          ============================================================ */}
      <section className="section section--sm dishes-commande" id="commande" aria-labelledby="commande-title">
        <span className="dishes-commande__bg-word" aria-hidden="true">Commande</span>

        <div className="container dishes-commande__container">
          <header className="dishes-commande__header">
            <div>
              <p className="category-label">
                <ClipboardList size={15} aria-hidden="true" /> Commande
              </p>
              <h2 className="dishes-commande__title" id="commande-title">
                Composez votre repas<br />
                <em className="dishes-commande__title-em">avant de le savourer.</em>
              </h2>
            </div>
          </header>

          <CheckoutForm />
        </div>
      </section>
    </main>
  );
}
