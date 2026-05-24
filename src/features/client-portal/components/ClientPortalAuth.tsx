import React from 'react';
import type { AuthMode } from '../types';

interface ClientPortalAuthProps {
  authMode: AuthMode;
  authLoading: boolean;
  loginForm: { email: string; password: string };
  registerForm: { name: string; email: string; password: string; phone: string };
  setAuthMode: (mode: AuthMode) => void;
  setView: (view: 'landing' | 'store' | 'client') => void;
  setLoginForm: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  setRegisterForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string; phone: string }>>;
  onLogin: (event: React.FormEvent) => void;
  onRegister: (event: React.FormEvent) => void;
}

export const ClientPortalAuth: React.FC<ClientPortalAuthProps> = ({
  authMode,
  authLoading,
  loginForm,
  registerForm,
  setAuthMode,
  setView,
  setLoginForm,
  setRegisterForm,
  onLogin,
  onRegister
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '80px',
        background:
          'radial-gradient(circle at top left, rgba(3, 2, 116, 0.08), transparent 28%), radial-gradient(circle at bottom right, rgba(214, 20, 44, 0.08), transparent 24%), var(--bg-primary)'
      }}
    >
      <div className="container">
        <div className="client-auth-layout" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '28px' }}>
          <div
            className="glass-card"
            style={{
              padding: '38px',
              minHeight: '620px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(3, 2, 116, 0.04) 0%, rgba(214, 20, 44, 0.03) 100%)'
            }}
          >
            <div>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.6px', marginBottom: '14px' }}>
                Nova Área do Cliente
              </span>
              <h1 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.08, marginBottom: '16px' }}>
                Portal completo para <span className="gradient-text">acompanhar cada etapa</span> do cuidado do seu pet
              </h1>
              <p style={{ maxWidth: '640px', fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Login e cadastro mockados, mas com arquitetura de produto real: acompanhamento clínico, agenda, loja, pets cadastrados, disponibilidade veterinária e experiência premium em um só lugar.
              </p>
            </div>

            <div className="client-feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
              {[
                ['Agenda centralizada', 'Consultas, banhos e avaliações técnicas em um fluxo único.'],
                ['Histórico por pet', 'Cada animal tem timeline médica própria e organizada.'],
                ['Loja personalizada', 'Produtos recomendados com base no perfil e rotina do tutor.'],
                ['Equipe disponível', 'Veterinários, horários e canais de atendimento em tempo real mockado.']
              ].map(([title, description]) => (
                <div key={title} style={{ padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.6)' }}>
                  <strong style={{ display: 'block', fontSize: '16px', marginBottom: '6px' }}>{title}</strong>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{description}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setView('landing')}
                style={{
                  padding: '13px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-glass)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Voltar ao site
              </button>
              <button
                onClick={() => setView('store')}
                className="gradient-bg gradient-bg-hover"
                style={{
                  padding: '13px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Ver loja pública
              </button>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setAuthMode('login')}
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

            {authMode === 'login' ? (
              <form onSubmit={onLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Entrar na área do cliente</h2>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    Como o fluxo é mockado, qualquer e-mail e senha liberam o acesso.
                  </p>
                </div>

                <input type="email" placeholder="Seu e-mail" value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} className="portal-input" />
                <input type="password" placeholder="Sua senha" value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} className="portal-input" />
                <button type="submit" className="gradient-bg gradient-bg-hover" style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                  {authLoading ? 'Entrando...' : 'Acessar portal'}
                </button>
              </form>
            ) : (
              <form onSubmit={onRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Criar cadastro mockado</h2>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    Estrutura pronta para onboarding, com login liberado logo após o cadastro.
                  </p>
                </div>

                <input type="text" placeholder="Nome completo" value={registerForm.name} onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })} className="portal-input" />
                <input type="email" placeholder="Seu e-mail" value={registerForm.email} onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })} className="portal-input" />
                <input type="tel" placeholder="Telefone" value={registerForm.phone} onChange={(event) => setRegisterForm({ ...registerForm, phone: event.target.value })} className="portal-input" />
                <input type="password" placeholder="Crie uma senha" value={registerForm.password} onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })} className="portal-input" />
                <button type="submit" className="gradient-bg gradient-bg-hover" style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                  {authLoading ? 'Criando conta...' : 'Criar conta e entrar'}
                </button>
              </form>
            )}

            <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', background: 'rgba(3, 2, 116, 0.04)', border: '1px solid var(--border-glass)' }}>
              <strong style={{ display: 'block', marginBottom: '8px' }}>Ambiente demonstrativo</strong>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Este portal é 100% mockado, mas já está estruturado como uma área autenticada real, com estados separados, módulos independentes e componentes reaproveitáveis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
