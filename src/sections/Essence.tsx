import React, { useState, useEffect } from 'react';
import { Droplet, Sparkles, Activity, Heart } from 'lucide-react';

export const Essence: React.FC = () => {
  const [petStatus, setPetStatus] = useState({ name: 'Tobias', status: 'recebendo banho de ofurô 🛁', progress: 45 });

  // Simulação do status ao vivo
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
      id="essencia"
      className="section-spacing section-light"
      style={{
        position: 'relative',
        transition: 'var(--transition-smooth)',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        <div className="essence-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '60px',
          alignItems: 'center'
        }}>
          
          {/* Coluna 1: A Essência & Widget ao Vivo */}
          <div style={{ textAlign: 'left' }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              display: 'block',
              marginBottom: '12px'
            }}>
              Nossa Filosofia
            </span>
            
            {/* Título Principal Exclusivo */}
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              marginBottom: '24px',
              letterSpacing: '-1.5px',
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.2
            }}>
              Onde o cuidado encontra <br />
              <span className="gradient-text">a calmaria das águas</span>
            </h2>
            
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '17px',
              lineHeight: 1.7,
              marginBottom: '36px',
              maxWidth: '560px'
            }}>
              Acreditamos que o banho não deve ser um momento de estresse, mas um ritual de renovação. O Acqua Pet foi planejado com isolamento acústico, controle fino de temperatura e terapias baseadas na água para acalmar a mente e tratar o corpo do seu pet.
            </p>

            {/* Fila do Spa ao Vivo (Hospedado na seção Essência) */}
            <div className="glass-card" style={{
              maxWidth: '440px',
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glass)',
              background: 'var(--bg-secondary)',
              position: 'relative'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Fila do Spa ao Vivo
                  </span>
                </div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#22c55e',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  <span style={{
                    width: '5px',
                    height: '5px',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'pulse-soft 1s infinite'
                  }} />
                  LIVE
                </span>
              </div>

              {/* Status do Pet */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ fontSize: '32px' }}>🐶</div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                    {petStatus.name}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>
                    {petStatus.status}
                  </p>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Progresso do Cuidado</span>
                  <strong>{petStatus.progress}%</strong>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'rgba(3, 2, 116, 0.05)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${petStatus.progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--primary) 0%, #1d4ed8 100%)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.8s ease'
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Os 4 Pilares da Calmaria das Águas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            textAlign: 'left'
          }}>
            
            {/* Pilar 1: Água Filtrada */}
            <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                <Droplet size={26} fill="rgba(3, 2, 116, 0.1)" />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                Água Duplamente Filtrada
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Banhos feitos com água 100% livre de cloro e impurezas, ideal para peles hipersensíveis, coceiras e alergias.
              </p>
            </div>

            {/* Pilar 2: Cromoterapia */}
            <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                <Sparkles size={26} />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                Cromoterapia Relaxante
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Luzes subaquáticas terapêuticas aplicadas no banho de ofurô para induzir o relaxamento e controle da ansiedade.
              </p>
            </div>

            {/* Pilar 3: Ozonioterapia */}
            <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                <Activity size={26} />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                Ozonioterapia Ativa
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Bolhas de ozônio que penetram na pelagem combatendo bactérias, acelerando a cicatrização e clareando o pelo.
              </p>
            </div>

            {/* Pilar 4: Secagem Silenciosa */}
            <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                <Heart size={26} fill="rgba(3, 2, 116, 0.1)" />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                Sopro de Baixo Ruído
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Equipamentos acústicos projetados para secar o pet de maneira aconchegante e suave, prevenindo sustos e pânico.
              </p>
            </div>

          </div>

        </div>
      </div>

      <style>{`
        .essence-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 992px) {
          .essence-grid {
            grid-template-columns: 1fr 1.2fr !important;
          }
        }
      `}</style>
    </section>
  );
};
