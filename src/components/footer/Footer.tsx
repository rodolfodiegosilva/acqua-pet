import React from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import acquaPetIcon from '@/assets/acqua_pet_icon.svg';
import type { AppView } from '@/types/navigation';
import './Footer.css';

interface FooterProps {
  setView?: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  const footerMenuItems = [
    { name: 'Início', id: 'inicio', type: 'anchor' },
    { name: 'Serviços', id: 'servicos', type: 'anchor' },
    { name: 'Loja Pet', id: 'loja', type: 'store' },
    { name: 'Área do Cliente', id: 'cliente', type: 'client' },
    { name: 'Agendamento', id: 'agendamento', type: 'anchor' },
    { name: 'Contato', id: 'contato', type: 'anchor' }
  ];

  const handleNavClick = (item: { name: string; id: string; type: string }) => {
    if (!setView) {
      return;
    }

    if (item.type === 'store') {
      setView('store');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (item.type === 'client') {
      setView('client');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    setView('landing');
    setTimeout(() => {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleBrandClick = () => {
    if (!setView) {
      return;
    }

    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    if (!setView) {
      return;
    }

    setView('admin');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleVeterinaryClick = () => {
    if (!setView) {
      return;
    }

    setView('veterinary');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <button className="footer-brand-button" onClick={handleBrandClick}>
              <img src={acquaPetIcon} alt="Acqua Pet" className="footer-brand-logo" />
              <span>
                Acqua
                <span className="footer-brand-accent">Pet</span>
              </span>
            </button>

            <p className="footer-brand-description">
              Centro especializado em aquarismo, pet shop multiespécie e cuidado veterinário em Manaus.
            </p>

            <div className="footer-socials">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-link"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="footer-social-icon"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-link"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="footer-social-icon"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">
              Links Úteis
              <span className="footer-section-title-line" />
            </h4>
            <ul className="footer-links-list">
              {footerMenuItems.map((item) => (
                <li key={item.id}>
                  <button className="footer-link-button" onClick={() => handleNavClick(item)}>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">
              Funcionamento
              <span className="footer-section-title-line" />
            </h4>
            <ul className="footer-hours-list">
              <li className="footer-hours-item">
                <Clock size={15} className="footer-icon-primary" />
                <div>
                  <strong>Seg a Sex:</strong>
                  <span className="footer-hours-value">08h às 19h</span>
                </div>
              </li>
              <li className="footer-hours-item">
                <Clock size={15} className="footer-icon-primary" />
                <div>
                  <strong>Sábado:</strong>
                  <span className="footer-hours-value">08h às 17h</span>
                </div>
              </li>
              <li className="footer-hours-item">
                <Clock size={15} className="footer-icon-accent" />
                <div>
                  <strong>Domingo:</strong>
                  <span className="footer-hours-value">Fechado</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">
              Onde Estamos
              <span className="footer-section-title-line" />
            </h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item footer-contact-item-start">
                <MapPin size={16} className="footer-icon-primary footer-map-icon" />
                <span>Rua da Legião, 56 - Coroado, Manaus - AM</span>
              </li>
              <li className="footer-contact-item footer-contact-item-center">
                <Phone size={16} className="footer-icon-primary" />
                <span>(92) 3344-9988</span>
              </li>
              <li className="footer-contact-item footer-contact-item-center">
                <Mail size={16} className="footer-icon-primary" />
                <span>contato@acquapetshop.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Acqua Pet. Todos os direitos reservados.</p>
          {setView && (
            <div className="footer-bottom-links">
              <button className="footer-bottom-button" onClick={handleAdminClick}>
                Painel admin
              </button>
              <button className="footer-bottom-button" onClick={handleVeterinaryClick}>
                Painel veterinário
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
