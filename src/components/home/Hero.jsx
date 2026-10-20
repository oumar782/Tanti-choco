import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  ArrowDown,
  ArrowUpRight,
  UtensilsCrossed,
  Star,
  Pause,
  Play,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MENU_ITEMS } from '../../data/menuData.js';
import './Hero.css';

const EASE = [0.22, 1, 0.36, 1];
const SLIDE_MS = 6500;

function heroSrcSet(src) {
  try {
    const url = new URL(src);
    if (url.hostname !== 'images.unsplash.com') return undefined;
    return [640, 960, 1200, 1600].map((width) => {
      const candidate = new URL(url);
      candidate.searchParams.set('w', String(width));
      candidate.searchParams.set('auto', 'format');
      return `${candidate.href} ${width}w`;
    }).join(', ');
  } catch {
    return undefined;
  }
}

/* ---------- Plats mis en scène ----------
   Chaque plat pilote la grande photo. Remplace les `image` par TES photos
   (ex: '/images/plats/poulet-braise.jpg', format portrait 4/5 idéal). */
const AVAILABLE_ITEMS = MENU_ITEMS.filter(item => item.available);
const DISHES = AVAILABLE_ITEMS
  .filter(item => item.featured)
  .map((item, index) => ({
    id: String(index + 1).padStart(2, '0'),
    title: item.name,
    subtitle: item.description,
    tag: item.tags?.[0] || 'À découvrir',
    image: item.image
      .replace(/([?&])w=\d+/, '$1w=1600')
      .replace(/([?&])q=\d+/, '$1q=88'),
    href: `/specialites#plat-${item.id}`,
  }));
const CATEGORY_COUNT = new Set(AVAILABLE_ITEMS.map(item => item.category)).size;

const TICKER = [
  'Poulet braisé',
  'Tô sauce gombo',
  'Brochettes',
  'Salade Tanti',
  'Riz au gras',
  'Sauce arachide',
  'Poisson grillé',
  'Dégué',
];

/* ---------- SplitTitle ---------- */

function SplitTitle({ text, className, delay = 0, reduceMotion }) {
  return (
    <span className={className} aria-hidden="true">
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="hero__word">
          {word.split('').map((char, ci) => (
            <motion.span
              key={ci}
              className="hero__char"
              initial={reduceMotion ? false : { y: '115%', rotate: 5, opacity: 0 }}
              animate={{ y: '0%', rotate: 0, opacity: 1 }}
              transition={{
                duration: 1,
                delay: delay + wi * 0.08 + ci * 0.035,
                ease: EASE,
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}

/* ---------- Compteur animé ---------- */

function Counter({ to, decimals = 0, prefix = '', delay = 0, reduceMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(reduceMotion ? to : 0);

  useEffect(() => {
    if (reduceMotion) {
      setValue(to);
      return undefined;
    }
    if (!inView) return undefined;
    const controls = animate(0, to, {
      duration: 2.2,
      delay,
      ease: EASE,
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, delay, reduceMotion]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toFixed(decimals)}
    </span>
  );
}

/* ---------- Effet magnétique ---------- */

function Magnetic({ children, strength = 0.3, reduceMotion }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e) => {
    if (reduceMotion || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Bandeau typographique ---------- */

function HeroTicker() {
  return (
    <div className="hticker" aria-hidden="true">
      <div className="hticker__track">
        {[0, 1].map((set) => (
          <div className="hticker__set" key={set}>
            {TICKER.map((name) => (
              <React.Fragment key={`${set}-${name}`}>
                <span className="hticker__item">{name}</span>
                <span className="hticker__sep">✦</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- HERO PRINCIPAL ---------- */

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  const intro = reduceMotion ? 0 : 0.6;
  const t = (x) => x + intro;

  /* Plat actif */
  const [active, setActive] = useState(0);
  const [hoverPause, setHoverPause] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [failed, setFailed] = useState(() => new Set());
  const paused = hoverPause || manualPause;
  const dish = DISHES[active];

  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, []);

  useEffect(() => {
    DISHES.forEach((d) => {
      const img = new Image();
      img.src = d.image;
    });
  }, []);

  useEffect(() => {
    if (reduceMotion || paused) return undefined;
    const id = setTimeout(
      () => setActive((a) => (a + 1) % DISHES.length),
      SLIDE_MS
    );
    return () => clearTimeout(id);
  }, [active, paused, reduceMotion]);

  /* Parallaxe au scroll */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const figureY = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%']);

  /* Souris : léger tilt, parallaxe de l'image, halo */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 90, damping: 18, mass: 0.6 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-2.5, 2.5]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [2, -2]);
  const imgX = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const imgY = useTransform(sy, [-0.5, 0.5], [-12, 12]);
  const px = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const py = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const spotlight = useMotionTemplate`radial-gradient(620px circle at ${px}% ${py}%, rgba(217,119,54,0.13), transparent 62%)`;

  const handleMouseMove = (e) => {
    if (reduceMotion) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  /* Légende : apparition en cascade */
  const capParent = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.09,
        delayChildren: firstRender.current ? t(1.5) : 0.3,
      },
    },
    exit: { opacity: 0, y: -14, transition: { duration: 0.35 } },
  };
  const capChild = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
  };

  return (
    <section
      ref={sectionRef}
      className="hero"
      id="accueil"
      aria-label="Bienvenue chez Tanti Choco"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Rideau d'intro */}
      {!reduceMotion && (
        <motion.div
          className="hero__curtain"
          aria-hidden="true"
          initial={{ y: '0%' }}
          animate={{ y: '-101%' }}
          transition={{ duration: 1.1, delay: 0.55, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="hero__curtain-word"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: [0, 1, 1, 0], y: [24, 0, 0, -12] }}
            transition={{ duration: 1.2, times: [0, 0.3, 0.75, 1], ease: 'easeOut' }}
          >
            Tanti Choco
          </motion.span>
        </motion.div>
      )}

      <div className="hero__bg" aria-hidden="true">
        <span className="hero__bg-orbit hero__bg-orbit--1" />
        <span className="hero__bg-orbit hero__bg-orbit--2" />
        <span className="hero__bg-blob hero__bg-blob--1" />
        <span className="hero__bg-blob hero__bg-blob--2" />
        <span className="hero__bg-grain" />
      </div>
      <motion.span
        className="hero__spotlight"
        aria-hidden="true"
        style={reduceMotion ? undefined : { background: spotlight }}
      />

      <motion.div
        className="hero__topline container"
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: t(0.15), ease: EASE }}
      >
        <span className="hero__topline-left">
          <span className="hero__dot" />
          Une cuisine généreuse
        </span>
        <span className="hero__topline-center">
          <Star size={11} strokeWidth={1.5} />
          Le goût du partage
        </span>
        <span className="hero__topline-right">
          Bamako · Mali
          <span className="hero__topline-line" />
        </span>
      </motion.div>

      <div className="hero__layout container">
        {/* ---------- Colonne éditoriale ---------- */}
        <motion.div
          className="hero__editorial"
          style={reduceMotion ? undefined : { y: textY }}
        >
          <motion.div
            className="hero__label"
            initial={reduceMotion ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: t(0.3), ease: EASE }}
          >
            <UtensilsCrossed size={13} strokeWidth={1.75} />
            <span>Bienvenue chez Tanti Choco</span>
            <span className="hero__label-rule" />
          </motion.div>

          <h1 className="hero__title">
            <span
              style={{
                position: 'absolute',
                width: 1,
                height: 1,
                overflow: 'hidden',
                clip: 'rect(0 0 0 0)',
              }}
            >
              Le goût de se retrouver.
            </span>
            <span className="hero__title-line">
              <SplitTitle text="Le goût" delay={t(0.4)} reduceMotion={reduceMotion} />
            </span>
            <span className="hero__title-line hero__title-line--offset">
              <SplitTitle text="de se" delay={t(0.55)} reduceMotion={reduceMotion} />
            </span>
            <span className="hero__title-line">
              <motion.em
                className="hero__title-em"
                aria-hidden="true"
                initial={reduceMotion ? false : { opacity: 0, y: 36, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.1, delay: t(0.8), ease: EASE }}
              >
                retrouver.
                <svg
                  className="hero__title-underline"
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
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: t(1.5), ease: EASE }}
                  />
                </svg>
              </motion.em>
            </span>
          </h1>

          <motion.p
            className="hero__description"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: t(0.95), ease: EASE }}
          >
            Des saveurs généreuses, une table accueillante et le plaisir simple
            de partager un bon repas — pensé comme un retour à la maison.
          </motion.p>

          <motion.div
            className="hero__ctas"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: t(1.1), ease: EASE }}
          >
            <Magnetic reduceMotion={reduceMotion}>
              <Link to="/menu" className="hero__btn-primary">
                <span className="hero__btn-primary-label">Commander</span>
                <span className="hero__btn-primary-icon">
                  <ArrowUpRight size={16} strokeWidth={2} />
                </span>
              </Link>
            </Magnetic>
            <Link to="/specialites" className="hero__text-link">
              <span>Découvrir la carte</span>
              <span className="hero__text-link-arrow" aria-hidden="true">
                <ArrowUpRight size={14} strokeWidth={1.75} />
              </span>
            </Link>
          </motion.div>

          <motion.div
            className="hero__meta"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: t(1.35), ease: EASE }}
          >
            <div className="hero__meta-item">
              <span className="hero__meta-number">
                <Counter to={AVAILABLE_ITEMS.length} delay={t(1.4)} reduceMotion={reduceMotion} />
              </span>
              <span className="hero__meta-label">Plats à découvrir</span>
            </div>
            <span className="hero__meta-divider" />
            <div className="hero__meta-item">
              <span className="hero__meta-number">
                <Counter to={DISHES.length} delay={t(1.5)} reduceMotion={reduceMotion} />
              </span>
              <span className="hero__meta-label">Plats en sélection</span>
            </div>
            <span className="hero__meta-divider" />
            <div className="hero__meta-item">
              <span className="hero__meta-number">
                <Counter to={CATEGORY_COUNT} delay={t(1.6)} reduceMotion={reduceMotion} />
              </span>
              <span className="hero__meta-label">Catégories</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ---------- Colonne visuelle ---------- */}
        <div className="hero__visual">
          <div
            className={`hero__stage ${paused ? 'is-paused' : ''}`}
            onMouseEnter={() => setHoverPause(true)}
            onMouseLeave={() => setHoverPause(false)}
          >
            <motion.div
              className="hero__figure"
              style={
                reduceMotion
                  ? undefined
                  : { y: figureY, rotateX, rotateY, transformPerspective: 1500 }
              }
            >
              <motion.span
                className="hero__figure-line"
                aria-hidden="true"
                initial={reduceMotion ? false : { opacity: 0, x: -18, y: -18 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1.3, delay: t(0.9), ease: EASE }}
              />

              <motion.div
                className="hero__frame"
                initial={reduceMotion ? false : { clipPath: 'inset(100% 0 0 0)' }}
                animate={{ clipPath: 'inset(0% 0 0 0)' }}
                transition={{ duration: 1.5, delay: t(0.2), ease: EASE }}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={dish.id}
                    className="hero__slide"
                    initial={reduceMotion ? false : { clipPath: 'inset(100% 0 0 0)' }}
                    animate={{ clipPath: 'inset(0% 0 0 0)' }}
                    exit={{ opacity: 1, transition: { duration: 1.4 } }}
                    transition={{ duration: 1.3, ease: EASE }}
                  >
                    {!failed.has(dish.image) && (
                      <motion.img
                        className="hero__img"
                        src={dish.image}
                        srcSet={heroSrcSet(dish.image)}
                        sizes="(max-width: 960px) 100vw, 45vw"
                        alt={`${dish.title} — ${dish.subtitle}`}
                        width="1200"
                        height="1500"
                        fetchPriority={active === 0 ? 'high' : undefined}
                        loading={active === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        draggable="false"
                        style={reduceMotion ? undefined : { x: imgX, y: imgY }}
                        initial={reduceMotion ? false : { scale: 1.28 }}
                        animate={{ scale: reduceMotion ? 1.04 : 1.07 }}
                        transition={{ duration: 7.5, ease: [0.25, 0.1, 0.25, 1] }}
                        onError={() =>
                          setFailed((f) => new Set(f).add(dish.image))
                        }
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="hero__frame-overlay" aria-hidden="true" />
                <span className="hero__frame-shine" aria-hidden="true" />

                <div className="hero__counter" aria-hidden="true">
                  <span className="hero__counter-current">
                    {String(active + 1).padStart(2, '0')}
                  </span>
                  <span className="hero__counter-sep" />
                  <span className="hero__counter-total">
                    {String(DISHES.length).padStart(2, '0')}
                  </span>
                </div>

                <button
                  type="button"
                  className="hero__pause"
                  aria-label={manualPause ? 'Reprendre le défilement' : 'Mettre en pause'}
                  onClick={() => setManualPause((p) => !p)}
                >
                  <svg className="hero__pause-ring" viewBox="0 0 40 40" aria-hidden="true">
                    <circle className="hero__pause-ring-track" cx="20" cy="20" r="18" />
                    <circle
                      key={`ring-${active}`}
                      className="hero__pause-ring-fill"
                      cx="20"
                      cy="20"
                      r="18"
                    />
                  </svg>
                  {manualPause ? (
                    <Play size={12} strokeWidth={1.75} />
                  ) : (
                    <Pause size={12} strokeWidth={1.75} />
                  )}
                </button>

                <div className="hero__caption" aria-live="polite">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={dish.id}
                      variants={capParent}
                      initial={reduceMotion ? false : 'hidden'}
                      animate="show"
                      exit={reduceMotion ? undefined : 'exit'}
                    >
                      <motion.span className="hero__tag" variants={capChild}>
                        <span className="hero__tag-dot" />
                        {dish.tag}
                      </motion.span>
                      <motion.h2 className="hero__dish-title" variants={capChild}>
                        {dish.title}
                      </motion.h2>
                      <motion.p className="hero__dish-sub" variants={capChild}>
                        {dish.subtitle}
                      </motion.p>
                      <motion.div variants={capChild}>
                        <Link to={dish.href} className="hero__dish-cta">
                          Voir le plat
                          <span className="hero__dish-cta-arrow">
                            <ArrowUpRight size={14} strokeWidth={1.75} />
                          </span>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

            {/* Index des plats */}
            <nav className="hero__index" aria-label="Plats signatures">
              {DISHES.map((d, i) => {
                const on = i === active;
                return (
                  <motion.button
                    key={d.id}
                    type="button"
                    className={`hero__index-item ${on ? 'is-active' : ''}`}
                    aria-current={on ? 'true' : undefined}
                    onClick={() => setActive(i)}
                    initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: t(1.2 + i * 0.1), ease: EASE }}
                  >
                    <span className="hero__index-num">{d.id}</span>
                    <span className="hero__index-name">{d.title}</span>
                    <span className="hero__index-bar" aria-hidden="true">
                      <span
                        key={on ? `on-${active}` : 'off'}
                        className="hero__index-fill"
                      />
                    </span>
                  </motion.button>
                );
              })}
            </nav>

            <motion.div
              className="hero__stamp"
              aria-hidden="true"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.5, rotate: -40 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.1, delay: t(1.3), ease: EASE }}
            >
              <svg className="hero__stamp-svg" viewBox="0 0 120 120">
                <defs>
                  <path
                    id="hero-stamp-circle"
                    d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                  />
                </defs>
                <g className="hero__stamp-rotor">
                  <text className="hero__stamp-text">
                    <textPath href="#hero-stamp-circle" startOffset="0%">
                      Fait avec générosité · Tanti Choco ·
                    </textPath>
                  </text>
                </g>
              </svg>
              <span className="hero__stamp-center">
                <UtensilsCrossed size={20} strokeWidth={1.25} />
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: t(1.6), ease: EASE }}
      >
        <HeroTicker />
      </motion.div>

      <motion.div
        className="hero__footer container"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: t(1.7), ease: EASE }}
      >
        <a
          href="#menu-du-jour"
          className="hero__scroll"
          aria-label="Découvrir le menu du jour"
        >
          <span className="hero__scroll-circle">
            <ArrowDown size={15} strokeWidth={1.75} />
          </span>
          <span className="hero__scroll-text">Défiler pour découvrir</span>
        </a>

        <span className="hero__signature">
          <span className="hero__signature-rule" />
          La générosité, à chaque assiette.
        </span>
      </motion.div>
    </section>
  );
}
