import type { AdminTab, VetTab } from '@/features/backoffice/types';
import type { PortalTab } from '@/features/client-portal/types';
import { normalizeAppPath } from '@/types/navigation';

const resolveTabFromPath = <TTab extends string>(pathname: string, routes: Record<TTab, string>, fallback: TTab) => {
  const normalizedPath = normalizeAppPath(pathname);
  const match = (Object.entries(routes) as Array<[TTab, string]>).find(([, route]) => route === normalizedPath);
  return match?.[0] ?? fallback;
};

export const CLIENT_PORTAL_ROUTES: Record<PortalTab, string> = {
  dashboard: '/area-cliente/visao-geral',
  pets: '/area-cliente/meus-pets',
  appointments: '/area-cliente/agendamentos',
  medical: '/area-cliente/historico-medico',
  vets: '/area-cliente/veterinarios',
  store: '/area-cliente/loja'
};

export const ADMIN_PORTAL_ROUTES: Record<AdminTab, string> = {
  overview: '/area-admin/visao-geral',
  clients: '/area-admin/clientes',
  pets: '/area-admin/pets',
  inventory: '/area-admin/estoque',
  orders: '/area-admin/pedidos'
};

export const VETERINARY_PORTAL_ROUTES: Record<VetTab, string> = {
  overview: '/area-veterinario/visao-clinica',
  agenda: '/area-veterinario/agenda',
  patients: '/area-veterinario/pacientes'
};

export const getClientPortalTabFromPath = (pathname: string) =>
  resolveTabFromPath(pathname, CLIENT_PORTAL_ROUTES, 'dashboard');

export const getAdminTabFromPath = (pathname: string) =>
  resolveTabFromPath(pathname, ADMIN_PORTAL_ROUTES, 'overview');

export const getVeterinaryTabFromPath = (pathname: string) =>
  resolveTabFromPath(pathname, VETERINARY_PORTAL_ROUTES, 'overview');
