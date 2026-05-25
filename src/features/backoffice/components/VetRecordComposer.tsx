import React, { useMemo, useState } from 'react';
import type { MedicalRecord } from '@/services/clientPortal';
import type { VetRecordDraft } from '../types';

interface VetRecordComposerProps {
  veterinarianName: string;
  onCreateRecord: (draft: VetRecordDraft) => void;
}

const splitLines = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const getToday = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
};

export const VetRecordComposer: React.FC<VetRecordComposerProps> = ({ veterinarianName, onCreateRecord }) => {
  const [form, setForm] = useState({
    date: getToday(),
    specialty: 'Clínica Geral',
    diagnosis: '',
    prescription: '',
    returnWindow: '',
    status: 'Estável' as MedicalRecord['status'],
    symptoms: '',
    clinicalNotes: '',
    examsRequested: '',
    recommendations: '',
    prescriptionItems: ''
  });

  const draftPrescriptionItems = useMemo(() => splitLines(form.prescriptionItems), [form.prescriptionItems]);
  const draftExams = useMemo(() => splitLines(form.examsRequested), [form.examsRequested]);
  const draftRecommendations = useMemo(() => splitLines(form.recommendations), [form.recommendations]);

  const handleFieldChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.diagnosis.trim() || !form.prescription.trim() || !form.clinicalNotes.trim()) return;

    onCreateRecord({
      date: form.date,
      specialty: form.specialty.trim(),
      diagnosis: form.diagnosis.trim(),
      prescription: form.prescription.trim(),
      returnWindow: form.returnWindow.trim() || 'Retorno a definir',
      status: form.status,
      symptoms: form.symptoms.trim() || 'Sem sintomas adicionais registrados.',
      clinicalNotes: form.clinicalNotes.trim(),
      examsRequested: draftExams,
      recommendations: draftRecommendations,
      prescriptionItems: draftPrescriptionItems
    });

    setForm({
      date: getToday(),
      specialty: 'Clínica Geral',
      diagnosis: '',
      prescription: '',
      returnWindow: '',
      status: 'Estável',
      symptoms: '',
      clinicalNotes: '',
      examsRequested: '',
      recommendations: '',
      prescriptionItems: ''
    });
  };

  return (
    <div className="backoffice-card backoffice-composer-card" style={{ padding: '20px', display: 'grid', gap: '18px', background: 'var(--backoffice-soft)' }}>
      <div className="backoffice-section-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
        <div>
          <strong style={{ display: 'block', color: 'var(--backoffice-text)', fontSize: '18px', marginBottom: '6px' }}>Novo prontuário clínico</strong>
          <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>Registre evolução, prescrição, exames e orientações como em um sistema veterinário real.</p>
        </div>
        <span className="backoffice-pill backoffice-status-info">{veterinarianName}</span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
        <div className="backoffice-table-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
          <input className="backoffice-input" type="text" value={form.date} onChange={(event) => handleFieldChange('date', event.target.value)} placeholder="dd/mm/aaaa" />
          <input className="backoffice-input" type="text" value={form.specialty} onChange={(event) => handleFieldChange('specialty', event.target.value)} placeholder="Especialidade" />
          <input className="backoffice-input" type="text" value={form.returnWindow} onChange={(event) => handleFieldChange('returnWindow', event.target.value)} placeholder="Retorno em 15 dias" />
          <select className="backoffice-select" value={form.status} onChange={(event) => handleFieldChange('status', event.target.value as MedicalRecord['status'])}>
            <option value="Estável">Estável</option>
            <option value="Atenção">Atenção</option>
            <option value="Em tratamento">Em tratamento</option>
          </select>
        </div>

        <input className="backoffice-input" type="text" value={form.diagnosis} onChange={(event) => handleFieldChange('diagnosis', event.target.value)} placeholder="Diagnóstico clínico" />
        <textarea className="backoffice-input backoffice-textarea" rows={3} value={form.symptoms} onChange={(event) => handleFieldChange('symptoms', event.target.value)} placeholder="Sintomas e queixa principal" />
        <textarea className="backoffice-input backoffice-textarea" rows={4} value={form.clinicalNotes} onChange={(event) => handleFieldChange('clinicalNotes', event.target.value)} placeholder="Notas clínicas detalhadas do atendimento" />
        <textarea className="backoffice-input backoffice-textarea" rows={3} value={form.prescription} onChange={(event) => handleFieldChange('prescription', event.target.value)} placeholder="Resumo do receituário e conduta" />

        <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
          <textarea className="backoffice-input backoffice-textarea" rows={4} value={form.prescriptionItems} onChange={(event) => handleFieldChange('prescriptionItems', event.target.value)} placeholder="Itens do receituário, um por linha" />
          <textarea className="backoffice-input backoffice-textarea" rows={4} value={form.examsRequested} onChange={(event) => handleFieldChange('examsRequested', event.target.value)} placeholder="Exames solicitados, um por linha" />
          <textarea className="backoffice-input backoffice-textarea" rows={4} value={form.recommendations} onChange={(event) => handleFieldChange('recommendations', event.target.value)} placeholder="Orientações ao tutor, uma por linha" />
        </div>

        <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
          <div className="backoffice-card" style={{ padding: '16px', background: 'var(--backoffice-surface)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>Receituário</span>
            <div style={{ display: 'grid', gap: '8px' }}>
              {draftPrescriptionItems.length > 0 ? draftPrescriptionItems.map((item) => (
                <span key={item} style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>{item}</span>
              )) : <span style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>Os itens prescritos aparecem aqui.</span>}
            </div>
          </div>
          <div className="backoffice-card" style={{ padding: '16px', background: 'var(--backoffice-surface)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>Exames</span>
            <div style={{ display: 'grid', gap: '8px' }}>
              {draftExams.length > 0 ? draftExams.map((item) => (
                <span key={item} style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>{item}</span>
              )) : <span style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>Solicitações de exame entram nesta prévia.</span>}
            </div>
          </div>
          <div className="backoffice-card" style={{ padding: '16px', background: 'var(--backoffice-surface)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>Orientações</span>
            <div style={{ display: 'grid', gap: '8px' }}>
              {draftRecommendations.length > 0 ? draftRecommendations.map((item) => (
                <span key={item} style={{ color: 'var(--backoffice-text)', lineHeight: 1.6 }}>{item}</span>
              )) : <span style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>As orientações ao tutor aparecem aqui.</span>}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="backoffice-primary-btn" type="submit">Salvar prontuário</button>
          <button
            className="backoffice-ghost-btn"
            type="button"
            onClick={() =>
              setForm({
                date: getToday(),
                specialty: 'Clínica Geral',
                diagnosis: '',
                prescription: '',
                returnWindow: '',
                status: 'Estável',
                symptoms: '',
                clinicalNotes: '',
                examsRequested: '',
                recommendations: '',
                prescriptionItems: ''
              })
            }
          >
            Limpar ficha
          </button>
        </div>
      </form>
    </div>
  );
};
