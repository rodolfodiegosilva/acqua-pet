import React, { useState } from 'react';
import { CalendarDays, HeartPulse, MapPin, PawPrint, ShoppingBag, Sparkles } from 'lucide-react';
import type { ClientAppointment, ClientOrder, ClientPet, ClientUser } from '../../../services/clientPortal';
import { PortalSectionCard } from '../../../components/client/PortalSectionCard';
import { PortalStatCard } from '../../../components/client/PortalStatCard';

interface DashboardTabProps {
  pets: ClientPet[];
  petsCount: number;
  appointments: ClientAppointment[];
  medicalRecordsCount: number;
  orders: ClientOrder[];
  ordersCount: number;
  currentUser: ClientUser;
  onUpdateProfile: (updates: Pick<ClientUser, 'name' | 'email' | 'phone' | 'city'>) => void;
  isSubmittingProfile?: boolean;
  onOpenAppointments: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  pets,
  petsCount,
  appointments,
  medicalRecordsCount,
  orders,
  ordersCount,
  currentUser,
  onUpdateProfile,
  isSubmittingProfile = false,
  onOpenAppointments
}) => {
  const nextAppointment = appointments[0];
  const latestOrder = orders[0];
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    city: currentUser.city
  });

  const resetProfileForm = () => {
    setProfileForm({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      city: currentUser.city
    });
  };

  return (
    <>
      <div
        className="glass-card portal-dashboard-hero"
        style={{
          padding: '26px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.25fr) minmax(280px, 0.75fr)',
          gap: '18px',
          background: 'var(--portal-hero-surface)'
        }}
      >
        <div style={{ display: 'grid', gap: '14px' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '999px', background: 'var(--portal-pill-info-bg)', color: 'var(--portal-pill-info-text)', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
              <Sparkles size={14} />
              Painel do tutor
            </span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', lineHeight: 1.08, color: 'var(--portal-text)', marginBottom: '10px' }}>
              Tudo que importa para o cuidado dos seus pets em um só lugar.
            </h2>
            <p style={{ color: 'var(--portal-muted)', lineHeight: 1.7, maxWidth: '680px' }}>
              Acompanhe agenda, saúde, pedidos e próximos passos sem voltar para o site público.
            </p>
          </div>

          <div className="portal-dashboard-highlight-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
            <div className="portal-surface" style={{ padding: '16px' }}>
              <span className="portal-mini-label">Plano ativo</span>
              <strong style={{ color: 'var(--portal-text)' }}>{currentUser.plan}</strong>
            </div>
            <div className="portal-surface" style={{ padding: '16px' }}>
              <span className="portal-mini-label">Desde</span>
              <strong style={{ color: 'var(--portal-text)' }}>{currentUser.memberSince}</strong>
            </div>
            <div className="portal-surface" style={{ padding: '16px' }}>
              <span className="portal-mini-label">Base de atendimento</span>
              <strong style={{ color: 'var(--portal-text)' }}>{currentUser.city}</strong>
            </div>
          </div>
        </div>

        <div className="portal-surface" style={{ padding: '18px', display: 'grid', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={18} color="var(--portal-accent)" />
            <strong style={{ color: 'var(--portal-text)' }}>Próxima prioridade</strong>
          </div>
          {nextAppointment ? (
            <>
              <div>
                <strong style={{ display: 'block', fontSize: '18px', color: 'var(--portal-text)', marginBottom: '6px' }}>{nextAppointment.service}</strong>
                <p style={{ color: 'var(--portal-muted)', lineHeight: 1.6 }}>
                  {nextAppointment.date} às {nextAppointment.time} · {nextAppointment.location}
                </p>
              </div>
              <button className="portal-ghost-btn" onClick={onOpenAppointments}>
                Abrir agenda
              </button>
            </>
          ) : (
            <p style={{ color: 'var(--portal-muted)', lineHeight: 1.6 }}>
              Nenhum agendamento pendente no momento.
            </p>
          )}
        </div>
      </div>

      <div className="portal-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }}>
        <PortalStatCard icon={PawPrint} label="Pets cadastrados" value={String(petsCount)} hint="Perfis individuais com observações, vacinas e histórico clínico." />
        <PortalStatCard icon={CalendarDays} label="Próximos agendamentos" value={String(appointments.length)} hint="Consultas e serviços já em acompanhamento." />
        <PortalStatCard icon={HeartPulse} label="Prontuários ativos" value={String(medicalRecordsCount)} hint="Registros clínicos vinculados por pet." />
        <PortalStatCard icon={ShoppingBag} label="Pedidos no portal" value={String(ordersCount)} hint="Pedidos da loja com status e valor total." />
      </div>

      <div className="portal-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '20px' }}>
        <PortalSectionCard title="Agenda da semana" eyebrow="Operação" action={<button onClick={onOpenAppointments} className="portal-link-btn">Gerenciar agenda</button>}>
          <div style={{ display: 'grid', gap: '14px' }}>
            {appointments.map((appointment) => (
              <div key={appointment.id} style={{ padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--portal-border)', background: 'var(--portal-soft-surface)', display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '16px', marginBottom: '4px', color: 'var(--portal-text)' }}>{appointment.service}</strong>
                  <span style={{ display: 'block', fontSize: '14px', color: 'var(--portal-muted)' }}>{appointment.veterinarian}</span>
                  <span style={{ display: 'block', fontSize: '13px', color: 'var(--portal-muted)', marginTop: '6px' }}>{appointment.date} às {appointment.time} · {appointment.location}</span>
                </div>
                <span style={{ alignSelf: 'start', padding: '8px 12px', borderRadius: 'var(--radius-full)', background: 'var(--portal-pill-info-bg)', color: 'var(--portal-pill-info-text)', fontSize: '12px', fontWeight: 700 }}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </PortalSectionCard>

        <div style={{ display: 'grid', gap: '20px' }}>
          <PortalSectionCard title="Pets em destaque" eyebrow="Perfis">
            <div style={{ display: 'grid', gap: '12px' }}>
              {pets.slice(0, 3).map((pet) => (
                <div key={pet.id} className="portal-surface" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--portal-text)', marginBottom: '4px' }}>{pet.avatar} {pet.name}</strong>
                      <p style={{ color: 'var(--portal-muted)', fontSize: '14px', lineHeight: 1.5 }}>
                        {pet.species} · {pet.sex} · {pet.breed}
                      </p>
                    </div>
                    <span style={{ padding: '6px 10px', borderRadius: '999px', background: 'var(--portal-pill-info-bg)', color: 'var(--portal-pill-info-text)', fontSize: '12px', fontWeight: 700 }}>
                      {pet.age}
                    </span>
                  </div>
                  <p style={{ color: 'var(--portal-muted)', fontSize: '13px', lineHeight: 1.6, marginTop: '10px' }}>
                    {pet.observation}
                  </p>
                </div>
              ))}
            </div>
          </PortalSectionCard>

          <PortalSectionCard
            title="Conta e pedidos"
            eyebrow="Conta"
            action={
              <button
                type="button"
                className="portal-link-btn"
                onClick={() => {
                  resetProfileForm();
                  setIsEditingProfile((current) => !current);
                }}
              >
                {isEditingProfile ? 'Fechar edição' : 'Editar perfil'}
              </button>
            }
          >
            {isEditingProfile ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  onUpdateProfile(profileForm);
                  setIsEditingProfile(false);
                }}
                style={{ display: 'grid', gap: '12px' }}
              >
                <input className="portal-input" type="text" placeholder="Nome completo" value={profileForm.name} onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))} />
                <input className="portal-input" type="email" placeholder="E-mail" value={profileForm.email} onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))} />
                <input className="portal-input" type="text" placeholder="Telefone" value={profileForm.phone} onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))} />
                <input className="portal-input" type="text" placeholder="Cidade base" value={profileForm.city} onChange={(event) => setProfileForm((current) => ({ ...current, city: event.target.value }))} />
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button type="submit" className="portal-ghost-btn" disabled={isSubmittingProfile}>
                    {isSubmittingProfile ? 'Salvando perfil...' : 'Salvar dados pessoais'}
                  </button>
                  <button
                    type="button"
                    className="portal-link-btn"
                    onClick={() => {
                      resetProfileForm();
                      setIsEditingProfile(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gap: '14px' }}>
                {[
                  ['Nome', currentUser.name],
                  ['E-mail', currentUser.email],
                  ['Plano', currentUser.plan],
                  ['Telefone', currentUser.phone],
                  ['Cidade', currentUser.city],
                  ['Último pedido', latestOrder ? `${latestOrder.number} · ${latestOrder.status}` : 'Nenhum pedido recente']
                ].map(([label, value]) => (
                  <div key={label} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--portal-border)' }}>
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--portal-muted)', marginBottom: '4px' }}>{label}</span>
                    <strong style={{ fontSize: '15px', color: 'var(--portal-text)', overflowWrap: 'anywhere' }}>{value}</strong>
                  </div>
                ))}
              </div>
            )}
          </PortalSectionCard>
        </div>
      </div>
    </>
  );
};
