import { Header } from './components/Header';
import { Hero } from './sections/Hero';
import { Essence } from './sections/Essence';
import { Services } from './sections/Services';
import { Products } from './sections/Products';
import { Contact } from './sections/Contact';
import { Footer } from './components/Footer';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Fixo com Glassmorphism */}
      <Header />
      
      {/* Corpo da Landing Page */}
      <main style={{ flex: '1 0 auto' }}>
        {/* Seção Hero Cinematográfica com Vídeo */}
        <Hero />
        
        {/* Seção Exclusiva da Essência (Cuidado e Calmaria das Águas) */}
        <Essence />
        
        {/* Seção de Serviços */}
        <Services />
        
        {/* Seção do Pet Shop Showcase */}
        <Products />
        
        {/* Seção de Agendamento e Contato */}
        <Contact />
      </main>
      
      {/* Rodapé com Links e Redes Sociais */}
      <Footer />
    </div>
  );
}

export default App;
