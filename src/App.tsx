import { useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './sections/Hero';
import { Essence } from './sections/Essence';
import { Services } from './sections/Services';
import { Contact } from './sections/Contact';
import { Footer } from './components/Footer';
import { Store } from './pages/Store';
import { ClientPortal } from './pages/ClientPortal';
import { AdminPortal } from './pages/AdminPortal';
import { VeterinaryPortal } from './pages/VeterinaryPortal';
import type { CartItem } from './pages/Store';
import type { Product } from './services/api';
import type { AppView } from './types/navigation';

function App() {
  const resolveViewFromPath = useCallback((pathname: string): AppView => {
    const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    if (normalizedPath === '/area-admin') return 'admin';
    if (normalizedPath === '/area-veterinario') return 'veterinary';
    if (normalizedPath === '/area-cliente') return 'client';
    if (normalizedPath === '/loja') return 'store';
    return 'landing';
  }, []);

  const [view, setViewState] = useState<AppView>(() => resolveViewFromPath(window.location.pathname));
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
  const isPrivatePortal = view === 'client' || view === 'admin' || view === 'veterinary';

  const setView = useCallback((nextView: AppView) => {
    setViewState(nextView);
    const nextPath =
      nextView === 'client'
        ? '/area-cliente'
        : nextView === 'admin'
          ? '/area-admin'
          : nextView === 'veterinary'
            ? '/area-veterinario'
            : nextView === 'store'
              ? '/loja'
              : '/';
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
      {!isPrivatePortal && (
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
        ) : view === 'client' ? (
          <ClientPortal
            setView={setView}
            addToCart={addToCart}
          />
        ) : view === 'admin' ? (
          <AdminPortal setView={setView} />
        ) : (
          <VeterinaryPortal setView={setView} />
        )}
      </main>
      
      {!isPrivatePortal && <Footer setView={setView} />}
    </div>
  );
}

export default App;
