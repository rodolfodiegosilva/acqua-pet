import { PRODUCTS_CATALOG, type Product } from './api';
import type { ClientAppointment, ClientPet, ClientPetSex, ClientPetSpecies, MedicalRecord } from './clientPortal';

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

const ADMIN_AUTH_STORAGE_KEY = 'acqua-pet-admin-auth-session';
const VET_AUTH_STORAGE_KEY = 'acqua-pet-veterinary-auth-session';

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

const ADMIN_USER: BackofficeSessionUser = {
  id: 1,
  name: 'Paula Nascimento',
  email: 'admin@acquapet.mock',
  role: 'admin',
  title: 'Admin Geral',
  unit: 'Central Operacional'
};

const VETERINARIAN_USER: BackofficeSessionUser = {
  id: 2,
  name: 'Dr. Lucas Varella',
  email: 'vet@acquapet.mock',
  role: 'veterinarian',
  title: 'Admin Veterinário',
  unit: 'Clínica e prontuário'
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
  await new Promise((resolve) => setTimeout(resolve, 500));
  const baseUser = role === 'admin' ? ADMIN_USER : VETERINARIAN_USER;
  return buildSession({ ...baseUser, email: email || baseUser.email });
};
