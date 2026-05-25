import { getStoredProductsCatalog, type Product } from './api';
import { MOCK_BACKOFFICE, updateBackofficePet, type BackofficeClient, type BackofficePet, type BackofficeSnapshot, type BackofficeVet, type BackofficeOrder } from './backoffice';
import { readSeededAppSessionSlice, simulateApiDelay, writeAppSessionSlice } from './mockStorage';

export const CLIENT_PET_SPECIES = [
  'Cão',
  'Gato',
  'Peixe',
  'Ave',
  'Réptil',
  'Coelho',
  'Hamster',
  'Porquinho-da-índia',
  'Chinchila',
  'Tartaruga',
  'Iguana',
  'Serpente',
  'Furão',
  'Outro pequeno pet'
] as const;
export type ClientPetSpecies = (typeof CLIENT_PET_SPECIES)[number];
export const CLIENT_PET_SEXES = ['Macho', 'Fêmea', 'Não informado'] as const;
export type ClientPetSex = (typeof CLIENT_PET_SEXES)[number];

export interface ClientUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  plan: 'Essential' | 'Care+' | 'Prime';
  memberSince: string;
  city: string;
}

export interface ClientPet {
  id: number;
  name: string;
  species: ClientPetSpecies;
  sex: ClientPetSex;
  breed: string;
  age: string;
  weight: string;
  avatar: string;
  tutorName: string;
  observation: string;
  vaccines: string[];
}

export interface MedicalRecord {
  id: number;
  petId: number;
  date: string;
  veterinarian: string;
  specialty: string;
  diagnosis: string;
  prescription: string;
  returnWindow: string;
  status: 'Estável' | 'Atenção' | 'Em tratamento';
  symptoms: string;
  clinicalNotes: string;
  examsRequested: string[];
  recommendations: string[];
  prescriptionItems: string[];
}

export interface VetAvailability {
  id: number;
  name: string;
  specialty: string;
  nextSlot: string;
  shift: string;
  channel: string;
  status: 'Disponível' | 'Últimas vagas' | 'Agenda cheia';
}

export interface ClientAppointment {
  id: number;
  petId: number;
  type: 'Serviço' | 'Táxi Pet';
  service: string;
  veterinarian: string;
  date: string;
  time: string;
  status: 'Confirmado' | 'Em análise' | 'Concluído';
  location: string;
  pickupAddress?: string;
  destinationAddress?: string;
  transportMode?: 'Somente ida' | 'Ida e volta';
  companion?: 'Tutor acompanha' | 'Pet desacompanhado';
}

export interface ClientOrder {
  id: number;
  number: string;
  createdAt: string;
  status: 'Separando' | 'Entregue' | 'Pronto para retirada';
  total: number;
  items: string[];
}

export interface ClientPortalSnapshot {
  user: ClientUser;
  pets: ClientPet[];
  medicalRecords: MedicalRecord[];
  veterinarians: VetAvailability[];
  appointments: ClientAppointment[];
  orders: ClientOrder[];
  recommendedProducts: Product[];
}

export interface ClientAuthSession {
  user: ClientUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

const CLIENT_AUTH_STORAGE_KEY = 'acqua-pet-client-auth-session';
const CLIENT_PROFILE_SLICE = 'clientProfile';
const CLIENTS_SLICE = 'clients';
const PETS_SLICE = 'pets';
const APPOINTMENTS_SLICE = 'appointments';
const RECORDS_SLICE = 'medicalRecords';
const VETERINARIANS_SLICE = 'veterinarians';
const ORDERS_SLICE = 'orders';

export const MOCK_CLIENT_PORTAL: ClientPortalSnapshot = {
  user: {
    id: 1,
    name: 'Marina Albuquerque',
    email: 'marina@cliente.mock',
    cpf: '123.456.789-10',
    phone: '(92) 99999-1001',
    plan: 'Prime',
    memberSince: 'Março de 2024',
    city: 'Manaus - AM'
  },
  pets: [
    {
      id: 1,
      name: 'Thor',
      species: 'Cão',
      sex: 'Macho',
      breed: 'Golden Retriever',
      age: '5 anos',
      weight: '31 kg',
      avatar: '🐶',
      tutorName: 'Marina Albuquerque',
      observation: 'Sensível a shampoos com fragrância intensa.',
      vaccines: ['V10', 'Antirrábica', 'Giárdia']
    },
    {
      id: 2,
      name: 'Mia',
      species: 'Gato',
      sex: 'Fêmea',
      breed: 'SRD',
      age: '3 anos',
      weight: '4,2 kg',
      avatar: '🐱',
      tutorName: 'Marina Albuquerque',
      observation: 'Acompanhamento anual renal preventivo.',
      vaccines: ['V4', 'Antirrábica']
    },
    {
      id: 3,
      name: 'Nemo',
      species: 'Peixe',
      sex: 'Não informado',
      breed: 'Acará Bandeira',
      age: '1 ano e 4 meses',
      weight: 'Monitoramento em aquário',
      avatar: '🐠',
      tutorName: 'Marina Albuquerque',
      observation: 'Aquário plantado 180L com rotina de testes semanais.',
      vaccines: []
    }
  ],
  medicalRecords: [
    {
      id: 1,
      petId: 1,
      date: '22/05/2026',
      veterinarian: 'Dra. Camila Freitas',
      specialty: 'Clínica Geral',
      diagnosis: 'Dermatite alérgica leve em regressão.',
      prescription: 'Banho terapêutico 1x por semana e dieta controlada por 30 dias.',
      returnWindow: 'Retorno em 20 dias',
      status: 'Em tratamento',
      symptoms: 'Coceira intermitente em dorso e patas após banho com fragrâncias intensas.',
      clinicalNotes: 'Pele com discreta vermelhidão em região abdominal. Sem lesões abertas. Tutor relata melhora parcial nas últimas duas semanas com ajuste alimentar.',
      examsRequested: ['Citologia cutânea de controle', 'Revisão fotográfica em 10 dias'],
      recommendations: ['Evitar shampoo perfumado', 'Manter toalha individual e secagem completa', 'Observar aumento de lambedura nas patas'],
      prescriptionItems: ['Shampoo terapêutico hipoalergênico 1x por semana', 'Dieta hipoalergênica por 30 dias', 'Ômega 3 veterinário conforme peso']
    },
    {
      id: 4,
      petId: 1,
      date: '04/04/2026',
      veterinarian: 'Dra. Camila Freitas',
      specialty: 'Clínica Geral',
      diagnosis: 'Otite externa leve em ouvido direito.',
      prescription: 'Limpeza auricular a cada 48h e retorno se houver odor persistente.',
      returnWindow: 'Revisão em 12 dias',
      status: 'Estável',
      symptoms: 'Sacudidas frequentes da cabeça e coceira pontual na orelha direita.',
      clinicalNotes: 'Canal auditivo com leve presença de cerúmen escurecido, sem dor intensa à palpação. Sem febre ou alteração sistêmica.',
      examsRequested: ['Otoscopia de revisão', 'Citologia auricular se mantiver secreção'],
      recommendations: ['Evitar entrada de água no conduto', 'Secar bem após banho', 'Monitorar odor ou secreção'],
      prescriptionItems: ['Solução auricular veterinária 2x ao dia por 7 dias', 'Limpeza com gaze seca na parte externa']
    },
    {
      id: 5,
      petId: 1,
      date: '15/02/2026',
      veterinarian: 'Dr. Renato Braga',
      specialty: 'Ortopedia',
      diagnosis: 'Sobrecarga articular leve após atividade intensa.',
      prescription: 'Reduzir impacto por 14 dias e iniciar condroprotetor.',
      returnWindow: 'Retorno em 30 dias',
      status: 'Atenção',
      symptoms: 'Claudicação discreta após corridas longas no fim de semana.',
      clinicalNotes: 'Sem edema evidente em articulações. Dor leve em flexão de joelho esquerdo. Indicada restrição temporária de exercícios de alto impacto.',
      examsRequested: ['Radiografia se persistir sensibilidade', 'Avaliação funcional de marcha'],
      recommendations: ['Evitar saltos', 'Passeios curtos em piso regular', 'Reforçar controle de peso'],
      prescriptionItems: ['Condroprotetor conforme peso por 60 dias', 'Compressa fria 2x ao dia por 3 dias']
    },
    {
      id: 2,
      petId: 2,
      date: '11/05/2026',
      veterinarian: 'Dr. Lucas Varella',
      specialty: 'Felinos',
      diagnosis: 'Check-up anual sem alterações laboratoriais relevantes.',
      prescription: 'Manter hidratação com fonte e alimentação úmida diária.',
      returnWindow: 'Revisão em 6 meses',
      status: 'Estável',
      symptoms: 'Sem queixas agudas. Consulta preventiva de rotina.',
      clinicalNotes: 'Mucosas normocoradas, ausculta sem alterações e escore corporal adequado. Tutor relata bom consumo hídrico após introdução de fonte.',
      examsRequested: ['Hemograma anual arquivado', 'Bioquímico renal de rotina'],
      recommendations: ['Manter enriquecimento ambiental', 'Estimular ingestão hídrica com sachê diário', 'Repetir exames preventivos no próximo semestre'],
      prescriptionItems: ['Sem medicação contínua nova', 'Manutenção da dieta úmida diária']
    },
    {
      id: 6,
      petId: 2,
      date: '02/03/2026',
      veterinarian: 'Dr. Lucas Varella',
      specialty: 'Felinos',
      diagnosis: 'Gengivite leve em acompanhamento.',
      prescription: 'Escovação adaptada e gel oral de uso veterinário.',
      returnWindow: 'Retorno em 45 dias',
      status: 'Em tratamento',
      symptoms: 'Halitose discreta e seletividade alimentar em rações mais secas.',
      clinicalNotes: 'Gengiva com rubor leve em arcada superior. Não há perda dentária nem dor intensa. Tutor orientado sobre adaptação gradual à higiene oral.',
      examsRequested: ['Avaliação odontológica de controle', 'Registro fotográfico da mucosa oral'],
      recommendations: ['Priorizar alimentação úmida em parte da rotina', 'Não usar produtos humanos', 'Observar sangramento durante mastigação'],
      prescriptionItems: ['Gel oral veterinário 1x ao dia por 21 dias', 'Escova dedeira com adaptação progressiva']
    },
    {
      id: 7,
      petId: 2,
      date: '19/01/2026',
      veterinarian: 'Dr. Lucas Varella',
      specialty: 'Medicina Preventiva',
      diagnosis: 'Estresse ambiental com episódios de vocalização noturna.',
      prescription: 'Ajuste ambiental, feromônio e rotina previsível por 30 dias.',
      returnWindow: 'Reavaliação em 1 mês',
      status: 'Atenção',
      symptoms: 'Miados intensos à noite após mudança de móveis e rotina da casa.',
      clinicalNotes: 'Sem alteração clínica em exame físico. Quadro compatível com gatilho ambiental recente. Reforçadas medidas de previsibilidade e áreas de refúgio.',
      examsRequested: ['Sem exames imediatos', 'Monitoramento comportamental por checklist semanal'],
      recommendations: ['Criar rotas altas e esconderijos', 'Manter horários fixos de alimentação', 'Evitar estímulos intensos no período noturno'],
      prescriptionItems: ['Difusor de feromônio felino por 30 dias', 'Plano de enriquecimento ambiental']
    },
    {
      id: 3,
      petId: 3,
      date: '18/05/2026',
      veterinarian: 'Dra. Helena Souto',
      specialty: 'Aquáticos',
      diagnosis: 'Parâmetros do aquário estáveis; recomendado reforço biológico.',
      prescription: 'Aumentar troca parcial para 20% semanal e revisar filtro biológico.',
      returnWindow: 'Acompanhamento em 30 dias',
      status: 'Atenção',
      symptoms: 'Leve redução de atividade no período da manhã e sensibilidade após oscilação prévia de amônia.',
      clinicalNotes: 'Animal sem sinais visíveis de parasitose externa. Sistema plantado com boa oxigenação, porém biologia do filtro pode ser reforçada para estabilização prolongada.',
      examsRequested: ['Teste sequencial de amônia e nitrito por 7 dias', 'Registro fotográfico do comportamento alimentar'],
      recommendations: ['Reforçar colônia bacteriana', 'Não aumentar a carga orgânica do aquário', 'Monitorar temperatura e pH após TPA'],
      prescriptionItems: ['Condicionador biológico conforme litragem', 'Rotina de TPA semanal de 20%']
    },
    {
      id: 8,
      petId: 3,
      date: '03/04/2026',
      veterinarian: 'Dra. Helena Souto',
      specialty: 'Aquáticos',
      diagnosis: 'Sinais leves de estresse por luminosidade excessiva.',
      prescription: 'Reduzir fotoperíodo e ampliar áreas de sombra com plantas.',
      returnWindow: 'Nova checagem em 15 dias',
      status: 'Estável',
      symptoms: 'Nado mais retraído nas primeiras horas após acendimento total da iluminação.',
      clinicalNotes: 'Comportamento melhora ao longo do dia. Não há sinais físicos de lesão. Ambiente muito exposto visualmente em uma das laterais.',
      examsRequested: ['Sem exames laboratoriais imediatos', 'Observação de comportamento em vídeo por 5 dias'],
      recommendations: ['Diminuir luz para 7 horas', 'Criar barreiras visuais laterais', 'Evitar batidas no vidro'],
      prescriptionItems: ['Ajuste de timer da iluminação', 'Reorganização do hardscape com zonas de refúgio']
    },
    {
      id: 9,
      petId: 3,
      date: '12/02/2026',
      veterinarian: 'Dra. Helena Souto',
      specialty: 'Aquáticos',
      diagnosis: 'Suspeita descartada de desequilíbrio osmótico após adaptação.',
      prescription: 'Manter estabilidade de parâmetros e evitar trocas bruscas.',
      returnWindow: 'Acompanhamento mensal',
      status: 'Estável',
      symptoms: 'Respiração discretamente acelerada após introdução em nova rotina de manutenção.',
      clinicalNotes: 'Melhora espontânea após estabilização de temperatura e condutividade. Sem necessidade de intervenção medicamentosa no momento.',
      examsRequested: ['Medição seriada de temperatura e condutividade', 'Checklist de alimentação'],
      recommendations: ['Evitar grandes trocas de água no mesmo dia', 'Aclimatação lenta em qualquer ajuste futuro', 'Registrar parâmetros em planilha semanal'],
      prescriptionItems: ['Sem medicação indicada', 'Protocolo de estabilidade de parâmetros']
    }
  ],
  veterinarians: [
    {
      id: 1,
      name: 'Dra. Camila Freitas',
      specialty: 'Clínica Geral e Dermatologia',
      nextSlot: 'Hoje, 16:30',
      shift: '14:00 às 20:00',
      channel: 'Presencial',
      status: 'Últimas vagas'
    },
    {
      id: 2,
      name: 'Dr. Lucas Varella',
      specialty: 'Felinos e Medicina Preventiva',
      nextSlot: 'Amanhã, 09:15',
      shift: '08:00 às 14:00',
      channel: 'Presencial e retorno digital',
      status: 'Disponível'
    },
    {
      id: 3,
      name: 'Dra. Helena Souto',
      specialty: 'Peixes Ornamentais e Ambientes Aquáticos',
      nextSlot: 'Amanhã, 18:10',
      shift: '15:00 às 21:00',
      channel: 'Consultoria técnica',
      status: 'Disponível'
    },
    {
      id: 4,
      name: 'Dr. Renato Braga',
      specialty: 'Animais Silvestres e Exóticos',
      nextSlot: '27/05, 10:40',
      shift: '09:00 às 17:00',
      channel: 'Presencial',
      status: 'Agenda cheia'
    }
  ],
  appointments: [
    {
      id: 1,
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
      id: 2,
      petId: 3,
      type: 'Serviço',
      service: 'Avaliação de saúde do aquário',
      veterinarian: 'Dra. Helena Souto',
      date: '26/05/2026',
      time: '18:10',
      status: 'Em análise',
      location: 'Consultoria técnica'
    },
    {
      id: 3,
      petId: 2,
      type: 'Táxi Pet',
      service: 'Táxi Pet para consulta felina',
      veterinarian: 'Dr. Lucas Varella',
      date: '08/05/2026',
      time: '09:00',
      status: 'Concluído',
      location: 'Rota concluída · Unidade Coroado',
      pickupAddress: 'Rua Rio Jutaí, 240 - Vieiralves',
      destinationAddress: 'Unidade Coroado',
      transportMode: 'Ida e volta',
      companion: 'Tutor acompanha'
    }
  ],
  orders: [
    {
      id: 1,
      number: 'AQ-58102',
      createdAt: '23/05/2026',
      status: 'Separando',
      total: 344.7,
      items: ['Peitoral Air Mesh com Guia M', 'Shampoo Hipoalergênico Aveia Orgânica', 'Sachê Gourmet Salmão & Atum 85g']
    },
    {
      id: 2,
      number: 'AQ-57088',
      createdAt: '18/05/2026',
      status: 'Entregue',
      total: 129.9,
      items: ['Kit Teste pH, Amônia e Nitrito']
    },
    {
      id: 3,
      number: 'AQ-56411',
      createdAt: '12/05/2026',
      status: 'Pronto para retirada',
      total: 179.9,
      items: ['Fonte de Água Cerâmica Bivolt 2L']
    }
  ],
  recommendedProducts: getStoredProductsCatalog().slice(0, 8)
};

const buildMockSession = (user: ClientUser): ClientAuthSession => ({
  user,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
});

const readClientProfile = () =>
  readSeededAppSessionSlice<ClientUser>(CLIENT_PROFILE_SLICE, {
    ...MOCK_CLIENT_PORTAL.user
  });

const writeClientProfile = (profile: ClientUser) => {
  writeAppSessionSlice(CLIENT_PROFILE_SLICE, profile);
};

const buildFallbackClientSnapshot = (): ClientPortalSnapshot => ({
  ...MOCK_CLIENT_PORTAL,
  user: readClientProfile(),
  recommendedProducts: getStoredProductsCatalog().slice(0, 8)
});

const upsertSharedClientFromUser = (user: ClientUser): ClientUser => {
  const clients = readSeededAppSessionSlice<BackofficeClient[]>(CLIENTS_SLICE, [...MOCK_BACKOFFICE.clients]);
  const existingClient = clients.find((client) => client.email === user.email || client.id === user.id);
  const nextClientId = clients.reduce((highestId, client) => Math.max(highestId, client.id), 0) + 1;

  const syncedUser: ClientUser = {
    ...user,
    id: existingClient?.id ?? nextClientId
  };

  const mirroredClient: BackofficeClient = existingClient
    ? {
        ...existingClient,
        name: syncedUser.name,
        email: syncedUser.email,
        phone: syncedUser.phone,
        city: syncedUser.city,
        plan: syncedUser.plan,
        joinedAt: syncedUser.memberSince
      }
    : {
        id: syncedUser.id,
        name: syncedUser.name,
        email: syncedUser.email,
        phone: syncedUser.phone,
        city: syncedUser.city,
        neighborhood: 'A definir',
        plan: syncedUser.plan,
        status: 'Novo',
        joinedAt: syncedUser.memberSince,
        tags: ['cadastro portal']
      };

  writeAppSessionSlice(
    CLIENTS_SLICE,
    existingClient ? clients.map((client) => (client.id === existingClient.id ? mirroredClient : client)) : [...clients, mirroredClient]
  );

  writeClientProfile(syncedUser);
  return syncedUser;
};

const readBackofficeSnapshot = (): BackofficeSnapshot => ({
  clients: readSeededAppSessionSlice<BackofficeClient[]>(CLIENTS_SLICE, [...MOCK_BACKOFFICE.clients]),
  pets: readSeededAppSessionSlice<BackofficePet[]>(PETS_SLICE, [...MOCK_BACKOFFICE.pets]),
  appointments: readSeededAppSessionSlice<ClientAppointment[]>(APPOINTMENTS_SLICE, [...MOCK_BACKOFFICE.appointments]),
  records: readSeededAppSessionSlice<MedicalRecord[]>(RECORDS_SLICE, [...MOCK_BACKOFFICE.records]),
  veterinarians: readSeededAppSessionSlice<BackofficeVet[]>(VETERINARIANS_SLICE, [...MOCK_BACKOFFICE.veterinarians]),
  alerts: [],
  inventory: [],
  orders: readSeededAppSessionSlice<BackofficeOrder[]>(ORDERS_SLICE, [...MOCK_BACKOFFICE.orders])
});

const mapBackofficeVetToAvailability = (vet: BackofficeVet): VetAvailability => ({
  id: vet.id,
  name: vet.name,
  specialty: vet.specialty,
  nextSlot: vet.status === 'Agenda cheia' ? 'Agenda temporariamente cheia' : 'Próximo encaixe disponível',
  shift: vet.shift,
  channel: 'Presencial e retorno digital',
  status: vet.status === 'Disponível' ? 'Disponível' : vet.status === 'Agenda cheia' ? 'Agenda cheia' : 'Últimas vagas'
});

const deriveClientSnapshotFromBackoffice = (fallbackUser?: ClientUser): ClientPortalSnapshot | null => {
  const backofficeSnapshot = readBackofficeSnapshot();
  if (backofficeSnapshot.clients.length === 0) return null;

  const baseUser = fallbackUser ?? readClientProfile();
  const matchingClient = backofficeSnapshot.clients.find((client) => client.id === baseUser.id || client.email === baseUser.email);

  const hydratedUser: ClientUser = {
    ...baseUser,
    id: matchingClient?.id ?? baseUser.id,
    name: matchingClient?.name ?? baseUser.name,
    email: matchingClient?.email ?? baseUser.email,
    phone: matchingClient?.phone ?? baseUser.phone,
    plan: matchingClient?.plan ?? baseUser.plan,
    memberSince: matchingClient?.joinedAt ?? baseUser.memberSince,
    city: matchingClient?.city ?? baseUser.city
  };

  const pets = backofficeSnapshot.pets.filter((pet) => pet.clientId === hydratedUser.id).map<ClientPet>(({ clientId, status, lastVisit, nextAction, ...pet }) => pet);
  const petIds = new Set(pets.map((pet) => pet.id));

  return {
    user: hydratedUser,
    pets,
    medicalRecords: backofficeSnapshot.records.filter((record) => petIds.has(record.petId)),
    veterinarians: backofficeSnapshot.veterinarians.map(mapBackofficeVetToAvailability),
    appointments: backofficeSnapshot.appointments.filter((appointment) => petIds.has(appointment.petId)),
    orders: backofficeSnapshot.orders
      .filter((order) => order.clientId === hydratedUser.id)
      .map<ClientOrder>((order) => ({
        id: order.id,
        number: order.number,
        createdAt: order.createdAt,
        status: order.status === 'Entregue' ? 'Entregue' : order.fulfillment === 'Retirada' ? 'Pronto para retirada' : 'Separando',
        total: order.total,
        items: order.items.map((item) => `${item.quantity}x ${item.name}`)
      })),
    recommendedProducts: getStoredProductsCatalog().slice(0, 8)
  };
};

export const fetchClientPortalSnapshot = async (): Promise<ClientPortalSnapshot> => {
  upsertSharedClientFromUser(readClientProfile());
  const derived = deriveClientSnapshotFromBackoffice();
  return simulateApiDelay(derived ?? buildFallbackClientSnapshot());
};

export const createClientPet = async (pet: Omit<ClientPet, 'id'>): Promise<ClientPet> => {
  const syncedUser = upsertSharedClientFromUser(readClientProfile());
  const snapshot = deriveClientSnapshotFromBackoffice(syncedUser) ?? buildFallbackClientSnapshot();
  const nextPet: ClientPet = {
    ...pet,
    id: snapshot.pets.reduce((highestId, item) => Math.max(highestId, item.id), 0) + 1
  };

  const backofficeSnapshot = readBackofficeSnapshot();
  const mirroredPet: BackofficePet = {
    ...nextPet,
    clientId: syncedUser.id,
    status: 'Ativo',
    lastVisit: 'Ainda sem consulta',
    nextAction: 'Aguardando primeiro atendimento'
  };

  writeAppSessionSlice(PETS_SLICE, [...backofficeSnapshot.pets, mirroredPet]);

  return simulateApiDelay(nextPet);
};

export const createClientAppointment = async (appointment: Omit<ClientAppointment, 'id'>): Promise<ClientAppointment> => {
  const syncedUser = upsertSharedClientFromUser(readClientProfile());
  const snapshot = deriveClientSnapshotFromBackoffice(syncedUser) ?? buildFallbackClientSnapshot();
  const nextAppointment: ClientAppointment = {
    ...appointment,
    id: snapshot.appointments.reduce((highestId, item) => Math.max(highestId, item.id), 0) + 1
  };

  const backofficeSnapshot = readBackofficeSnapshot();
  writeAppSessionSlice(APPOINTMENTS_SLICE, [nextAppointment, ...backofficeSnapshot.appointments]);

  return simulateApiDelay(nextAppointment);
};

export const updateClientPet = async (
  petId: number,
  updates: Partial<Omit<ClientPet, 'id' | 'tutorName' | 'vaccines'>>
): Promise<ClientPet[]> => {
  const nextPets = await updateBackofficePet(petId, updates);
  return nextPets.map<ClientPet>(({ clientId, status, lastVisit, nextAction, ...pet }) => pet);
};

export const updateClientProfile = async (
  updates: Partial<Pick<ClientUser, 'name' | 'email' | 'phone' | 'city'>>
): Promise<ClientUser> => {
  const currentProfile = readClientProfile();
  const nextProfile = upsertSharedClientFromUser({
    ...currentProfile,
    ...updates
  });

  return simulateApiDelay(nextProfile);
};

export const getStoredClientAuthSession = (): ClientAuthSession | null => {
  const raw = localStorage.getItem(CLIENT_AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ClientAuthSession;
    if (!parsed?.user?.email || !parsed?.accessToken) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveClientAuthSession = (session: ClientAuthSession) => {
  localStorage.setItem(CLIENT_AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredClientAuthSession = () => {
  localStorage.removeItem(CLIENT_AUTH_STORAGE_KEY);
};

export const mockAuthLogin = (email: string): Promise<ClientAuthSession> => {
  const user = upsertSharedClientFromUser({
    ...readClientProfile(),
    email: email || readClientProfile().email
  });

  return simulateApiDelay(buildMockSession(user));
};

export const mockAuthRegister = (name: string, email: string): Promise<ClientAuthSession> => {
  const user = upsertSharedClientFromUser({
    ...readClientProfile(),
    name: name || readClientProfile().name,
    email: email || readClientProfile().email
  });

  return simulateApiDelay(buildMockSession(user));
};
