import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, X, Plus, Minus, Trash2, Check, ArrowRight, CreditCard, ChevronRight, CheckCircle } from 'lucide-react';
import { fetchProducts } from '../services/api';
import type { Product } from '../services/api';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreProps {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartQty: (productId: number, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  setView: (view: 'landing' | 'store') => void;
}

export const Store: React.FC<StoreProps> = ({
  cart,
  addToCart,
  removeFromCart,
  updateCartQty,
  clearCart,
  isCartOpen,
  setIsCartOpen,
  setView
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('relevance');

  // Checkout Flow states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'retirada' | 'entrega'>('retirada');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('pix');
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

  // Form states
  const [address, setAddress] = useState({
    cep: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: ''
  });
  const [card, setCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const categories = ['Todos', 'Cães 🐶', 'Gatos 🐱', 'Peixes 🐠', 'Aves 🦜', 'Répteis 🐢'];

  // Carregar produtos da API mockada
  useEffect(() => {
    setLoading(true);
    fetchProducts(activeCategory).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [activeCategory]);

  // Filtragem local baseada na busca
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ordenação
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return a.id - b.id; // relevance
  });

  // Cálculos do Carrinho
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = discountApplied ? cartSubtotal * 0.1 : 0;
  const deliveryFee = deliveryMethod === 'entrega' ? 15.00 : 0;
  const isPixDiscount = paymentMethod === 'pix';
  const pixDiscountAmount = isPixDiscount ? (cartSubtotal - discountAmount) * 0.05 : 0;
  const cartTotal = cartSubtotal - discountAmount - pixDiscountAmount + deliveryFee;

  // Cupom de Desconto
  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'ACQUAMANAUS') {
      setDiscountApplied(true);
      alert('Cupom ACQUAMANAUS (10% de desconto) aplicado com sucesso!');
    } else {
      alert('Cupom inválido. Tente usar: ACQUAMANAUS');
    }
  };

  // Gerar número de pedido aleatório
  const handlePlaceOrder = () => {
    if (deliveryMethod === 'entrega' && (!address.bairro || !address.rua || !address.numero)) {
      alert('Por favor, preencha todos os campos obrigatórios de endereço para a entrega.');
      return;
    }
    if (paymentMethod === 'cartao' && (!card.number || !card.name || !card.expiry || !card.cvv)) {
      alert('Por favor, preencha todos os dados obrigatórios do cartão de crédito.');
      return;
    }

    setOrderNumber(`AQ-${Math.floor(10000 + Math.random() * 90000)}`);
    setCheckoutStep(3);
  };

  const handleFinishCheckout = () => {
    clearCart();
    setIsCheckoutOpen(false);
    setCheckoutStep(1);
    setDiscountApplied(false);
    setPromoCode('');
    setView('landing'); // Retorna para a home com sucesso
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-main)',
      paddingTop: '120px',
      paddingBottom: '80px',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container">
        
        {/* Banner do E-commerce */}
        <div className="glass-card" style={{
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(3, 2, 116, 0.04) 0%, rgba(0, 180, 216, 0.04) 100%)',
          border: '1px solid var(--border-glass)',
          marginBottom: '40px',
          textAlign: 'left'
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            display: 'block',
            marginBottom: '8px'
          }}>
            Aquarismo de Elite
          </span>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            marginBottom: '12px',
            letterSpacing: '-1.5px',
            lineHeight: 1.2
          }}>
            A Boutique Oficial do seu <span className="gradient-text">Ecossistema Aquático</span>
          </h1>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '16px',
            maxWidth: '650px',
            lineHeight: 1.6
          }}>
            Encontre equipamentos de alta performance, nutrição premium internacional, tratamentos biológicos e troncos artesanais para manter seus peixes com saúde perfeita.
          </p>
        </div>

        {/* Controles do Catálogo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* Barra de Filtros & Busca */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            justifyContent: 'space-between',
            alignItems: 'stretch'
          }} className="catalog-controls-grid">
            
            {/* Barra de Pesquisa */}
            <div style={{
              position: 'relative',
              flexGrow: 1
            }}>
              <input
                type="text"
                placeholder="Buscar equipamentos, rações ou condicionadores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px 14px 48px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-glass)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-main)',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'var(--transition-smooth)'
                }}
                className="search-input-premium"
              />
              <Search size={18} style={{
                position: 'absolute',
                left: '18px',
                top: '16px',
                color: 'var(--text-muted)'
              }} />
            </div>

            {/* Ordenação */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-glass)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="relevance">Destaque</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
              </select>
            </div>
          </div>

          {/* Categorias (Pills Horizontais) */}
          <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '10px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }} className="category-scroll">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'var(--primary)' : 'var(--border-glass)',
                  background: activeCategory === cat ? 'var(--primary)' : 'var(--bg-secondary)',
                  color: activeCategory === cat ? '#ffffff' : 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  boxShadow: activeCategory === cat ? '0 4px 12px rgba(3, 2, 116, 0.15)' : 'none',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = 'var(--border-glass)';
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Produtos / Skeleton */}
        {loading ? (
          /* SKELETON LOADING ELEGANTE */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '30px'
          }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card skeleton-card" style={{
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                border: '1px solid var(--border-glass)',
                background: 'var(--bg-secondary)',
                height: '380px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div className="skeleton-media" style={{
                  height: '180px',
                  width: '100%',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(3, 2, 116, 0.05)',
                  animation: 'pulse-soft 1.5s infinite'
                }} />
                <div style={{ height: '14px', width: '40%', borderRadius: '4px', backgroundColor: 'rgba(3, 2, 116, 0.05)', animation: 'pulse-soft 1.5s infinite' }} />
                <div style={{ height: '24px', width: '80%', borderRadius: '4px', backgroundColor: 'rgba(3, 2, 116, 0.05)', animation: 'pulse-soft 1.5s infinite' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', alignItems: 'center' }}>
                  <div style={{ height: '20px', width: '30%', borderRadius: '4px', backgroundColor: 'rgba(3, 2, 116, 0.05)', animation: 'pulse-soft 1.5s infinite' }} />
                  <div style={{ height: '40px', width: '40px', borderRadius: '50%', backgroundColor: 'rgba(3, 2, 116, 0.05)', animation: 'pulse-soft 1.5s infinite' }} />
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: 'var(--text-muted)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Nenhum produto encontrado</h3>
            <p>Tente reescrever a busca ou trocar de categoria.</p>
          </div>
        ) : (
          /* GRID REAL DE PRODUTOS */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '30px'
          }}>
            {sortedProducts.map((product) => {
              const cartItem = cart.find(item => item.product.id === product.id);
              const qty = cartItem ? cartItem.quantity : 0;
              return (
                <div
                  key={product.id}
                  className="glass-card product-store-card"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    border: '1px solid var(--border-glass)',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    transition: 'var(--transition-bounce)'
                  }}
                >
                  {/* Foto/Preview Container */}
                  <div style={{
                    width: '100%',
                    height: '180px',
                    borderRadius: 'var(--radius-sm)',
                    background: product.imageBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '64px',
                    marginBottom: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <span className="emoji-glow">{product.imageEmoji}</span>
                    {/* Badge de Categoria */}
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(255,255,255,0.9)',
                      color: 'var(--primary)',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}>
                      {product.category}
                    </span>
                  </div>

                  {/* Nome & Detalhes */}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                      ⭐ {product.rating.toFixed(1)}
                    </span>
                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      lineHeight: 1.3
                    }}>
                      {product.name}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      lineHeight: 1.4,
                      marginBottom: '12px'
                    }}>
                      {product.description}
                    </p>
                  </div>

                  {/* Preços e Ações */}
                  <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '16px'
                  }}>
                    <div>
                      {product.originalPrice && (
                        <span style={{
                          display: 'block',
                          fontSize: '12px',
                          textDecoration: 'line-through',
                          color: 'var(--text-muted)',
                          marginBottom: '2px'
                        }}>
                          R$ {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: 'var(--primary)'
                      }}>
                        R$ {product.price.toFixed(2)}
                      </span>
                    </div>

                    {qty > 0 ? (
                      /* Seletor de Quantidade */
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--bg-primary)',
                        padding: '4px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border-glass)'
                      }}>
                        <button
                          onClick={() => updateCartQty(product.id, qty - 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '14px', fontWeight: 700, padding: '0 4px', minWidth: '16px', textAlign: 'center' }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(product.id, qty + 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      /* Botão Adicionar */
                      <button
                        onClick={() => addToCart(product)}
                        className="gradient-bg gradient-bg-hover"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 10px rgba(0, 180, 216, 0.2)'
                        }}
                      >
                        <ShoppingBag size={18} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CARRINHO DE COMPRAS LATERAL (CART DRAWER) */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'rgba(1, 0, 46, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'flex-end',
          textAlign: 'left'
        }}>
          {/* Fundo clicável para fechar */}
          <div style={{ flexGrow: 1 }} onClick={() => setIsCartOpen(false)} />
          
          {/* Painel do Carrinho */}
          <div style={{
            width: '100%',
            maxWidth: '480px',
            height: '100%',
            backgroundColor: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-10px 0 40px rgba(0,0,0,0.3)',
            position: 'relative'
          }} className="cart-drawer-panel">
            
            {/* Header do Carrinho */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={22} style={{ color: 'var(--primary)' }} />
                <h2 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  Meu Carrinho ({cart.reduce((a, b) => a + b.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '50%'
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Itens do Carrinho */}
            <div style={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              
              {/* Barra de Progresso de Frete Grátis */}
              {cart.length > 0 && (
                <div style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(3, 2, 116, 0.03)',
                  border: '1px solid var(--border-glass)'
                }}>
                  <span style={{ fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    {cartSubtotal >= 250 ? (
                      <span style={{ color: '#22c55e' }}>🎉 Parabéns! Você ganhou <strong>Frete Grátis</strong> em Manaus!</span>
                    ) : (
                      <span>Faltam <strong>R$ {(250 - cartSubtotal).toFixed(2)}</strong> para ganhar <strong>Frete Grátis</strong>!</span>
                    )}
                  </span>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'rgba(3, 2, 116, 0.05)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min((cartSubtotal / 250) * 100, 100)}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--primary) 0%, #00b4d8 100%)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              )}

              {cart.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  margin: 'auto 0',
                  color: 'var(--text-muted)'
                }}>
                  <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                  <p style={{ fontSize: '16px', fontWeight: 600 }}>Seu carrinho está vazio.</p>
                  <p style={{ fontSize: '14px', marginTop: '4px' }}>Adicione produtos premium abaixo!</p>
                </div>
              ) : (
                /* LISTA DE ITENS */
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(3, 2, 116, 0.05)',
                      paddingBottom: '16px'
                    }}
                  >
                    {/* Foto Emoji */}
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      background: item.product.imageBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      flexShrink: 0
                    }}>
                      {item.product.imageEmoji}
                    </div>

                    {/* Descrições */}
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                        {item.product.name}
                      </h4>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)' }}>
                        R$ {item.product.price.toFixed(2)}
                      </span>

                      {/* Controles de Qtde */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: 'rgba(3, 2, 116, 0.03)',
                          padding: '2px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--border-glass)'
                        }}>
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-main)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Minus size={10} />
                          </button>
                          <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '14px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-main)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        {/* Deletar */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer do Carrinho (Resumo Financeiro & Ação) */}
            {cart.length > 0 && (
              <div style={{
                padding: '24px',
                borderTop: '1px solid var(--border-glass)',
                backgroundColor: 'var(--bg-secondary)'
              }}>
                {/* Campo de Cupom */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  <input
                    type="text"
                    placeholder="Cupom: ACQUAMANAUS"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{
                      flexGrow: 1,
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-glass)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-main)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    disabled={discountApplied}
                  />
                  <button
                    onClick={applyPromo}
                    style={{
                      padding: '0 20px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: discountApplied ? '#22c55e' : 'var(--primary)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    disabled={discountApplied}
                  >
                    {discountApplied ? 'Ativo' : 'Aplicar'}
                  </button>
                </div>

                {/* Subtotais */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)' }}>
                    <span>Subtotal:</span>
                    <strong>R$ {cartSubtotal.toFixed(2)}</strong>
                  </div>
                  {discountApplied && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#22c55e' }}>
                      <span>Desconto Cupom (10%):</span>
                      <strong>- R$ {discountAmount.toFixed(2)}</strong>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    borderTop: '1px solid rgba(3, 2, 116, 0.05)',
                    paddingTop: '8px',
                    marginTop: '4px'
                  }}>
                    <span>Total estimado:</span>
                    <span style={{ color: 'var(--primary)' }}>R$ {(cartSubtotal - discountAmount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Botão Finalizar */}
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="gradient-bg gradient-bg-hover"
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 6px 15px rgba(0,180,216,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  Finalizar Compra
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CHECKOUT MULTIETAPAS */}
      {isCheckoutOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'rgba(1, 0, 46, 0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'left'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '540px',
            maxHeight: '90vh',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 24px 50px rgba(0,0,0,0.4)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {/* Header do Checkout */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                Finalizando meu Pedido
              </h2>
              {checkoutStep !== 3 && (
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X size={22} />
                </button>
              )}
            </div>

            {/* Indicador de Passos */}
            {checkoutStep !== 3 && (
              <div style={{
                padding: '16px 24px',
                backgroundColor: 'rgba(3, 2, 116, 0.02)',
                borderBottom: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-muted)'
              }}>
                <span style={{ color: checkoutStep === 1 ? 'var(--primary)' : 'inherit' }}>1. Método de Envio</span>
                <ChevronRight size={14} />
                <span style={{ color: checkoutStep === 2 ? 'var(--primary)' : 'inherit' }}>2. Pagamento</span>
                <ChevronRight size={14} />
                <span>3. Sucesso</span>
              </div>
            )}

            {/* Conteúdo do Checkout */}
            <div style={{ padding: '24px', flexGrow: 1 }}>
              
              {/* PASSO 1: ENVIO / ENTREGA */}
              {checkoutStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Seleção do Método */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>
                      Como deseja receber seus produtos?
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      
                      {/* Retirada */}
                      <button
                        onClick={() => setDeliveryMethod('retirada')}
                        style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-sm)',
                          border: '2px solid',
                          borderColor: deliveryMethod === 'retirada' ? 'var(--primary)' : 'var(--border-glass)',
                          background: deliveryMethod === 'retirada' ? 'rgba(3, 2, 116, 0.03)' : 'var(--bg-secondary)',
                          color: 'var(--text-main)',
                          textAlign: 'center',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '14px',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        🏪 Retirada na Loja
                        <span style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', marginTop: '4px' }}>
                          Grátis (Coroado)
                        </span>
                      </button>

                      {/* Entrega */}
                      <button
                        onClick={() => setDeliveryMethod('entrega')}
                        style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-sm)',
                          border: '2px solid',
                          borderColor: deliveryMethod === 'entrega' ? 'var(--primary)' : 'var(--border-glass)',
                          background: deliveryMethod === 'entrega' ? 'rgba(3, 2, 116, 0.03)' : 'var(--bg-secondary)',
                          color: 'var(--text-main)',
                          textAlign: 'center',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '14px',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        🛵 Entrega Expressa
                        <span style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', marginTop: '4px' }}>
                          R$ 15,00 (Manaus)
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Detalhes de Retirada */}
                  {deliveryMethod === 'retirada' ? (
                    <div style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(231, 164, 12, 0.04)',
                      border: '1px solid rgba(231, 164, 12, 0.2)',
                      fontSize: '13px',
                      lineHeight: 1.5
                    }}>
                      <strong>📍 Endereço para Retirada:</strong>
                      <span style={{ display: 'block', marginTop: '4px' }}>Rua da Legião, nº 56 - Coroado, Manaus - AM</span>
                      <span style={{ display: 'block', marginTop: '4px', fontWeight: 600 }}>🕰️ Disponível para retirada em 30 minutos após aprovação!</span>
                    </div>
                  ) : (
                    /* Endereço de Entrega */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>Endereço de Entrega em Manaus:</h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="CEP"
                          value={address.cep}
                          onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                          style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-main)' }}
                        />
                        <input
                          type="text"
                          placeholder="Bairro (Obrigatório)"
                          value={address.bairro}
                          onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                          style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-main)' }}
                          required
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Rua (Obrigatório)"
                        value={address.rua}
                        onChange={(e) => setAddress({ ...address, rua: e.target.value })}
                        style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-main)' }}
                        required
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Número (Obrigatório)"
                          value={address.numero}
                          onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                          style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-main)' }}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Complemento"
                          value={address.complemento}
                          onChange={(e) => setAddress({ ...address, complemento: e.target.value })}
                          style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-main)' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Resumo Financeiro */}
                  <div style={{
                    borderTop: '1px solid var(--border-glass)',
                    paddingTop: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '13px',
                    color: 'var(--text-muted)'
                  }}>
                    <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                      <span>Subtotal:</span>
                      <strong>R$ {cartSubtotal.toFixed(2)}</strong>
                    </div>
                    {discountApplied && (
                      <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', color: '#22c55e' }}>
                        <span>Cupom de Desconto:</span>
                        <strong>- R$ {discountAmount.toFixed(2)}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                      <span>Taxa de Envio:</span>
                      <strong>{deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2)}`}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                      <span>Total Parcial:</span>
                      <span style={{ color: 'var(--primary)' }}>R$ {(cartSubtotal - discountAmount + deliveryFee).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Ação */}
                  <button
                    onClick={() => setCheckoutStep(2)}
                    className="gradient-bg gradient-bg-hover"
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Seguir para o Pagamento
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* PASSO 2: METODO DE PAGAMENTO */}
              {checkoutStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Seleção do Pagamento */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>
                      Escolha a forma de pagamento:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      
                      {/* PIX */}
                      <button
                        onClick={() => setPaymentMethod('pix')}
                        style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-sm)',
                          border: '2px solid',
                          borderColor: paymentMethod === 'pix' ? 'var(--primary)' : 'var(--border-glass)',
                          background: paymentMethod === 'pix' ? 'rgba(3, 2, 116, 0.03)' : 'var(--bg-secondary)',
                          color: 'var(--text-main)',
                          textAlign: 'center',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '14px',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        ⚡ PIX
                        <span style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: '#22c55e', marginTop: '4px' }}>
                          5% de Desconto Extra!
                        </span>
                      </button>

                      {/* Cartão de Crédito */}
                      <button
                        onClick={() => setPaymentMethod('cartao')}
                        style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-sm)',
                          border: '2px solid',
                          borderColor: paymentMethod === 'cartao' ? 'var(--primary)' : 'var(--border-glass)',
                          background: paymentMethod === 'cartao' ? 'rgba(3, 2, 116, 0.03)' : 'var(--bg-secondary)',
                          color: 'var(--text-main)',
                          textAlign: 'center',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '14px',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        💳 Cartão de Crédito
                        <span style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', marginTop: '4px' }}>
                          Até 10x sem juros
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Conteúdo de Pagamento - PIX */}
                  {paymentMethod === 'pix' ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '20px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(34, 197, 94, 0.04)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        width: '120px',
                        height: '120px',
                        backgroundColor: '#fff',
                        padding: '10px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}>
                        {/* Simulação de QR Code via Canvas/Vetor */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#030274' }}>
                          <rect width="5" height="5" x="3" y="3" rx="1"/>
                          <rect width="5" height="5" x="16" y="3" rx="1"/>
                          <rect width="5" height="5" x="3" y="16" rx="1"/>
                          <path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
                          <path d="M21 21v.01"/>
                          <path d="M12 7v3a2 2 0 0 1-2 2H7"/>
                          <path d="M3 12h.01"/>
                          <path d="M12 3h.01"/>
                          <path d="M12 16v.01"/>
                          <path d="M16 12h1"/>
                          <path d="M21 12v.01"/>
                          <path d="M12 21h.01"/>
                        </svg>
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        Escaneie o QR Code ou copie o código Pix abaixo para realizar o pagamento. O desconto extra de 5% já foi deduzido do total!
                      </span>
                      
                      <button
                        onClick={() => alert('Código Pix Copiado com Sucesso!')}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: '#22c55e',
                          color: '#fff',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Check size={14} />
                        Copiar Chave Copia e Cola
                      </button>
                    </div>
                  ) : (
                    /* Conteúdo de Pagamento - Cartão */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>Dados do Cartão de Crédito:</h4>
                      
                      <input
                        type="text"
                        placeholder="Nome impresso no Cartão (Obrigatório)"
                        value={card.name}
                        onChange={(e) => setCard({ ...card, name: e.target.value })}
                        style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-main)' }}
                        required
                      />

                      <input
                        type="text"
                        placeholder="Número do Cartão (Obrigatório)"
                        value={card.number}
                        onChange={(e) => setCard({ ...card, number: e.target.value })}
                        style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-main)' }}
                        required
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Validade: MM/AA"
                          value={card.expiry}
                          onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                          style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-main)' }}
                          required
                        />
                        <input
                          type="password"
                          placeholder="CVV (Código)"
                          value={card.cvv}
                          onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                          style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-main)' }}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Resumo Financeiro Final */}
                  <div style={{
                    borderTop: '1px solid var(--border-glass)',
                    paddingTop: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '13px',
                    color: 'var(--text-muted)'
                  }}>
                    <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                      <span>Subtotal da Loja:</span>
                      <strong>R$ {cartSubtotal.toFixed(2)}</strong>
                    </div>
                    {discountApplied && (
                      <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', color: '#22c55e' }}>
                        <span>Cupom Promo (10%):</span>
                        <strong>- R$ {discountAmount.toFixed(2)}</strong>
                      </div>
                    )}
                    {paymentMethod === 'pix' && (
                      <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', color: '#22c55e' }}>
                        <span>Desconto Especial PIX (5%):</span>
                        <strong>- R$ {pixDiscountAmount.toFixed(2)}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                      <span>Taxa de Envio ({deliveryMethod === 'entrega' ? 'Expressa' : 'Balcão'}):</span>
                      <strong>{deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2)}`}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                      <span>Total Geral:</span>
                      <span style={{ color: 'var(--primary)' }}>R$ {cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Botoes de Ação */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                    <button
                      onClick={() => setCheckoutStep(1)}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-glass)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-main)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="gradient-bg gradient-bg-hover"
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <CreditCard size={16} />
                      Confirmar e Pagar
                    </button>
                  </div>
                </div>
              )}

              {/* PASSO 3: TELA DE SUCESSO E CONFIRMAÇÃO */}
              {checkoutStep === 3 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '30px 0',
                  textAlign: 'center'
                }}>
                  <div style={{
                    color: '#22c55e',
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }}>
                    <CheckCircle size={72} fill="rgba(34, 197, 94, 0.1)" />
                  </div>
                  
                  <h3 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)' }}>
                    Pedido Confirmado!
                  </h3>
                  
                  <div style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(3, 2, 116, 0.03)',
                    border: '1px solid var(--border-glass)',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Código do Pedido:</span>
                      <strong>{orderNumber}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Método:</span>
                      <strong>{deliveryMethod === 'entrega' ? '🛵 Entrega Expressa' : '🏪 Retirada na Loja'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Valor Pago:</span>
                      <strong style={{ color: 'var(--primary)' }}>R$ {cartTotal.toFixed(2)}</strong>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    marginTop: '10px'
                  }}>
                    {deliveryMethod === 'entrega' ? (
                      <span>Obrigado! Seu pedido já está sendo faturado e embalado. A entrega expressa será realizada no seu endereço em até <strong>2 horas</strong>. Enviaremos o link de rastreamento por WhatsApp.</span>
                    ) : (
                      <span>Obrigado! Seu pedido foi faturado e já está em processo de separação biológica na nossa loja. Você poderá retirá-lo na <strong>Rua da Legião nº 56 - Coroado em até 30 minutos</strong>!</span>
                    )}
                  </p>

                  <button
                    onClick={handleFinishCheckout}
                    className="gradient-bg gradient-bg-hover"
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: '20px',
                      boxShadow: '0 4px 12px rgba(0, 180, 216, 0.2)'
                    }}
                  >
                    Voltar para a Página Inicial
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ESTILOS INTERNOS DE SCROLL E SKELETON */}
      <style>{`
        .category-scroll::-webkit-scrollbar {
          display: none;
        }
        @media (min-width: 768px) {
          .catalog-controls-grid {
            flex-direction: row !important;
            align-items: center !important;
          }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .skeleton-card {
          animation: pulse-soft 2s infinite ease-in-out;
        }
        .product-store-card:hover {
          transform: translateY(-6px);
          border-color: var(--primary) !important;
          box-shadow: var(--shadow-lg) !important;
        }
        .product-store-card:hover .emoji-glow {
          transform: scale(1.1);
          filter: drop-shadow(0 5px 15px rgba(3,2,116,0.15));
        }
        .emoji-glow {
          transition: var(--transition-bounce);
        }
      `}</style>
    </div>
  );
};
