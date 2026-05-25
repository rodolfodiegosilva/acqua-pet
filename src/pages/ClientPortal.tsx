import React, { useEffect, useState } from 'react';
import { CalendarDays, HeartPulse, LayoutDashboard, PawPrint, ShoppingBag, Stethoscope } from 'lucide-react';
import type { Product } from '../services/api';
import {
  clearStoredClientAuthSession,
  createClientAppointment,
  createClientPet,
  fetchClientPortalSnapshot,
  getStoredClientAuthSession,
  mockAuthLogin,
  mockAuthRegister,
  saveClientAuthSession,
  updateClientProfile,
  updateClientPet,
  type ClientAppointment,
  type ClientOrder,
  type ClientPet,
  type ClientPetSpecies,
  type ClientPetSex,
  type ClientUser,
  type MedicalRecord,
  type VetAvailability
} from '../services/clientPortal';
import { ClientPortalAuth } from '../features/client-portal/components/ClientPortalAuth';
import { ClientPortalSidebar } from '../features/client-portal/components/ClientPortalSidebar';
import { ClientPortalTopbar } from '../features/client-portal/components/ClientPortalTopbar';
import { DashboardTab } from '../features/client-portal/tabs/DashboardTab';
import { PetsTab } from '../features/client-portal/tabs/PetsTab';
import { AppointmentsTab } from '../features/client-portal/tabs/AppointmentsTab';
import { MedicalTab } from '../features/client-portal/tabs/MedicalTab';
import { VetsTab } from '../features/client-portal/tabs/VetsTab';
import { StoreTab } from '../features/client-portal/tabs/StoreTab';
import type { AuthMode, PortalTab, PortalTabItem, PortalTheme } from '../features/client-portal/types';
import '../features/client-portal/clientPortal.css';

interface ClientPortalProps {
  setView: (view: 'landing' | 'store' | 'client') => void;
  addToCart: (product: Product) => void;
}

const formatPtBrDateInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export const ClientPortal: React.FC<ClientPortalProps> = ({ setView, addToCart }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [activeTab, setActiveTab] = useState<PortalTab>('dashboard');
  const [authLoading, setAuthLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [portalTheme, setPortalTheme] = useState<PortalTheme>(() => {
    const saved = localStorage.getItem('acqua-pet-client-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });
  const [currentUser, setCurrentUser] = useState<ClientUser | null>(() => getStoredClientAuthSession()?.user ?? null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<'pet' | 'appointment' | 'profile' | null>(null);
  const [pets, setPets] = useState<ClientPet[]>([]);
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [veterinarians, setVeterinarians] = useState<VetAvailability[]>([]);
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedMedicalPetId, setSelectedMedicalPetId] = useState<number>(1);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [petForm, setPetForm] = useState<{ name: string; species: ClientPetSpecies | ''; sex: ClientPetSex | ''; breed: string; age: string; weight: string; observation: string }>({
    name: '',
    species: '',
    sex: '',
    breed: '',
    age: '',
    weight: '',
    observation: ''
  });
  const [appointmentForm, setAppointmentForm] = useState({
    type: 'Serviço' as ClientAppointment['type'],
    petId: '1',
    service: 'Consulta clínica premium',
    veterinarian: '',
    date: '28/05/2026',
    time: '15:40',
    pickupAddress: '',
    destinationAddress: 'Unidade Coroado',
    transportMode: 'Somente ida' as NonNullable<ClientAppointment['transportMode']>,
    companion: 'Tutor acompanha' as NonNullable<ClientAppointment['companion']>
  });

  useEffect(() => {
    localStorage.setItem('acqua-pet-client-theme', portalTheme);
  }, [portalTheme]);

  useEffect(() => {
    if (!currentUser) return;

    let isMounted = true;
    setPortalLoading(true);

    fetchClientPortalSnapshot().then((snapshot) => {
      if (!isMounted) return;
      setPets(snapshot.pets);
      setAppointments(snapshot.appointments);
      setRecords(snapshot.medicalRecords);
      setVeterinarians(snapshot.veterinarians);
      setOrders(snapshot.orders);
      setProducts(snapshot.recommendedProducts);
      setSelectedMedicalPetId(snapshot.pets[0]?.id ?? 1);
      setAppointmentForm((current) => ({
        ...current,
        petId: String(snapshot.pets[0]?.id ?? 1),
        veterinarian: snapshot.veterinarians[0]?.name ?? ''
      }));
      setPortalLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const tabItems: PortalTabItem[] = [
    { id: 'dashboard', label: 'Visão geral', icon: LayoutDashboard },
    { id: 'pets', label: 'Meus pets', icon: PawPrint },
    { id: 'appointments', label: 'Agendamentos', icon: CalendarDays },
    { id: 'medical', label: 'Histórico médico', icon: HeartPulse },
    { id: 'vets', label: 'Veterinários', icon: Stethoscope },
    { id: 'store', label: 'Loja do cliente', icon: ShoppingBag }
  ];

  const upcomingAppointments = appointments.filter((appointment) => appointment.status !== 'Concluído');
  const filteredRecords = records.filter((record) => record.petId === selectedMedicalPetId);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);
    const session = await mockAuthLogin(loginForm.email);
    saveClientAuthSession(session);
    setCurrentUser(session.user);
    setAuthLoading(false);
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);
    const session = await mockAuthRegister(registerForm.name, registerForm.email);
    const hydratedSession = {
      ...session,
      user: {
        ...session.user,
        phone: registerForm.phone || session.user.phone
      }
    };
    saveClientAuthSession(hydratedSession);
    setCurrentUser(hydratedSession.user);
    setAuthLoading(false);
  };

  const handleAddPet = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!petForm.name || !petForm.species || !petForm.breed) return;
    setActionLoading('pet');

    const newPet = await createClientPet({
      name: petForm.name,
      species: petForm.species,
      sex: petForm.sex || 'Não informado',
      breed: petForm.breed,
      age: petForm.age || 'Idade não informada',
      weight: petForm.weight || 'Peso não informado',
      avatar: petForm.species.toLowerCase().includes('gato')
        ? '🐱'
        : petForm.species.toLowerCase().includes('peixe')
          ? '🐠'
          : petForm.species.toLowerCase().includes('ave')
            ? '🦜'
            : '🐾',
      tutorName: currentUser?.name ?? 'Cliente AcquaPet',
      observation: petForm.observation || 'Cadastro criado pelo portal do cliente.',
      vaccines: []
    });

    setPets((prev) => [...prev, newPet]);
    setPetForm({ name: '', species: '', sex: '', breed: '', age: '', weight: '', observation: '' });
    setActionLoading(null);
  };

  const handleUpdatePet = async (petId: number) => {
    if (!petForm.name || !petForm.species || !petForm.breed) return;
    setActionLoading('pet');

    await updateClientPet(petId, {
      name: petForm.name,
      species: petForm.species as ClientPetSpecies,
      sex: petForm.sex || 'Não informado',
      breed: petForm.breed,
      age: petForm.age || 'Idade não informada',
      weight: petForm.weight || 'Peso não informado',
      observation: petForm.observation || 'Cadastro atualizado pelo portal do cliente.',
      avatar: petForm.species.toLowerCase().includes('gato')
        ? '🐱'
        : petForm.species.toLowerCase().includes('peixe')
          ? '🐠'
          : petForm.species.toLowerCase().includes('ave')
            ? '🦜'
            : '🐾'
    });

    setPets((current) =>
      current.map((pet) =>
        pet.id === petId
          ? {
              ...pet,
              name: petForm.name,
              species: petForm.species as ClientPetSpecies,
              sex: petForm.sex || 'Não informado',
              breed: petForm.breed,
              age: petForm.age || 'Idade não informada',
              weight: petForm.weight || 'Peso não informado',
              observation: petForm.observation || 'Cadastro atualizado pelo portal do cliente.',
              avatar: petForm.species.toLowerCase().includes('gato')
                ? '🐱'
                : petForm.species.toLowerCase().includes('peixe')
                  ? '🐠'
                  : petForm.species.toLowerCase().includes('ave')
                    ? '🦜'
                    : '🐾'
            }
          : pet
      )
    );
    setPetForm({ name: '', species: '', sex: '', breed: '', age: '', weight: '', observation: '' });
    setActionLoading(null);
  };

  const handleCreateAppointment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (appointmentForm.type === 'Táxi Pet' && !appointmentForm.pickupAddress.trim()) return;
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(appointmentForm.date)) return;
    setActionLoading('appointment');

    const newAppointment = await createClientAppointment({
      petId: Number(appointmentForm.petId),
      type: appointmentForm.type,
      service: appointmentForm.service,
      veterinarian: appointmentForm.type === 'Táxi Pet' ? 'Central de mobilidade pet' : appointmentForm.veterinarian,
      date: appointmentForm.date,
      time: appointmentForm.time,
      status: 'Confirmado',
      location: appointmentForm.type === 'Táxi Pet' ? `Rota agendada · ${appointmentForm.destinationAddress}` : 'Unidade Coroado',
      pickupAddress: appointmentForm.type === 'Táxi Pet' ? appointmentForm.pickupAddress : undefined,
      destinationAddress: appointmentForm.type === 'Táxi Pet' ? appointmentForm.destinationAddress : undefined,
      transportMode: appointmentForm.type === 'Táxi Pet' ? appointmentForm.transportMode : undefined,
      companion: appointmentForm.type === 'Táxi Pet' ? appointmentForm.companion : undefined
    });

    setAppointments((prev) => [newAppointment, ...prev]);
    setAppointmentForm((prev) => ({
      ...prev,
      type: 'Serviço',
      service: 'Consulta clínica premium',
      veterinarian: veterinarians[0]?.name ?? '',
      date: '28/05/2026',
      time: '15:40',
      pickupAddress: '',
      destinationAddress: 'Unidade Coroado',
      transportMode: 'Somente ida',
      companion: 'Tutor acompanha'
    }));
    setActiveTab('appointments');
    setActionLoading(null);
  };

  const handleUpdateProfile = async (updates: Pick<ClientUser, 'name' | 'email' | 'cpf' | 'phone' | 'city' | 'neighborhood'>) => {
    setActionLoading('profile');
    const nextUser = await updateClientProfile(updates);
    setCurrentUser(nextUser);

    const storedSession = getStoredClientAuthSession();
    if (storedSession) {
      saveClientAuthSession({
        ...storedSession,
        user: {
          ...storedSession.user,
          ...nextUser
        }
      });
    }

    setPets((current) => current.map((pet) => ({ ...pet, tutorName: nextUser.name })));
    setActionLoading(null);
  };

  const handleLogout = () => {
    clearStoredClientAuthSession();
    setCurrentUser(null);
    setAuthMode('login');
  };

  if (!currentUser) {
    return (
      <ClientPortalAuth
        authMode={authMode}
        authLoading={authLoading}
        loginForm={loginForm}
        registerForm={registerForm}
        setAuthMode={setAuthMode}
        setView={setView}
        setLoginForm={setLoginForm}
        setRegisterForm={setRegisterForm}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="portal-app" data-portal-theme={portalTheme} style={{ minHeight: '100vh', paddingTop: '32px', paddingBottom: '32px', background: 'var(--portal-bg)' }}>
      <div className="container">
        <div className="portal-frame">
          <ClientPortalTopbar onOpenSidebar={() => setIsSidebarOpen(true)} isSidebarOpen={isSidebarOpen} />

          <div className="portal-shell" style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: '24px' }}>
            <ClientPortalSidebar
              currentUser={currentUser}
              activeTab={activeTab}
              tabItems={tabItems}
              setActiveTab={setActiveTab}
              setView={setView}
              onLogout={handleLogout}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              portalTheme={portalTheme}
              setPortalTheme={setPortalTheme}
            />

            <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
              <div className="glass-card" style={{ padding: '30px', background: 'var(--portal-hero-surface)' }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--portal-danger-text)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>
                  Área do Cliente
                </span>
                <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, lineHeight: 1.08, marginBottom: '10px', color: 'var(--portal-text)' }}>
                  {activeTab === 'dashboard' && 'Resumo operacional do cuidado do seu pet'}
                  {activeTab === 'pets' && 'Cadastro e gestão de perfis dos seus pets'}
                  {activeTab === 'appointments' && 'Agendamentos de serviços e consultas'}
                  {activeTab === 'medical' && 'Histórico médico individual por pet'}
                  {activeTab === 'vets' && 'Disponibilidade da equipe veterinária'}
                  {activeTab === 'store' && 'Loja com recomendações personalizadas'}
                </h1>
                <p style={{ fontSize: '15px', color: 'var(--portal-muted)', maxWidth: '760px', lineHeight: 1.7 }}>
                  Ambiente privado com tema e navegação próprios, separado do site público e estruturado em módulos de produto.
                </p>
              </div>

              {portalLoading ? (
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div className="portal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }}>
                    {Array.from({ length: 4 }, (_, index) => (
                      <div key={index} className="glass-card" style={{ minHeight: '168px', background: 'var(--portal-card)', opacity: 0.7 }} />
                    ))}
                  </div>
                  <div className="portal-overview-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
                    <div className="glass-card" style={{ minHeight: '320px', background: 'var(--portal-card)', opacity: 0.7 }} />
                    <div className="glass-card" style={{ minHeight: '320px', background: 'var(--portal-card)', opacity: 0.7 }} />
                  </div>
                </div>
              ) : activeTab === 'dashboard' && (
                <DashboardTab
                  pets={pets}
                  petsCount={pets.length}
                  appointments={upcomingAppointments}
                  medicalRecordsCount={records.length}
                  orders={orders}
                  ordersCount={orders.length}
                  currentUser={currentUser}
                  onUpdateProfile={handleUpdateProfile}
                  isSubmittingProfile={actionLoading === 'profile'}
                  onOpenAppointments={() => setActiveTab('appointments')}
                />
              )}

              {!portalLoading && activeTab === 'pets' && (
                <PetsTab
                  pets={pets}
                  petForm={petForm}
                  setPetForm={setPetForm}
                  onAddPet={handleAddPet}
                  onUpdatePet={handleUpdatePet}
                  isSubmitting={actionLoading === 'pet'}
                  onOpenMedical={(petId) => {
                    setSelectedMedicalPetId(petId);
                    setActiveTab('medical');
                  }}
                />
              )}

              {!portalLoading && activeTab === 'appointments' && (
                <AppointmentsTab
                  pets={pets}
                  appointments={appointments}
                  veterinarians={veterinarians}
                  appointmentForm={appointmentForm}
                  setAppointmentForm={setAppointmentForm}
                  onCreateAppointment={handleCreateAppointment}
                  isSubmitting={actionLoading === 'appointment'}
                  formatDateInput={formatPtBrDateInput}
                />
              )}

              {!portalLoading && activeTab === 'medical' && (
                <MedicalTab
                  pets={pets}
                  selectedMedicalPetId={selectedMedicalPetId}
                  setSelectedMedicalPetId={setSelectedMedicalPetId}
                  records={filteredRecords}
                />
              )}

              {!portalLoading && activeTab === 'vets' && <VetsTab veterinarians={veterinarians} />}

              {!portalLoading && activeTab === 'store' && (
                <StoreTab
                  pets={pets}
                  products={products}
                  orders={orders}
                  addToCart={addToCart}
                  setView={setView}
                />
              )}

              <footer className="portal-panel-footer">
                <span>AcquaPet Client Suite</span>
                <span>Ambiente privado mockado com estrutura pronta para API e produção.</span>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
