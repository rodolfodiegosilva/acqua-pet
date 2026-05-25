import React, { useState } from 'react';
import AddRounded from '@mui/icons-material/AddRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { PortalSectionCard } from '@/components/client/portal-section-card/PortalSectionCard';
import { CLIENT_PET_SEXES, CLIENT_PET_SPECIES, type ClientPet, type ClientPetSex, type ClientPetSpecies } from '@/services/clientPortal';

interface PetsTabProps {
  pets: ClientPet[];
  petForm: { name: string; species: ClientPetSpecies | ''; sex: ClientPetSex | ''; breed: string; age: string; weight: string; observation: string };
  setPetForm: React.Dispatch<React.SetStateAction<{ name: string; species: ClientPetSpecies | ''; sex: ClientPetSex | ''; breed: string; age: string; weight: string; observation: string }>>;
  onAddPet: (event: React.FormEvent) => void;
  onUpdatePet: (petId: number) => void;
  isSubmitting?: boolean;
  onOpenMedical: (petId: number) => void;
}

export const PetsTab: React.FC<PetsTabProps> = ({ pets, petForm, setPetForm, onAddPet, onUpdatePet, isSubmitting = false, onOpenMedical }) => {
  const [isCreatePetModalOpen, setIsCreatePetModalOpen] = useState(false);
  const [editingPetId, setEditingPetId] = useState<number | null>(null);

  const resetForm = () => {
    setPetForm({ name: '', species: '', sex: '', breed: '', age: '', weight: '', observation: '' });
    setEditingPetId(null);
  };

  const startEditingPet = (pet: ClientPet) => {
    setPetForm({
      name: pet.name,
      species: pet.species,
      sex: pet.sex,
      breed: pet.breed,
      age: pet.age,
      weight: pet.weight,
      observation: pet.observation
    });
    setEditingPetId(pet.id);
    setIsCreatePetModalOpen(true);
  };

  const renderPetForm = () => (
    <form
      onSubmit={(event) => {
        if (editingPetId) {
          event.preventDefault();
          onUpdatePet(editingPetId);
          setIsCreatePetModalOpen(false);
          resetForm();
          return;
        }

        onAddPet(event);
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
      <input className="portal-input" type="text" placeholder="Nome do pet" value={petForm.name} onChange={(event) => setPetForm({ ...petForm, name: event.target.value })} />
      <select className="portal-input" value={petForm.species} onChange={(event) => setPetForm({ ...petForm, species: event.target.value as ClientPetSpecies | '' })}>
        <option value="">Selecione a espécie</option>
        {CLIENT_PET_SPECIES.map((species) => (
          <option key={species} value={species}>{species}</option>
        ))}
      </select>
      <select className="portal-input" value={petForm.sex} onChange={(event) => setPetForm({ ...petForm, sex: event.target.value as ClientPetSex | '' })}>
        <option value="">Selecione o sexo</option>
        {CLIENT_PET_SEXES.map((sex) => (
          <option key={sex} value={sex}>{sex}</option>
        ))}
      </select>
      <input className="portal-input" type="text" placeholder="Raça" value={petForm.breed} onChange={(event) => setPetForm({ ...petForm, breed: event.target.value })} />
      <input className="portal-input" type="text" placeholder="Idade" value={petForm.age} onChange={(event) => setPetForm({ ...petForm, age: event.target.value })} />
      <input className="portal-input" type="text" placeholder="Peso" value={petForm.weight} onChange={(event) => setPetForm({ ...petForm, weight: event.target.value })} />
      <textarea className="portal-input" placeholder="Observação" value={petForm.observation} onChange={(event) => setPetForm({ ...petForm, observation: event.target.value })} rows={4} style={{ resize: 'vertical' }} />
      <button
        type="submit"
        disabled={isSubmitting}
        className="gradient-bg gradient-bg-hover"
        style={{ padding: '15px', borderRadius: 'var(--radius-md)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
      >
        {isSubmitting ? 'Salvando pet...' : editingPetId ? 'Salvar alterações do pet' : 'Adicionar pet ao portal'}
      </button>
      {editingPetId && (
        <button type="button" className="portal-ghost-btn" onClick={resetForm}>
          Cancelar edição
        </button>
      )}
    </form>
  );

  return (
    <div className="portal-two-cols" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
      <PortalSectionCard
        title="Pets cadastrados"
        eyebrow="Perfis"
        action={
          <button className="portal-ghost-btn portal-pets-mobile-trigger" onClick={() => {
            resetForm();
            setIsCreatePetModalOpen(true);
          }}>
            <AddRounded sx={{ fontSize: 16 }} />
            Cadastrar novo pet
          </button>
        }
      >
        <div style={{ display: 'grid', gap: '16px' }}>
          {pets.map((pet) => (
            <div key={pet.id} style={{ padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--portal-border)', background: 'var(--portal-soft-surface)', display: 'grid', gridTemplateColumns: '72px minmax(0, 1fr)', gap: '16px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'var(--portal-avatar-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px' }}>
                {pet.avatar}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '18px', color: 'var(--portal-text)' }}>{pet.name}</strong>
                    <span style={{ fontSize: '14px', color: 'var(--portal-muted)' }}>{pet.species} · {pet.sex} · {pet.breed}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => startEditingPet(pet)} className="portal-link-btn">Editar cadastro</button>
                    <button type="button" onClick={() => onOpenMedical(pet.id)} className="portal-link-btn">Ver prontuário</button>
                  </div>
                </div>
                <div className="portal-mini-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px', marginBottom: '10px' }}>
                  <div><span className="portal-mini-label">Idade</span><strong style={{ color: 'var(--portal-text)' }}>{pet.age}</strong></div>
                  <div><span className="portal-mini-label">Peso</span><strong style={{ color: 'var(--portal-text)' }}>{pet.weight}</strong></div>
                  <div><span className="portal-mini-label">Tutor</span><strong style={{ color: 'var(--portal-text)' }}>{pet.tutorName}</strong></div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--portal-muted)', marginBottom: '8px' }}>{pet.observation}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {pet.vaccines.length > 0 ? pet.vaccines.map((vaccine) => (
                    <span key={vaccine} style={{ padding: '7px 10px', borderRadius: 'var(--radius-full)', background: 'var(--portal-pill-info-bg)', fontSize: '12px', fontWeight: 700, color: 'var(--portal-pill-info-text)' }}>
                      {vaccine}
                    </span>
                  )) : (
                    <span style={{ fontSize: '13px', color: 'var(--portal-muted)' }}>Sem vacinas registradas neste mock.</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </PortalSectionCard>

      <PortalSectionCard title={editingPetId ? 'Editar cadastro do pet' : 'Cadastrar novo pet'} eyebrow="Ação rápida">
        <div className="portal-pets-desktop-form">
          {renderPetForm()}
        </div>
      </PortalSectionCard>

      {isCreatePetModalOpen && (
        <div
          className="portal-modal-backdrop portal-pets-mobile-modal"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 23, 0.68)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 90
          }}
          onClick={() => setIsCreatePetModalOpen(false)}
        >
          <div
            className="portal-modal-card"
            style={{
              width: 'min(640px, 100%)',
              maxHeight: '88vh',
              overflowY: 'auto',
              borderRadius: '24px',
              background: 'var(--portal-surface)',
              border: '1px solid var(--portal-border)',
              boxShadow: '0 24px 60px rgba(2, 6, 23, 0.3)',
              padding: '24px'
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="portal-section-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.4px', color: 'var(--portal-danger-text)', marginBottom: '8px' }}>
                  Cadastro de pet
                </span>
                <h3 style={{ fontSize: '24px', color: 'var(--portal-text)' }}>{editingPetId ? 'Editar cadastro do pet' : 'Cadastrar novo pet'}</h3>
              </div>
              <button
                type="button"
                aria-label="Fechar modal"
                onClick={() => setIsCreatePetModalOpen(false)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '1px solid var(--portal-border)',
                  background: 'var(--portal-soft-surface)',
                  color: 'var(--portal-text)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <CloseRounded sx={{ fontSize: 18 }} />
              </button>
            </div>
            {renderPetForm()}
          </div>
        </div>
      )}
    </div>
  );
};
