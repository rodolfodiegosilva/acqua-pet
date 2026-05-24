import { useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './sections/Hero';
import { Essence } from './sections/Essence';
import { Services } from './sections/Services';
import { Contact } from './sections/Contact';
import { Footer } from './components/Footer';
import { Store } from './pages/Store';
import { ClientPortal } from './pages/ClientPortal';
import type { CartItem } from './pages/Store';
import type { Product } from './services/api';

function App() {
  const resolveViewFromPath = useCallback((pathname: string): 'landing' | 'store' | 'client' => {
    if (pathname === '/area-cliente') return 'client';
    if (pathname === '/loja') return 'store';
    return 'landing';
  }, []);

  const [view, setViewState] = useState<'landing' | 'store' | 'client'>(() => resolveViewFromPath(window.location.pathname));
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
  const isClientPortal = view === 'client';

  const setView = useCallback((nextView: 'landing' | 'store' | 'client') => {
    setViewState(nextView);
    const nextPath = nextView === 'client' ? '/area-cliente' : nextView === 'store' ? '/loja' : '/';
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setViewState(resolveViewFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [resolveViewFromPath]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isClientPortal && (
        <Header
          view={view}
          setView={setView}
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
        />
      )}
      
      <main style={{ flex: '1 0 auto' }}>
        {view === 'landing' ? (
          <>
            <Hero />
            <Essence />
            <Services />
            <Contact />
          </>
        ) : view === 'store' ? (
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
        ) : (
          <ClientPortal
            setView={setView}
            addToCart={addToCart}
          />
        )}
      </main>
      
      {!isClientPortal && <Footer setView={setView} />}
    </div>
  );
}

export default App;
