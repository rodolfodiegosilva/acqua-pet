import React from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  badge?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, price, badge }) => {
  return (
    <div className="glass-card" style={{
      padding: '40px 30px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between'
    }}>
      {badge && (
        <span style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          backgroundColor: 'var(--accent)',
          color: 'var(--text-main)',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 2px 8px rgba(255, 181, 167, 0.4)'
        }}>
          {badge}
        </span>
      )}

      <div>
        {/* Icone com gradiente flutuante */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.15) 0%, rgba(0, 119, 182, 0.05) 100%)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '28px',
          border: '1px solid var(--border-glass)',
          boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.2)'
        }}>
          {icon}
        </div>

        {/* Titulo & Descricao */}
        <h3 style={{
          fontSize: '22px',
          fontWeight: 700,
          marginBottom: '12px',
          fontFamily: 'var(--font-heading)'
        }}>
          {title}
        </h3>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '15px',
          lineHeight: 1.6,
          marginBottom: '24px'
        }}>
          {description}
        </p>
      </div>

      {/* Preco & Link */}
      <div style={{
        borderTop: '1px solid var(--border-glass)',
        paddingTop: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <span style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            display: 'block'
          }}>
            A partir de
          </span>
          <span style={{
            fontSize: '20px',
            fontWeight: 800,
            color: 'var(--primary)'
          }}>
            {price}
          </span>
        </div>
        
        <a href="#agendamento" style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'var(--transition-smooth)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--primary)';
          e.currentTarget.style.transform = 'translateX(4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-main)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}>
          Agendar &rarr;
        </a>
      </div>
    </div>
  );
};
