import React, { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { getFeaturedItems } from '../../data/menuData.js';
import { formatPrice } from '../../data/restaurantConfig.js';
import ImageWithFallback from '../common/ImageWithFallback.jsx';
import './FeaturedDishes.css';

const EASE = [0.22, 1, 0.36, 1];

/* Mots qui montent un à un depuis un masque */
function RevealWords({ text, delay = 0, reduceMotion }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} className="featured__word" aria-hidden="true">
          <motion.span
            className="featured__word-inner"
            initial={reduceMotion ? false : { y: '115%', rotate: 4 }}
            whileInView={{ y: '0%', rotate: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1, delay: delay + i * 0.08, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  );
}

/* Halo qui suit la souris sur la carte */
function trackPointer(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}

export default function FeaturedDishes() {
  const items = getFeaturedItems().slice(0, 3);
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const wordX = useTransform(scrollYProgress, [0, 1], ['6%', '-12%']);

  return (
    <section
      ref={sectionRef}
      className="featured section"
      id="menu-du-jour"
      aria-labelledby="featured-title"
    >
      <motion.span
        className="featured__bg-word"
        aria-hidden="true"
        style={reduceMotion ? undefined : { x: wordX }}
      >
        Gourmand
      </motion.span>

      <div className="container featured__container">
        <div className="featured__header">
          <div>
            <motion.p
              className="category-label"
              initial={reduceMotion ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              La sélection de la maison
            </motion.p>

            <h2
              className="featured__title"
              id="featured-title"
              aria-label="Le menu du jour, à savourer."
            >
              <span className="featured__title-line">
                <RevealWords text="Le menu du jour," reduceMotion={reduceMotion} />
              </span>
              <span className="featured__title-line">
                <em className="featured__title-em">
                  <RevealWords text="à savourer." delay={0.25} reduceMotion={reduceMotion} />
                  <svg
                    className="featured__title-underline"
                    viewBox="0 0 300 20"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M2 14 C 60 3, 120 3, 180 10 S 270 17, 298 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={reduceMotion ? false : { pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
                    />
                  </svg>
                </em>
              </span>
            </h2>
          </div>

          <motion.div
            className="featured__side"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          >
            <p className="featured__intro">
              Quelques assiettes choisies pour leur générosité, leurs parfums et le plaisir simple de les partager.
            </p>
            {items.length > 0 && (
              <span className="featured__count">
                <span className="featured__count-dot" />
                {String(items.length).padStart(2, '0')} plats à l’honneur
              </span>
            )}
          </motion.div>
        </div>

        <div className={`featured__grid featured__grid--${items.length}`}>
          {items.map((item, index) => {
            const isLarge = index === 0;
            return (
              <motion.div
                key={item.id}
                className={`featured__item${isLarge ? ' featured__item--large' : ''}`}
                initial={reduceMotion ? false : { opacity: 0, y: 64 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 1.05, delay: index * 0.12, ease: EASE }}
              >
                <Link
                  to={`/specialites#plat-${item.id}`}
                  className={`featured-card${isLarge ? ' featured-card--large' : ''}`}
                  aria-label={`Découvrir ${item.name} dans nos spécialités`}
                  onMouseMove={trackPointer}
                >
                  <div className="featured-card__img-wrap">
                    <motion.div
                      className="featured-card__media"
                      initial={reduceMotion ? false : { scale: 1.2 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 1.8, delay: index * 0.12, ease: EASE }}
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="featured-card__img"
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                        width={isLarge ? '900' : '600'}
                        height={isLarge ? '1000' : '400'}
                      />
                    </motion.div>
                    <span className="featured-card__shade" aria-hidden="true" />

                    {item.tags?.length > 0 && (
                      <div className="featured-card__tags" aria-hidden="true">
                        {item.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="badge badge--orange">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="featured-card__num" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="featured-card__body">
                    <div className="featured-card__info">
                      <h3 className="featured-card__name">{item.name}</h3>
                      <p className="featured-card__desc">{item.description}</p>
                    </div>
                    <div className="featured-card__footer">
                      <span className="featured-card__price">
                        <span className="price">{formatPrice(item.price)}</span>
                      </span>
                      <span className="featured-card__discover">
                        <span className="featured-card__discover-text">Découvrir</span>
                        <span className="featured-card__go" aria-hidden="true">
                          <ArrowUpRight size={17} strokeWidth={1.9} />
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="featured__cta-wrap"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <Link to="/specialites" className="featured__cta">
            <span className="featured__cta-label">Explorer toutes nos spécialités</span>
            <span className="featured__cta-icon" aria-hidden="true">
              <ArrowUpRight size={17} strokeWidth={2} />
            </span>
          </Link>
          <Link to="/menu" className="featured__order-link">
            Commander un plat
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
