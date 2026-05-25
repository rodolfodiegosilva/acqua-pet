import React from 'react';
import { ArrowRight, AutoAwesome, CalendarToday, WaterDrop } from '@mui/icons-material';
import './Hero.css';

export const Hero: React.FC = () => {
  return (
    <section id="inicio" className="section-dark hero-section">
      <video autoPlay loop muted playsInline className="hero-video">
        <source src="https://acqua-pet-assets.s3.amazonaws.com/hero.mp4" type="video/mp4" />
        <source src="https://assets.mixkit.co/videos/preview/mixkit-underwater-bubbles-background-40748-large.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos em background.
      </video>

      <div className="hero-overlay" />

      <div className="bubble-container hero-bubble-layer">
        <div className="bubble" style={{ left: '15%', width: '35px', height: '35px', animationDelay: '0s', animationDuration: '8s' }} />
        <div className="bubble" style={{ left: '30%', width: '20px', height: '20px', animationDelay: '2s', animationDuration: '12s' }} />
        <div className="bubble" style={{ left: '50%', width: '50px', height: '50px', animationDelay: '1s', animationDuration: '10s' }} />
        <div className="bubble" style={{ left: '75%', width: '25px', height: '25px', animationDelay: '4s', animationDuration: '9s' }} />
      </div>

      <div className="container hero-shell">
        <div className="hero-kicker">
          <span className="hero-kicker-chip hero-kicker-chip-accent">
            <WaterDrop sx={{ fontSize: 16 }} />
            Peixes ornamentais
          </span>
          <span className="hero-kicker-separator" />
          <span className="hero-kicker-chip">
            <AutoAwesome sx={{ fontSize: 16 }} />
            Consultório veterinário aquático
          </span>
        </div>

        <h1 className="hero-title">
          Cuidado clínico, aquários premium e espécies raras
          <br />
          <span className="hero-title-highlight">em um só destino em Manaus</span>
        </h1>

        <p className="hero-description">
          Unimos loja especializada, montagem de ecossistemas e atendimento veterinário para peixes ornamentais com operação pensada para tutores exigentes, colecionadores e projetos de alto padrão.
        </p>

        <div className="hero-actions">
          <a href="#agendamento" className="gradient-bg gradient-bg-hover animate-pulse-soft hero-primary-action">
            <CalendarToday sx={{ fontSize: 18 }} />
            Agendar consulta ou visita
          </a>

          <a href="#servicos" className="hero-secondary-action">
            Conhecer serviços
            <ArrowRight sx={{ fontSize: 18 }} />
          </a>
        </div>
      </div>
    </section>
  );
};
