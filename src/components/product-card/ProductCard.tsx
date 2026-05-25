import React from 'react';
import { Star, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  rating: number;
  imageBg: string; // Gradiente ou cor de fundo para a imagem
  imageEmoji: string; // Emoji de alta qualidade ou ícone de placeholder
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  category,
  price,
  originalPrice,
  rating,
  imageBg,
  imageEmoji
}) => {
  return (
    <div className="glass-card" style={{
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between'
    }}>
      <div>
        {/* Container da Imagem do Produto com Estilo Premium */}
        <div style={{
          height: '200px',
          borderRadius: 'var(--radius-sm)',
          background: imageBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '64px',
          position: 'relative',
          marginBottom: '20px',
          overflow: 'hidden',
          boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.05)'
        }}>
          {originalPrice && (
            <span style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: '#ef4444',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)'
            }}>
              PROMO
            </span>
          )}
          
          <span style={{
            filter: 'drop-shadow(0 8px 12px rgba(0, 0, 0, 0.15))',
            transition: 'var(--transition-bounce)'
          }} className="product-emoji">
            {imageEmoji}
          </span>
        </div>

        {/* Categoria */}
        <span style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '1px',
          display: 'block',
          marginBottom: '6px'
        }}>
          {category}
        </span>

        {/* Titulo */}
        <h4 style={{
          fontSize: '18px',
          fontWeight: 700,
          marginBottom: '10px',
          lineHeight: '1.4',
          fontFamily: 'var(--font-heading)'
        }}>
          {name}
        </h4>

        {/* Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '16px'
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < Math.floor(rating) ? '#f59e0b' : 'none'}
              stroke={i < Math.floor(rating) ? '#f59e0b' : 'var(--text-muted)'}
            />
          ))}
          <span style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            marginLeft: '4px',
            fontWeight: 500
          }}>
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Preco & Botao de Compra */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '8px'
      }}>
        <div>
          {originalPrice && (
            <span style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              textDecoration: 'line-through',
              display: 'block'
            }}>
              {originalPrice}
            </span>
          )}
          <span style={{
            fontSize: '22px',
            fontWeight: 800,
            color: 'var(--text-main)'
          }}>
            {price}
          </span>
        </div>

        <button
          className="gradient-bg gradient-bg-hover"
          style={{
            border: 'none',
            color: '#fff',
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0, 180, 216, 0.2)',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Adicionar ao carrinho"
        >
          <ShoppingBag size={18} />
        </button>
      </div>

      <style>{`
        .glass-card:hover .product-emoji {
          transform: scale(1.15) rotate(4deg);
        }
      `}</style>
    </div>
  );
};
