import React, { useEffect, useState } from 'react';
import { CalendarClock, HeartPulse, LayoutDashboard } from 'lucide-react';
import {
  type BackofficePet,
  clearBackofficeSession,
  createVeterinaryRecord,
  fetchBackofficeSnapshot,
  getStoredBackofficeSession,
  mockBackofficeLogin,
  saveBackofficeSession
} from '../services/backoffice';
import type { ClientAppointment, MedicalRecord } from '../services/clientPortal';
import { BackofficeAuth } from '../features/backoffice/components/BackofficeAuth';
import { BackofficeShell } from '../features/backoffice/components/BackofficeShell';
import { VetAgendaTab } from '../features/backoffice/tabs/VetAgendaTab';
import { VetOverviewTab } from '../features/backoffice/tabs/VetOverviewTab';
import { VetPatientsTab } from '../features/backoffice/tabs/VetPatientsTab';
import type { BackofficeNavItem, BackofficeTheme, VetRecordDraft, VetTab } from '../features/backoffice/types';
import '../features/backoffice/backoffice.css';

interface VeterinaryPortalProps {
  setView: (view: 'landing' | 'store' | 'client' | 'admin' | 'veterinary') => void;
}

export const VeterinaryPortal: React.FC<VeterinaryPortalProps> = ({ setView }) => {
  const [theme, setTheme] = useState<BackofficeTheme>(() => localStorage.getItem('acqua-pet-veterinary-theme') === 'dark' ? 'dark' : 'light');
  const [sessionUser, setSessionUser] = useState(() => getStoredBackofficeSession('veterinarian')?.user ?? null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [panelLoading, setPanelLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<VetTab>('overview');
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [pets, setPets] = useState<BackofficePet[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);

  useEffect(() => {
    localStorage.setItem('acqua-pet-veterinary-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (activeTab !== 'patients') {
      setSelectedPetId(null);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!sessionUser) return;
    setPanelLoading(true);
    fetchBackofficeSnapshot().then((snapshot) => {
      setPets(snapshot.pets);
      setRecords(snapshot.records);
      setAppointments(snapshot.appointments);
      setPanelLoading(false);
    });
  }, [sessionUser]);

  const navItems: BackofficeNavItem<VetTab>[] = [
    { id: 'overview', label: 'Visão clínica', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: CalendarClock },
    { id: 'patients', label: 'Pacientes', icon: HeartPulse }
  ];

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const session = await mockBackofficeLogin('veterinarian', credentials.email);
    saveBackofficeSession('veterinarian', session);
    setSessionUser(session.user);
    setLoading(false);
  };

  const handleLogout = () => {
    clearBackofficeSession('veterinarian');
    setSessionUser(null);
  };

  const handleCreateRecord = (petId: number, draft: VetRecordDraft) => {
    createVeterinaryRecord(petId, sessionUser?.name ?? 'Equipe veterinária', draft).then((snapshot) => {
      setPets(snapshot.pets);
      setRecords(snapshot.records);
    });
  };

  if (!sessionUser) {
    return (
      <BackofficeAuth
        role="veterinarian"
        loading={loading}
        credentials={credentials}
        setCredentials={setCredentials}
        onSubmit={handleLogin}
        onBackToSite={() => setView('landing')}
      />
    );
  }

  return (
    <BackofficeShell
      theme={theme}
      setTheme={setTheme}
      setView={setView}
      user={sessionUser}
      title="Central veterinária"
      description="Ambiente clínico desacoplado da operação geral, focado em agenda, pacientes, histórico e decisões de atendimento."
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      {panelLoading ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }}>
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="backoffice-card" style={{ minHeight: '170px', background: 'var(--backoffice-soft)', opacity: 0.7 }} />
            ))}
          </div>
          <div className="backoffice-two-cols" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
            <div className="backoffice-card" style={{ minHeight: '320px', background: 'var(--backoffice-soft)', opacity: 0.7 }} />
            <div className="backoffice-card" style={{ minHeight: '320px', background: 'var(--backoffice-soft)', opacity: 0.7 }} />
          </div>
        </div>
      ) : activeTab === 'overview' && (
        <VetOverviewTab
          appointments={appointments}
          records={records}
          pets={pets}
        />
      )}
      {!panelLoading && activeTab === 'agenda' && <VetAgendaTab appointments={appointments} pets={pets} />}
      {!panelLoading && activeTab === 'patients' && (
        <VetPatientsTab
          pets={pets}
          records={records}
          selectedPetId={selectedPetId}
          veterinarianName={sessionUser.name}
          onSelectPet={setSelectedPetId}
          onBackToList={() => setSelectedPetId(null)}
          onCreateRecord={handleCreateRecord}
        />
      )}
    </BackofficeShell>
  );
};
