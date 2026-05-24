import React from 'react';
import { Droplet, Scissors, Heart, Home } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';

export const Services: React.FC = () => {
  const servicesData = [
    {
      title: 'Spa de Hidromassagem',
      description: 'Banhos terapêuticos de ofurô com sais minerais, ozonoterapia e cromoterapia. Ajuda no relaxamento muscular e na saúde da pele.',
      icon: <Droplet size={32} strokeWidth={1.5} />,
      price: 'R$ 119,90',
      badge: 'Exclusivo'
    },
    {
      title: 'Estética & Tosa',
      description: 'Banho completo com água duplamente filtrada, secagem silenciosa e tosas estéticas personalizadas feitas por especialistas da raça.',
      icon: <Scissors size={32} strokeWidth={1.5} />,
      price: 'R$ 79,90',
      badge: 'Mais Procurado'
    },
    {
      title: 'Clínica Veterinária',
      description: 'Atendimento clínico preventivo, exames rápidos, aplicação de vacinas importadas e acompanhamento pediátrico/geriátrico com afeto.',
      icon: <Heart size={32} strokeWidth={1.5} />,
      price: 'R$ 149,90',
    },
    {
      title: 'Hotelzinho Acqua',
      description: 'Hospedagem humanizada em suítes climatizadas, rotina de socialização, piscina pet monitorada e envio diário de fotos e vídeos.',
      icon: <Home size={32} strokeWidth={1.5} />,
      price: 'R$ 89,90',
      badge: 'Novidade'
    }
  ];

  return (
    <section
      id="servicos"
      className="section-spacing section-dark"
      style={{
        position: 'relative',
        transition: 'var(--transition-smooth)'
      }}
    >
      <div className="container">
        {/* Cabeçalho da Seção */}
        <div style={{
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 auto 60px'
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            display: 'block',
            marginBottom: '12px'
          }}>
            Serviços de Alto Padrão
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800,
            marginBottom: '20px',
            letterSpacing: '-1px',
            fontFamily: 'var(--font-heading)'
          }}>
            Tratamentos que seu pet <span className="gradient-text">vai amar experimentar</span>
          </h2>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '16px',
            lineHeight: 1.6
          }}>
            Combinamos técnicas modernas de estética e cuidados veterinários em um ecossistema projetado inteiramente para minimizar o estresse e maximizar o carinho.
          </p>
        </div>

        {/* Grid de Serviços */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '30px'
        }}>
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              price={service.price}
              badge={service.badge}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
