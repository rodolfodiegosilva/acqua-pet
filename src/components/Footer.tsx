import React from 'react';
import { Droplet, Phone, Mail, MapPin, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-glass)',
      paddingTop: '80px',
      paddingBottom: '40px',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container">
        {/* Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '60px',
          textAlign: 'left'
        }}>
          {/* Coluna 1: Sobre */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 800,
              fontSize: '24px',
              fontFamily: 'var(--font-heading)',
              marginBottom: '20px',
              color: 'var(--text-main)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
                color: '#fff'
              }}>
                <Droplet size={18} fill="#ffffff" />
              </div>
              <span>Acqua<span className="gradient-text">Pet</span></span>
            </div>
            
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '15px',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              Cuidado de alto padrão, carinho e inovação para o bem-estar do seu pet. Especialistas em estética animal e hidromassagem.
            </p>

            {/* Redes Sociais */}
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  transition: 'var(--transition-bounce)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-main)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  transition: 'var(--transition-bounce)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-main)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: 700,
              marginBottom: '24px',
              fontFamily: 'var(--font-heading)',
              position: 'relative',
              paddingBottom: '8px'
            }}>
              Links Úteis
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '30px',
                height: '3px',
                backgroundColor: 'var(--primary)',
                borderRadius: 'var(--radius-full)'
              }} />
            </h4>
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '15px'
            }}>
              {['Inicio', 'Servicos', 'Petshop', 'Agendamento', 'Contato'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    style={{
                      color: 'var(--text-muted)',
                      transition: 'var(--transition-smooth)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {item === 'Inicio' ? 'Início' : item === 'Servicos' ? 'Serviços' : item === 'Petshop' ? 'Pet Shop' : item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Horários */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: 700,
              marginBottom: '24px',
              fontFamily: 'var(--font-heading)',
              position: 'relative',
              paddingBottom: '8px'
            }}>
              Funcionamento
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '30px',
                height: '3px',
                backgroundColor: 'var(--primary)',
                borderRadius: 'var(--radius-full)'
              }} />
            </h4>
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '14px',
              color: 'var(--text-muted)'
            }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} className="gradient-text" style={{ color: 'var(--primary)' }} />
                <div>
                  <strong>Segunda a Sexta:</strong>
                  <span style={{ display: 'block' }}>08:00h às 19:00h</span>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} style={{ color: 'var(--primary)' }} />
                <div>
                  <strong>Sábado:</strong>
                  <span style={{ display: 'block' }}>08:00h às 17:00h</span>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} style={{ color: 'var(--accent)' }} />
                <div>
                  <strong>Domingo:</strong>
                  <span style={{ display: 'block' }}>Fechado (Plantão Emergencial)</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Contato / Localização */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: 700,
              marginBottom: '24px',
              fontFamily: 'var(--font-heading)',
              position: 'relative',
              paddingBottom: '8px'
            }}>
              Onde Estamos
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '30px',
                height: '3px',
                backgroundColor: 'var(--primary)',
                borderRadius: 'var(--radius-full)'
              }} />
            </h4>
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              fontSize: '14px',
              color: 'var(--text-muted)'
            }}>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <span>Av. Beira Mar, 1500 - Praia dos Recifes, Vitória - ES</span>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>(27) 3344-9988 / (27) 99988-7766</span>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>contato@acquapetshop.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé Inferior */}
        <div style={{
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '14px',
          color: 'var(--text-muted)'
        }} className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Acqua Pet Shop. Todos os direitos reservados.</p>
          <p>
            Desenvolvido com carinho para o bem-estar do seu melhor amigo 🐾💙
          </p>
        </div>
      </div>
      
      <style>{`
        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row !important;
          }
        }
      `}</style>
    </footer>
  );
};
