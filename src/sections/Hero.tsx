import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export const Hero: React.FC = () => {
  const [petStatus, setPetStatus] = useState({ name: 'Tobias', status: 'recebendo banho de ofurô 🛁', progress: 45 });

  // Simulação de atualização de status em tempo real para parecer vivo e interativo!
  useEffect(() => {
    const statuses = [
      { name: 'Tobias', status: 'recebendo banho de ofurô 🛁', progress: 55 },
      { name: 'Tobias', status: 'relaxando na cromoterapia 🌈', progress: 85 },
      { name: 'Mel', status: 'fazendo tosa higiênica ✂️', progress: 20 },
      { name: 'Mel', status: 'passando perfume suave 🌸', progress: 95 },
      { name: 'Thor', status: 'em consulta com o Dr. Henrique 🩺', progress: 50 },
      { name: 'Luna', status: 'se divertindo no Spa Aquático 🌊', progress: 75 },
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % statuses.length;
      setPetStatus(statuses[index]);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="inicio"
      className="section-dark"
      style={{
        position: 'relative',
        paddingTop: '180px',
        paddingBottom: '120px',
        overflow: 'hidden',
        textAlign: 'left',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* 1. Vídeo de Background Cinematográfico (Mixkit CDN estável) */}
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
        <source src="https://assets.mixkit.co/videos/preview/mixkit-dogs-playing-in-a-lake-43180-large.mp4" type="video/mp4" />
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
          background: 'linear-gradient(135deg, rgba(3, 2, 116, 0.95) 0%, rgba(3, 2, 116, 0.75) 60%, rgba(1, 0, 46, 0.45) 100%)',
          zIndex: 2
        }}
      />

      {/* 3. Bolhas flutuantes decorativas (Acima do overlay, abaixo do conteúdo) */}
      <div className="bubble-container" style={{ zIndex: 3 }}>
        <div className="bubble" style={{ left: '10%', width: '40px', height: '40px', animationDelay: '0s', animationDuration: '8s' }} />
        <div className="bubble" style={{ left: '25%', width: '20px', height: '20px', animationDelay: '2s', animationDuration: '12s' }} />
        <div className="bubble" style={{ left: '50%', width: '60px', height: '60px', animationDelay: '1s', animationDuration: '10s' }} />
        <div className="bubble" style={{ left: '70%', width: '30px', height: '30px', animationDelay: '4s', animationDuration: '9s' }} />
        <div className="bubble" style={{ left: '85%', width: '50px', height: '50px', animationDelay: '3s', animationDuration: '14s' }} />
      </div>

      {/* 4. Conteúdo da Página */}
      <div className="container" style={{ position: 'relative', zIndex: 4 }}>
        <div className="hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '50px',
          alignItems: 'center'
        }}>
          {/* Texto Principal */}
          <div>
            {/* Tag em Destaque com o Amarelo Ouro de alto contraste */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(231, 164, 12, 0.15)',
              border: '1px solid rgba(231, 164, 12, 0.3)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--accent-gold)',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '24px'
            }}>
              <Sparkles size={14} />
              <span>O 1º Spa Aquático da Região</span>
            </div>

            {/* Titulo */}
            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '24px',
              letterSpacing: '-1.5px',
              fontFamily: 'var(--font-heading)',
              color: '#ffffff'
            }}>
              Onde o cuidado encontra a <span style={{ color: 'var(--accent-gold)' }}>calmaria das águas</span>
            </h1>

            {/* Descricao */}
            <p style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: 'rgba(248, 249, 251, 0.9)',
              lineHeight: 1.7,
              marginBottom: '36px',
              maxWidth: '560px'
            }}>
              Banhos terapêuticos, hidromassagem relaxante e cuidados estéticos premium. Usamos água morna purificada e produtos hipoalergênicos importados para garantir o bem-estar do seu pet.
            </p>

            {/* CTAs */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '40px'
            }}>
              <a
                href="#agendamento"
                className="gradient-bg gradient-bg-hover animate-pulse-soft"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 36px',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 700,
                  boxShadow: '0 10px 20px rgba(3, 2, 116, 0.4)',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <Calendar size={18} />
                Agendar Spa & Banho
              </a>

              <a
                href="#servicos"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 30px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-sm)',
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

            {/* Selos de Qualidade */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              paddingTop: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(248, 249, 251, 0.8)' }}>
                <ShieldCheck size={18} style={{ color: 'var(--accent-gold)' }} />
                <span>Veterinários no local</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(248, 249, 251, 0.8)' }}>
                <Sparkles size={18} style={{ color: 'var(--accent-gold)' }} />
                <span>Cosméticos Hipoalergênicos</span>
              </div>
            </div>
          </div>

          {/* Painel Interativo Direto / Fila do Spa ao Vivo */}
          <div className="hero-visual" style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Card Principal - "Spa Live Status" */}
            <div className="glass-card animate-float" style={{
              width: '100%',
              maxWidth: '420px',
              padding: '30px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} style={{ color: 'var(--accent-gold)' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(248, 249, 251, 0.7)' }}>
                    Fila do Spa ao Vivo
                  </span>
                </div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#22c55e',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'pulse-soft 1s infinite'
                  }} />
                  ONLINE
                </span>
              </div>

              {/* Box Ilustrativo com Pet Ativo */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '72px',
                  marginBottom: '16px',
                  filter: 'drop-shadow(0 10px 10px rgba(0, 0, 0, 0.3))'
                }}>
                  🐶
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px', color: '#ffffff' }}>
                  {petStatus.name}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  {petStatus.status}
                </p>
              </div>

              {/* Barra de Progresso do Cuidado */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(248, 249, 251, 0.7)', marginBottom: '6px' }}>
                  <span>Sessão de Cuidado</span>
                  <strong style={{ color: '#fff' }}>{petStatus.progress}% Concluído</strong>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${petStatus.progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #E7A40C 0%, #ffbd21 100%)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.8s ease'
                  }} />
                </div>
              </div>

              <p style={{
                fontSize: '12px',
                color: 'rgba(248, 249, 251, 0.6)',
                textAlign: 'center',
                marginTop: '16px',
                fontStyle: 'italic'
              }}>
                *Acompanhe o banho do seu pet pelo nosso app exclusivo!
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 992px) {
          .hero-grid {
            grid-template-columns: 1.2fr 0.8fr !important;
          }
        }
      `}</style>
    </section>
  );
};
