import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';

export const Products: React.FC = () => {
  const productsData = [
    {
      name: 'Aquário Smart LED Acqua (30L)',
      category: 'Equipamentos',
      price: 'R$ 489,90',
      rating: 5.0,
      imageBg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
      imageEmoji: '🫧'
    },
    {
      name: 'Ração Sera Vipan Premium',
      category: 'Nutrição',
      price: 'R$ 64,90',
      originalPrice: 'R$ 79,90',
      rating: 4.9,
      imageBg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
      imageEmoji: '🥫'
    },
    {
      name: 'Filtro Canister Ultra-Quiet',
      category: 'Filtragem',
      price: 'R$ 299,90',
      rating: 4.8,
      imageBg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      imageEmoji: '🔌'
    },
    {
      name: 'Condicionador Seachem Prime (100ml)',
      category: 'Tratamento',
      price: 'R$ 74,90',
      rating: 4.9,
      imageBg: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
      imageEmoji: '🧪'
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
              Aquarismo de Elite
            </span>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800,
              letterSpacing: '-1px',
              fontFamily: 'var(--font-heading)'
            }}>
              Produtos selecionados <span className="gradient-text">para seu ecossistema</span>
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
