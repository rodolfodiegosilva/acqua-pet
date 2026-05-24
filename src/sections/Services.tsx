import React from 'react';
import { Droplet, Heart, Sparkles, ShieldAlert } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';

export const Services: React.FC = () => {
  const servicesData = [
    {
      title: 'Consultório Veterinário Aquático',
      description: 'Atendimento clínico especializado em peixes ornamentais: biópsias branquiais, exames parasitológicos, raspados de pele e cirurgias de precisão com anestesia aquática.',
      icon: <Heart size={32} strokeWidth={1.5} />,
      price: 'R$ 179,90',
      badge: 'Exclusivo'
    },
    {
      title: 'Design & Aquascaping',
      description: 'Planejamento, montagem e manutenção sob medida de aquários plantados, marinhos, lagoas ornamentais e ecossistemas complexos inspirados na Bacia Amazônica.',
      icon: <Droplet size={32} strokeWidth={1.5} />,
      price: 'Sob Consulta',
      badge: 'Sob Medida'
    },
    {
      title: 'Análise de Água & Consultoria',
      description: 'Biorremediação completa e análise físico-química laboratorial precisa de pH, amônia total, nitrito, nitrato, GH e KH com prescrição de tratamento biológico ideal.',
      icon: <Sparkles size={32} strokeWidth={1.5} />,
      price: 'R$ 89,90',
      badge: 'Mais Procurado'
    },
    {
      title: 'Quarentena & Aclimatação',
      description: 'Hospedagem segura em sistemas individuais de quarentena biológica, tratamento preventivo contra patógenos e aclimatação gradual gota a gota de novos espécimes.',
      icon: <ShieldAlert size={32} strokeWidth={1.5} />,
      price: 'R$ 99,90',
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
            Serviços Especializados
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800,
            marginBottom: '20px',
            letterSpacing: '-1px',
            fontFamily: 'var(--font-heading)'
          }}>
            Saúde aquática e ecossistemas <br />
            <span className="gradient-text">de altíssimo padrão</span>
          </h2>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '16px',
            lineHeight: 1.6
          }}>
            Combinamos a precisão da biologia marinha com o cuidado veterinário especializado em um ambiente projetado para maximizar a saúde e a exuberância dos seus peixes ornamentais.
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
