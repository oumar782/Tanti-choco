import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Flame, HandHeart, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import './RestaurantStory.css';

const VALUES = [
  {
    Icon: Sprout,
    id: '01',
    title: 'Authenticité',
    text: 'Des saveurs franches, inspirées par les cuisines que l’on aime partager.',
  },
  {
    Icon: HandHeart,
    id: '02',
    title: 'Générosité',
    text: 'Des assiettes pensées pour laisser une vraie place au plaisir.',
  },
  {
    Icon: Flame,
    id: '03',
    title: 'Soin du geste',
    text: 'Une attention portée aux détails, de la préparation à la présentation.',
  },
];

export default function RestaurantStory() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="story section" id="nos-valeurs" aria-labelledby="story-title">
      <span className="story__bg-word" aria-hidden="true">Valeurs</span>

      <div className="container story__container">
        {/* En-tête aligné sur .featured__heading */}
        <div className="story__heading">
          <div>
            <p className="category-label">Ce qui nous rassemble</p>
            <h2 className="story__title" id="story-title">
              Nos valeurs,<br /><em>dans chaque assiette.</em>
            </h2>
          </div>
          <Link to="/about" className="story__about-link">
            L’esprit de la maison <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Grille bento */}
        <div className="story__grid">
          {VALUES.map(({ Icon, ...value }, index) => (
            <motion.article
              key={value.title}
              className="story__item"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className="story-card">
                <span className="story-card__index">{value.id}</span>

                <div className="story-card__icon-wrap">
                  <Icon size={23} strokeWidth={1.5} className="story-card__icon" aria-hidden="true" />
                </div>

                <div className="story-card__body">
                  <div className="story-card__info">
                    <h3 className="story-card__name">{value.title}</h3>
                    <p className="story-card__desc">{value.text}</p>
                  </div>

                  <div className="story-card__footer">
                    <Link to="/about" className="story-card__link">
                      En savoir plus <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA bas aligné sur .featured__cta-row */}
        <div className="story__cta-row">
          <Link to="/about" className="story__cta-link">
            Découvrir notre histoire <ArrowUpRight size={17} />
          </Link>
          <Link to="/menu#commande" className="story__cta-link">
            Composer une commande <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
