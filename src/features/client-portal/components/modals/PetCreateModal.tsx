import React from 'react';
import { PortalModal } from './PortalModal';

interface PetCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const PetCreateModal: React.FC<PetCreateModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <PortalModal eyebrow="Cadastro de pet" title="Cadastrar novo pet" onClose={onClose}>
      {children}
    </PortalModal>
  );
};
