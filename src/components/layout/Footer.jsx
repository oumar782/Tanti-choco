import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import RESTAURANT_CONFIG, { formatOpeningHours } from '../../data/restaurantConfig.js';
import './Footer.css';

const FOOTER_NAV = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/about' },
  { label: 'Spécialités', to: '/specialites' },
  { label: 'Nos plats', to: '/menu' },
  { label: 'Contact', to: '/contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const cfg = RESTAURANT_CONFIG;
  const openingHours = formatOpeningHours(cfg.hours);

  return (
    <footer className="footer" role="contentinfo" id="contact">
      <div className="footer__inner container">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-icon" aria-hidden="true">
              <UtensilsCrossed size={16} />
            </span>
            <span>Chez <em>Tanti</em> Choco</span>
          </Link>
          <p className="footer__tagline">{cfg.tagline}</p>
          <p className="footer__description">
            Une cuisine généreuse et chaleureuse au cœur de Bamako, pensée pour rassembler.
          </p>

          {(cfg.social.facebook || cfg.social.instagram) && (
            <div className="footer__social">
              {cfg.social.instagram && (
                <a href={cfg.social.instagram} className="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <Instagram size={18} />
                </a>
              )}
              {cfg.social.facebook && (
                <a href={cfg.social.facebook} className="footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <Facebook size={18} />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="footer__col">
          <h3 className="footer__col-title">Navigation</h3>
          <ul className="footer__nav">
            {FOOTER_NAV.map(link => (
              <li key={link.to}>
                <Link to={link.to} className="footer__nav-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__col-title">Nous trouver</h3>
          <ul className="footer__info">
            {(cfg.address.street || cfg.address.neighborhood) && (
              <li className="footer__info-item">
                <MapPin size={15} className="footer__info-icon" />
                <span>
                  {cfg.address.street && <>{cfg.address.street}<br /></>}
                  {cfg.address.neighborhood && <>{cfg.address.neighborhood}, </>}
                  {cfg.address.city}
                </span>
              </li>
            )}
            {!cfg.address.street && !cfg.address.neighborhood && (
              <li className="footer__info-item footer__info-item--placeholder">
                <MapPin size={15} className="footer__info-icon" />
                <span>Adresse à confirmer — {cfg.address.city}</span>
              </li>
            )}
            {cfg.contact.phone ? (
              <li className="footer__info-item">
                <Phone size={15} className="footer__info-icon" />
                <a href={`tel:${cfg.contact.phone}`} className="footer__link">{cfg.contact.phone}</a>
              </li>
            ) : (
              <li className="footer__info-item footer__info-item--placeholder">
                <Phone size={15} className="footer__info-icon" />
                <span>Téléphone à confirmer</span>
              </li>
            )}
            <li className={`footer__info-item${openingHours === 'Horaires à confirmer' ? ' footer__info-item--placeholder' : ''}`}>
              <Clock size={15} className="footer__info-icon" />
              <span>{openingHours}</span>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__col-title">Commander</h3>
          <ul className="footer__info">
            {cfg.orderModes.pickup && (
              <li className="footer__info-item">
                <span className="footer__bullet">→</span>
                <span>Retrait sur place</span>
              </li>
            )}
            {cfg.orderModes.delivery && (
              <li className="footer__info-item">
                <span className="footer__bullet">→</span>
                <span>Livraison à domicile</span>
              </li>
            )}
          </ul>
          <p className="footer__demo-notice">
            Les informations pratiques seront actualisées dès confirmation par le restaurant.
          </p>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            © {year} Chez Tanti Choco. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

