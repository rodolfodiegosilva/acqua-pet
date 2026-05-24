import React from 'react';
import { ShieldCheck, Stethoscope } from 'lucide-react';
import type { BackofficeRole } from '../../../services/backoffice';

interface BackofficeAuthProps {
  role: BackofficeRole;
  loading: boolean;
  credentials: { email: string; password: string };
  setCredentials: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  onSubmit: (event: React.FormEvent) => void;
  onBackToSite: () => void;
}

export const BackofficeAuth: React.FC<BackofficeAuthProps> = ({
  role,
  loading,
  credentials,
  setCredentials,
  onSubmit,
  onBackToSite
}) => {
  const isAdmin = role === 'admin';
  const Icon = isAdmin ? ShieldCheck : Stethoscope;

  return (
    <div className="backoffice-app" data-backoffice-theme="light" style={{ minHeight: '100vh', background: 'var(--backoffice-bg)', padding: '24px 0' }}>
      <div className="container">
        <div className="backoffice-auth" style={{ display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: '22px', alignItems: 'stretch' }}>
          <div className="backoffice-card" style={{ padding: '30px', background: 'var(--backoffice-hero)' }}>
            <span className="backoffice-pill backoffice-status-info" style={{ marginBottom: '16px' }}>
              <Icon size={14} />
              {isAdmin ? 'Área administrativa' : 'Área veterinária'}
            </span>
            <h1 style={{ fontSize: 'clamp(30px, 5vw, 48px)', lineHeight: 1.02, color: 'var(--backoffice-text)', marginBottom: '14px' }}>
              {isAdmin ? 'Controle operacional completo da base de clientes.' : 'Painel clínico para acompanhar agenda, pacientes e prontuários.'}
            </h1>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--backoffice-muted)', maxWidth: '640px', marginBottom: '24px' }}>
              Fluxo mockado, mas estruturado como backoffice real, com sessão persistida e camada pronta para integração HTTP depois.
            </p>
            <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px' }}>
              {[
                isAdmin ? 'Clientes e pets' : 'Fila clínica',
                isAdmin ? 'Indicadores operacionais' : 'Histórico e prescrição',
                isAdmin ? 'Relacionamento e riscos' : 'Acompanhamento por paciente'
              ].map((item) => (
                <div key={item} className="backoffice-card" style={{ padding: '18px', background: 'color-mix(in srgb, var(--backoffice-surface) 88%, transparent)' }}>
                  <strong style={{ display: 'block', color: 'var(--backoffice-text)', lineHeight: 1.45 }}>{item}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="backoffice-card" style={{ padding: '30px' }}>
            <div style={{ marginBottom: '22px' }}>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--backoffice-accent-strong)', marginBottom: '8px' }}>
                Login
              </span>
              <h2 style={{ fontSize: '30px', color: 'var(--backoffice-text)', marginBottom: '10px' }}>
                {isAdmin ? 'Entrar como admin geral' : 'Entrar como admin veterinário'}
              </h2>
              <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.65 }}>
                Como é mockado, qualquer combinação válida entra. A sessão fica salva no navegador.
              </p>
            </div>

            <form onSubmit={onSubmit} style={{ display: 'grid', gap: '14px' }}>
              <input
                className="backoffice-input"
                type="email"
                placeholder={isAdmin ? 'admin@acquapet.mock' : 'vet@acquapet.mock'}
                value={credentials.email}
                onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
              />
              <input
                className="backoffice-input"
                type="password"
                placeholder="Digite qualquer senha"
                value={credentials.password}
                onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
              />
              <button type="submit" className="backoffice-primary-btn" disabled={loading}>
                {loading ? 'Autenticando...' : isAdmin ? 'Entrar no admin' : 'Entrar na área veterinária'}
              </button>
            </form>

            <button type="button" className="backoffice-ghost-btn" style={{ marginTop: '14px', width: '100%' }} onClick={onBackToSite}>
              Voltar para o site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
