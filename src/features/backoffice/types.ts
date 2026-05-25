import type { ElementType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { MedicalRecord } from '@/services/clientPortal';

export type BackofficeTheme = 'light' | 'dark';
export type AdminTab = 'overview' | 'clients' | 'pets' | 'inventory' | 'orders';
export type VetTab = 'overview' | 'agenda' | 'patients';

export interface BackofficeNavItem<TTab extends string> {
  id: TTab;
  label: string;
  icon: ElementType<SvgIconProps>;
}

export interface VetRecordDraft {
  date: string;
  specialty: string;
  diagnosis: string;
  prescription: string;
  returnWindow: string;
  status: MedicalRecord['status'];
  symptoms: string;
  clinicalNotes: string;
  examsRequested: string[];
  recommendations: string[];
  prescriptionItems: string[];
}
