import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Clock3,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import RESTAURANT_CONFIG, { formatOpeningHours } from '../data/restaurantConfig.js';
import './ContactPage.css';

const CONTACT_INFO = (cfg, address) => [
  {
    Icon: MapPin,
    label: 'Adresse',
    value: address || 'Adresse à confirmer',
    extra: cfg.address.country,
  },
  {
    Icon: Phone,
    label: 'Téléphone',
    value: cfg.contact.phone,
    href: cfg.contact.phone ? `tel:${cfg.contact.phone}` : undefined,
    fallback: 'Numéro à confirmer',
  },
  {
    Icon: Clock3,
    label: 'Horaires',
    value: formatOpeningHours(cfg.hours),
    extra: cfg.hours.note,
  },
  {
    Icon: Mail,
    label: 'E-mail',
    value: cfg.contact.email,
    href: cfg.contact.email ? `mailto:${cfg.contact.email}` : undefined,
    hidden: !cfg.contact.email,
  },
];

export default function ContactPage() {
  const cfg = RESTAURANT_CONFIG;
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState('');
  const address = [cfg.address.street, cfg.address.neighborhood, cfg.address.city]
    .filter(Boolean)
    .join(', ');
  const infoList = CONTACT_INFO(cfg, address).filter(item => !item.hidden);

  const handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const subject = formData.get('subject');
    const message = formData.get('message');

    if (!cfg.contact.email) {
      setStatus(
        'Votre message est prêt. L’envoi sera activé dès que l’adresse e-mail du restaurant sera renseignée.'
      );
      return;
    }

    const mailSubject = encodeURIComponent(`${subject} — Chez Tanti Choco`);
    const mailBody = encodeURIComponent(
      `Nom : ${name}\nE-mail : ${email}\nTéléphone : ${phone || 'Non renseigné'}\n\n${message}`
    );
    window.location.href = `mailto:${cfg.contact.email}?subject=${mailSubject}&body=${mailBody}`;
    setStatus('Votre application de messagerie va s’ouvrir avec votre demande.');
  };

  return (
    <main className="contact-page page-shell">
      {/* ============================================================
          HERO — éditorial + carte d'infos vitrée
          ============================================================ */}
      <section className="contact-hero" aria-labelledby="contact-title">
        <div className="contact-hero__bg" aria-hidden="true">
          <span className="contact-hero__bg-orbit contact-hero__bg-orbit--1" />
          <span className="contact-hero__bg-orbit contact-hero__bg-orbit--2" />
          <span className="contact-hero__bg-blob contact-hero__bg-blob--1" />
          <span className="contact-hero__bg-blob contact-hero__bg-blob--2" />
          <span className="contact-hero__bg-grain" />
        </div>

        <div className="contact-hero__topline">
          <span className="contact-hero__topline-left">
            <span className="contact-hero__dot" aria-hidden="true" />
            Contact direct
          </span>
          <span className="contact-hero__topline-center">
            <span className="contact-hero__topline-line" aria-hidden="true" />
            Contact & informations
            <span className="contact-hero__topline-line" aria-hidden="true" />
          </span>
          <span className="contact-hero__topline-right">Bamako · Mali</span>
        </div>

        <div className="container contact-hero__layout">
          <motion.div
            className="contact-hero__editorial"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="contact-hero__label">
              <span className="contact-hero__label-rule" aria-hidden="true" />
              Contact & informations
            </p>

            <h1 className="contact-hero__title" id="contact-title">
              <span className="contact-hero__title-line">On se</span>
              <span className="contact-hero__title-line contact-hero__title-line--offset">
                <em className="contact-hero__title-em">parle ?</em>
              </span>
            </h1>

            <p className="contact-hero__description">
              Une question, une réservation ou un renseignement sur la carte ? Écrivez-nous,
              nous serons heureux de vous lire.
            </p>

            <div className="contact-hero__ctas">
              <a className="contact-hero__btn-primary" href="#contact-form">
                <span className="contact-hero__btn-primary-label">Écrire un message</span>
                <span className="contact-hero__btn-primary-icon" aria-hidden="true">
                  <Send size={15} />
                </span>
              </a>
              {cfg.contact.phone && (
                <a className="contact-hero__text-link" href={`tel:${cfg.contact.phone}`}>
                  Nous appeler
                  <span className="contact-hero__text-link-arrow" aria-hidden="true">
                    <Phone size={13} />
                  </span>
                </a>
              )}
            </div>

            {/* Carte vitrée des infos — .hero__meta */}
            <div className="contact-hero__meta">
              <div className="contact-hero__meta-item">
                <span className="contact-hero__meta-number">{cfg.address.city}</span>
                <span className="contact-hero__meta-label">Nous trouver</span>
              </div>
              <span className="contact-hero__meta-divider" aria-hidden="true" />
              <div className="contact-hero__meta-item">
                <span className="contact-hero__meta-number">Contact</span>
                <span className="contact-hero__meta-label">Nous écrire</span>
              </div>
              <span className="contact-hero__meta-divider" aria-hidden="true" />
              <div className="contact-hero__meta-item">
                <span className="contact-hero__meta-label">
                  <span className="contact-hero__stars" aria-hidden="true">★★★★★</span>
                  Accueil chaleureux
                </span>
              </div>
            </div>
          </motion.div>

          {/* Carte visuelle — photo cinéma avec filet passe-partout */}
          <motion.div
            className="contact-hero__visual"
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="contact-hero__stage">
              <figure className="contact-hero__figure">
                <span className="contact-hero__figure-line" aria-hidden="true" />
                <div className="contact-hero__frame">
                  <div className="contact-hero__frame-content" aria-hidden="true">
                    <MapPin size={72} strokeWidth={1} className="contact-hero__frame-icon" />
                  </div>
                  <span className="contact-hero__frame-overlay" aria-hidden="true" />
                  <span className="contact-hero__frame-shine" aria-hidden="true" />

                  <div className="contact-hero__caption">
                    <span className="contact-hero__tag">
                      <span className="contact-hero__tag-dot" aria-hidden="true" />
                      Nous trouver
                    </span>
                    <p className="contact-hero__dish-title">
                      À votre écoute,<br />
                      <em>à Bamako.</em>
                    </p>
                    <p className="contact-hero__dish-sub">{address || 'Bamako, Mali'}</p>
                    <a
                      href={
                        cfg.address.googleMapsUrl ||
                        'https://www.openstreetmap.org/?mlat=12.6392&mlon=-8.0029#map=13/12.6392/-8.0029'
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="contact-hero__dish-cta"
                    >
                      Ouvrir la carte
                      <span className="contact-hero__dish-cta-arrow" aria-hidden="true">
                        <ArrowUpRight size={13} />
                      </span>
                    </a>
                  </div>
                </div>
              </figure>

              {/* Index latéral — coordonnées rapides */}
              <aside className="contact-hero__index" aria-label="Coordonnées rapides">
                {infoList.slice(0, 3).map((item, i) => (
                  <div className="contact-hero__index-item" key={item.label}>
                    <span className="contact-hero__index-num">0{i + 1}</span>
                    <span className="contact-hero__index-name">
                      <item.Icon size={14} aria-hidden="true" />
                      {item.label}
                    </span>
                    <span className="contact-hero__index-bar" aria-hidden="true">
                      <span
                        className="contact-hero__index-fill"
                        style={{ animationDelay: `${i * 0.4}s` }}
                      />
                    </span>
                  </div>
                ))}
              </aside>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          MAIN — coordonnées + formulaire (cartes bento)
          ============================================================ */}
      <section
        className="contact-main section"
        aria-label="Coordonnées et formulaire de contact"
      >
        <span className="contact-main__bg-word" aria-hidden="true">Contact</span>

        <div className="container contact-main__container">
          <header className="contact-main__header">
            <div>
              <p className="category-label">Nous trouver, nous écrire</p>
              <h2 className="contact-main__title">
                Coordonnées &amp;<br />
                <em className="contact-main__title-em">formulaire.</em>
              </h2>
            </div>
            <div className="contact-main__side">
              <p className="contact-main__intro">
                Une question sur la carte, une réservation, une privatisation ? Choisissez le canal
                qui vous convient.
              </p>
              <span className="contact-main__count">
                <span className="contact-main__count-dot" aria-hidden="true" />
                Informations pratiques
              </span>
            </div>
          </header>

          <div className="contact-main__grid">
            {/* --- Carte coordonnées --- */}
            <motion.aside
              className="contact-details"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              aria-labelledby="contact-details-title"
            >
              <div className="contact-card">
                <div className="contact-card__media">
                  <div className="contact-card__icon-wrap" aria-hidden="true">
                    <MapPin size={56} strokeWidth={1.2} className="contact-card__icon-hero" />
                  </div>
                  <span className="contact-card__shade" aria-hidden="true" />
                  <div className="contact-card__tags">
                    <span className="badge">Coordonnées</span>
                  </div>
                </div>

                <div className="contact-card__body">
                  <h3 className="contact-card__name" id="contact-details-title">
                    À votre écoute,<br />
                    <em>à Bamako.</em>
                  </h3>

                  <ul className="contact-details__list">
                    {infoList.map(({ Icon, label, value, href, extra, fallback }) => (
                      <li className="contact-detail" key={label}>
                        <span className="contact-detail__icon" aria-hidden="true">
                          <Icon size={17} strokeWidth={1.6} />
                        </span>
                        <div>
                          <span className="contact-detail__label">{label}</span>
                          {value ? (
                            href ? (
                              <a href={href}>{value}</a>
                            ) : (
                              <strong>{value}</strong>
                            )
                          ) : (
                            <strong>{fallback}</strong>
                          )}
                          {extra && <small>{extra}</small>}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="contact-card__footer">
                    <span className="contact-card__footer-label">Suivez-nous</span>
                    <div className="contact-details__socials" aria-label="Réseaux sociaux">
                      {cfg.social.instagram && (
                        <a
                          href={cfg.social.instagram}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Instagram"
                        >
                          <Instagram size={16} />
                        </a>
                      )}
                      {cfg.social.facebook && (
                        <a
                          href={cfg.social.facebook}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Facebook"
                        >
                          <Facebook size={16} />
                        </a>
                      )}
                      {cfg.contact.email && (
                        <a href={`mailto:${cfg.contact.email}`} aria-label="Envoyer un e-mail">
                          <Mail size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* --- Formulaire --- */}
            <motion.section
              className="contact-form-panel"
              id="contact-form"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              aria-labelledby="contact-form-title"
            >
              <div className="contact-form-panel__heading">
                <p className="contact-form-panel__label">
                  <span className="contact-form-panel__label-rule" aria-hidden="true" />
                  Votre message
                </p>
                <h2 className="contact-form-panel__title" id="contact-form-title">
                  Écrivez-<em>nous.</em>
                </h2>
                <p className="contact-form-panel__intro">
                  Les champs marqués d’un astérisque sont nécessaires pour préparer votre demande.
                </p>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form__row">
                  <div className="contact-field">
                    <label htmlFor="contact-name">
                      Nom complet <span>*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="contact-email">
                      E-mail <span>*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="vous@exemple.com"
                      required
                    />
                  </div>
                </div>

                <div className="contact-form__row">
                  <div className="contact-field">
                    <label htmlFor="contact-phone">Téléphone</label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+223 …"
                    />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="contact-subject">Sujet</label>
                    <select id="contact-subject" name="subject" defaultValue="Information">
                      <option>Information</option>
                      <option>Réservation</option>
                      <option>Question sur la carte</option>
                      <option>Autre demande</option>
                    </select>
                  </div>
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-message">
                    Votre message <span>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    maxLength={1500}
                    placeholder="Comment pouvons-nous vous aider ?"
                    required
                  />
                </div>

                <div className="contact-form__submit-row">
                  <button type="submit" className="contact-form__cta">
                    <span className="contact-form__cta-label">Préparer mon message</span>
                    <span className="contact-form__cta-icon" aria-hidden="true">
                      <Send size={15} />
                    </span>
                  </button>
                  <span className="contact-form__privacy">
                    Vos informations servent uniquement à traiter cette demande.
                  </span>
                </div>

                {status && (
                  <p className="contact-form__status" role="status" aria-live="polite">
                    {status}
                  </p>
                )}
              </form>
            </motion.section>
          </div>

          {/* --- Carte map plein cadre --- */}
          <motion.div
            className="contact-map"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="contact-map__frame">
              <iframe
                title="Carte de Bamako — emplacement exact du restaurant à confirmer"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-8.1324%2C12.4895%2C-7.8962%2C12.7004&layer=mapnik"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                className="contact-map__cta"
                href={
                  cfg.address.googleMapsUrl ||
                  'https://www.openstreetmap.org/#map=13/12.6392/-8.0029'
                }
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-map__cta-label">{cfg.address.googleMapsUrl ? 'Ouvrir Google Maps' : 'Voir la carte de Bamako'}</span>
                <span className="contact-map__cta-icon" aria-hidden="true">
                  <ArrowUpRight size={15} />
                </span>
              </a>
            </div>
          </motion.div>

          {/* --- CTA bas --- */}
          <div className="contact-main__cta-wrap">
            {cfg.contact.phone && (
              <a href={`tel:${cfg.contact.phone}`} className="contact-main__cta">
                <span className="contact-main__cta-label">Nous appeler</span>
                <span className="contact-main__cta-icon" aria-hidden="true">
                  <Phone size={16} />
                </span>
              </a>
            )}
            <Link to="/menu#commande" className="contact-main__order-link">
              Composer une commande
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
