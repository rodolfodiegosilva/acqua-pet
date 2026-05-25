import React, { useEffect, useMemo, useState } from 'react';
import { AppPagination, getResponsiveDefaultPageSize } from '@/components/pagination/AppPagination';
import type { BackofficePet } from '@/services/backoffice';
import type { MedicalRecord } from '@/services/clientPortal';
import type { VetRecordDraft } from '../types';
import { BackofficeSectionCard } from '../components/BackofficeSectionCard';
import { VetPatientDetailView } from '../components/VetPatientDetailView';

interface VetPatientsTabProps {
  pets: BackofficePet[];
  records: MedicalRecord[];
  selectedPetId: number | null;
  veterinarianName: string;
  onSelectPet: (petId: number) => void;
  onBackToList: () => void;
  onCreateRecord: (petId: number, draft: VetRecordDraft) => void;
}

export const VetPatientsTab: React.FC<VetPatientsTabProps> = ({
  pets,
  records,
  selectedPetId,
  veterinarianName,
  onSelectPet,
  onBackToList,
  onCreateRecord
}) => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | BackofficePet['status']>('Todos');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'attention'>('recent');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => getResponsiveDefaultPageSize());

  const selectedPet = useMemo(() => pets.find((pet) => pet.id === selectedPetId) ?? null, [pets, selectedPetId]);

  const patientCards = useMemo(() => {
    return pets.map((pet) => {
      const petRecords = records.filter((record) => record.petId === pet.id);
      const latestRecord = [...petRecords].sort((a, b) => b.date.split('/').reverse().join('-').localeCompare(a.date.split('/').reverse().join('-')))[0];
      return {
        pet,
        latestRecord,
        recordCount: petRecords.length
      };
    });
  }, [pets, records]);

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return patientCards.filter(({ pet, latestRecord }) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        pet.name.toLowerCase().includes(normalizedQuery) ||
        pet.tutorName.toLowerCase().includes(normalizedQuery) ||
        pet.species.toLowerCase().includes(normalizedQuery) ||
        latestRecord?.diagnosis.toLowerCase().includes(normalizedQuery);

      const matchesStatus = statusFilter === 'Todos' || pet.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [patientCards, query, statusFilter]);

  const sortedPatients = useMemo(() => {
    return [...filteredPatients].sort((a, b) => {
      if (sortBy === 'name') return a.pet.name.localeCompare(b.pet.name, 'pt-BR');
      if (sortBy === 'attention') return b.recordCount - a.recordCount;
      return (b.latestRecord?.date ?? '').split('/').reverse().join('-').localeCompare((a.latestRecord?.date ?? '').split('/').reverse().join('-'));
    });
  }, [filteredPatients, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, sortBy, pageSize]);

  if (selectedPet) {
    return (
      <VetPatientDetailView
        pet={selectedPet}
        records={records.filter((record) => record.petId === selectedPet.id)}
        veterinarianName={veterinarianName}
        onBack={onBackToList}
        onCreateRecord={onCreateRecord}
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(sortedPatients.length / pageSize));
  const paginatedPatients = sortedPatients.slice((page - 1) * pageSize, page * pageSize);

  return (
    <BackofficeSectionCard title="Pacientes e prontuários" eyebrow="Clínica">
      <div className="backoffice-table-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) repeat(2, minmax(0, 0.75fr))', gap: '12px' }}>
        <input className="backoffice-input" type="text" placeholder="Buscar pet, tutor, espécie ou diagnóstico" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="backoffice-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'Todos' | BackofficePet['status'])}>
          <option value="Todos">Todos os perfis</option>
          <option value="Ativo">Ativo</option>
          <option value="Em acompanhamento">Em acompanhamento</option>
          <option value="Observação">Observação</option>
        </select>
        <select className="backoffice-select" value={sortBy} onChange={(event) => setSortBy(event.target.value as 'recent' | 'name' | 'attention')}>
          <option value="recent">Mais recentes</option>
          <option value="attention">Mais prontuários</option>
          <option value="name">Nome do pet</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        {paginatedPatients.map(({ pet, latestRecord, recordCount }) => (
          <div key={pet.id} className="backoffice-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '14px', minWidth: 0 }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '22px', background: 'color-mix(in srgb, var(--backoffice-accent-strong) 14%, var(--backoffice-surface))', display: 'grid', placeItems: 'center', fontSize: '34px', flexShrink: 0 }}>
                  {pet.avatar}
                </div>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: 'block', color: 'var(--backoffice-text)', fontSize: '18px', marginBottom: '6px' }}>{pet.name}</strong>
                  <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{pet.species} · {pet.sex} · {pet.breed} · Tutor: {pet.tutorName}</p>
                  <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>Último diagnóstico: {latestRecord?.diagnosis ?? 'Sem prontuário clínico registrado'}</p>
                </div>
              </div>
              <span className={`backoffice-pill ${pet.status === 'Ativo' ? 'backoffice-status-success' : pet.status === 'Em acompanhamento' ? 'backoffice-status-attention' : 'backoffice-status-critical'}`}>
                {pet.status}
              </span>
            </div>

            <div className="backoffice-mini-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '14px' }}>
              <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Prontuários</span><strong style={{ color: 'var(--backoffice-text)' }}>{recordCount}</strong></div>
              <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Última visita</span><strong style={{ color: 'var(--backoffice-text)' }}>{pet.lastVisit}</strong></div>
              <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Próxima ação</span><strong style={{ color: 'var(--backoffice-text)' }}>{pet.nextAction}</strong></div>
              <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Status clínico</span><strong style={{ color: 'var(--backoffice-text)' }}>{latestRecord?.status ?? 'Sem status'}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="backoffice-primary-btn" onClick={() => onSelectPet(pet.id)}>Abrir ficha completa</button>
            </div>
          </div>
        ))}
      </div>

      <AppPagination page={page} count={totalPages} pageSize={pageSize} onPageSizeChange={setPageSize} onChange={setPage} tone="backoffice" />
    </BackofficeSectionCard>
  );
};
