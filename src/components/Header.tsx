import React, { useState } from 'react';
import { Menu, X, Droplet } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="glass-nav" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      transition: 'var(--transition-smooth)'
    }}>
      <div className="header-container">
        {/* Bloco Agrupado à Esquerda: Logo + Navegação */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '48px',
          flexGrow: 1
        }}>
          {/* Logo */}
          <a href="#inicio" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            fontSize: '24px',
            color: 'var(--text-main)',
            flexShrink: 0
          }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              color: '#fff',
              boxShadow: '0 4px 10px rgba(3, 2, 116, 0.2)'
            }}>
              <Droplet size={20} fill="#ffffff" />
              <span style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                border: '2px solid #fff'
              }} />
            </div>
            <span>Acqua<span className="gradient-text">Pet</span></span>
          </a>

          {/* Desktop Navigation (Alinhada ao lado da Logo) */}
          <nav style={{
            display: 'none',
          }} className="desktop-menu">
            <ul style={{
              display: 'flex',
              gap: '32px',
              listStyle: 'none',
              fontSize: '16px',
              fontWeight: 500
            }}>
              {['Inicio', 'Servicos', 'Petshop', 'Agendamento', 'Contato'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    style={{
                      color: 'var(--text-muted)',
                      transition: 'var(--transition-smooth)',
                      padding: '8px 0',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    {item === 'Inicio' ? 'Início' : item === 'Servicos' ? 'Serviços' : item === 'Petshop' ? 'Pet Shop' : item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Action Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <ThemeToggle />
          
          <a
            href="#agendamento"
            className="gradient-bg gradient-bg-hover cta-header-btn"
            style={{
              display: 'none',
              padding: '12px 24px',
              borderRadius: 'var(--radius-full)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(0, 180, 216, 0.2)',
              transition: 'var(--transition-smooth)'
            }}
          >
            Agendar Banho
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'block'
            }}
            className="mobile-toggle"
            aria-label="Abrir menu de navegação"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div style={{
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-glass)',
          padding: '24px 0',
          position: 'absolute',
          top: '80px',
          left: 0,
          width: '100%',
          boxShadow: 'var(--shadow-md)',
          zIndex: 999
        }}>
          <ul style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center',
            listStyle: 'none',
            fontSize: '18px',
            fontWeight: 600
          }}>
            {['Inicio', 'Servicos', 'Petshop', 'Agendamento', 'Contato'].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  style={{
                    color: 'var(--text-main)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {item === 'Inicio' ? 'Início' : item === 'Servicos' ? 'Serviços' : item === 'Petshop' ? 'Pet Shop' : item}
                </a>
              </li>
            ))}
            <li style={{ width: '80%', marginTop: '8px' }}>
              <a
                href="#agendamento"
                onClick={() => setIsOpen(false)}
                className="gradient-bg text-center"
                style={{
                  display: 'block',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 600
                }}
              >
                Agendar Agora
              </a>
            </li>
          </ul>
        </div>
      )}

      <style>{`
        .header-container {
          width: 100%;
          box-sizing: border-box;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .header-container {
            padding: 0 40px;
            gap: 40px;
          }
          .desktop-menu {
            display: block !important;
          }
          .cta-header-btn {
            display: inline-block !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
