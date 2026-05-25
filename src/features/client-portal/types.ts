import type { Product } from '@/services/api';
import type {
  ClientAppointment,
  ClientPet,
  ClientUser,
  MedicalRecord,
  VetAvailability,
  ClientOrder
} from '@/services/clientPortal';

export type PortalTab = 'dashboard' | 'pets' | 'appointments' | 'medical' | 'vets' | 'store';
export type AuthMode = 'login' | 'register';
export type PortalTheme = 'light' | 'dark';

export interface PortalTabItem {
  id: PortalTab;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

export interface ClientPortalState {
  currentUser: ClientUser;
  pets: ClientPet[];
  appointments: ClientAppointment[];
  medicalRecords: MedicalRecord[];
  veterinarians: VetAvailability[];
  orders: ClientOrder[];
  recommendedProducts: Product[];
}
