import React from 'react';
import { MOCK_SYSTEM_USERS } from '@/services/backoffice';
import type { AuthMode } from '../types';

interface ClientPortalAuthProps {
  authMode: AuthMode;
  authLoading: boolean;
  authError?: string | null;
  loginForm: { email: string; password: string };
  registerForm: { name: string; email: string; password: string; phone: string };
  setAuthMode: (mode: AuthMode) => void;
  setLoginForm: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  setRegisterForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string; phone: string }>>;
  onLogin: (event: React.FormEvent) => void;
  onRegister: (event: React.FormEvent) => void;
}

export const ClientPortalAuth: React.FC<ClientPortalAuthProps> = ({
  authMode,
  authLoading,
  authError,
  loginForm,
  registerForm,
  setAuthMode,
  setLoginForm,
  setRegisterForm,
  onLogin,
  onRegister
}) => {
  return (
    <div
      className="portal-auth-screen"
      style={{
        paddingTop: '168px',
        paddingBottom: '40px',
        background:
          'radial-gradient(circle at top left, rgba(3, 2, 116, 0.08), transparent 28%), radial-gradient(circle at bottom right, rgba(214, 20, 44, 0.08), transparent 24%), var(--bg-primary)'
      }}
    >
      <div className="container">
        <div className="portal-auth-shell" style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div className="glass-card portal-auth-card" style={{ padding: '32px', display: 'grid', gap: '22px' }}>
            <div className="portal-auth-head" style={{ display: 'grid', gap: '10px' }}>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, lineHeight: 1.08, color: 'var(--text-main)' }}>
                Acesso do tutor
              </h1>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.65 }}>
                Entre com um e-mail já cadastrado ou crie uma nova conta para testar pets, agenda, prontuários e loja do cliente.
              </p>
            </div>

            <div className="portal-auth-mode-switch" style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setAuthMode('login')}
                className="portal-auth-mode-btn"
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: authMode === 'login' ? 'var(--primary)' : 'var(--border-glass)',
                  background: authMode === 'login' ? 'var(--primary)' : 'var(--bg-primary)',
                  color: authMode === 'login' ? '#fff' : 'var(--text-main)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Entrar
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className="portal-auth-mode-btn"
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: authMode === 'register' ? 'var(--primary)' : 'var(--border-glass)',
                  background: authMode === 'register' ? 'var(--primary)' : 'var(--bg-primary)',
                  color: authMode === 'register' ? '#fff' : 'var(--text-main)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Criar conta
              </button>
            </div>

            <div className="portal-auth-credentials" style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(3, 2, 116, 0.04)', border: '1px solid var(--border-glass)' }}>
              <strong style={{ display: 'block', marginBottom: '8px' }}>Conta pronta para teste</strong>
              <span style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>E-mail: {MOCK_SYSTEM_USERS.client.email}</span>
              <span style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)' }}>Senha: 123456</span>
            </div>

            {authMode === 'login' ? (
              <form className="portal-auth-form" onSubmit={onLogin} style={{ display: 'grid', gap: '14px' }}>
                <input
                  type="email"
                  placeholder={MOCK_SYSTEM_USERS.client.email}
                  value={loginForm.email}
                  onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                  className="portal-input"
                />
                <input
                  type="password"
                  placeholder="123456"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                  className="portal-input"
                />
                {authError && (
                  <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(214, 20, 44, 0.18)', background: 'rgba(214, 20, 44, 0.08)', color: '#991b1b', fontSize: '14px', lineHeight: 1.5 }}>
                    {authError}
                  </div>
                )}
                <button type="submit" className="gradient-bg gradient-bg-hover" style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                  {authLoading ? 'Entrando...' : 'Acessar portal'}
                </button>
              </form>
            ) : (
              <form className="portal-auth-form" onSubmit={onRegister} style={{ display: 'grid', gap: '14px' }}>
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={registerForm.name}
                  onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })}
                  className="portal-input"
                />
                <input
                  type="email"
                  placeholder={MOCK_SYSTEM_USERS.client.email}
                  value={registerForm.email}
                  onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                  className="portal-input"
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={registerForm.phone}
                  onChange={(event) => setRegisterForm({ ...registerForm, phone: event.target.value })}
                  className="portal-input"
                />
                <input
                  type="password"
                  placeholder="123456"
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                  className="portal-input"
                />
                {authError && (
                  <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(214, 20, 44, 0.18)', background: 'rgba(214, 20, 44, 0.08)', color: '#991b1b', fontSize: '14px', lineHeight: 1.5 }}>
                    {authError}
                  </div>
                )}
                <button type="submit" className="gradient-bg gradient-bg-hover" style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                  {authLoading ? 'Criando conta...' : 'Criar conta e entrar'}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
