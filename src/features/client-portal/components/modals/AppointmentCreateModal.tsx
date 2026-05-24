import React from 'react';
import { PortalModal } from './PortalModal';

interface AppointmentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const AppointmentCreateModal: React.FC<AppointmentCreateModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <PortalModal eyebrow="Novo agendamento" title="Agendar serviço no mobile" onClose={onClose}>
      {children}
    </PortalModal>
  );
};
