import React, { useEffect, useState } from 'react';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import DashboardRounded from '@mui/icons-material/DashboardRounded';
import FavoriteRounded from '@mui/icons-material/FavoriteRounded';
import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';
import { BackofficeAuth } from '@/features/backoffice/components/BackofficeAuth';
import { BackofficeShell } from '@/features/backoffice/components/BackofficeShell';
import { VetAgendaTab } from '@/features/backoffice/tabs/VetAgendaTab';
import { VetOverviewTab } from '@/features/backoffice/tabs/VetOverviewTab';
import { VetPatientsTab } from '@/features/backoffice/tabs/VetPatientsTab';
import type { BackofficeNavItem, BackofficeTheme, VetRecordDraft, VetTab } from '@/features/backoffice/types';
import {
  type BackofficePet,
  clearBackofficeSession,
  createVeterinaryRecord,
  fetchBackofficeSnapshot,
  getStoredBackofficeSession,
  mockBackofficeLogin,
  saveBackofficeSession
} from '@/services/backoffice';
import type { ClientAppointment, MedicalRecord } from '@/services/clientPortal';
import { subscribeToAppSessionUpdates } from '@/services/mockStorage';
import { getVeterinaryTabFromPath, VETERINARY_PORTAL_ROUTES } from '@/services/panelRoutes';
import type { AppView } from '@/types/navigation';
import '@/features/backoffice/backoffice.css';

interface VeterinaryPortalProps {
  setView: (view: AppView) => void;
}

export const VeterinaryPortal: React.FC<VeterinaryPortalProps> = ({ setView }) => {
  const [theme, setTheme] = useState<BackofficeTheme>(() => localStorage.getItem('acqua-pet-veterinary-theme') === 'dark' ? 'dark' : 'light');
  const [sessionUser, setSessionUser] = useState(() => getStoredBackofficeSession('veterinarian')?.user ?? null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [panelLoading, setPanelLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<VetTab>(() => getVeterinaryTabFromPath(window.location.pathname));
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [pets, setPets] = useState<BackofficePet[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const authBackground =
    'radial-gradient(circle at top left, rgba(3, 2, 116, 0.08), transparent 28%), radial-gradient(circle at bottom right, rgba(214, 20, 44, 0.08), transparent 24%), var(--bg-primary)';

  useEffect(() => {
    localStorage.setItem('acqua-pet-veterinary-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getVeterinaryTabFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const nextPath = VETERINARY_PORTAL_ROUTES[activeTab];
    const currentPath = window.location.pathname;
    if (currentPath !== nextPath) {
      if (currentPath === '/area-veterinario') {
        window.history.replaceState({}, '', nextPath);
      } else {
        window.history.pushState({}, '', nextPath);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'patients') {
      setSelectedPetId(null);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!sessionUser) return;

    let isMounted = true;
    const syncSnapshot = (withLoading = false) => {
      if (withLoading) {
        setPanelLoading(true);
      }

      fetchBackofficeSnapshot().then((snapshot) => {
        if (!isMounted) return;
        setPets(snapshot.pets);
        setRecords(snapshot.records);
        setAppointments(snapshot.appointments);
        setPanelLoading(false);
      });
    };

    syncSnapshot(true);
    const unsubscribe = subscribeToAppSessionUpdates(() => {
      syncSnapshot(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [sessionUser]);

  const navItems: BackofficeNavItem<VetTab>[] = [
    { id: 'overview', label: 'Visão clínica', icon: DashboardRounded },
    { id: 'agenda', label: 'Agenda', icon: CalendarMonthRounded },
    { id: 'patients', label: 'Pacientes', icon: FavoriteRounded }
  ];

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const session = await mockBackofficeLogin('veterinarian', credentials.email);
      saveBackofficeSession('veterinarian', session);
      setSessionUser(session.user);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Não foi possível autenticar neste painel.');
    } finally {
      setLoading(false);
    }
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header view="veterinary" setView={setView} cartItemCount={0} onCartClick={() => undefined} />
        <main style={{ flex: '1 0 auto', background: authBackground }}>
          <BackofficeAuth
            role="veterinarian"
            loading={loading}
            authError={authError}
            credentials={credentials}
            setCredentials={setCredentials}
            onSubmit={handleLogin}
          />
        </main>
        <Footer setView={setView} />
      </div>
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
