import React, { useEffect, useMemo, useState } from 'react';
import type { BackofficeInventoryItem } from '../../../services/backoffice';
import { BackofficeSectionCard } from '../components/BackofficeSectionCard';

interface AdminInventoryTabProps {
  inventory: BackofficeInventoryItem[];
  onAdjustStock: (itemId: number, nextStock: number) => void;
  onCreateProduct: (product: Omit<BackofficeInventoryItem, 'id' | 'status'>) => void;
}

const CATEGORY_OPTIONS: BackofficeInventoryItem['category'][] = ['Cães', 'Gatos', 'Peixes', 'Aves', 'Répteis', 'Pequenos Pets'];

const CATEGORY_VISUALS: Record<BackofficeInventoryItem['category'], { emoji: string; imageBg: string }> = {
  Cães: { emoji: '🐶', imageBg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)' },
  Gatos: { emoji: '🐱', imageBg: 'linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%)' },
  Peixes: { emoji: '🐠', imageBg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)' },
  Aves: { emoji: '🦜', imageBg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' },
  Répteis: { emoji: '🦎', imageBg: 'linear-gradient(135deg, #d9f99d 0%, #bef264 100%)' },
  'Pequenos Pets': { emoji: '🐹', imageBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }
};

const buildSku = (name: string, category: BackofficeInventoryItem['category']) => {
  const prefix = category
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .slice(0, 3)
    .toUpperCase();

  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 12)
    .toUpperCase();

  return `${prefix}-${slug || 'NOVO'}`;
};

export const AdminInventoryTab: React.FC<AdminInventoryTabProps> = ({ inventory, onAdjustStock, onCreateProduct }) => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | BackofficeInventoryItem['status']>('Todos');
  const [sortBy, setSortBy] = useState<'stock' | 'name' | 'reserved'>('stock');
  const [page, setPage] = useState(1);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [imagePreview, setImagePreview] = useState('');
  const [form, setForm] = useState({
    name: '',
    category: 'Cães' as BackofficeInventoryItem['category'],
    price: '',
    originalPrice: '',
    stock: '',
    minStock: '',
    supplier: '',
    description: '',
    imageUrl: ''
  });

  const filteredInventory = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return inventory.filter((item) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.sku.toLowerCase().includes(normalizedQuery);

      const matchesStatus = statusFilter === 'Todos' || item.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [inventory, query, statusFilter]);

  const sortedInventory = useMemo(() => {
    return [...filteredInventory].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'pt-BR');
      if (sortBy === 'reserved') return b.reserved - a.reserved;
      return a.stock - b.stock;
    });
  }, [filteredInventory, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, sortBy]);

  const perPage = 4;
  const totalPages = Math.max(1, Math.ceil(sortedInventory.length / perPage));
  const paginatedInventory = sortedInventory.slice((page - 1) * perPage, page * perPage);

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const nextValue = typeof reader.result === 'string' ? reader.result : '';
      setImagePreview(nextValue);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const price = Number(form.price);
    const stock = Number(form.stock);
    const minStock = Number(form.minStock);
    const originalPrice = form.originalPrice ? Number(form.originalPrice) : undefined;

    if (!form.name.trim() || !form.supplier.trim() || !form.description.trim()) return;
    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(stock) || stock < 0 || !Number.isFinite(minStock) || minStock < 0) return;
    if (typeof originalPrice === 'number' && (!Number.isFinite(originalPrice) || originalPrice <= 0)) return;

    const categoryVisual = CATEGORY_VISUALS[form.category];
    const imageSource = imageInputMode === 'url' ? form.imageUrl.trim() : imagePreview;

    onCreateProduct({
      name: form.name.trim(),
      category: form.category,
      price,
      originalPrice,
      rating: 4.9,
      imageBg: categoryVisual.imageBg,
      imageEmoji: categoryVisual.emoji,
      description: form.description.trim(),
      stock,
      sku: buildSku(form.name, form.category),
      supplier: form.supplier.trim(),
      reserved: 0,
      minStock,
      imageSource: imageSource || undefined
    });

    setForm({
      name: '',
      category: 'Cães',
      price: '',
      originalPrice: '',
      stock: '',
      minStock: '',
      supplier: '',
      description: '',
      imageUrl: ''
    });
    setImagePreview('');
    setImageInputMode('upload');
    setPage(1);
  };

  return (
    <BackofficeSectionCard title="Estoque da loja" eyebrow="Operação de inventory">
      <form className="backoffice-card backoffice-product-form" style={{ padding: '20px', marginBottom: '18px' }} onSubmit={handleCreateSubmit}>
        <div className="backoffice-section-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <strong style={{ display: 'block', color: 'var(--backoffice-text)', fontSize: '18px', marginBottom: '6px' }}>Cadastrar produto mockado</strong>
            <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>Salvando aqui, o item entra de verdade no estoque do painel para testar a operação.</p>
          </div>
          <span className="backoffice-pill backoffice-status-info">Cadastro ativo</span>
        </div>

        <div className="backoffice-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(260px, 0.8fr)', gap: '16px', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div className="backoffice-table-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
              <input className="backoffice-input" type="text" placeholder="Nome do produto" value={form.name} onChange={(event) => handleFormChange('name', event.target.value)} />
              <select className="backoffice-select" value={form.category} onChange={(event) => handleFormChange('category', event.target.value)}>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="backoffice-table-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
              <input className="backoffice-input" type="number" min="0" step="0.01" placeholder="Preço atual" value={form.price} onChange={(event) => handleFormChange('price', event.target.value)} />
              <input className="backoffice-input" type="number" min="0" step="0.01" placeholder="Preço original opcional" value={form.originalPrice} onChange={(event) => handleFormChange('originalPrice', event.target.value)} />
            </div>

            <div className="backoffice-table-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
              <input className="backoffice-input" type="number" min="0" step="1" placeholder="Estoque inicial" value={form.stock} onChange={(event) => handleFormChange('stock', event.target.value)} />
              <input className="backoffice-input" type="number" min="0" step="1" placeholder="Estoque mínimo" value={form.minStock} onChange={(event) => handleFormChange('minStock', event.target.value)} />
              <input className="backoffice-input" type="text" placeholder="Fornecedor" value={form.supplier} onChange={(event) => handleFormChange('supplier', event.target.value)} />
            </div>

            <textarea
              className="backoffice-input backoffice-textarea"
              rows={4}
              placeholder="Descrição do produto"
              value={form.description}
              onChange={(event) => handleFormChange('description', event.target.value)}
            />

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button type="button" className={imageInputMode === 'upload' ? 'backoffice-primary-btn' : 'backoffice-ghost-btn'} onClick={() => setImageInputMode('upload')}>
                Subir imagem
              </button>
              <button type="button" className={imageInputMode === 'url' ? 'backoffice-primary-btn' : 'backoffice-ghost-btn'} onClick={() => setImageInputMode('url')}>
                Anexar link
              </button>
            </div>

            {imageInputMode === 'upload' ? (
              <label className="backoffice-upload-field">
                <span style={{ color: 'var(--backoffice-text)', fontWeight: 700 }}>Selecionar arquivo</span>
                <span style={{ color: 'var(--backoffice-muted)', fontSize: '13px' }}>PNG, JPG ou WebP para testar a vitrine do painel.</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </label>
            ) : (
              <input className="backoffice-input" type="url" placeholder="https://exemplo.com/minha-imagem.jpg" value={form.imageUrl} onChange={(event) => handleFormChange('imageUrl', event.target.value)} />
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="backoffice-primary-btn" type="submit">Salvar produto</button>
              <button
                className="backoffice-ghost-btn"
                type="button"
                onClick={() => {
                  setForm({
                    name: '',
                    category: 'Cães',
                    price: '',
                    originalPrice: '',
                    stock: '',
                    minStock: '',
                    supplier: '',
                    description: '',
                    imageUrl: ''
                  });
                  setImagePreview('');
                  setImageInputMode('upload');
                }}
              >
                Limpar
              </button>
            </div>
          </div>

          <div className="backoffice-card" style={{ padding: '16px', background: 'var(--backoffice-soft)' }}>
            <span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Prévia do produto</span>
            <div className="backoffice-product-preview" style={{ padding: '16px', borderRadius: '20px', background: CATEGORY_VISUALS[form.category].imageBg }}>
              {((imageInputMode === 'upload' && imagePreview) || (imageInputMode === 'url' && form.imageUrl.trim())) ? (
                <img
                  src={imageInputMode === 'upload' ? imagePreview : form.imageUrl.trim()}
                  alt={form.name || 'Prévia do produto'}
                  style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '18px', marginBottom: '14px', background: 'rgba(255,255,255,0.5)' }}
                />
              ) : (
                <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '18px', marginBottom: '14px', background: 'rgba(255,255,255,0.38)', display: 'grid', placeItems: 'center', fontSize: '44px' }}>
                  {CATEGORY_VISUALS[form.category].emoji}
                </div>
              )}
              <strong style={{ display: 'block', color: '#0f172a', fontSize: '18px', marginBottom: '8px' }}>{form.name || 'Novo produto da loja'}</strong>
              <p style={{ color: 'rgba(15, 23, 42, 0.72)', lineHeight: 1.6, marginBottom: '10px' }}>{form.description || 'A descrição aparece aqui para o admin validar a apresentação antes de salvar.'}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', color: '#0f172a' }}>
                <span><strong>Categoria:</strong> {form.category}</span>
                <span><strong>Preço:</strong> {form.price ? `R$ ${Number(form.price).toFixed(2)}` : 'R$ 0,00'}</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="backoffice-table-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) repeat(2, minmax(0, 0.7fr))', gap: '12px' }}>
        <input className="backoffice-input" type="text" placeholder="Buscar produto, categoria ou SKU" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="backoffice-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'Todos' | BackofficeInventoryItem['status'])}>
          <option value="Todos">Todos os níveis</option>
          <option value="Saudável">Saudável</option>
          <option value="Baixo">Baixo</option>
          <option value="Crítico">Crítico</option>
        </select>
        <select className="backoffice-select" value={sortBy} onChange={(event) => setSortBy(event.target.value as 'stock' | 'name' | 'reserved')}>
          <option value="stock">Menor estoque</option>
          <option value="reserved">Mais reservado</option>
          <option value="name">Nome</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        {paginatedInventory.map((item) => (
          <div key={item.id} className="backoffice-card" style={{ padding: '18px', background: 'var(--backoffice-soft)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', minWidth: 0 }}>
                <div style={{ width: '76px', height: '76px', borderRadius: '18px', overflow: 'hidden', flexShrink: 0, background: item.imageBg }}>
                  {item.imageSource ? (
                    <img src={item.imageSource} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: '34px' }}>{item.imageEmoji}</div>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                <strong style={{ display: 'block', color: 'var(--backoffice-text)', fontSize: '18px', marginBottom: '6px' }}>{item.name}</strong>
                <p style={{ color: 'var(--backoffice-muted)', lineHeight: 1.6 }}>{item.category} · {item.sku} · {item.supplier}</p>
                </div>
              </div>
              <span className={`backoffice-pill ${item.status === 'Saudável' ? 'backoffice-status-success' : item.status === 'Baixo' ? 'backoffice-status-attention' : 'backoffice-status-critical'}`}>
                {item.status}
              </span>
            </div>

            <div className="backoffice-mini-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '14px' }}>
              <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Estoque</span><strong style={{ color: 'var(--backoffice-text)' }}>{item.stock}</strong></div>
              <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Reservado</span><strong style={{ color: 'var(--backoffice-text)' }}>{item.reserved}</strong></div>
              <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Mínimo</span><strong style={{ color: 'var(--backoffice-text)' }}>{item.minStock}</strong></div>
              <div><span style={{ display: 'block', color: 'var(--backoffice-muted)', fontSize: '12px', marginBottom: '4px' }}>Preço</span><strong style={{ color: 'var(--backoffice-text)' }}>R$ {item.price.toFixed(2)}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="backoffice-ghost-btn" onClick={() => onAdjustStock(item.id, Math.max(0, item.stock - 1))}>-1 estoque</button>
              <button className="backoffice-ghost-btn" onClick={() => onAdjustStock(item.id, item.stock + 1)}>+1 estoque</button>
              <button className="backoffice-primary-btn" onClick={() => onAdjustStock(item.id, item.stock + 5)}>Repor +5</button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="backoffice-ghost-btn" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>Anterior</button>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button key={pageNumber} className={pageNumber === page ? 'backoffice-primary-btn' : 'backoffice-ghost-btn'} onClick={() => setPage(pageNumber)}>
                {pageNumber}
              </button>
            );
          })}
          <button className="backoffice-ghost-btn" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>Próxima</button>
        </div>
      )}
    </BackofficeSectionCard>
  );
};
