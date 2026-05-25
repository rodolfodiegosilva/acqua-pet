import { readSeededAppSessionSlice, simulateApiDelay, writeAppSessionSlice } from './mockStorage';

export interface Product {
  id: number;
  name: string;
  category: 'Cães' | 'Gatos' | 'Peixes' | 'Aves' | 'Répteis' | 'Pequenos Pets';
  price: number;
  originalPrice?: number;
  rating: number;
  imageBg: string;
  imageEmoji: string;
  description: string;
  stock: number;
}

export const PRODUCTS_CATALOG: Product[] = [
  // PEIXES
  {
    id: 1,
    name: 'Aquário Curvo Smart LED 45L',
    category: 'Peixes',
    price: 689.0,
    rating: 5.0,
    imageBg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    imageEmoji: '🫧',
    description: 'Aquário curvo premium com iluminação LED integrada, sump traseiro oculto e visual clean para ambientes internos.',
    stock: 5
  },
  {
    id: 2,
    name: 'Ração Sera Vipan Flakes 100g',
    category: 'Peixes',
    price: 74.9,
    originalPrice: 89.9,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
    imageEmoji: '🥫',
    description: 'Alimento em flocos para peixes ornamentais com prebióticos e excelente aceitação diária.',
    stock: 25
  },
  {
    id: 3,
    name: 'Filtro Canister Premium 1000 L/h',
    category: 'Peixes',
    price: 420.0,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    imageEmoji: '🔌',
    description: 'Filtro canister externo silencioso com três gavetas para mídias biológicas, mecânicas e químicas.',
    stock: 8
  },
  {
    id: 4,
    name: 'Condicionador Seachem Prime 250ml',
    category: 'Peixes',
    price: 115.0,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
    imageEmoji: '🧪',
    description: 'Condicionador concentrado que neutraliza cloro, cloramina, amônia e nitrito instantaneamente.',
    stock: 15
  },
  {
    id: 5,
    name: 'Termostato Digital Submerso 200W',
    category: 'Peixes',
    price: 159.9,
    rating: 4.7,
    imageBg: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
    imageEmoji: '🌡️',
    description: 'Termostato com ajuste fino de temperatura e proteção extra para manter o aquário estável.',
    stock: 9
  },
  {
    id: 6,
    name: 'Kit Teste pH, Amônia e Nitrito',
    category: 'Peixes',
    price: 129.9,
    originalPrice: 149.9,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    imageEmoji: '📊',
    description: 'Kit com reagentes essenciais para monitorar os parâmetros críticos da água com precisão.',
    stock: 11
  },

  // CÃES
  {
    id: 7,
    name: 'Ração Super Premium Cães Adultos 12kg',
    category: 'Cães',
    price: 219.9,
    originalPrice: 249.9,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    imageEmoji: '🍖',
    description: 'Ração de alta digestibilidade com proteínas nobres e ômegas para energia, pele e pelagem.',
    stock: 10
  },
  {
    id: 8,
    name: 'Brinquedo Extreme KONG Borracha G',
    category: 'Cães',
    price: 89.9,
    rating: 5.0,
    imageBg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
    imageEmoji: '🥎',
    description: 'Brinquedo resistente para mordida forte, ideal para enriquecimento ambiental com petiscos.',
    stock: 18
  },
  {
    id: 9,
    name: 'Caminha Ortopédica Wave Comfort G',
    category: 'Cães',
    price: 289.9,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    imageEmoji: '🛏️',
    description: 'Caminha com espuma ortopédica, capa removível e ótimo suporte para cães adultos ou idosos.',
    stock: 4
  },
  {
    id: 10,
    name: 'Shampoo Hipoalergênico Aveia Orgânica',
    category: 'Cães',
    price: 44.9,
    rating: 4.7,
    imageBg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    imageEmoji: '🧴',
    description: 'Shampoo suave com aveia e pH balanceado para cães sensíveis, deixando a pelagem macia.',
    stock: 12
  },
  {
    id: 11,
    name: 'Coleira Antipulgas Ajustável 8 Meses',
    category: 'Cães',
    price: 139.9,
    originalPrice: 159.9,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    imageEmoji: '🦴',
    description: 'Coleira com proteção prolongada contra pulgas e carrapatos, resistente à água e sem cheiro forte.',
    stock: 16
  },
  {
    id: 12,
    name: 'Peitoral Air Mesh com Guia M',
    category: 'Cães',
    price: 79.9,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%)',
    imageEmoji: '🐕',
    description: 'Peitoral acolchoado e respirável com guia combinando, ideal para passeios urbanos confortáveis.',
    stock: 14
  },

  // GATOS
  {
    id: 13,
    name: 'Arranhador Torre Castelo com Rede',
    category: 'Gatos',
    price: 320.0,
    rating: 5.0,
    imageBg: 'linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%)',
    imageEmoji: '🐈',
    description: 'Arranhador com múltiplos níveis, redes e casinha suspensa para descanso e brincadeira diária.',
    stock: 3
  },
  {
    id: 14,
    name: 'Fonte de Água Cerâmica Bivolt 2L',
    category: 'Gatos',
    price: 179.9,
    originalPrice: 199.9,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    imageEmoji: '⛲',
    description: 'Fonte silenciosa em cerâmica atóxica que estimula a hidratação e facilita a limpeza.',
    stock: 6
  },
  {
    id: 15,
    name: 'Ração N&D Gatos Castrados 1.5kg',
    category: 'Gatos',
    price: 124.9,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    imageEmoji: '🐾',
    description: 'Alimento grain-free de baixo índice glicêmico para controle de peso e alta palatabilidade.',
    stock: 14
  },
  {
    id: 16,
    name: 'Varinha Interativa Pena & Catnip',
    category: 'Gatos',
    price: 29.9,
    rating: 4.7,
    imageBg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
    imageEmoji: '🪄',
    description: 'Brinquedo com penas, guizo e catnip para estimular o instinto de caça e reduzir o tédio.',
    stock: 30
  },
  {
    id: 17,
    name: 'Caixa de Areia Fechada Easy Clean',
    category: 'Gatos',
    price: 149.9,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
    imageEmoji: '📦',
    description: 'Caixa de areia fechada com pá inclusa, porta basculante e controle melhor de odores.',
    stock: 9
  },
  {
    id: 18,
    name: 'Sachê Gourmet Salmão & Atum 85g',
    category: 'Gatos',
    price: 8.9,
    originalPrice: 10.9,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)',
    imageEmoji: '🐟',
    description: 'Alimento úmido premium com alto teor de umidade e sabor intenso para gatos exigentes.',
    stock: 60
  },

  // AVES
  {
    id: 19,
    name: 'Sementes Orgânicas Super-Alimento 1kg',
    category: 'Aves',
    price: 38.9,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    imageEmoji: '🌾',
    description: 'Mistura selecionada de sementes enriquecida com vitaminas para aves de pequeno e médio porte.',
    stock: 40
  },
  {
    id: 20,
    name: 'Playground Madeira para Calopsita',
    category: 'Aves',
    price: 119.9,
    originalPrice: 139.9,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
    imageEmoji: '🪵',
    description: 'Playground em madeira natural com escadas, balanço e poleiros para enriquecer a rotina.',
    stock: 5
  },
  {
    id: 21,
    name: 'Balanço de Miçangas Coloridas G',
    category: 'Aves',
    price: 34.9,
    rating: 4.6,
    imageBg: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
    imageEmoji: '🎡',
    description: 'Balanço recreativo com madeira atóxica e peças coloridas para papagaios, calopsitas e periquitos.',
    stock: 15
  },
  {
    id: 22,
    name: 'Viveiro Dobrável Premium 80cm',
    category: 'Aves',
    price: 359.9,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    imageEmoji: '🪺',
    description: 'Viveiro espaçoso com bandeja removível, rodinhas e estrutura reforçada para manejo diário.',
    stock: 4
  },
  {
    id: 23,
    name: 'Banheira Externa Cristal para Canários',
    category: 'Aves',
    price: 26.9,
    rating: 4.7,
    imageBg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    imageEmoji: '💧',
    description: 'Banheira de encaixe transparente para estimular banhos frequentes e manter a plumagem limpa.',
    stock: 22
  },
  {
    id: 24,
    name: 'Farinhada Nutritiva com Frutas 500g',
    category: 'Aves',
    price: 24.9,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    imageEmoji: '🍍',
    description: 'Complemento alimentar com frutas desidratadas e minerais para períodos de muda e reprodução.',
    stock: 18
  },

  // RÉPTEIS
  {
    id: 25,
    name: 'Lâmpada Cerâmica Aquecedora 100W',
    category: 'Répteis',
    price: 89.9,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    imageEmoji: '💡',
    description: 'Fonte de calor sem emissão de luz para manter o terrário aquecido inclusive no período noturno.',
    stock: 10
  },
  {
    id: 26,
    name: 'Substrato Fibra de Coco Terrário 500g',
    category: 'Répteis',
    price: 29.9,
    rating: 4.7,
    imageBg: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
    imageEmoji: '🌴',
    description: 'Substrato esterilizado com alta retenção de umidade para cobras, geckos e anfíbios.',
    stock: 20
  },
  {
    id: 27,
    name: 'Caverna Realista Resina Oculta P',
    category: 'Répteis',
    price: 79.9,
    originalPrice: 89.9,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    imageEmoji: '🦎',
    description: 'Esconderijo em resina de fácil limpeza que reduz estresse e oferece segurança térmica.',
    stock: 8
  },
  {
    id: 28,
    name: 'Tapete Térmico Controlado 28x42cm',
    category: 'Répteis',
    price: 109.9,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    imageEmoji: '🔥',
    description: 'Tapete térmico com aquecimento uniforme para criar um ponto quente estável no terrário.',
    stock: 7
  },
  {
    id: 29,
    name: 'Luminária UVB Compacta 26W',
    category: 'Répteis',
    price: 149.9,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)',
    imageEmoji: '☀️',
    description: 'Lâmpada UVB essencial para metabolismo do cálcio e bem-estar de iguanas, jabutis e pogonas.',
    stock: 9
  },
  {
    id: 30,
    name: 'Comedouro Rocha Antiderramamento',
    category: 'Répteis',
    price: 42.9,
    rating: 4.6,
    imageBg: 'linear-gradient(135deg, #e7e5e4 0%, #d6d3d1 100%)',
    imageEmoji: '🪨',
    description: 'Comedouro com aparência natural e base estável para insetos, frutas ou ração extrusada.',
    stock: 17
  },

  // PEQUENOS PETS
  {
    id: 31,
    name: 'Gaiola Modular para Hamster 3 Andares',
    category: 'Pequenos Pets',
    price: 249.9,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    imageEmoji: '🐹',
    description: 'Habitat modular com túneis, rodas e plataformas para hamsters ativos e curiosos.',
    stock: 6
  },
  {
    id: 32,
    name: 'Feno Timothy Premium 1kg',
    category: 'Pequenos Pets',
    price: 39.9,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)',
    imageEmoji: '🌿',
    description: 'Feno selecionado para coelhos e porquinhos-da-índia, com fibras longas e alta aceitação.',
    stock: 24
  },
  {
    id: 33,
    name: 'Bebedouro Automático de Esfera 500ml',
    category: 'Pequenos Pets',
    price: 22.9,
    rating: 4.7,
    imageBg: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)',
    imageEmoji: '🥤',
    description: 'Bebedouro com esfera anti-vazamento para gaiolas de roedores, coelhos e furões.',
    stock: 28
  },
  {
    id: 34,
    name: 'Toca de Madeira Natural para Coelho',
    category: 'Pequenos Pets',
    price: 94.9,
    originalPrice: 109.9,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    imageEmoji: '🐇',
    description: 'Toca espaçosa em madeira tratada para descanso, mastigação segura e enriquecimento ambiental.',
    stock: 8
  },
  {
    id: 35,
    name: 'Roda Silenciosa Speed Wheel 21cm',
    category: 'Pequenos Pets',
    price: 64.9,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #ecfccb 0%, #d9f99d 100%)',
    imageEmoji: '🎠',
    description: 'Roda silenciosa com base estável e superfície segura para corridas noturnas sem ruído.',
    stock: 13
  },
  {
    id: 36,
    name: 'Snack Natural Maçã & Cenoura 80g',
    category: 'Pequenos Pets',
    price: 16.9,
    rating: 4.7,
    imageBg: 'linear-gradient(135deg, #ffedd5 0%, #fdba74 100%)',
    imageEmoji: '🥕',
    description: 'Petisco desidratado sem conservantes para coelhos, chinchilas e porquinhos-da-índia.',
    stock: 33
  }
];

const PRODUCTS_STORAGE_SLICE = 'productsCatalog';

export const getStoredProductsCatalog = () => readSeededAppSessionSlice<Product[]>(PRODUCTS_STORAGE_SLICE, PRODUCTS_CATALOG);

export const saveStoredProductsCatalog = (products: Product[]) => {
  writeAppSessionSlice(PRODUCTS_STORAGE_SLICE, products);
};

export const fetchProducts = (category?: string): Promise<Product[]> => {
  const products = getStoredProductsCatalog();

  if (!category || category === 'Todos') {
    return simulateApiDelay(products);
  }

  const parsedCategory = (category.match(/[A-Za-zÀ-ÿ\s]+/)?.[0] ?? category).trim();
  return simulateApiDelay(products.filter((product) => product.category === parsedCategory));
};
