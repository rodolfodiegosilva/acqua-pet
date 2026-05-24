import React, { useEffect, useState } from 'react';
import { CalendarClock, HeartPulse, LayoutDashboard } from 'lucide-react';
import {
  MOCK_BACKOFFICE,
  type BackofficePet,
  clearBackofficeSession,
  getStoredBackofficeSession,
  mockBackofficeLogin,
  saveBackofficeSession
} from '../services/backoffice';
import type { MedicalRecord } from '../services/clientPortal';
import { BackofficeAuth } from '../features/backoffice/components/BackofficeAuth';
import { BackofficeShell } from '../features/backoffice/components/BackofficeShell';
import { VetAgendaTab } from '../features/backoffice/tabs/VetAgendaTab';
import { VetOverviewTab } from '../features/backoffice/tabs/VetOverviewTab';
import { VetPatientsTab } from '../features/backoffice/tabs/VetPatientsTab';
import type { BackofficeNavItem, BackofficeTheme, VetRecordDraft, VetTab } from '../features/backoffice/types';
import '../features/backoffice/backoffice.css';

const VET_PETS_STORAGE_KEY = 'acqua-pet-veterinary-pets';
const VET_RECORDS_STORAGE_KEY = 'acqua-pet-veterinary-records';

interface VeterinaryPortalProps {
  setView: (view: 'landing' | 'store' | 'client' | 'admin' | 'veterinary') => void;
}

export const VeterinaryPortal: React.FC<VeterinaryPortalProps> = ({ setView }) => {
  const [theme, setTheme] = useState<BackofficeTheme>(() => localStorage.getItem('acqua-pet-veterinary-theme') === 'dark' ? 'dark' : 'light');
  const [sessionUser, setSessionUser] = useState(() => getStoredBackofficeSession('veterinarian')?.user ?? null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<VetTab>('overview');
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [pets, setPets] = useState<BackofficePet[]>(() => {
    const storedPets = localStorage.getItem(VET_PETS_STORAGE_KEY);
    if (!storedPets) return MOCK_BACKOFFICE.pets;

    try {
      return JSON.parse(storedPets);
    } catch {
      return MOCK_BACKOFFICE.pets;
    }
  });
  const [records, setRecords] = useState<MedicalRecord[]>(() => {
    const storedRecords = localStorage.getItem(VET_RECORDS_STORAGE_KEY);
    if (!storedRecords) return MOCK_BACKOFFICE.records;

    try {
      return JSON.parse(storedRecords);
    } catch {
      return MOCK_BACKOFFICE.records;
    }
  });

  useEffect(() => {
    localStorage.setItem('acqua-pet-veterinary-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(VET_PETS_STORAGE_KEY, JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem(VET_RECORDS_STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    if (activeTab !== 'patients') {
      setSelectedPetId(null);
    }
  }, [activeTab]);

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
    setRecords((current: MedicalRecord[]) => [
      {
        id: current.reduce((highestId: number, record: MedicalRecord) => Math.max(highestId, record.id), 0) + 1,
        petId,
        veterinarian: sessionUser?.name ?? 'Equipe veterinária',
        ...draft
      },
      ...current
    ]);

    setPets((current: BackofficePet[]) =>
      current.map((pet: BackofficePet) =>
        pet.id === petId
          ? {
              ...pet,
              lastVisit: draft.date,
              nextAction: draft.returnWindow,
              status: draft.status === 'Estável' ? 'Ativo' : draft.status === 'Atenção' ? 'Observação' : 'Em acompanhamento'
            }
          : pet
      )
    );
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
      user={sessionUser}
      title="Central veterinária"
      description="Ambiente clínico desacoplado da operação geral, focado em agenda, pacientes, histórico e decisões de atendimento."
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      {activeTab === 'overview' && (
        <VetOverviewTab
          appointments={MOCK_BACKOFFICE.appointments}
          records={records}
          pets={pets}
        />
      )}
      {activeTab === 'agenda' && <VetAgendaTab appointments={MOCK_BACKOFFICE.appointments} pets={pets} />}
      {activeTab === 'patients' && (
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
