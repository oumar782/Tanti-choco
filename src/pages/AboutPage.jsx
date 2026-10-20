import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, HeartHandshake, Leaf, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import RESTAURANT_CONFIG from '../data/restaurantConfig.js';
import ImageWithFallback from '../components/common/ImageWithFallback.jsx';
import './AboutPage.css';

const ABOUT_IMAGE = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85&auto=format&fit=crop';

const PRINCIPLES = [
  { Icon: Leaf, id: '01', title: 'Le goût juste', text: 'Des recettes généreuses, pensées autour du plaisir de bien manger.', large: true },
  { Icon: HeartHandshake, id: '02', title: 'Le sens du partage', text: 'Une table accueillante où chaque assiette invite à se retrouver.' },
  { Icon: Sparkles, id: '03', title: 'Le soin du détail', text: 'Une attention portée aux saveurs comme à l’expérience autour de la table.' },
];

export default function AboutPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="about-page page-shell">
      {/* ---------- HERO ---------- */}
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero__image" aria-hidden="true" />
        <div className="about-hero__ornament" aria-hidden="true">T</div>
        <div className="container about-hero__inner">
          <motion.div
            className="about-hero__content"
            initial={reduceMotion ? false : 'hidden'}
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.16, delayChildren: 0.12 } },
            }}
          >
            <motion.p
              className="editorial-kicker"
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            ><span /> À propos de la maison</motion.p>
            <motion.h1
              id="about-title"
              variants={{ hidden: { opacity: 0, y: 28, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            >Une cuisine généreuse.<br /><em>Un esprit de partage.</em></motion.h1>
            <motion.p
              className="about-hero__description"
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >{RESTAURANT_CONFIG.description}</motion.p>
            <motion.div
              className="about-hero__actions"
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/specialites" className="about-hero__button">
                Découvrir la maison <ArrowUpRight size={17} />
              </Link>
              <span className="about-hero__location">Bamako <i /> Mali</span>
            </motion.div>
          </motion.div>
          <motion.div
            className="about-hero__seal"
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.75, rotate: -18 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>Le goût du partage</span><b>✦</b><span>Depuis Bamako</span>
          </motion.div>
        </div>
        <div className="about-hero__bottom-line" aria-hidden="true"><span /> Une maison, mille façons de se retrouver</div>
      </section>

      {/* ---------- STORY : bento image + texte ---------- */}
      <section className="about-story section" aria-labelledby="about-story-title">
        <span className="about-story__bg-word" aria-hidden="true">Maison</span>
        <div className="container about-story__container">
          <div className="about-story__layout">
            <motion.figure
              className="about-story__visual"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65 }}
            >
              <ImageWithFallback
                src={ABOUT_IMAGE}
                alt="Une table dressée dans une atmosphère chaleureuse"
                width="1000"
                height="1200"
                loading="lazy"
              />
              <figcaption><span>Chez Tanti Choco</span><span>Bamako, Mali</span></figcaption>
            </motion.figure>

            <motion.div
              className="about-story__copy"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              <p className="editorial-kicker"><span /> Notre intention</p>
              <h2 id="about-story-title">Faire de chaque repas<br /><em>un moment à soi.</em></h2>
              <p>
                Chez Tanti Choco, nous aimons les repas qui prennent leur temps : une assiette généreuse,
                des saveurs franches et le plaisir de se retrouver autour de la table.
              </p>
              <p>
                La maison réunit une cuisine conviviale et une attention sincère à l’accueil. Une vision
                simple, portée par le goût et le partage.
              </p>
              <Link to="/specialites" className="about-story__link">
                Découvrir la cuisine de la maison <ArrowUpRight size={17} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- PRINCIPES : grille bento façon FeaturedDishes ---------- */}
      <section className="about-principles section" aria-labelledby="principles-title">
        <span className="about-principles__bg-word" aria-hidden="true">Repères</span>
        <div className="container about-principles__container">
          <header className="about-principles__header">
            <div>
              <p className="category-label">Nos repères</p>
              <h2 className="about-principles__title" id="principles-title">
                L’essentiel,<br />
                <em className="about-principles__title-em">bien fait.</em>
              </h2>
            </div>
            <div className="about-principles__side">
              <p className="about-principles__intro">
                Trois convictions simples qui guident chaque assiette, du marché à la table.
              </p>
              <span className="about-principles__count">
                <span className="about-principles__count-dot" aria-hidden="true" />
                3 repères
              </span>
            </div>
          </header>

          <div className="about-principles__grid">
            {PRINCIPLES.map(({ Icon, ...principle }, index) => (
              <motion.article
                key={principle.title}
                className={`about-principles__item${principle.large ? ' about-principles__item--large' : ''}`}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <article className={`principle-card${principle.large ? ' principle-card--large' : ''}`}>
                  <div className="principle-card__img-wrap">
                    <div className="principle-card__icon-media" aria-hidden="true">
                      <Icon size={64} strokeWidth={1.2} className="principle-card__icon-hero" />
                    </div>
                    <span className="principle-card__shade" aria-hidden="true" />
                    <div className="principle-card__tags">
                      <span className="badge">Principe</span>
                    </div>
                  </div>

                  <span className="principle-card__num">{principle.id}</span>

                  <div className="principle-card__body">
                    <div className="principle-card__info">
                      <h3 className="principle-card__name">{principle.title}</h3>
                      <p className="principle-card__desc">{principle.text}</p>
                    </div>
                    <div className="principle-card__footer">
                      <Link to="/specialites" className="principle-card__discover">
                        <span className="principle-card__discover-text">En savoir plus</span>
                        <span className="principle-card__go" aria-hidden="true">
                          <ArrowUpRight size={15} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              </motion.article>
            ))}
          </div>

          {/* CTA bas : même pilule que .featured__cta-wrap */}
          <div className="about-principles__cta-wrap">
            <Link to="/specialites" className="about-principles__cta">
              <span className="about-principles__cta-label">Voir nos spécialités</span>
              <span className="about-principles__cta-icon" aria-hidden="true">
                <ArrowUpRight size={17} />
              </span>
            </Link>
            <Link to="/menu#commande" className="about-principles__order-link">
              Composer une commande
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- ENDCAP ---------- */}
      <section className="about-endcap">
        <div className="container about-endcap__inner">
          <div>
            <p className="editorial-kicker"><span /> La table est ouverte</p>
            <h2>On se retrouve<br /><em>autour d’une assiette ?</em></h2>
          </div>
          <Link to="/menu" className="btn btn--primary btn--lg">
            Voir nos plats <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
