import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';

export const Products: React.FC = () => {
  const productsData = [
    {
      name: 'Peitoral Air Mesh com Guia',
      category: 'Cães',
      price: 'R$ 79,90',
      rating: 5.0,
      imageBg: 'linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%)',
      imageEmoji: '🐕'
    },
    {
      name: 'Fonte de Água Cerâmica Bivolt',
      category: 'Gatos',
      price: 'R$ 179,90',
      originalPrice: 'R$ 199,90',
      rating: 4.9,
      imageBg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
      imageEmoji: '⛲'
    },
    {
      name: 'Filtro Canister Premium 1000 L/h',
      category: 'Peixes',
      price: 'R$ 420,00',
      rating: 4.8,
      imageBg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      imageEmoji: '🔌'
    },
    {
      name: 'Playground Madeira para Calopsita',
      category: 'Aves',
      price: 'R$ 119,90',
      rating: 4.9,
      imageBg: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
      imageEmoji: '🪵'
    },
    {
      name: 'Luminária UVB Compacta 26W',
      category: 'Répteis',
      price: 'R$ 149,90',
      rating: 4.9,
      imageBg: 'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)',
      imageEmoji: '☀️'
    },
    {
      name: 'Gaiola Modular para Hamster',
      category: 'Pequenos Pets',
      price: 'R$ 249,90',
      rating: 4.8,
      imageBg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
      imageEmoji: '🐹'
    }
  ];

  return (
    <section
      id="petshop"
      className="section-spacing"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative',
        transition: 'var(--transition-smooth)'
      }}
    >
      <div className="container">
        {/* Cabeçalho da Seção */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px',
          marginBottom: '50px'
        }} className="products-header">
          <div>
            <span style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              display: 'block',
              marginBottom: '12px'
            }}>
              Loja Multiespécies
            </span>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800,
              letterSpacing: '-1px',
              fontFamily: 'var(--font-heading)'
            }}>
              Produtos selecionados <span className="gradient-text">para cada tipo de pet</span>
            </h2>
          </div>
          
          <a
            href="#contato"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-main)',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: 'var(--shadow-sm)',
              transition: 'var(--transition-smooth)',
              alignSelf: 'flex-start'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-glass)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            Ver catálogo completo
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Grid de Produtos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '30px'
        }}>
          {productsData.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              category={product.category}
              price={product.price}
              originalPrice={product.originalPrice}
              rating={product.rating}
              imageBg={product.imageBg}
              imageEmoji={product.imageEmoji}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .products-header {
            flex-direction: row !important;
            align-items: flex-end !important;
          }
        }
      `}</style>
    </section>
  );
};
