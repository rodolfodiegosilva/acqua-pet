import React from 'react';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section
      id="inicio"
      className="section-dark"
      style={{
        position: 'relative',
        paddingTop: '200px',
        paddingBottom: '140px',
        overflow: 'hidden',
        textAlign: 'center', /* Centralizado para máximo impacto minimalista */
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* 1. Vídeo de Background Cinematográfico */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        <source src="https://acqua-pet-assets.s3.amazonaws.com/hero.mp4" type="video/mp4" />
        <source src="https://assets.mixkit.co/videos/preview/mixkit-underwater-bubbles-background-40748-large.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos em background.
      </video>

      {/* 2. Overlay de Contraste Seguro (Garante a perfeita legibilidade da fonte branca) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(3, 2, 116, 0.9) 0%, rgba(3, 2, 116, 0.75) 60%, rgba(1, 0, 46, 0.9) 100%)',
          zIndex: 2
        }}
      />

      {/* 3. Bolhas flutuantes decorativas */}
      <div className="bubble-container" style={{ zIndex: 3 }}>
        <div className="bubble" style={{ left: '15%', width: '35px', height: '35px', animationDelay: '0s', animationDuration: '8s' }} />
        <div className="bubble" style={{ left: '30%', width: '20px', height: '20px', animationDelay: '2s', animationDuration: '12s' }} />
        <div className="bubble" style={{ left: '50%', width: '50px', height: '50px', animationDelay: '1s', animationDuration: '10s' }} />
        <div className="bubble" style={{ left: '75%', width: '25px', height: '25px', animationDelay: '4s', animationDuration: '9s' }} />
      </div>

      {/* 4. Conteúdo Centralizado */}
      <div className="container" style={{ position: 'relative', zIndex: 4, maxWidth: '900px' }}>
        {/* Tag Superior */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(231, 164, 12, 0.15)',
          border: '1px solid rgba(231, 164, 12, 0.3)',
          padding: '8px 20px',
          borderRadius: 'var(--radius-full)',
          color: 'var(--accent-gold)',
          fontSize: '13px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '30px'
        }}>
          <Sparkles size={14} />
          <span>Experiência Estética Pet de Alto Padrão</span>
        </div>

        {/* Titulo com Frase Impactante */}
        <h1 style={{
          fontSize: 'clamp(38px, 6vw, 64px)',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: '24px',
          letterSpacing: '-2px',
          fontFamily: 'var(--font-heading)',
          color: '#ffffff'
        }}>
          Cuidado de luxo e carinho <br />
          <span style={{ color: 'var(--accent-gold)' }}>para o seu melhor amigo</span>
        </h1>

        {/* Tagline / Subtítulo */}
        <p style={{
          fontSize: 'clamp(17px, 2.5vw, 21px)',
          color: 'rgba(248, 249, 251, 0.95)',
          lineHeight: 1.7,
          marginBottom: '44px',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '680px',
          fontWeight: 400
        }}>
          Banhos relaxantes em águas duplamente filtradas, spa de ofurô terapêutico e estética animal humanizada em um ambiente planejado para o relaxamento absoluto do seu pet.
        </p>

        {/* Ações */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center'
        }}>
          <a
            href="#agendamento"
            className="gradient-bg gradient-bg-hover animate-pulse-soft"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '18px 40px',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 700,
              boxShadow: '0 10px 25px rgba(3, 2, 116, 0.5)',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Calendar size={18} />
            Agendar Sessão de Spa
          </a>

          <a
            href="#servicos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '18px 36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 600,
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Conhecer Serviços
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};
