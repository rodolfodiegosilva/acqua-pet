import React, { useState, useEffect } from 'react';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import FavoriteRounded from '@mui/icons-material/FavoriteRounded';
import MonitorHeartRounded from '@mui/icons-material/MonitorHeartRounded';
import WaterDropRounded from '@mui/icons-material/WaterDropRounded';

export const Essence: React.FC = () => {
  const [petStatus, setPetStatus] = useState({ name: 'Aquário Hospital A', status: 'dosando regenerador biológico 🫧', progress: 45 });

  // Simulação do status ao vivo
  useEffect(() => {
    const statuses = [
      { name: 'Aquário Hospital A', status: 'dosando regenerador biológico 🫧', progress: 55 },
      { name: 'Estufa Ciclídeos', status: 'aclimatação gradual de pH e T 🌡️', progress: 85 },
      { name: 'Bateria Betta Show', status: 'alimentação automática ativada 🪱', progress: 100 },
      { name: 'Tanque Lagoa Lago', status: 'filtragem UV ativada contra algas ☀️', progress: 95 },
      { name: 'Aquário Quarentena B', status: 'consulta diagnóstica com o Vet Aquático 🩺', progress: 50 },
      { name: 'Aquaterrário C', status: 'tpa parcial e ozonização da água 💧', progress: 75 },
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
              <span className="gradient-text">o equilíbrio biológico</span>
            </h2>
            
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '17px',
              lineHeight: 1.7,
              marginBottom: '36px',
              maxWidth: '560px'
            }}>
              Acreditamos que um ecossistema aquático perfeito exige equilíbrio biológico preciso e cuidado veterinário especializado. Nosso centro na Rua da Legião foi planejado com sistemas de filtragem industrial de última geração e atendimento médico dedicado para garantir a saúde e o esplendor dos seus peixes ornamentais.
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
                  <MonitorHeartRounded sx={{ fontSize: 18, color: 'var(--primary)' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Parâmetros e Quarentena ao Vivo
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
                <div style={{ fontSize: '32px' }}>🐠</div>
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
                  <span>Progresso do Protocolo</span>
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

          {/* Coluna 2: Os 4 Pilares */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            textAlign: 'left'
          }}>
            
            {/* Pilar 1: Água Filtrada */}
            <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                <WaterDropRounded sx={{ fontSize: 26, color: 'var(--primary)' }} />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                Filtragem Industrial & UV/Ozônio
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Manutenção rigorosa com filtragem física, química e biológica avançada, além de esterilização ultravioleta para patógenos zero.
              </p>
            </div>

            {/* Pilar 2: Veterinário Aquático */}
            <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                <FavoriteRounded sx={{ fontSize: 26, color: 'var(--primary)' }} />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                Clínica Especializada
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Atendimento veterinário pioneiro para peixes ornamentais e fauna aquática: diagnóstico de doenças, biópsias e cirurgias.
              </p>
            </div>

            {/* Pilar 3: Aquascaping Autoral */}
            <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                <AutoAwesomeRounded sx={{ fontSize: 26 }} />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                Aquascaping Autoral
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Desenvolvimento de designs e ecossistemas plantados ou marinhos sob medida, recriando a beleza natural de rios e lagos.
              </p>
            </div>

            {/* Pilar 4: Aclimatação Lenta */}
            <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                <MonitorHeartRounded sx={{ fontSize: 26 }} />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                Aclimatação Choque Zero
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Protocolo estrito de quarentena gota a gota e estabilização de parâmetros químicos para introdução segura de novas espécies.
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
