import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, CakeSlice, Flame, Leaf, Sandwich, Utensils, CupSoda } from 'lucide-react';
import { CATEGORIES, MENU_ITEMS } from '../data/menuData.js';
import { formatPrice } from '../data/restaurantConfig.js';
import ImageWithFallback from '../components/common/ImageWithFallback.jsx';
import { Link } from 'react-router-dom';
import './SpecialtiesPage.css';

const CATEGORY_ICONS = {
  mains: Utensils,
  grillades: Flame,
  sides: Leaf,
  snacks: Sandwich,
  desserts: CakeSlice,
  drinks: CupSoda,
};

const CATEGORIES_WITH_DISHES = Object.values(CATEGORIES)
  .filter(category => category.id !== 'featured')
  .map(category => ({
    ...category,
    items: MENU_ITEMS.filter(item => item.category === category.id && item.available),
  }))
  .filter(category => category.items.length > 0);

export default function SpecialtiesPage() {
  const reduceMotion = useReducedMotion();
  const leadDish = MENU_ITEMS.find(item => item.featured && item.available);

  return (
    <main className="specialties-page page-shell">
      {/* ============================================================
          HERO — éditorial + photo cinéma + index à droite
          ============================================================ */}
      <section className="specialties-hero" aria-labelledby="specialties-title">
        <div className="container specialties-hero__layout">
          <motion.div
            className="specialties-hero__editorial"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="specialties-hero__label">
              <span className="specialties-hero__label-rule" aria-hidden="true" />
              La signature de la maison
            </p>

            <h1 className="specialties-hero__title" id="specialties-title">
              <span className="specialties-hero__title-line">Des plats qui</span>
              <span className="specialties-hero__title-line specialties-hero__title-line--offset">
                <em className="specialties-hero__title-em">ont du caractère.</em>
              </span>
            </h1>

            <p className="specialties-hero__description">
              Une sélection de recettes généreuses, de grillades et de douceurs à découvrir à votre rythme.
            </p>

            <a className="specialties-hero__btn-primary" href="#specialties-list">
              <span className="specialties-hero__btn-primary-label">Parcourir les spécialités</span>
              <span className="specialties-hero__btn-primary-icon" aria-hidden="true">
                <ArrowDown size={16} />
              </span>
            </a>
          </motion.div>

          {leadDish && (
            <motion.div
              className="specialties-hero__visual"
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="specialties-hero__stage">
                <figure className="specialties-hero__figure">
                  <span className="specialties-hero__figure-line" aria-hidden="true" />
                  <div className="specialties-hero__frame">
                    <ImageWithFallback
                      src={leadDish.image}
                      alt={leadDish.name}
                      width="960"
                      height="760"
                      loading="eager"
                      className="specialties-hero__img"
                    />
                    <span className="specialties-hero__frame-overlay" aria-hidden="true" />
                    <span className="specialties-hero__frame-shine" aria-hidden="true" />

                    <div className="specialties-hero__caption">
                      <span className="specialties-hero__tag">
                        <span className="specialties-hero__tag-dot" aria-hidden="true" />
                        À la une
                      </span>
                      <p className="specialties-hero__dish-title">{leadDish.name}</p>
                      <p className="specialties-hero__dish-sub">{formatPrice(leadDish.price)}</p>
                      <a href={`#plat-${leadDish.id}`} className="specialties-hero__dish-cta">
                        Voir le plat
                        <span className="specialties-hero__dish-cta-arrow" aria-hidden="true">
                          <ArrowUpRight size={13} />
                        </span>
                      </a>
                    </div>
                  </div>
                </figure>

                <aside className="specialties-hero__index" aria-label="Catégories en bref">
                  {CATEGORIES_WITH_DISHES.slice(0, 3).map((cat, i) => (
                    <a
                      key={cat.id}
                      href={`#specialite-${cat.id}`}
                      className="specialties-hero__index-item"
                    >
                      <span className="specialties-hero__index-num">0{i + 1}</span>
                      <span className="specialties-hero__index-name">{cat.label}</span>
                      <span className="specialties-hero__index-bar" aria-hidden="true">
                        <span
                          className="specialties-hero__index-fill"
                          style={{ animationDelay: `${i * 0.4}s` }}
                        />
                      </span>
                    </a>
                  ))}
                </aside>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ---------- Navigation sticky ---------- */}
      <nav className="specialties-nav" aria-label="Explorer les spécialités par catégorie">
        <div className="container specialties-nav__inner">
          {CATEGORIES_WITH_DISHES.map(category => {
            const Icon = CATEGORY_ICONS[category.id] || Utensils;
            return (
              <a key={category.id} href={`#specialite-${category.id}`}>
                <Icon size={16} strokeWidth={1.7} />
                {category.label}
              </a>
            );
          })}
        </div>
      </nav>

      {/* ---------- Bandes de catégories ---------- */}
      <div id="specialties-list">
        {CATEGORIES_WITH_DISHES.map((category, categoryIndex) => {
          const Icon = CATEGORY_ICONS[category.id] || Utensils;
          const isFirst = categoryIndex === 0;

          return (
            <section
              className={`specialty-band${categoryIndex % 2 ? ' specialty-band--cream' : ''}`}
              id={`specialite-${category.id}`}
              key={category.id}
              aria-labelledby={`specialty-title-${category.id}`}
            >
              <span className="specialty-band__bg-word" aria-hidden="true">
                {String(categoryIndex + 1).padStart(2, '0')}
              </span>

              <div className="container specialty-band__container">
                {/* En-tête — calqué sur .featured__header */}
                <header className="specialty-band__header">
                  <div>
                    <p className="specialty-band__label">
                      <span className="specialty-band__icon"><Icon size={14} strokeWidth={1.7} /></span>
                      Sélection {String(categoryIndex + 1).padStart(2, '0')}
                    </p>
                    <h2 className="specialty-band__title" id={`specialty-title-${category.id}`}>
                      {category.label}
                    </h2>
                  </div>
                  <div className="specialty-band__side">
                    <span className="specialty-band__count">
                      <span className="specialty-band__count-dot" aria-hidden="true" />
                      {category.items.length} {category.items.length > 1 ? 'plats' : 'plat'}
                    </span>
                  </div>
                </header>

                {/* Grille bento : 1ʳᵉ carte = grande, autres = empilées à droite */}
                <div className={`specialty-grid${isFirst ? ' specialty-grid--bento' : ''}`}>
                  {category.items.map((item, itemIndex) => {
                    const isLarge = isFirst && itemIndex === 0;
                    return (
                      <motion.article
                        key={item.id}
                        id={`plat-${item.id}`}
                        className={`specialty__item${isLarge ? ' specialty__item--large' : ''}`}
                        initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.12 }}
                        transition={{
                          duration: 0.55,
                          delay: Math.min(itemIndex * 0.07, 0.21),
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <article className={`specialty-card${isLarge ? ' specialty-card--large' : ''}`}>
                          <div className="specialty-card__img-wrap">
                            <div className="specialty-card__media">
                              <ImageWithFallback
                                src={item.image}
                                alt={item.name}
                                width="640"
                                height="440"
                                loading="lazy"
                                className="specialty-card__img"
                              />
                            </div>
                            <span className="specialty-card__shade" aria-hidden="true" />
                            {item.tags?.[0] && (
                              <div className="specialty-card__tags">
                                <span className="badge">{item.tags[0]}</span>
                              </div>
                            )}
                          </div>

                          <span className="specialty-card__num">
                            {String(itemIndex + 1).padStart(2, '0')}
                          </span>

                          <div className="specialty-card__body">
                            <div className="specialty-card__info">
                              <h3 className="specialty-card__name">{item.name}</h3>
                              <p className="specialty-card__desc">{item.description}</p>
                            </div>
                            <div className="specialty-card__footer">
                              <span className="specialty-card__price">
                                <span className="price">{formatPrice(item.price)}</span>
                              </span>
                              <span className="specialty-card__discover">
                                <span className="specialty-card__discover-text">Découvrir</span>
                                <span className="specialty-card__go" aria-hidden="true">
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
              </div>
            </section>
          );
        })}
      </div>

      {/* ---------- CTA bas — pilule calquée sur .featured__cta-wrap ---------- */}
      <section className="specialties-order" aria-labelledby="specialties-order-title">
        <div className="container specialties-order__inner">
          <div>
            <p className="editorial-kicker">Envie de passer à table ?</p>
            <h2 id="specialties-order-title">
              Retrouvez la carte<br /><em>et composez votre repas.</em>
            </h2>
          </div>
          <div className="specialties-order__cta-wrap">
            <Link className="specialties-order__cta" to="/menu">
              <span className="specialties-order__cta-label">Voir la carte</span>
              <span className="specialties-order__cta-icon" aria-hidden="true">
                <ArrowUpRight size={17} />
              </span>
            </Link>
            <Link className="specialties-order__order-link" to="/menu#commande">
              Composer une commande
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
