import React, { useState } from 'react';
import { Calendar, User, Smile, ShieldAlert, CheckCircle, MessageSquare } from 'lucide-react';

export const Contact: React.FC = () => {
  const [form, setForm] = useState({
    ownerName: '',
    phone: '',
    petName: '',
    petType: 'dog',
    service: 'spa',
    date: '',
    time: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simula uma resposta do servidor após 1.5s
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const resetForm = () => {
    setForm({
      ownerName: '',
      phone: '',
      petName: '',
      petType: 'dog',
      service: 'spa',
      date: '',
      time: ''
    });
    setSubmitted(false);
  };

  return (
    <section
      id="agendamento"
      className="section-spacing section-dark"
      style={{
        position: 'relative',
        transition: 'var(--transition-smooth)'
      }}
    >
      <div className="container">
        <div className="contact-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '50px',
          alignItems: 'start',
          textAlign: 'left'
        }}>
          {/* Coluna 1: Informações de Contato / Chamada */}
          <div>
            <span style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              display: 'block',
              marginBottom: '12px'
            }}>
              Agende com Facilidade
            </span>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800,
              marginBottom: '20px',
              letterSpacing: '-1px',
              fontFamily: 'var(--font-heading)'
            }}>
              Dê ao seu pet o <span className="gradient-text">cuidado que ele merece</span>
            </h2>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '16px',
              lineHeight: 1.6,
              marginBottom: '32px'
            }}>
              Preencha o formulário ao lado para solicitar uma pré-reserva de banho, tosa ou consulta veterinária. Nossa equipe entrará em contato via WhatsApp em até 15 minutos para confirmar.
            </p>

            {/* Suporte Rápido WhatsApp */}
            <div className="glass-card" style={{
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderLeft: '4px solid #22c55e',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MessageSquare size={24} fill="#22c55e" />
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
                  Prefere falar diretamente no WhatsApp?
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Tire dúvidas ou agende de forma imediata com nossa atendente.
                </p>
                <a
                  href="https://wa.me/5527999887766"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#22c55e',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Iniciar Conversa &rarr;
                </a>
              </div>
            </div>

            {/* Alerta de Segurança */}
            <div style={{
              display: 'flex',
              gap: '10px',
              fontSize: '13px',
              color: 'var(--text-muted)',
              lineHeight: 1.4
            }}>
              <ShieldAlert size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>
                Fique tranquilo! Suas informações estão seguras conosco e serão usadas exclusivamente para a comunicação do agendamento.
              </span>
            </div>
          </div>

          {/* Coluna 2: Formulário de Agendamento Interativo */}
          <div id="contato">
            <div className="glass-card form-card-light" style={{
              padding: '40px',
              position: 'relative'
            }}>
              {submitted ? (
                /* Tela de Sucesso */
                <div style={{
                  textAlign: 'center',
                  padding: '30px 0'
                }}>
                  <div style={{
                    color: '#22c55e',
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <CheckCircle size={64} fill="rgba(34, 197, 94, 0.1)" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>
                    Solicitação Recebida!
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '30px' }}>
                    Obrigado, <strong>{form.ownerName}</strong>. Nós registramos a solicitação de <strong>{form.service === 'spa' ? 'Spa de Hidromassagem' : form.service === 'grooming' ? 'Estética & Tosa' : 'Clínica Veterinária'}</strong> para o(a) <strong>{form.petName}</strong> em <strong>{form.date} às {form.time}</strong>.
                    <br /><br />
                    Enviamos um resumo no seu celular e entraremos em contato para confirmar o agendamento final!
                  </p>
                  <button
                    onClick={resetForm}
                    className="gradient-bg gradient-bg-hover"
                    style={{
                      border: 'none',
                      color: '#fff',
                      padding: '14px 28px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 180, 216, 0.2)'
                    }}
                  >
                    Fazer outro Agendamento
                  </button>
                </div>
              ) : (
                /* Formulário normal */
                <form onSubmit={handleSubmit}>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    marginBottom: '30px',
                    fontFamily: 'var(--font-heading)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <Calendar size={22} style={{ color: 'var(--primary)' }} />
                    Dados do Agendamento
                  </h3>

                  {/* Nome do Tutor */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>
                      Seu Nome Completo
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Carlos Eduardo"
                        value={form.ownerName}
                        onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                        className="input-premium"
                        style={{ paddingLeft: '44px' }}
                      />
                      <User size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  {/* Contato (Telefone/WhatsApp) */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>
                      Celular / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: (27) 99988-7766"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-premium"
                    />
                  </div>

                  {/* Nome & Tipo do Pet */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>
                        Nome do Pet
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Rex"
                          value={form.petName}
                          onChange={(e) => setForm({ ...form, petName: e.target.value })}
                          className="input-premium"
                          style={{ paddingLeft: '44px' }}
                        />
                        <Smile size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>
                        Tipo de Pet
                      </label>
                      <select
                        value={form.petType}
                        onChange={(e) => setForm({ ...form, petType: e.target.value })}
                        className="input-premium"
                        style={{ height: '52px' }}
                      >
                        <option value="dog">Cão 🐶</option>
                        <option value="cat">Gato 🐱</option>
                        <option value="other">Outro 🐾</option>
                      </select>
                    </div>
                  </div>

                  {/* Serviço Escolhido */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>
                      Serviço Desejado
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="input-premium"
                      style={{ height: '52px' }}
                    >
                      <option value="spa">Spa de Hidromassagem (Ofurô + Ozônio)</option>
                      <option value="grooming">Estética & Tosa Estilizada</option>
                      <option value="vet">Consulta Veterinária Preventiva</option>
                      <option value="hotel">Hospedagem / Hotelzinho Acqua</option>
                    </select>
                  </div>

                  {/* Data & Hora */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '30px'
                  }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>
                        Data
                      </label>
                      <input
                        type="date"
                        required
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="input-premium"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>
                        Melhor Horário
                      </label>
                      <select
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        className="input-premium"
                        style={{ height: '52px' }}
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="08:00">08:00h</option>
                        <option value="10:00">10:00h</option>
                        <option value="13:00">13:00h</option>
                        <option value="15:00">15:00h</option>
                        <option value="17:00">17:00h</option>
                      </select>
                    </div>
                  </div>

                  {/* Botão de Envio */}
                  <button
                    type="submit"
                    className="gradient-bg gradient-bg-hover text-center"
                    disabled={loading}
                    style={{
                      border: 'none',
                      color: '#fff',
                      width: '100%',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '16px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 8px 18px rgba(0, 180, 216, 0.25)',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    {loading ? 'Processando Solicitação...' : 'Solicitar Pré-Reserva'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
