import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './sections/Hero';
import { Essence } from './sections/Essence';
import { Services } from './sections/Services';
import { Contact } from './sections/Contact';
import { Footer } from './components/Footer';
import { Store } from './pages/Store';
import type { CartItem } from './pages/Store';
import type { Product } from './services/api';

function App() {
  const [view, setView] = useState<'landing' | 'store'>('landing');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Funções do Carrinho
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) => prev.map(item => item.product.id === productId ? { ...item, quantity: qty } : item));
    }
  };

  const clearCart = () => setCart([]);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Fixo com Glassmorphism e controles de navegação SPA */}
      <Header
        view={view}
        setView={setView}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      {/* Corpo da Landing Page ou E-commerce */}
      <main style={{ flex: '1 0 auto' }}>
        {view === 'landing' ? (
          <>
            {/* Seção Hero Cinematográfica com Vídeo */}
            <Hero />
            
            {/* Seção Exclusiva da Essência (Equilíbrio Biológico e Saúde) */}
            <Essence />
            
            {/* Seção de Serviços */}
            <Services />
            
            {/* Seção de Agendamento e Contato */}
            <Contact />
          </>
        ) : (
          /* Loja Virtual Premium */
          <Store
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateCartQty={updateCartQty}
            clearCart={clearCart}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            setView={setView}
          />
        )}
      </main>
      
      {/* Rodapé com Links e Redes Sociais integrado à SPA */}
      <Footer setView={setView} />
    </div>
  );
}

export default App;
