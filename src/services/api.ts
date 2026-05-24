export interface Product {
  id: number;
  name: string;
  category: 'Cães' | 'Gatos' | 'Peixes' | 'Aves' | 'Répteis';
  price: number;
  originalPrice?: number;
  rating: number;
  imageBg: string;
  imageEmoji: string;
  description: string;
  stock: number;
}

export const PRODUCTS_CATALOG: Product[] = [
  // PEIXES (4 itens)
  {
    id: 1,
    name: 'Aquário Curvo Smart LED 45L',
    category: 'Peixes',
    price: 689.00,
    rating: 5.0,
    imageBg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    imageEmoji: '🫧',
    description: 'Aquário curvo premium com sistema de iluminação LED inteligente integrado de 3 modos (dia, noite, entardecer) e sump traseiro oculto.',
    stock: 5
  },
  {
    id: 2,
    name: 'Ração Sera Vipan Flakes 100g',
    category: 'Peixes',
    price: 74.90,
    originalPrice: 89.90,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
    imageEmoji: '🥫',
    description: 'Alimento básico em flocos processado de forma altamente conservadora para todos os peixes ornamentais. Rico em prebióticos saudáveis.',
    stock: 25
  },
  {
    id: 3,
    name: 'Filtro Canister Premium 1000 L/h',
    category: 'Peixes',
    price: 420.00,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    imageEmoji: '🔌',
    description: 'Filtro canister externo de alta performance e operação extremamente silenciosa. Possui 3 gavetas amplas para mídias filtrantes.',
    stock: 8
  },
  {
    id: 4,
    name: 'Condicionador Seachem Prime 250ml',
    category: 'Peixes',
    price: 115.00,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
    imageEmoji: '🧪',
    description: 'Condicionador completo e super concentrado. Remove cloro, cloramina e desintoxica amônia, nitrito e metais pesados instantaneamente.',
    stock: 15
  },

  // CÃES (4 itens)
  {
    id: 5,
    name: 'Ração Super Premium Cães Adultos 12kg',
    category: 'Cães',
    price: 219.90,
    originalPrice: 249.90,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    imageEmoji: '🍖',
    description: 'Ração de altíssima digestibilidade formulada com ingredientes nobres, livre de corantes artificiais e rica em ômega 3 e 6 para a pelagem.',
    stock: 10
  },
  {
    id: 6,
    name: 'Brinquedo Extreme KONG Borracha G',
    category: 'Cães',
    price: 89.90,
    rating: 5.0,
    imageBg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
    imageEmoji: '🥎',
    description: 'Brinquedo de borracha natural ultra resistente para cães de mordida forte. Ideal para rechear com petiscos e diminuir a ansiedade.',
    stock: 18
  },
  {
    id: 7,
    name: 'Caminha Ortopédica Wave Comfort G',
    category: 'Cães',
    price: 289.90,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    imageEmoji: '🛏️',
    description: 'Cama com espuma ortopédica e capa impermeável lavável. Ideal para cães idosos ou de grande porte que precisam de alívio articular.',
    stock: 4
  },
  {
    id: 8,
    name: 'Shampoo Hipoalergênico Aveia Orgânica',
    category: 'Cães',
    price: 44.90,
    rating: 4.7,
    imageBg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    imageEmoji: '🧴',
    description: 'Shampoo suave formulado com pH neutro e extrato natural de aveia orgânica. Alivia coceiras, alergias e mantém o pelo brilhante.',
    stock: 12
  },

  // GATOS (4 itens)
  {
    id: 9,
    name: 'Arranhador Torre Castelo com Rede',
    category: 'Gatos',
    price: 320.00,
    rating: 5.0,
    imageBg: 'linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%)',
    imageEmoji: '🐈',
    description: 'Arranhador multinível com postes revestidos em sisal de alta qualidade, redes confortáveis e casinha suspensa para relaxamento felino.',
    stock: 3
  },
  {
    id: 10,
    name: 'Fonte de Água Cerâmica Bivolt 2L',
    category: 'Gatos',
    price: 179.90,
    originalPrice: 199.90,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    imageEmoji: ' Fountain ⛲',
    description: 'Fonte silenciosa feita em cerâmica atóxica de fácil higienização. Estimula a hidratação dos gatos prevenindo problemas urinários.',
    stock: 6
  },
  {
    id: 11,
    name: 'Ração N&D Gatos Castrados 1.5kg',
    category: 'Gatos',
    price: 124.90,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    imageEmoji: '🐾',
    description: 'Alimento grain-free formulado com frango, romã e ingredientes de baixo índice glicêmico para controle de peso do seu felino castrado.',
    stock: 14
  },
  {
    id: 12,
    name: 'Varinha Interativa Pena & Catnip',
    category: 'Gatos',
    price: 29.90,
    rating: 4.7,
    imageBg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
    imageEmoji: '🪄',
    description: 'Brinquedo divertido contendo penas coloridas e guizo, preenchido com catnip (erva de gato) pura que estimula o instinto de caça.',
    stock: 30
  },

  // AVES (3 itens)
  {
    id: 13,
    name: 'Sementes Orgânicas Super-Alimento 1kg',
    category: 'Aves',
    price: 38.90,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    imageEmoji: '🌾',
    description: 'Mistura selecionada de alpiste, painço e aveia cultivados organicamente, enriquecida com vitaminas essenciais para a plumagem.',
    stock: 40
  },
  {
    id: 14,
    name: 'Playground Madeira para Calopsita',
    category: 'Aves',
    price: 119.90,
    originalPrice: 139.90,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
    imageEmoji: '🪵',
    description: 'Parque de diversões feito em madeira natural de reflorestamento com escada, balanço, poleiros e comedouro para aves de pequeno porte.',
    stock: 5
  },
  {
    id: 15,
    name: 'Balanço de Miçangas Coloridas G',
    category: 'Aves',
    price: 34.90,
    rating: 4.6,
    imageBg: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
    imageEmoji: '🎡',
    description: 'Balanço decorativo e recreativo feito com arame de alta resistência e miçangas coloridas de madeira atóxica para papagaios e araras.',
    stock: 15
  },

  // RÉPTEIS (3 itens)
  {
    id: 16,
    name: 'Lâmpada Cerâmica Aquecedora 100W',
    category: 'Répteis',
    price: 89.90,
    rating: 4.8,
    imageBg: 'linear-gradient(135deg, #ffedd5 0%, #ffedd5 100%)',
    imageEmoji: '💡',
    description: 'Lâmpada de cerâmica infravermelha bivolt. Emite calor suave sem emitir luz, ideal para manter o terrário aquecido durante a noite.',
    stock: 10
  },
  {
    id: 17,
    name: 'Substrato Fibra de Coco Terrário 500g',
    category: 'Répteis',
    price: 29.90,
    rating: 4.7,
    imageBg: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
    imageEmoji: '🪵',
    description: 'Fibra de coco expandida esterilizada para forração de fundo de terrários de cobras, lagartos e jabutis. Retém umidade de forma excelente.',
    stock: 20
  },
  {
    id: 18,
    name: 'Caverna Realista Resina Oculta P',
    category: 'Répteis',
    price: 79.90,
    originalPrice: 89.90,
    rating: 4.9,
    imageBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    imageEmoji: '🦎',
    description: 'Esconderijo feito de resina realista e resistente de fácil limpeza. Cria um refúgio seguro e escuro diminuindo o estresse do réptil.',
    stock: 8
  }
];

export const fetchProducts = (category?: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!category || category === 'Todos') {
        resolve(PRODUCTS_CATALOG);
      } else {
        // Remover emoji ou espaço da categoria passada na busca se necessário
        const parsedCategory = category.split(' ')[0].trim();
        resolve(PRODUCTS_CATALOG.filter(p => p.category === parsedCategory));
      }
    }, 600); // 600ms de latência simulada realista
  });
};
