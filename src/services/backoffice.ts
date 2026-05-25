import { PRODUCTS_CATALOG, getStoredProductsCatalog, saveStoredProductsCatalog, type Product } from './api';
import type { ClientAppointment, ClientPet, ClientPetSex, ClientPetSpecies, MedicalRecord } from './clientPortal';
import { readSeededAppSessionSlice, simulateApiDelay, writeAppSessionSlice } from './mockStorage';

export type BackofficeRole = 'admin' | 'veterinarian';

export interface BackofficeSessionUser {
  id: number;
  name: string;
  email: string;
  role: BackofficeRole;
  title: string;
  unit: string;
}

export interface BackofficeAuthSession {
  user: BackofficeSessionUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface BackofficeClient {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  neighborhood: string;
  plan: 'Essential' | 'Care+' | 'Prime';
  status: 'Ativo' | 'Atenção' | 'Novo';
  joinedAt: string;
  tags: string[];
}

export interface BackofficePet extends ClientPet {
  clientId: number;
  status: 'Ativo' | 'Em acompanhamento' | 'Observação';
  lastVisit: string;
  nextAction: string;
}

export interface BackofficeVet {
  id: number;
  name: string;
  specialty: string;
  unit: string;
  shift: string;
  status: 'Em atendimento' | 'Disponível' | 'Agenda cheia';
}

export interface BackofficeAlert {
  id: number;
  title: string;
  description: string;
  tone: 'critical' | 'attention' | 'info';
}

export interface BackofficeInventoryItem extends Product {
  sku: string;
  supplier: string;
  reserved: number;
  minStock: number;
  status: 'Saudável' | 'Baixo' | 'Crítico';
  imageSource?: string;
}

export interface BackofficeOrder {
  id: number;
  number: string;
  clientId: number;
  createdAt: string;
  status: 'Separando' | 'Pago' | 'Enviado' | 'Entregue' | 'Cancelado';
  fulfillment: 'Entrega' | 'Retirada';
  total: number;
  items: Array<{
    productId: number;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  notes: string;
}

export interface BackofficeSnapshot {
  clients: BackofficeClient[];
  pets: BackofficePet[];
  appointments: ClientAppointment[];
  records: MedicalRecord[];
  veterinarians: BackofficeVet[];
  alerts: BackofficeAlert[];
  inventory: BackofficeInventoryItem[];
  orders: BackofficeOrder[];
}

const mergeSeededById = <T extends { id: number }>(current: T[], seeded: T[]) => {
  const existingIds = new Set(current.map((item) => item.id));
  return [...current, ...seeded.filter((item) => !existingIds.has(item.id))];
};

const ADMIN_AUTH_STORAGE_KEY = 'acqua-pet-admin-auth-session';
const VET_AUTH_STORAGE_KEY = 'acqua-pet-veterinary-auth-session';
const CLIENTS_SLICE = 'clients';
const PETS_SLICE = 'pets';
const APPOINTMENTS_SLICE = 'appointments';
const RECORDS_SLICE = 'medicalRecords';
const VETERINARIANS_SLICE = 'veterinarians';
const ALERTS_SLICE = 'alerts';
const INVENTORY_SLICE = 'inventory';
const ORDERS_SLICE = 'orders';

const buildPet = (
  id: number,
  clientId: number,
  name: string,
  species: ClientPetSpecies,
  sex: ClientPetSex,
  breed: string,
  age: string,
  weight: string,
  avatar: string,
  tutorName: string,
  observation: string,
  vaccines: string[],
  status: BackofficePet['status'],
  lastVisit: string,
  nextAction: string
): BackofficePet => ({
  id,
  clientId,
  name,
  species,
  sex,
  breed,
  age,
  weight,
  avatar,
  tutorName,
  observation,
  vaccines,
  status,
  lastVisit,
  nextAction
});

const buildInventoryItem = (
  product: Product,
  sku: string,
  supplier: string,
  reserved: number,
  minStock: number
): BackofficeInventoryItem => ({
  ...product,
  sku,
  supplier,
  reserved,
  minStock,
  status: product.stock <= Math.max(2, Math.floor(minStock / 2)) ? 'Crítico' : product.stock <= minStock ? 'Baixo' : 'Saudável'
});

export const MOCK_BACKOFFICE: BackofficeSnapshot = {
  clients: [
    {
      id: 1,
      name: 'Marina Albuquerque',
      email: 'marina@cliente.mock',
      phone: '(92) 99999-1001',
      city: 'Manaus - AM',
      neighborhood: 'Vieiralves',
      plan: 'Prime',
      status: 'Ativo',
      joinedAt: 'Março de 2024',
      tags: ['alto valor', 'multiespécie']
    },
    {
      id: 2,
      name: 'Rafael Monteiro',
      email: 'rafael.monteiro@cliente.mock',
      phone: '(92) 99118-4420',
      city: 'Manaus - AM',
      neighborhood: 'Adrianópolis',
      plan: 'Care+',
      status: 'Atenção',
      joinedAt: 'Novembro de 2025',
      tags: ['recorrência clínica', 'taxi pet']
    },
    {
      id: 3,
      name: 'Bianca Nogueira',
      email: 'bianca.nogueira@cliente.mock',
      phone: '(92) 98877-1150',
      city: 'Manaus - AM',
      neighborhood: 'Ponta Negra',
      plan: 'Prime',
      status: 'Ativo',
      joinedAt: 'Janeiro de 2026',
      tags: ['exóticos', 'alto ticket']
    },
    {
      id: 4,
      name: 'Eduardo Castro',
      email: 'eduardo.castro@cliente.mock',
      phone: '(92) 99434-7612',
      city: 'Manaus - AM',
      neighborhood: 'Parque 10',
      plan: 'Essential',
      status: 'Novo',
      joinedAt: 'Maio de 2026',
      tags: ['primeira consulta']
    }
  ],
  pets: [
    buildPet(1, 1, 'Thor', 'Cão', 'Macho', 'Golden Retriever', '5 anos', '31 kg', '🐶', 'Marina Albuquerque', 'Sensível a shampoos com fragrância intensa.', ['V10', 'Antirrábica', 'Giárdia'], 'Em acompanhamento', '22/05/2026', 'Retorno dermatológico'),
    buildPet(2, 1, 'Mia', 'Gato', 'Fêmea', 'SRD', '3 anos', '4,2 kg', '🐱', 'Marina Albuquerque', 'Acompanhamento anual renal preventivo.', ['V4', 'Antirrábica'], 'Ativo', '11/05/2026', 'Check-up semestral'),
    buildPet(3, 1, 'Nemo', 'Peixe', 'Não informado', 'Acará Bandeira', '1 ano e 4 meses', 'Monitoramento em aquário', '🐠', 'Marina Albuquerque', 'Aquário plantado 180L com rotina de testes semanais.', [], 'Observação', '18/05/2026', 'Revisar parâmetros do aquário'),
    buildPet(9, 1, 'Luna', 'Ave', 'Fêmea', 'Calopsita Pérola', '2 anos', '98 g', '🦜', 'Marina Albuquerque', 'Muito responsiva a enriquecimento alimentar e precisa de manejo com pouco ruído.', [], 'Ativo', '16/05/2026', 'Ajuste nutricional e manejo de bico'),
    buildPet(10, 1, 'Gaia', 'Tartaruga', 'Não informado', 'Tigre d’água', '2 anos e 6 meses', '1,1 kg', '🐢', 'Marina Albuquerque', 'Terrário aquático com plataforma seca e controle rigoroso de iluminação UVB.', [], 'Observação', '10/05/2026', 'Revisar iluminação e rotina de cálcio'),
    buildPet(4, 2, 'Amora', 'Cão', 'Fêmea', 'Shih-tzu', '7 anos', '7,1 kg', '🐶', 'Rafael Monteiro', 'Histórico de sensibilidade digestiva e ansiedade em deslocamentos.', ['V8', 'Antirrábica'], 'Em acompanhamento', '20/05/2026', 'Ultrassom abdominal'),
    buildPet(5, 2, 'Juca', 'Ave', 'Macho', 'Calopsita', '2 anos', '95 g', '🦜', 'Rafael Monteiro', 'Necessita manejo com pouco ruído durante consulta.', [], 'Ativo', '14/04/2026', 'Revisão nutricional'),
    buildPet(6, 3, 'Kira', 'Réptil', 'Fêmea', 'Iguana verde', '4 anos', '2,8 kg', '🦎', 'Bianca Nogueira', 'Temperatura e umidade precisam ser conferidas em toda revisão.', [], 'Observação', '09/05/2026', 'Análise ambiental do terrário'),
    buildPet(7, 3, 'Pipoca', 'Coelho', 'Fêmea', 'Mini Lop', '1 ano', '1,6 kg', '🐰', 'Bianca Nogueira', 'Dieta rica em feno e histórico de crescimento dentário acelerado.', ['Mixomatoses'], 'Ativo', '28/04/2026', 'Avaliação odontológica'),
    buildPet(8, 4, 'Bidu', 'Cão', 'Macho', 'SRD', '8 meses', '12 kg', '🐶', 'Eduardo Castro', 'Primeiro ciclo completo de vacinação em andamento.', ['V10'], 'Ativo', '17/05/2026', 'Segunda dose vacinal')
  ],
  appointments: [
    {
      id: 101,
      petId: 1,
      type: 'Serviço',
      service: 'Banho terapêutico premium',
      veterinarian: 'Dra. Camila Freitas',
      date: '25/05/2026',
      time: '16:30',
      status: 'Confirmado',
      location: 'Unidade Coroado'
    },
    {
      id: 102,
      petId: 4,
      type: 'Táxi Pet',
      service: 'Táxi Pet para ultrassom abdominal',
      veterinarian: 'Central de mobilidade pet',
      date: '26/05/2026',
      time: '09:20',
      status: 'Em análise',
      location: 'Rota agendada · Unidade Vieiralves',
      pickupAddress: 'Rua Belo Horizonte, 180 - Adrianópolis',
      destinationAddress: 'Unidade Vieiralves',
      transportMode: 'Ida e volta',
      companion: 'Pet desacompanhado'
    },
    {
      id: 103,
      petId: 6,
      type: 'Serviço',
      service: 'Revisão de terrário e manejo clínico',
      veterinarian: 'Dr. Renato Braga',
      date: '26/05/2026',
      time: '14:10',
      status: 'Confirmado',
      location: 'Unidade Exóticos'
    },
    {
      id: 104,
      petId: 2,
      type: 'Serviço',
      service: 'Check-up felino preventivo',
      veterinarian: 'Dr. Lucas Varella',
      date: '08/05/2026',
      time: '09:00',
      status: 'Concluído',
      location: 'Unidade Coroado'
    },
    {
      id: 106,
      petId: 9,
      type: 'Serviço',
      service: 'Avaliação de penas e correção nutricional',
      veterinarian: 'Dra. Elisa Moraes',
      date: '28/05/2026',
      time: '15:40',
      status: 'Confirmado',
      location: 'Unidade Vieiralves'
    },
    {
      id: 107,
      petId: 10,
      type: 'Serviço',
      service: 'Check-up de quelônio e manejo ambiental',
      veterinarian: 'Dr. Renato Braga',
      date: '29/05/2026',
      time: '10:20',
      status: 'Em análise',
      location: 'Unidade Exóticos'
    },
    {
      id: 108,
      petId: 1,
      type: 'Táxi Pet',
      service: 'Táxi Pet para retorno dermatológico',
      veterinarian: 'Central de mobilidade pet',
      date: '02/06/2026',
      time: '14:10',
      status: 'Confirmado',
      location: 'Rota prevista · Unidade Coroado',
      pickupAddress: 'Rua Rio Jutaí, 240 - Vieiralves',
      destinationAddress: 'Unidade Coroado',
      transportMode: 'Ida e volta',
      companion: 'Tutor acompanha'
    },
    {
      id: 109,
      petId: 3,
      type: 'Serviço',
      service: 'Revisão de filtragem e fauna do aquário',
      veterinarian: 'Dra. Helena Souto',
      date: '03/06/2026',
      time: '18:30',
      status: 'Confirmado',
      location: 'Consultoria técnica'
    },
    {
      id: 110,
      petId: 2,
      type: 'Serviço',
      service: 'Retorno felino preventivo',
      veterinarian: 'Dr. Lucas Varella',
      date: '05/06/2026',
      time: '09:50',
      status: 'Confirmado',
      location: 'Unidade Coroado'
    },
    {
      id: 111,
      petId: 9,
      type: 'Táxi Pet',
      service: 'Táxi Pet para consulta de aves',
      veterinarian: 'Central de mobilidade pet',
      date: '06/06/2026',
      time: '15:00',
      status: 'Em análise',
      location: 'Rota prevista · Unidade Vieiralves',
      pickupAddress: 'Rua Rio Jutaí, 240 - Vieiralves',
      destinationAddress: 'Unidade Vieiralves',
      transportMode: 'Somente ida',
      companion: 'Tutor acompanha'
    },
    {
      id: 105,
      petId: 8,
      type: 'Serviço',
      service: 'Consulta vacinal pediátrica',
      veterinarian: 'Dra. Camila Freitas',
      date: '27/05/2026',
      time: '11:15',
      status: 'Confirmado',
      location: 'Unidade Parque 10'
    }
  ],
  records: [
    {
      id: 201,
      petId: 1,
      date: '22/05/2026',
      veterinarian: 'Dra. Camila Freitas',
      specialty: 'Clínica Geral',
      diagnosis: 'Dermatite alérgica leve em regressão.',
      prescription: 'Banho terapêutico 1x por semana e dieta controlada por 30 dias.',
      returnWindow: 'Retorno em 20 dias',
      status: 'Em tratamento',
      symptoms: 'Coceira intermitente em dorso e patas após banho com fragrâncias intensas.',
      clinicalNotes: 'Pele com discreta vermelhidão em região abdominal. Sem lesões abertas. Tutor relata melhora parcial.',
      examsRequested: ['Citologia cutânea de controle'],
      recommendations: ['Evitar shampoo perfumado', 'Secagem completa após banho'],
      prescriptionItems: ['Shampoo terapêutico semanal', 'Dieta hipoalergênica por 30 dias']
    },
    {
      id: 205,
      petId: 2,
      date: '11/05/2026',
      veterinarian: 'Dr. Lucas Varella',
      specialty: 'Felinos',
      diagnosis: 'Check-up anual sem alterações laboratoriais relevantes.',
      prescription: 'Manter hidratação com fonte e sachê diário.',
      returnWindow: 'Revisão em 6 meses',
      status: 'Estável',
      symptoms: 'Consulta preventiva sem queixas agudas.',
      clinicalNotes: 'Escore corporal adequado, mucosas normais e boa aceitação do manejo. Tutor relata boa adaptação à rotina com fonte de água.',
      examsRequested: ['Bioquímico renal de rotina', 'Urina tipo I preventiva'],
      recommendations: ['Manter enriquecimento ambiental', 'Reforçar consumo de água com alimento úmido'],
      prescriptionItems: ['Sem nova medicação contínua', 'Rotina preventiva mantida']
    },
    {
      id: 206,
      petId: 3,
      date: '18/05/2026',
      veterinarian: 'Dra. Helena Souto',
      specialty: 'Aquáticos',
      diagnosis: 'Parâmetros do aquário estáveis com necessidade de reforço biológico.',
      prescription: 'Aumentar TPA semanal e revisar carga biológica do filtro.',
      returnWindow: 'Acompanhamento em 30 dias',
      status: 'Atenção',
      symptoms: 'Leve redução de atividade nas primeiras horas da manhã após oscilação prévia.',
      clinicalNotes: 'Sem sinais visíveis de parasitose externa. Ambiente plantado com boa oxigenação, porém há espaço para reforço no filtro biológico.',
      examsRequested: ['Teste seriado de amônia e nitrito por 7 dias', 'Registro fotográfico da alimentação'],
      recommendations: ['Reforçar colônia bacteriana', 'Não aumentar a carga orgânica do aquário', 'Monitorar temperatura após TPA'],
      prescriptionItems: ['Condicionador biológico conforme litragem', 'TPA de 20% semanal']
    },
    {
      id: 207,
      petId: 9,
      date: '16/05/2026',
      veterinarian: 'Dra. Elisa Moraes',
      specialty: 'Aves Ornamentais',
      diagnosis: 'Desgaste irregular de bico associado a rotina alimentar limitada.',
      prescription: 'Introduzir enriquecimento alimentar e poleiros de diferentes texturas.',
      returnWindow: 'Revisão em 25 dias',
      status: 'Atenção',
      symptoms: 'Menor interesse por sementes secas e leve seletividade alimentar.',
      clinicalNotes: 'Bico sem fratura, porém com desgaste assimétrico discreto. Condição corporal preservada e comportamento responsivo ao tutor.',
      examsRequested: ['Avaliação de cavidade oral na revisão', 'Registro semanal de ingestão alimentar'],
      recommendations: ['Oferecer legumes seguros e pellets', 'Variar poleiros e momentos de forrageamento'],
      prescriptionItems: ['Plano alimentar com pellets e vegetais', 'Suplementação mineral sob orientação']
    },
    {
      id: 208,
      petId: 10,
      date: '10/05/2026',
      veterinarian: 'Dr. Renato Braga',
      specialty: 'Animais Exóticos',
      diagnosis: 'Ajuste preventivo de manejo UVB e suplementação de cálcio.',
      prescription: 'Trocar lâmpada UVB, revisar distância da plataforma e manter suplementação orientada.',
      returnWindow: 'Revisão em 20 dias',
      status: 'Estável',
      symptoms: 'Sem sinais clínicos agudos. Consulta preventiva ambiental.',
      clinicalNotes: 'Casco íntegro, boa resposta ao manejo e sem alterações locomotoras. Ambiente demanda apenas refinamento técnico.',
      examsRequested: ['Checklist ambiental com fotos', 'Medição de temperatura por zonas'],
      recommendations: ['Trocar UVB dentro da validade', 'Garantir basking seco', 'Registrar rotina de cálcio'],
      prescriptionItems: ['Suplementação de cálcio conforme protocolo', 'Ajuste de timer da iluminação']
    },
    {
      id: 209,
      petId: 1,
      date: '04/04/2026',
      veterinarian: 'Dra. Camila Freitas',
      specialty: 'Clínica Geral',
      diagnosis: 'Otite externa leve em ouvido direito.',
      prescription: 'Limpeza auricular a cada 48h e revisão se persistir secreção.',
      returnWindow: 'Revisão em 12 dias',
      status: 'Estável',
      symptoms: 'Sacudidas frequentes da cabeça e coceira pontual na orelha direita.',
      clinicalNotes: 'Canal com discreto excesso de cerúmen e sem dor intensa à palpação. Quadro leve em boa resposta.',
      examsRequested: ['Otoscopia de revisão', 'Citologia auricular se mantiver secreção'],
      recommendations: ['Evitar água no conduto', 'Secar bem após banho'],
      prescriptionItems: ['Solução auricular 2x ao dia por 7 dias', 'Limpeza externa com gaze']
    },
    {
      id: 210,
      petId: 2,
      date: '02/03/2026',
      veterinarian: 'Dr. Lucas Varella',
      specialty: 'Felinos',
      diagnosis: 'Gengivite leve em acompanhamento.',
      prescription: 'Escovação adaptada e gel oral veterinário.',
      returnWindow: 'Retorno em 45 dias',
      status: 'Em tratamento',
      symptoms: 'Halitose discreta e seletividade com ração seca.',
      clinicalNotes: 'Gengiva com rubor leve em arcada superior, sem perda dentária. Tutor recebeu orientação de adaptação gradual à higiene oral.',
      examsRequested: ['Avaliação odontológica de controle'],
      recommendations: ['Priorizar alimento úmido em parte da rotina', 'Observar sangramento durante mastigação'],
      prescriptionItems: ['Gel oral veterinário 1x ao dia', 'Escova dedeira com adaptação progressiva']
    },
    {
      id: 202,
      petId: 4,
      date: '20/05/2026',
      veterinarian: 'Dra. Camila Freitas',
      specialty: 'Clínica Geral',
      diagnosis: 'Gastrite leve com suspeita alimentar.',
      prescription: 'Fracionar dieta e iniciar protetor gástrico conforme peso.',
      returnWindow: 'Retorno em 7 dias',
      status: 'Atenção',
      symptoms: 'Vômito esporádico e redução do apetite em 48 horas.',
      clinicalNotes: 'Abdômen flácido, sem dor intensa à palpação. Tutor orientado a observar hidratação e evacuação.',
      examsRequested: ['Ultrassom abdominal', 'Hemograma completo'],
      recommendations: ['Ofertar dieta gastrointestinal', 'Evitar petiscos gordurosos'],
      prescriptionItems: ['Protetor gástrico por 5 dias', 'Dieta gastrointestinal fracionada']
    },
    {
      id: 203,
      petId: 6,
      date: '09/05/2026',
      veterinarian: 'Dr. Renato Braga',
      specialty: 'Animais Exóticos',
      diagnosis: 'Ajuste de manejo térmico no terrário.',
      prescription: 'Corrigir gradiente térmico e revisar ponto UVB.',
      returnWindow: 'Revisão em 15 dias',
      status: 'Estável',
      symptoms: 'Menor atividade nas primeiras horas do dia.',
      clinicalNotes: 'Sem sinais clínicos sistêmicos. Quadro sugere ajuste ambiental e não processo infeccioso.',
      examsRequested: ['Checklist de temperatura por faixa horária'],
      recommendations: ['Revisar termostato', 'Aumentar zona de basking'],
      prescriptionItems: ['Sem medicação', 'Plano de correção ambiental']
    },
    {
      id: 204,
      petId: 8,
      date: '17/05/2026',
      veterinarian: 'Dra. Camila Freitas',
      specialty: 'Pediatria',
      diagnosis: 'Protocolo vacinal em dia e boa evolução geral.',
      prescription: 'Manter cronograma de reforço vacinal.',
      returnWindow: 'Retorno em 21 dias',
      status: 'Estável',
      symptoms: 'Consulta de rotina sem sintomas agudos.',
      clinicalNotes: 'Paciente ativo, sem alterações em ausculta ou inspeção de pele.',
      examsRequested: ['Sem exames complementares imediatos'],
      recommendations: ['Manter socialização gradual', 'Continuar protocolo antiparasitário'],
      prescriptionItems: ['Reforço vacinal programado', 'Antiparasitário conforme peso']
    }
  ],
  veterinarians: [
    {
      id: 1,
      name: 'Dra. Camila Freitas',
      specialty: 'Clínica Geral e Dermatologia',
      unit: 'Unidade Coroado',
      shift: '08:00 às 18:00',
      status: 'Em atendimento'
    },
    {
      id: 2,
      name: 'Dr. Lucas Varella',
      specialty: 'Felinos e Medicina Preventiva',
      unit: 'Unidade Coroado',
      shift: '08:00 às 14:00',
      status: 'Disponível'
    },
    {
      id: 3,
      name: 'Dr. Renato Braga',
      specialty: 'Animais Exóticos',
      unit: 'Unidade Exóticos',
      shift: '10:00 às 19:00',
      status: 'Agenda cheia'
    },
    {
      id: 4,
      name: 'Dra. Helena Souto',
      specialty: 'Peixes Ornamentais e Ambientes Aquáticos',
      unit: 'Consultoria técnica',
      shift: '15:00 às 21:00',
      status: 'Disponível'
    },
    {
      id: 5,
      name: 'Dra. Elisa Moraes',
      specialty: 'Aves Ornamentais e pequenos exóticos',
      unit: 'Unidade Vieiralves',
      shift: '09:00 às 17:00',
      status: 'Em atendimento'
    }
  ],
  alerts: [
    {
      id: 1,
      title: '3 clientes com retorno vencendo',
      description: 'Thor, Amora e Kira precisam de contato ativo nas próximas 48h.',
      tone: 'attention'
    },
    {
      id: 2,
      title: 'Fila clínica concentrada na Coroado',
      description: 'A unidade está com maior pressão operacional no turno da tarde.',
      tone: 'critical'
    },
    {
      id: 3,
      title: '2 novos clientes na última semana',
      description: 'Bidu e cadastro da família Monteiro entraram na base de onboarding.',
      tone: 'info'
    }
  ],
  inventory: [
    buildInventoryItem(PRODUCTS_CATALOG[0], 'AQ-PEI-0001', 'AquaGlass Brasil', 2, 4),
    buildInventoryItem(PRODUCTS_CATALOG[2], 'AQ-PEI-0003', 'Canister Pro Systems', 3, 6),
    buildInventoryItem(PRODUCTS_CATALOG[6], 'AQ-CAO-0007', 'NutriPet Prime', 4, 8),
    buildInventoryItem(PRODUCTS_CATALOG[8], 'AQ-CAO-0009', 'Comfort Beds', 1, 3),
    buildInventoryItem(PRODUCTS_CATALOG[13], 'AQ-GAT-0014', 'HydraCeram', 2, 5),
    buildInventoryItem(PRODUCTS_CATALOG[17], 'AQ-GAT-0018', 'Ocean Foods', 9, 18),
    buildInventoryItem(PRODUCTS_CATALOG[20], 'AQ-AVE-0021', 'Bird Joy', 3, 10),
    buildInventoryItem(PRODUCTS_CATALOG[24], 'AQ-REP-0025', 'Exotic Habitat Co.', 1, 4),
    buildInventoryItem(PRODUCTS_CATALOG[31], 'AQ-SMP-0032', 'Pocket Pets Lab', 2, 7),
    buildInventoryItem(PRODUCTS_CATALOG[35], 'AQ-SMP-0036', 'Pocket Pets Lab', 5, 10)
  ],
  orders: [
    {
      id: 1,
      number: 'AQ-60111',
      clientId: 1,
      createdAt: '24/05/2026',
      status: 'Separando',
      fulfillment: 'Entrega',
      total: 344.7,
      items: [
        { productId: 12, name: 'Peitoral Air Mesh com Guia M', quantity: 1, unitPrice: 79.9 },
        { productId: 10, name: 'Shampoo Hipoalergênico Aveia Orgânica', quantity: 1, unitPrice: 44.9 },
        { productId: 18, name: 'Sachê Gourmet Salmão & Atum 85g', quantity: 15, unitPrice: 8.9 }
      ],
      notes: 'Cliente pediu conferência especial da embalagem por causa de sensibilidade do pet.'
    },
    {
      id: 6,
      number: 'AQ-60192',
      clientId: 1,
      createdAt: '25/05/2026',
      status: 'Pago',
      fulfillment: 'Entrega',
      total: 214.8,
      items: [
        { productId: 14, name: 'Fonte de Água Cerâmica Bivolt 2L', quantity: 1, unitPrice: 179.9 },
        { productId: 18, name: 'Sachê Gourmet Salmão & Atum 85g', quantity: 2, unitPrice: 8.9 },
        { productId: 13, name: 'Areia Biodegradável de Milho 4kg', quantity: 1, unitPrice: 17.1 }
      ],
      notes: 'Entrega combinada com portaria e preferência por janela do fim da manhã.'
    },
    {
      id: 7,
      number: 'AQ-59680',
      clientId: 1,
      createdAt: '15/05/2026',
      status: 'Entregue',
      fulfillment: 'Retirada',
      total: 129.9,
      items: [{ productId: 6, name: 'Kit Teste pH, Amônia e Nitrito', quantity: 1, unitPrice: 129.9 }],
      notes: 'Pedido retirado presencialmente após revisão do aquário.'
    },
    {
      id: 8,
      number: 'AQ-59321',
      clientId: 1,
      createdAt: '06/05/2026',
      status: 'Enviado',
      fulfillment: 'Entrega',
      total: 88.9,
      items: [{ productId: 10, name: 'Shampoo Hipoalergênico Aveia Orgânica', quantity: 1, unitPrice: 44.9 }, { productId: 12, name: 'Peitoral Air Mesh com Guia M', quantity: 1, unitPrice: 44.0 }],
      notes: 'Pedido complementar para rotina dermatológica do Thor.'
    },
    {
      id: 2,
      number: 'AQ-60048',
      clientId: 2,
      createdAt: '23/05/2026',
      status: 'Pago',
      fulfillment: 'Retirada',
      total: 129.9,
      items: [{ productId: 6, name: 'Kit Teste pH, Amônia e Nitrito', quantity: 1, unitPrice: 129.9 }],
      notes: 'Retirada prevista para o fim da tarde.'
    },
    {
      id: 3,
      number: 'AQ-59990',
      clientId: 3,
      createdAt: '22/05/2026',
      status: 'Enviado',
      fulfillment: 'Entrega',
      total: 179.9,
      items: [{ productId: 14, name: 'Fonte de Água Cerâmica Bivolt 2L', quantity: 1, unitPrice: 179.9 }],
      notes: 'Entrega premium com janela das 13h às 17h.'
    },
    {
      id: 4,
      number: 'AQ-59877',
      clientId: 4,
      createdAt: '20/05/2026',
      status: 'Entregue',
      fulfillment: 'Entrega',
      total: 219.9,
      items: [{ productId: 7, name: 'Ração Super Premium Cães Adultos 12kg', quantity: 1, unitPrice: 219.9 }],
      notes: 'Primeira compra do cliente pelo portal.'
    },
    {
      id: 5,
      number: 'AQ-59745',
      clientId: 2,
      createdAt: '18/05/2026',
      status: 'Cancelado',
      fulfillment: 'Entrega',
      total: 289.9,
      items: [{ productId: 9, name: 'Caminha Ortopédica Wave Comfort G', quantity: 1, unitPrice: 289.9 }],
      notes: 'Cancelamento solicitado por divergência de tamanho.'
    }
  ]
};

function readBackofficeSnapshot(): BackofficeSnapshot {
  const snapshot: BackofficeSnapshot = {
    clients: readSeededAppSessionSlice<BackofficeClient[]>(CLIENTS_SLICE, [...MOCK_BACKOFFICE.clients]),
    pets: readSeededAppSessionSlice<BackofficePet[]>(PETS_SLICE, [...MOCK_BACKOFFICE.pets]),
    appointments: readSeededAppSessionSlice<ClientAppointment[]>(APPOINTMENTS_SLICE, [...MOCK_BACKOFFICE.appointments]),
    records: readSeededAppSessionSlice<MedicalRecord[]>(RECORDS_SLICE, [...MOCK_BACKOFFICE.records]),
    veterinarians: readSeededAppSessionSlice<BackofficeVet[]>(VETERINARIANS_SLICE, [...MOCK_BACKOFFICE.veterinarians]),
    alerts: readSeededAppSessionSlice<BackofficeAlert[]>(ALERTS_SLICE, [...MOCK_BACKOFFICE.alerts]),
    inventory: readSeededAppSessionSlice<BackofficeInventoryItem[]>(INVENTORY_SLICE, [...MOCK_BACKOFFICE.inventory]),
    orders: readSeededAppSessionSlice<BackofficeOrder[]>(ORDERS_SLICE, [...MOCK_BACKOFFICE.orders])
  };

  const hydratedSnapshot: BackofficeSnapshot = {
    clients: mergeSeededById(snapshot.clients, MOCK_BACKOFFICE.clients),
    pets: mergeSeededById(snapshot.pets, MOCK_BACKOFFICE.pets),
    appointments: mergeSeededById(snapshot.appointments, MOCK_BACKOFFICE.appointments),
    records: mergeSeededById(snapshot.records, MOCK_BACKOFFICE.records),
    veterinarians: mergeSeededById(snapshot.veterinarians, MOCK_BACKOFFICE.veterinarians),
    alerts: mergeSeededById(snapshot.alerts, MOCK_BACKOFFICE.alerts),
    inventory: mergeSeededById(snapshot.inventory, MOCK_BACKOFFICE.inventory),
    orders: mergeSeededById(snapshot.orders, MOCK_BACKOFFICE.orders)
  };

  const changed =
    hydratedSnapshot.clients.length !== snapshot.clients.length ||
    hydratedSnapshot.pets.length !== snapshot.pets.length ||
    hydratedSnapshot.appointments.length !== snapshot.appointments.length ||
    hydratedSnapshot.records.length !== snapshot.records.length ||
    hydratedSnapshot.veterinarians.length !== snapshot.veterinarians.length ||
    hydratedSnapshot.alerts.length !== snapshot.alerts.length ||
    hydratedSnapshot.inventory.length !== snapshot.inventory.length ||
    hydratedSnapshot.orders.length !== snapshot.orders.length;

  if (changed) {
    writeBackofficeSnapshot(hydratedSnapshot);
  }

  return hydratedSnapshot;
}

const writeBackofficeSnapshot = (snapshot: BackofficeSnapshot) => {
  writeAppSessionSlice(CLIENTS_SLICE, snapshot.clients);
  writeAppSessionSlice(PETS_SLICE, snapshot.pets);
  writeAppSessionSlice(APPOINTMENTS_SLICE, snapshot.appointments);
  writeAppSessionSlice(RECORDS_SLICE, snapshot.records);
  writeAppSessionSlice(VETERINARIANS_SLICE, snapshot.veterinarians);
  writeAppSessionSlice(ALERTS_SLICE, snapshot.alerts);
  writeAppSessionSlice(INVENTORY_SLICE, snapshot.inventory);
  writeAppSessionSlice(ORDERS_SLICE, snapshot.orders);
};

export const fetchBackofficeSnapshot = async (): Promise<BackofficeSnapshot> => simulateApiDelay(readBackofficeSnapshot());

export const createBackofficeInventoryItem = async (product: Omit<BackofficeInventoryItem, 'id' | 'status'>): Promise<BackofficeInventoryItem> => {
  const snapshot = readBackofficeSnapshot();
  const products = getStoredProductsCatalog();
  const nextItem: BackofficeInventoryItem = {
    ...product,
    id: snapshot.inventory.reduce((highestId, item) => Math.max(highestId, item.id), 0) + 1,
    status: product.stock <= Math.max(2, Math.floor(product.minStock / 2)) ? 'Crítico' : product.stock <= product.minStock ? 'Baixo' : 'Saudável'
  };

  writeBackofficeSnapshot({
    ...snapshot,
    inventory: [nextItem, ...snapshot.inventory]
  });
  saveStoredProductsCatalog([{ ...nextItem }, ...products]);

  return simulateApiDelay(nextItem);
};

export const updateBackofficeInventoryStock = async (itemId: number, nextStock: number): Promise<BackofficeInventoryItem[]> => {
  const snapshot = readBackofficeSnapshot();
  const products = getStoredProductsCatalog();
  const nextInventory: BackofficeInventoryItem[] = snapshot.inventory.map((item) =>
    item.id === itemId
      ? {
          ...item,
          stock: nextStock,
          status: (nextStock <= Math.max(2, Math.floor(item.minStock / 2)) ? 'Crítico' : nextStock <= item.minStock ? 'Baixo' : 'Saudável') as BackofficeInventoryItem['status']
        }
      : item
  );

  writeBackofficeSnapshot({
    ...snapshot,
    inventory: nextInventory
  });
  saveStoredProductsCatalog(
    products.map((product) =>
      product.id === itemId
        ? {
            ...product,
            stock: nextStock
          }
        : product
    )
  );

  return simulateApiDelay(nextInventory);
};

export const updateBackofficeOrderStatus = async (orderId: number, status: BackofficeOrder['status']): Promise<BackofficeOrder[]> => {
  const snapshot = readBackofficeSnapshot();
  const nextOrders: BackofficeOrder[] = snapshot.orders.map((order) => (order.id === orderId ? { ...order, status } : order));

  writeBackofficeSnapshot({
    ...snapshot,
    orders: nextOrders
  });

  return simulateApiDelay(nextOrders);
};

export const updateBackofficeOrder = async (
  orderId: number,
  updates: Partial<Pick<BackofficeOrder, 'status' | 'fulfillment' | 'notes'>>
): Promise<BackofficeOrder[]> => {
  const snapshot = readBackofficeSnapshot();
  const nextOrders: BackofficeOrder[] = snapshot.orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          ...updates
        }
      : order
  );

  writeBackofficeSnapshot({
    ...snapshot,
    orders: nextOrders
  });

  return simulateApiDelay(nextOrders);
};

export const cancelBackofficeOrder = async (orderId: number): Promise<BackofficeOrder[]> => {
  const snapshot = readBackofficeSnapshot();
  const nextOrders: BackofficeOrder[] = snapshot.orders.map((order) =>
    order.id === orderId ? { ...order, status: 'Cancelado' as BackofficeOrder['status'], notes: `${order.notes} Cancelado pelo admin.` } : order
  );

  writeBackofficeSnapshot({
    ...snapshot,
    orders: nextOrders
  });

  return simulateApiDelay(nextOrders);
};

export const deleteBackofficeOrder = async (orderId: number): Promise<BackofficeOrder[]> => {
  const snapshot = readBackofficeSnapshot();
  const nextOrders: BackofficeOrder[] = snapshot.orders.filter((order) => order.id !== orderId);

  writeBackofficeSnapshot({
    ...snapshot,
    orders: nextOrders
  });

  return simulateApiDelay(nextOrders);
};

export const createVeterinaryRecord = async (
  petId: number,
  veterinarian: string,
  draft: Omit<MedicalRecord, 'id' | 'petId' | 'veterinarian'>
): Promise<BackofficeSnapshot> => {
  const snapshot = readBackofficeSnapshot();
  const nextRecord: MedicalRecord = {
    ...draft,
    id: snapshot.records.reduce((highestId, record) => Math.max(highestId, record.id), 0) + 1,
    petId,
    veterinarian
  };

  const nextPets: BackofficePet[] = snapshot.pets.map((pet) =>
    pet.id === petId
      ? {
          ...pet,
          lastVisit: draft.date,
          nextAction: draft.returnWindow,
          status: (draft.status === 'Estável' ? 'Ativo' : draft.status === 'Atenção' ? 'Observação' : 'Em acompanhamento') as BackofficePet['status']
        }
      : pet
  );

  const nextSnapshot: BackofficeSnapshot = {
    ...snapshot,
    pets: nextPets,
    records: [nextRecord, ...snapshot.records]
  };

  writeBackofficeSnapshot(nextSnapshot);
  return simulateApiDelay(nextSnapshot);
};

export const updateBackofficePet = async (
  petId: number,
  updates: Partial<Omit<BackofficePet, 'id' | 'clientId' | 'tutorName' | 'vaccines'>>
): Promise<BackofficePet[]> => {
  const snapshot = readBackofficeSnapshot();
  const nextPets: BackofficePet[] = snapshot.pets.map((pet) =>
    pet.id === petId
      ? {
          ...pet,
          ...updates
        }
      : pet
  );

  writeBackofficeSnapshot({
    ...snapshot,
    pets: nextPets
  });

  return simulateApiDelay(nextPets);
};

export const MOCK_BACKOFFICE_USERS = {
  admin: {
  id: 1,
  name: 'Paula Nascimento',
  email: 'admin@acquapet.mock',
  role: 'admin',
  title: 'Admin Geral',
  unit: 'Central Operacional'
  },
  veterinarian: {
    id: 2,
    name: 'Dr. Lucas Varella',
    email: 'vet@acquapet.mock',
    role: 'veterinarian',
    title: 'Admin Veterinário',
    unit: 'Clínica e prontuário'
  }
} satisfies Record<BackofficeRole, BackofficeSessionUser>;

const ADMIN_USER: BackofficeSessionUser = MOCK_BACKOFFICE_USERS.admin;
const VETERINARIAN_USER: BackofficeSessionUser = MOCK_BACKOFFICE_USERS.veterinarian;

export const MOCK_SYSTEM_USERS = {
  client: {
    id: MOCK_BACKOFFICE.clients[0].id,
    name: MOCK_BACKOFFICE.clients[0].name,
    email: MOCK_BACKOFFICE.clients[0].email
  },
  admin: {
    id: MOCK_BACKOFFICE_USERS.admin.id,
    name: MOCK_BACKOFFICE_USERS.admin.name,
    email: MOCK_BACKOFFICE_USERS.admin.email
  },
  veterinarian: {
    id: MOCK_BACKOFFICE_USERS.veterinarian.id,
    name: MOCK_BACKOFFICE_USERS.veterinarian.name,
    email: MOCK_BACKOFFICE_USERS.veterinarian.email
  }
};

const buildSession = (user: BackofficeSessionUser): BackofficeAuthSession => ({
  user,
  accessToken: `mock-${user.role}-access-token`,
  refreshToken: `mock-${user.role}-refresh-token`,
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
});

const getStorageKey = (role: BackofficeRole) => (role === 'admin' ? ADMIN_AUTH_STORAGE_KEY : VET_AUTH_STORAGE_KEY);

export const getStoredBackofficeSession = (role: BackofficeRole): BackofficeAuthSession | null => {
  const raw = localStorage.getItem(getStorageKey(role));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as BackofficeAuthSession;
    if (!parsed?.user?.email || !parsed?.accessToken || parsed.user.role !== role) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveBackofficeSession = (role: BackofficeRole, session: BackofficeAuthSession) => {
  localStorage.setItem(getStorageKey(role), JSON.stringify(session));
};

export const clearBackofficeSession = (role: BackofficeRole) => {
  localStorage.removeItem(getStorageKey(role));
};

export const mockBackofficeLogin = async (role: BackofficeRole, email: string): Promise<BackofficeAuthSession> => {
  const baseUser = role === 'admin' ? ADMIN_USER : VETERINARIAN_USER;
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== baseUser.email.toLowerCase()) {
    throw new Error(`Use o e-mail mockado ${baseUser.email} para acessar este painel.`);
  }

  return simulateApiDelay(buildSession(baseUser));
};
