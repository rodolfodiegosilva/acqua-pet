import React, { useEffect, useMemo, useState } from 'react';
import { AppPagination, getResponsiveDefaultPageSize } from '@/components/pagination/AppPagination';
import { PortalSectionCard } from '@/components/client/portal-section-card/PortalSectionCard';
import type { Product } from '@/services/api';
import type { ClientOrder, ClientPet } from '@/services/clientPortal';

interface StoreTabProps {
  pets: ClientPet[];
  products: Product[];
  orders: ClientOrder[];
  addToCart: (product: Product) => void;
  setView: (view: 'landing' | 'store' | 'client') => void;
}

const PET_SPECIES_CATEGORY_MAP: Record<string, Product['category'][]> = {
  cão: ['Cães'],
  gato: ['Gatos'],
  peixe: ['Peixes'],
  ave: ['Aves'],
  réptil: ['Répteis'],
  reptil: ['Répteis'],
  coelho: ['Pequenos Pets'],
  hamster: ['Pequenos Pets'],
  porquinho: ['Pequenos Pets'],
  chinchila: ['Pequenos Pets'],
  furão: ['Pequenos Pets'],
  tartaruga: ['Répteis'],
  iguana: ['Répteis'],
  serpente: ['Répteis'],
  roedor: ['Pequenos Pets']
};

export const StoreTab: React.FC<StoreTabProps> = ({ pets, products, orders, addToCart, setView }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [promoOnly, setPromoOnly] = useState(false);
  const [recommendedOnly, setRecommendedOnly] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => getResponsiveDefaultPageSize());

  const recommendedCategories = useMemo(() => {
    const categories = new Set<Product['category']>();
    pets.forEach((pet) => {
      const normalizedSpecies = pet.species.toLowerCase();
      Object.entries(PET_SPECIES_CATEGORY_MAP).forEach(([key, mappedCategories]) => {
        if (normalizedSpecies.includes(key)) {
          mappedCategories.forEach((category) => categories.add(category));
        }
      });
    });
    return categories;
  }, [pets]);

  const categories = useMemo(
    () => ['Todos', ...Array.from(new Set(products.map((product) => product.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);

      const matchesCategory = categoryFilter === 'Todos' || product.category === categoryFilter;
      const matchesPromo = !promoOnly || Boolean(product.originalPrice);
      const matchesRecommended = !recommendedOnly || recommendedCategories.has(product.category);

      return matchesSearch && matchesCategory && matchesPromo && matchesRecommended;
    });
  }, [products, searchQuery, categoryFilter, promoOnly, recommendedOnly, recommendedCategories]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'discount-desc') return ((b.originalPrice ?? b.price) - b.price) - ((a.originalPrice ?? a.price) - a.price);

      const aRecommended = recommendedCategories.has(a.category) ? 1 : 0;
      const bRecommended = recommendedCategories.has(b.category) ? 1 : 0;
      return bRecommended - aRecommended || b.rating - a.rating || a.price - b.price;
    });
  }, [filteredProducts, sortBy, recommendedCategories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, categoryFilter, promoOnly, recommendedOnly, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="portal-two-cols" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '20px' }}>
      <PortalSectionCard title="Produtos recomendados" eyebrow="Loja" action={<button onClick={() => setView('store')} className="portal-link-btn">Abrir loja completa</button>}>
        <div style={{ display: 'grid', gap: '14px' }}>
          <div className="portal-store-controls" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) repeat(2, minmax(0, 0.7fr))', gap: '12px' }}>
            <input
              className="portal-input"
              type="text"
              placeholder="Buscar produtos para a rotina do seu pet"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <select className="portal-input" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select className="portal-input" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="recommended">Mais indicados</option>
              <option value="rating-desc">Melhor avaliação</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="discount-desc">Maior desconto</option>
            </select>
          </div>

          <div className="portal-store-filters" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <label className="portal-ghost-btn" style={{ justifyContent: 'flex-start' }}>
              <input type="checkbox" checked={recommendedOnly} onChange={(event) => setRecommendedOnly(event.target.checked)} />
              Indicados para seus pets
            </label>
            <label className="portal-ghost-btn" style={{ justifyContent: 'flex-start' }}>
              <input type="checkbox" checked={promoOnly} onChange={(event) => setPromoOnly(event.target.checked)} />
              Somente promoções
            </label>
            <span style={{ fontSize: '13px', color: 'var(--portal-muted)' }}>
              {sortedProducts.length} itens · página {currentPage} de {totalPages}
            </span>
          </div>
        </div>

        <div className="portal-store-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
          {paginatedProducts.map((product) => (
            <div key={product.id} className="portal-store-product-card" style={{ padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--portal-border)', background: 'var(--portal-soft-surface)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="portal-store-product-card__media" style={{ height: '140px', borderRadius: 'var(--radius-md)', background: product.imageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                {product.imageEmoji}
              </div>
              <div className="portal-store-product-card__content">
                <span className="portal-store-product-card__category" style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--portal-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>{product.category}</span>
                <strong className="portal-store-product-card__title" style={{ display: 'block', fontSize: '16px', marginBottom: '6px', color: 'var(--portal-text)' }}>{product.name}</strong>
                <p className="portal-store-product-card__copy" style={{ fontSize: '13px', color: 'var(--portal-muted)', lineHeight: 1.5 }}>{product.description}</p>
                <div className="portal-store-product-card__tags" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {recommendedCategories.has(product.category) && (
                    <span style={{ padding: '6px 9px', borderRadius: 'var(--radius-full)', background: 'var(--portal-pill-info-bg)', color: 'var(--portal-pill-info-text)', fontSize: '11px', fontWeight: 700 }}>
                      Indicado para seus pets
                    </span>
                  )}
                  {product.originalPrice && (
                    <span style={{ padding: '6px 9px', borderRadius: 'var(--radius-full)', background: 'var(--portal-pill-success-bg)', color: 'var(--portal-pill-success-text)', fontSize: '11px', fontWeight: 700 }}>
                      Oferta ativa
                    </span>
                  )}
                </div>
              </div>
              <div className="portal-store-product-card__footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: 'auto', flexWrap: 'wrap' }}>
                <div className="portal-store-product-card__price">
                  {product.originalPrice && (
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--portal-muted)', textDecoration: 'line-through' }}>
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <strong style={{ fontSize: '22px', color: 'var(--portal-accent)' }}>R$ {product.price.toFixed(2)}</strong>
                </div>
                <button onClick={() => addToCart(product)} className="gradient-bg gradient-bg-hover" style={{ padding: '12px 16px', borderRadius: 'var(--radius-full)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="portal-surface" style={{ padding: '20px' }}>
            <strong style={{ display: 'block', color: 'var(--portal-text)', marginBottom: '6px' }}>Nenhum produto encontrado</strong>
            <p style={{ color: 'var(--portal-muted)', fontSize: '14px' }}>
              Ajuste os filtros ou desative a flag de produtos indicados para ampliar a vitrine.
            </p>
          </div>
        )}

        {sortedProducts.length > 0 && <AppPagination page={currentPage} count={totalPages} pageSize={pageSize} onPageSizeChange={setPageSize} onChange={setCurrentPage} tone="portal" />}
      </PortalSectionCard>

      <PortalSectionCard title="Pedidos recentes" eyebrow="Histórico de compra">
        <div style={{ display: 'grid', gap: '14px' }}>
          {orders.map((order) => (
            <div key={order.id} className="portal-order-card" style={{ padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--portal-border)', background: 'var(--portal-soft-surface)' }}>
              <div className="portal-order-card__head" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <div className="portal-order-card__content">
                  <strong className="portal-order-card__title" style={{ display: 'block', fontSize: '17px', color: 'var(--portal-text)' }}>{order.number}</strong>
                  <span className="portal-order-card__subtitle" style={{ fontSize: '13px', color: 'var(--portal-muted)' }}>{order.createdAt}</span>
                </div>
                <span className="portal-order-card__status" style={{ padding: '8px 12px', borderRadius: 'var(--radius-full)', background: 'var(--portal-pill-info-bg)', color: 'var(--portal-pill-info-text)', fontSize: '12px', fontWeight: 700, height: 'fit-content' }}>
                  {order.status}
                </span>
              </div>
              <p className="portal-order-card__copy" style={{ fontSize: '14px', color: 'var(--portal-muted)', lineHeight: 1.6, marginBottom: '10px' }}>{order.items.join(' · ')}</p>
              <strong style={{ color: 'var(--portal-accent)' }}>Total R$ {order.total.toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </PortalSectionCard>
    </div>
  );
};
