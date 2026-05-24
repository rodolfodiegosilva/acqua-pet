import React, { useEffect, useState } from 'react';
import { Boxes, LayoutDashboard, PackageSearch, PawPrint, Users } from 'lucide-react';
import {
  MOCK_BACKOFFICE,
  type BackofficeInventoryItem,
  type BackofficeOrder,
  clearBackofficeSession,
  getStoredBackofficeSession,
  mockBackofficeLogin,
  saveBackofficeSession
} from '../services/backoffice';
import { BackofficeAuth } from '../features/backoffice/components/BackofficeAuth';
import { BackofficeShell } from '../features/backoffice/components/BackofficeShell';
import { AdminClientsTab } from '../features/backoffice/tabs/AdminClientsTab';
import { AdminInventoryTab } from '../features/backoffice/tabs/AdminInventoryTab';
import { AdminOverviewTab } from '../features/backoffice/tabs/AdminOverviewTab';
import { AdminOrdersTab } from '../features/backoffice/tabs/AdminOrdersTab';
import { AdminPetsTab } from '../features/backoffice/tabs/AdminPetsTab';
import type { AdminTab, BackofficeNavItem, BackofficeTheme } from '../features/backoffice/types';
import '../features/backoffice/backoffice.css';

const ADMIN_INVENTORY_STORAGE_KEY = 'acqua-pet-admin-inventory';

interface AdminPortalProps {
  setView: (view: 'landing' | 'store' | 'client' | 'admin' | 'veterinary') => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ setView }) => {
  const [theme, setTheme] = useState<BackofficeTheme>(() => localStorage.getItem('acqua-pet-admin-theme') === 'dark' ? 'dark' : 'light');
  const [sessionUser, setSessionUser] = useState(() => getStoredBackofficeSession('admin')?.user ?? null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [inventory, setInventory] = useState<BackofficeInventoryItem[]>(() => {
    const storedInventory = localStorage.getItem(ADMIN_INVENTORY_STORAGE_KEY);
    if (!storedInventory) return MOCK_BACKOFFICE.inventory;

    try {
      return JSON.parse(storedInventory) as BackofficeInventoryItem[];
    } catch {
      return MOCK_BACKOFFICE.inventory;
    }
  });
  const [orders, setOrders] = useState<BackofficeOrder[]>(MOCK_BACKOFFICE.orders);

  useEffect(() => {
    localStorage.setItem('acqua-pet-admin-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(ADMIN_INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory]);

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
    const session = await mockBackofficeLogin('admin', credentials.email);
    saveBackofficeSession('admin', session);
    setSessionUser(session.user);
    setLoading(false);
  };

  const handleLogout = () => {
    clearBackofficeSession('admin');
    setSessionUser(null);
  };

  const handleAdjustStock = (itemId: number, nextStock: number) => {
    setInventory((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              stock: nextStock,
              status: nextStock <= Math.max(2, Math.floor(item.minStock / 2)) ? 'Crítico' : nextStock <= item.minStock ? 'Baixo' : 'Saudável'
            }
          : item
      )
    );
  };

  const handleCreateProduct = (product: Omit<BackofficeInventoryItem, 'id' | 'status'>) => {
    setInventory((current) => {
      const nextId = current.reduce((highestId, item) => Math.max(highestId, item.id), 0) + 1;
      const nextStock = Math.max(0, product.stock);

      return [
        {
          ...product,
          id: nextId,
          stock: nextStock,
          status: nextStock <= Math.max(2, Math.floor(product.minStock / 2)) ? 'Crítico' : nextStock <= product.minStock ? 'Baixo' : 'Saudável'
        },
        ...current
      ];
    });
  };

  const handleUpdateOrderStatus = (orderId: number, status: BackofficeOrder['status']) => {
    setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, status } : order)));
  };

  const handleCancelOrder = (orderId: number) => {
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, status: 'Cancelado', notes: `${order.notes} Cancelado pelo admin.` } : order))
    );
  };

  if (!sessionUser) {
    return (
      <BackofficeAuth
        role="admin"
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
      title="Central administrativa"
      description="Painel operacional para gerenciar carteira de clientes, pets, riscos e rotina comercial do ecossistema."
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      {activeTab === 'overview' && (
        <AdminOverviewTab
          clients={MOCK_BACKOFFICE.clients}
          pets={MOCK_BACKOFFICE.pets}
          alerts={MOCK_BACKOFFICE.alerts}
          inventory={inventory}
          orders={orders}
        />
      )}
      {activeTab === 'clients' && <AdminClientsTab clients={MOCK_BACKOFFICE.clients} />}
      {activeTab === 'pets' && <AdminPetsTab pets={MOCK_BACKOFFICE.pets} clients={MOCK_BACKOFFICE.clients} />}
      {activeTab === 'inventory' && <AdminInventoryTab inventory={inventory} onAdjustStock={handleAdjustStock} onCreateProduct={handleCreateProduct} />}
      {activeTab === 'orders' && <AdminOrdersTab orders={orders} clients={MOCK_BACKOFFICE.clients} onUpdateOrderStatus={handleUpdateOrderStatus} onCancelOrder={handleCancelOrder} />}
    </BackofficeShell>
  );
};
