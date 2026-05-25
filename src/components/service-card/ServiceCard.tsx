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
    <div className="glass-card service-card">
      {badge && (
        <span style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          backgroundColor: 'var(--accent)',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 2px 8px rgba(214, 20, 44, 0.2)'
        }}>
          {badge}
        </span>
      )}

      <div>
        {/* Icone com classe customizada */}
        <div className="service-card-icon">
          {icon}
        </div>

        {/* Titulo & Descricao */}
        <h3>{title}</h3>
        <p className="service-card-desc">
          {description}
        </p>
      </div>

      {/* Preco & Link */}
      <div className="service-card-footer">
        <div>
          <span className="service-card-price-label">
            A partir de
          </span>
          <span className="service-card-price">
            {price}
          </span>
        </div>
        
        <a href="#agendamento" className="service-card-action">
          Agendar &rarr;
        </a>
      </div>
    </div>
  );
};
