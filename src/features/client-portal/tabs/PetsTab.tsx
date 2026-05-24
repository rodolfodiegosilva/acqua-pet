import React from 'react';
import { CLIENT_PET_SEXES, CLIENT_PET_SPECIES, type ClientPet, type ClientPetSex, type ClientPetSpecies } from '../../../services/clientPortal';
import { PortalSectionCard } from '../../../components/client/PortalSectionCard';

interface PetsTabProps {
  pets: ClientPet[];
  petForm: { name: string; species: ClientPetSpecies | ''; sex: ClientPetSex | ''; breed: string; age: string; weight: string; observation: string };
  setPetForm: React.Dispatch<React.SetStateAction<{ name: string; species: ClientPetSpecies | ''; sex: ClientPetSex | ''; breed: string; age: string; weight: string; observation: string }>>;
  onAddPet: (event: React.FormEvent) => void;
  onOpenMedical: (petId: number) => void;
}

export const PetsTab: React.FC<PetsTabProps> = ({ pets, petForm, setPetForm, onAddPet, onOpenMedical }) => {
  return (
    <div className="portal-two-cols" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
      <PortalSectionCard title="Pets cadastrados" eyebrow="Perfis">
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
                  <button onClick={() => onOpenMedical(pet.id)} className="portal-link-btn">Ver prontuário</button>
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

      <PortalSectionCard title="Cadastrar novo pet" eyebrow="Ação rápida">
        <form onSubmit={onAddPet} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          <button type="submit" className="gradient-bg gradient-bg-hover" style={{ padding: '15px', borderRadius: 'var(--radius-md)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            Adicionar pet ao portal
          </button>
        </form>
      </PortalSectionCard>
    </div>
  );
};
