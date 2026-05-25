import React, { useEffect, useMemo, useState } from 'react';
import { ClipboardPlus, FileText, ShieldPlus, X } from 'lucide-react';
import { AppPagination, getResponsiveDefaultPageSize } from '@/components/pagination/AppPagination';
import { PortalSectionCard } from '@/components/client/portal-section-card/PortalSectionCard';
import type { ClientPet, MedicalRecord } from '@/services/clientPortal';

interface MedicalTabProps {
  pets: ClientPet[];
  selectedMedicalPetId: number;
  setSelectedMedicalPetId: React.Dispatch<React.SetStateAction<number>>;
  records: MedicalRecord[];
}

export const MedicalTab: React.FC<MedicalTabProps> = ({ pets, selectedMedicalPetId, setSelectedMedicalPetId, records }) => {
  const selectedPet = pets.find((pet) => pet.id === selectedMedicalPetId) ?? pets[0];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | MedicalRecord['status']>('Todos');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'status'>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => getResponsiveDefaultPageSize());
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return records.filter((record) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        record.diagnosis.toLowerCase().includes(normalizedQuery) ||
        record.veterinarian.toLowerCase().includes(normalizedQuery) ||
        record.specialty.toLowerCase().includes(normalizedQuery) ||
        record.prescription.toLowerCase().includes(normalizedQuery);

      const matchesStatus = statusFilter === 'Todos' || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const sortedRecords = useMemo(() => {
    const parseDate = (value: string) => {
      const [day, month, year] = value.split('/').map(Number);
      return new Date(year, month - 1, day).getTime();
    };

    return [...filteredRecords].sort((a, b) => {
      if (sortBy === 'date-asc') return parseDate(a.date) - parseDate(b.date);
      if (sortBy === 'status') return a.status.localeCompare(b.status, 'pt-BR');
      return parseDate(b.date) - parseDate(a.date);
    });
  }, [filteredRecords, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy, selectedMedicalPetId, pageSize]);

  useEffect(() => {
    setSelectedRecord(null);
  }, [selectedMedicalPetId]);

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const paginatedRecords = sortedRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const rangeStart = sortedRecords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, sortedRecords.length);

  return (
    <PortalSectionCard
      title="Prontuário médico por pet"
      eyebrow="Saúde"
      action={
        <select className="portal-input" style={{ minWidth: '210px' }} value={selectedMedicalPetId} onChange={(event) => setSelectedMedicalPetId(Number(event.target.value))}>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>{pet.name}</option>
          ))}
        </select>
      }
    >
      <div className="portal-surface" style={{ padding: '18px' }}>
        <strong style={{ display: 'block', fontSize: '18px', marginBottom: '6px', color: 'var(--portal-text)' }}>
          {selectedPet?.avatar} {selectedPet?.name}
        </strong>
        <p style={{ fontSize: '14px', color: 'var(--portal-muted)' }}>
          {selectedPet?.species} · {selectedPet?.sex} · {selectedPet?.breed} · {selectedPet?.observation}
        </p>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        <div className="portal-medical-controls" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) repeat(2, minmax(0, 0.7fr))', gap: '12px' }}>
          <input
            className="portal-input"
            type="text"
            placeholder="Buscar diagnóstico, veterinário ou prescrição"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <select className="portal-input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'Todos' | MedicalRecord['status'])}>
            <option value="Todos">Todos os status</option>
            <option value="Estável">Estável</option>
            <option value="Atenção">Atenção</option>
            <option value="Em tratamento">Em tratamento</option>
          </select>
          <select className="portal-input" value={sortBy} onChange={(event) => setSortBy(event.target.value as 'date-desc' | 'date-asc' | 'status')}>
            <option value="date-desc">Mais recentes</option>
            <option value="date-asc">Mais antigos</option>
            <option value="status">Status</option>
          </select>
        </div>

        <span className="portal-medical-summary" style={{ fontSize: '13px', color: 'var(--portal-muted)' }}>
          Exibindo {rangeStart}-{rangeEnd} de {sortedRecords.length} registros · página {currentPage} de {totalPages}
        </span>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        {paginatedRecords.map((record) => (
          <div key={record.id} style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--portal-border)', background: 'var(--portal-soft-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '17px', color: 'var(--portal-text)' }}>{record.diagnosis}</strong>
                <span style={{ fontSize: '14px', color: 'var(--portal-muted)' }}>{record.veterinarian} · {record.specialty}</span>
              </div>
              <span style={{ padding: '8px 12px', borderRadius: 'var(--radius-full)', background: 'var(--portal-danger-surface)', color: 'var(--portal-danger-text)', fontSize: '12px', fontWeight: 700, height: 'fit-content' }}>
                {record.status}
              </span>
            </div>
            <div className="portal-record-grid" style={{ display: 'grid', gridTemplateColumns: '150px minmax(0, 1fr)', gap: '18px' }}>
              <div><span className="portal-mini-label">Data</span><strong style={{ color: 'var(--portal-text)' }}>{record.date}</strong></div>
              <div>
                <span className="portal-mini-label">Prescrição</span>
                <p style={{ fontSize: '14px', color: 'var(--portal-muted)' }}>{record.prescription}</p>
              </div>
            </div>
            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--portal-border)' }}>
              <span className="portal-mini-label">Retorno</span>
              <strong style={{ color: 'var(--portal-text)' }}>{record.returnWindow}</strong>
            </div>
            <button className="portal-ghost-btn" style={{ marginTop: '16px' }} onClick={() => setSelectedRecord(record)}>
              Ver prontuário completo
            </button>
          </div>
        ))}

        {sortedRecords.length === 0 && (
          <div className="portal-surface" style={{ padding: '20px' }}>
            <strong style={{ display: 'block', color: 'var(--portal-text)', marginBottom: '6px' }}>Nenhum registro encontrado</strong>
            <p style={{ color: 'var(--portal-muted)', fontSize: '14px' }}>
              Ajuste os filtros para localizar o histórico desejado deste pet.
            </p>
          </div>
        )}
      </div>

      {sortedRecords.length > 0 && <AppPagination page={currentPage} count={totalPages} pageSize={pageSize} onPageSizeChange={setPageSize} onChange={setCurrentPage} tone="portal" />}

      {selectedRecord && (
        <div
          className="portal-modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 23, 0.68)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 80
          }}
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="portal-modal-card"
            style={{
              width: 'min(920px, 100%)',
              maxHeight: '85vh',
              overflowY: 'auto',
              borderRadius: '24px',
              background: 'var(--portal-surface)',
              border: '1px solid var(--portal-border)',
              boxShadow: '0 24px 60px rgba(2, 6, 23, 0.3)',
              padding: '24px'
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="portal-medical-modal-hero" style={{ marginBottom: '18px', padding: '20px', borderRadius: '20px', background: 'linear-gradient(135deg, color-mix(in srgb, var(--portal-accent) 18%, var(--portal-surface)) 0%, color-mix(in srgb, var(--portal-danger-text) 12%, var(--portal-surface)) 100%)', border: '1px solid var(--portal-border)' }}>
              <div className="portal-section-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.4px', color: 'var(--portal-danger-text)', marginBottom: '8px' }}>
                    Prontuário detalhado
                  </span>
                  <h3 style={{ fontSize: '24px', color: 'var(--portal-text)', marginBottom: '8px' }}>{selectedRecord.diagnosis}</h3>
                  <p style={{ color: 'var(--portal-muted)', fontSize: '14px' }}>
                    {selectedPet?.avatar} {selectedPet?.name} · {selectedRecord.veterinarian} · {selectedRecord.specialty}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Fechar modal"
                  onClick={() => setSelectedRecord(null)}
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
                  <X size={18} />
                </button>
              </div>

              <div className="portal-medical-modal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'var(--portal-surface)', border: '1px solid var(--portal-border)' }}>
                  <span className="portal-mini-label">Data do atendimento</span>
                  <strong style={{ color: 'var(--portal-text)' }}>{selectedRecord.date}</strong>
                </div>
                <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'var(--portal-surface)', border: '1px solid var(--portal-border)' }}>
                  <span className="portal-mini-label">Status clínico</span>
                  <strong style={{ color: 'var(--portal-text)' }}>{selectedRecord.status}</strong>
                </div>
                <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'var(--portal-surface)', border: '1px solid var(--portal-border)' }}>
                  <span className="portal-mini-label">Retorno indicado</span>
                  <strong style={{ color: 'var(--portal-text)' }}>{selectedRecord.returnWindow}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '14px' }}>
              <div className="portal-surface" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <ClipboardPlus size={18} color="var(--portal-danger-text)" />
                  <span className="portal-mini-label" style={{ marginBottom: 0 }}>Sintomas e queixa principal</span>
                </div>
                <p style={{ color: 'var(--portal-text)', lineHeight: 1.7 }}>{selectedRecord.symptoms}</p>
              </div>

              <div className="portal-surface" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <ShieldPlus size={18} color="var(--portal-accent)" />
                  <span className="portal-mini-label" style={{ marginBottom: 0 }}>Observações clínicas do veterinário</span>
                </div>
                <p style={{ color: 'var(--portal-text)', lineHeight: 1.7 }}>{selectedRecord.clinicalNotes}</p>
              </div>

              <div className="portal-medical-modal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
                <div className="portal-surface" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <FileText size={18} color="var(--portal-accent)" />
                    <span className="portal-mini-label" style={{ marginBottom: 0 }}>Receituário</span>
                  </div>
                  <p style={{ color: 'var(--portal-muted)', fontSize: '14px', marginBottom: '12px' }}>{selectedRecord.prescription}</p>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {selectedRecord.prescriptionItems.map((item) => (
                      <p key={item} style={{ color: 'var(--portal-text)', lineHeight: 1.6 }}>• {item}</p>
                    ))}
                  </div>
                </div>

                <div className="portal-surface" style={{ padding: '18px' }}>
                  <span className="portal-mini-label">Exames e acompanhamentos solicitados</span>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {selectedRecord.examsRequested.map((item) => (
                      <p key={item} style={{ color: 'var(--portal-text)', lineHeight: 1.6 }}>• {item}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="portal-surface" style={{ padding: '18px' }}>
                <span className="portal-mini-label">Orientações adicionais</span>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {selectedRecord.recommendations.map((item) => (
                    <p key={item} style={{ color: 'var(--portal-text)', lineHeight: 1.6 }}>• {item}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalSectionCard>
  );
};
