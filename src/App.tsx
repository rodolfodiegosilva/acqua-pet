import { useCallback, useEffect, useState } from 'react';
import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';
import { InstallGate } from '@/components/pwa/install-gate/InstallGate';
import { AdminPortal } from '@/pages/admin-portal/AdminPortal';
import { ClientPortal } from '@/pages/client-portal/ClientPortal';
import { Store } from '@/pages/store/Store';
import type { CartItem } from '@/pages/store/Store';
import { VeterinaryPortal } from '@/pages/veterinary-portal/VeterinaryPortal';
import { Contact } from '@/sections/contact/Contact';
import { Essence } from '@/sections/essence/Essence';
import { Hero } from '@/sections/hero/Hero';
import { Services } from '@/sections/services/Services';
import type { Product } from '@/services/api';
import { getAppViewFromPath } from '@/types/navigation';
import type { AppView } from '@/types/navigation';

function App() {
  const [view, setViewState] = useState<AppView>(() => getAppViewFromPath(window.location.pathname));
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
      setViewState(getAppViewFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleCartClick = useCallback(() => {
    if (view !== 'store') {
      setView('store');
    }
    setIsCartOpen(true);
  }, [setView, view]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <InstallGate />
      {!isPrivatePortal && (
        <Header
          view={view}
          setView={setView}
          cartItemCount={cartItemCount}
          onCartClick={handleCartClick}
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
