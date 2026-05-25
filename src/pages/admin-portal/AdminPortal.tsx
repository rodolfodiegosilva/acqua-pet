import React, { useEffect, useState } from 'react';
import { Boxes, LayoutDashboard, PackageSearch, PawPrint, Users } from 'lucide-react';
import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';
import {
  cancelBackofficeOrder,
  createBackofficeInventoryItem,
  fetchBackofficeSnapshot,
  type BackofficeInventoryItem,
  type BackofficeOrder,
  type BackofficePet,
  type BackofficeSnapshot,
  clearBackofficeSession,
  getStoredBackofficeSession,
  mockBackofficeLogin,
  saveBackofficeSession,
  updateBackofficeInventoryStock,
  updateBackofficePet,
  updateBackofficeOrderStatus
} from '@/services/backoffice';
import { subscribeToAppSessionUpdates } from '@/services/mockStorage';
import { BackofficeAuth } from '@/features/backoffice/components/BackofficeAuth';
import { BackofficeShell } from '@/features/backoffice/components/BackofficeShell';
import { AdminClientsTab } from '@/features/backoffice/tabs/AdminClientsTab';
import { AdminInventoryTab } from '@/features/backoffice/tabs/AdminInventoryTab';
import { AdminOverviewTab } from '@/features/backoffice/tabs/AdminOverviewTab';
import { AdminOrdersTab } from '@/features/backoffice/tabs/AdminOrdersTab';
import { AdminPetsTab } from '@/features/backoffice/tabs/AdminPetsTab';
import type { AdminTab, BackofficeNavItem, BackofficeTheme } from '@/features/backoffice/types';
import type { AppView } from '@/types/navigation';
import '@/features/backoffice/backoffice.css';

interface AdminPortalProps {
  setView: (view: AppView) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ setView }) => {
  const [theme, setTheme] = useState<BackofficeTheme>(() => localStorage.getItem('acqua-pet-admin-theme') === 'dark' ? 'dark' : 'light');
  const [sessionUser, setSessionUser] = useState(() => getStoredBackofficeSession('admin')?.user ?? null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [panelLoading, setPanelLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [snapshot, setSnapshot] = useState<BackofficeSnapshot | null>(null);
  const authBackground =
    'radial-gradient(circle at top left, rgba(3, 2, 116, 0.08), transparent 28%), radial-gradient(circle at bottom right, rgba(214, 20, 44, 0.08), transparent 24%), var(--bg-primary)';

  useEffect(() => {
    localStorage.setItem('acqua-pet-admin-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!sessionUser) return;

    let isMounted = true;
    const syncSnapshot = (withLoading = false) => {
      if (withLoading) {
        setPanelLoading(true);
      }

      fetchBackofficeSnapshot().then((nextSnapshot) => {
        if (!isMounted) return;
        setSnapshot(nextSnapshot);
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

  const navItems: BackofficeNavItem<AdminTab>[] = [
    { id: 'overview', label: 'Visão geral', icon: LayoutDashboard },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'pets', label: 'Pets', icon: PawPrint },
    { id: 'inventory', label: 'Estoque', icon: Boxes },
    { id: 'orders', label: 'Pedidos', icon: PackageSearch }
  ];

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const session = await mockBackofficeLogin('admin', credentials.email);
      saveBackofficeSession('admin', session);
      setSessionUser(session.user);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Não foi possível autenticar neste painel.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearBackofficeSession('admin');
    setSessionUser(null);
  };

  const handleAdjustStock = async (itemId: number, nextStock: number) => {
    setActionLoading(true);
    const nextInventory = await updateBackofficeInventoryStock(itemId, nextStock);
    setSnapshot((current) => (current ? { ...current, inventory: nextInventory } : current));
    setActionLoading(false);
  };

  const handleCreateProduct = async (product: Omit<BackofficeInventoryItem, 'id' | 'status'>) => {
    setActionLoading(true);
    const nextItem = await createBackofficeInventoryItem(product);
    setSnapshot((current) => (current ? { ...current, inventory: [nextItem, ...current.inventory] } : current));
    setActionLoading(false);
  };

  const handleUpdateOrderStatus = async (orderId: number, status: BackofficeOrder['status']) => {
    setActionLoading(true);
    const nextOrders = await updateBackofficeOrderStatus(orderId, status);
    setSnapshot((current) => (current ? { ...current, orders: nextOrders } : current));
    setActionLoading(false);
  };

  const handleCancelOrder = async (orderId: number) => {
    setActionLoading(true);
    const nextOrders = await cancelBackofficeOrder(orderId);
    setSnapshot((current) => (current ? { ...current, orders: nextOrders } : current));
    setActionLoading(false);
  };

  const handleUpdatePet = async (petId: number, updates: Partial<Omit<BackofficePet, 'id' | 'clientId' | 'tutorName' | 'vaccines'>>) => {
    setActionLoading(true);
    const nextPets = await updateBackofficePet(petId, updates);
    setSnapshot((current) => (current ? { ...current, pets: nextPets } : current));
    setActionLoading(false);
  };

  if (!sessionUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header view="admin" setView={setView} cartItemCount={0} onCartClick={() => undefined} />
        <main style={{ flex: '1 0 auto', background: authBackground }}>
          <BackofficeAuth
            role="admin"
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
      setView={setView}
      user={sessionUser}
      title="Central administrativa"
      description="Painel operacional para gerenciar carteira de clientes, pets, riscos e rotina comercial do ecossistema."
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      {panelLoading || !snapshot ? (
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
        <AdminOverviewTab
          clients={snapshot.clients}
          pets={snapshot.pets}
          alerts={snapshot.alerts}
          inventory={snapshot.inventory}
          orders={snapshot.orders}
        />
      )}
      {!panelLoading && snapshot && activeTab === 'clients' && <AdminClientsTab clients={snapshot.clients} />}
      {!panelLoading && snapshot && activeTab === 'pets' && <AdminPetsTab pets={snapshot.pets} clients={snapshot.clients} onUpdatePet={handleUpdatePet} isSubmitting={actionLoading} />}
      {!panelLoading && snapshot && activeTab === 'inventory' && <AdminInventoryTab inventory={snapshot.inventory} onAdjustStock={handleAdjustStock} onCreateProduct={handleCreateProduct} isSubmitting={actionLoading} />}
      {!panelLoading && snapshot && activeTab === 'orders' && <AdminOrdersTab orders={snapshot.orders} clients={snapshot.clients} onUpdateOrderStatus={handleUpdateOrderStatus} onCancelOrder={handleCancelOrder} />}
    </BackofficeShell>
  );
};
