import React from 'react';
import { MOCK_SYSTEM_USERS, type BackofficeRole } from '@/services/backoffice';

interface BackofficeAuthProps {
  role: BackofficeRole;
  loading: boolean;
  authError?: string | null;
  credentials: { email: string; password: string };
  setCredentials: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  onSubmit: (event: React.FormEvent) => void;
}

export const BackofficeAuth: React.FC<BackofficeAuthProps> = ({
  role,
  loading,
  authError,
  credentials,
  setCredentials,
  onSubmit
}) => {
  const isAdmin = role === 'admin';
  const accessUser = isAdmin ? MOCK_SYSTEM_USERS.admin : MOCK_SYSTEM_USERS.veterinarian;
  const authBackground =
    'radial-gradient(circle at top left, rgba(3, 2, 116, 0.08), transparent 28%), radial-gradient(circle at bottom right, rgba(214, 20, 44, 0.08), transparent 24%), var(--bg-primary)';

  return (
    <div className="backoffice-app backoffice-auth-screen" data-backoffice-theme="light" style={{ background: authBackground, padding: '168px 0 8px' }}>
      <div className="container">
        <div className="backoffice-auth-shell" style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div className="backoffice-card backoffice-auth-card" style={{ padding: '32px', display: 'grid', gap: '22px' }}>
            <div className="backoffice-auth-head" style={{ display: 'grid', gap: '10px' }}>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 38px)', lineHeight: 1.08, color: 'var(--backoffice-text)' }}>
                {isAdmin ? 'Acesso do admin geral' : 'Acesso do veterinário'}
              </h1>
              <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.65 }}>
                Use o e-mail mockado deste painel para testar o backoffice.
              </p>
            </div>

            <div className="backoffice-card backoffice-auth-credentials" style={{ padding: '16px', background: 'var(--backoffice-soft)' }}>
              <strong style={{ display: 'block', color: 'var(--backoffice-text)', marginBottom: '8px' }}>Conta pronta para teste</strong>
              <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '14px', marginBottom: '4px' }}>E-mail: {accessUser.email}</span>
              <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '14px' }}>Senha: 123456</span>
            </div>

            <form className="backoffice-auth-form" onSubmit={onSubmit} style={{ display: 'grid', gap: '14px' }}>
              <input
                className="backoffice-input"
                type="email"
                placeholder={accessUser.email}
                value={credentials.email}
                onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
              />
              <input
                className="backoffice-input"
                type="password"
                placeholder="123456"
                value={credentials.password}
                onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
              />
              {authError && (
                <div style={{ padding: '12px 14px', borderRadius: '16px', border: '1px solid color-mix(in srgb, var(--backoffice-danger) 24%, transparent)', background: 'color-mix(in srgb, var(--backoffice-danger) 10%, transparent)', color: 'var(--backoffice-danger)', fontSize: '14px', lineHeight: 1.55 }}>
                  {authError}
                </div>
              )}
              <button type="submit" className="backoffice-primary-btn" disabled={loading}>
                {loading ? 'Autenticando...' : isAdmin ? 'Entrar no admin' : 'Entrar na área veterinária'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
