import React, { useState } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import LocalMallRounded from '@mui/icons-material/LocalMallRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import acquaPetIcon from '@/assets/acqua_pet_icon.svg';
import { ThemeToggle } from '@/components/theme-toggle/ThemeToggle';
import type { AppView } from '@/types/navigation';

interface HeaderProps {
  view: AppView;
  setView: (view: AppView) => void;
  cartItemCount: number;
  onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  view,
  setView,
  cartItemCount,
  onCartClick
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: 'Início', id: 'inicio', type: 'anchor' },
    { name: 'Serviços', id: 'servicos', type: 'anchor' },
    { name: 'Agendamento', id: 'agendamento', type: 'anchor' },
    { name: 'Contato', id: 'contato', type: 'anchor' }
  ];

  const handleNavClick = (item: { name: string; id: string; type: string }) => {
    setIsOpen(false);
    if (item.type === 'store') {
      setView('store');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.type === 'client') {
      setView('client');
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      setView('landing');
      // Pequeno timeout para dar tempo da renderização da landing ocorrer se estivesse na loja
      setTimeout(() => {
        const element = document.getElementById(item.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

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
          <button 
            onClick={() => {
              setView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              color: 'var(--text-main)',
              flexShrink: 0,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <img
              src={acquaPetIcon}
              alt="Acqua Pet"
              style={{
                width: '40px',
                height: '40px',
                flexShrink: 0,
                objectFit: 'contain'
              }}
            />
            <span>
              Acqua
              <span style={{ color: 'var(--accent)' }}>Pet</span>
            </span>
          </button>

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
              {menuItems.map((item) => {
                const isActive =
                  (item.type === 'store' && view === 'store') ||
                  (item.type === 'client' && view === 'client') ||
                  (item.type === 'anchor' && view === 'landing');
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item)}
                      style={{
                        color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '16px',
                        transition: 'var(--transition-smooth)',
                        padding: '8px 0',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = 'var(--text-muted)';
                        }
                      }}
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Action Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <ThemeToggle />

          {/* Carrinho Flutuante e Luminoso */}
          <button
            onClick={onCartClick}
            className="header-cart-btn"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: 'var(--shadow-sm)',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-glass)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            aria-label="Abrir carrinho de compras"
          >
            <LocalMallRounded sx={{ fontSize: 20 }} />
            {cartItemCount > 0 && (
              <span 
                className="cart-badge-glow"
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-primary)',
                  boxShadow: '0 0 10px rgba(3, 2, 116, 0.4)'
                }}
              >
                {cartItemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick({ name: 'Loja Pet', id: 'loja', type: 'store' })}
            className="desktop-store-btn"
            style={{
              display: 'none',
              padding: '11px 18px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--primary)',
              fontSize: '14px',
              fontWeight: 700,
              background: 'color-mix(in srgb, var(--primary) 10%, var(--bg-secondary))',
              border: '1px solid color-mix(in srgb, var(--primary) 18%, var(--border-glass))',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--primary) 18%, var(--border-glass))';
            }}
          >
            Loja Pet
          </button>
          
          <button
            onClick={() => handleNavClick({ name: 'Área do Cliente', id: 'cliente', type: 'client' })}
            className="gradient-bg gradient-bg-hover cta-header-btn"
            style={{
              display: 'none',
              padding: '12px 24px',
              borderRadius: 'var(--radius-full)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(0, 180, 216, 0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            Área do Cliente
          </button>

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
            {isOpen ? <CloseRounded sx={{ fontSize: 26 }} /> : <MenuRounded sx={{ fontSize: 26 }} />}
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
            gap: '18px',
            alignItems: 'stretch',
            listStyle: 'none',
            fontSize: '18px',
            fontWeight: 600,
            width: 'min(100%, 320px)',
            margin: '0 auto'
          }}>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item)}
                  style={{
                    color: 'var(--text-main)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 600,
                    transition: 'var(--transition-smooth)',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0 4px'
                  }}
                >
                  {item.name}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => handleNavClick({ name: 'Loja Pet', id: 'loja', type: 'store' })}
                style={{
                  color: 'var(--text-main)',
                  background: 'color-mix(in srgb, var(--primary) 10%, var(--bg-secondary))',
                  border: '1px solid color-mix(in srgb, var(--primary) 18%, var(--border-glass))',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 700,
                  transition: 'var(--transition-smooth)',
                  width: '100%',
                  textAlign: 'center',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Loja Pet
              </button>
            </li>
            <li>
              <button
                onClick={onCartClick}
                style={{
                  color: 'var(--text-main)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 700,
                  transition: 'var(--transition-smooth)',
                  width: '100%',
                  textAlign: 'center',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <LocalMallRounded sx={{ fontSize: 18 }} />
                Carrinho
                {cartItemCount > 0 ? `(${cartItemCount})` : ''}
              </button>
            </li>
            <li style={{ width: '100%', marginTop: '8px' }}>
              <button
                onClick={() => handleNavClick({ name: 'Área do Cliente', id: 'cliente', type: 'client' })}
                className="gradient-bg text-center"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Área do Cliente
              </button>
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
          .desktop-store-btn {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
          }
          .cta-header-btn {
            display: inline-block !important;
          }
          .header-cart-btn {
            display: inline-flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }

        @media (max-width: 767px) {
          .header-cart-btn,
          .cta-header-btn,
          .desktop-store-btn,
          .desktop-menu {
            display: none !important;
          }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(3, 2, 116, 0.4); }
          50% { box-shadow: 0 0 15px rgba(0, 180, 216, 0.8); }
        }
        .cart-badge-glow {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
    </header>
  );
};
