import { useEffect, useMemo, useState } from 'react';
import appIcon from '@/assets/acqua_pet_icon.svg';
import './InstallGate.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const isStandaloneMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.matchMedia('(display-mode: fullscreen)').matches ||
  ((window.navigator as Navigator & { standalone?: boolean }).standalone === true);

const isMobileBrowser = () => /android|iphone|ipad|ipod/i.test(window.navigator.userAgent);

export const InstallGate = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(() => (typeof window !== 'undefined' ? isStandaloneMode() : true));
  const [showIosSteps, setShowIosSteps] = useState(false);

  const isIos = useMemo(
    () => typeof window !== 'undefined' && /iphone|ipad|ipod/i.test(window.navigator.userAgent),
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (typeof window === 'undefined' || isInstalled || !isMobileBrowser()) {
    return null;
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      return;
    }

    if (isIos) {
      setShowIosSteps(true);
    }
  };

  return (
    <div className="install-gate" role="dialog" aria-modal="true" aria-labelledby="install-gate-title">
      <div className="install-gate__card">
        <div className="install-gate__brand">
          <img className="install-gate__icon" src={appIcon} alt="Acqua Pet" />
          <div>
            <span className="install-gate__eyebrow">Experiência mobile</span>
            <h2 id="install-gate-title" className="install-gate__title">Instale o app Acqua Pet no dispositivo.</h2>
          </div>
        </div>

        <p className="install-gate__copy">
          Para usar com comportamento de app mobile, sem depender da barra do navegador, instale a versão webview/PWA no seu celular.
        </p>

        {(showIosSteps || (isIos && !deferredPrompt)) && (
          <ol className="install-gate__steps">
            <li>Toque em compartilhar no navegador.</li>
            <li>Escolha <strong>Adicionar à Tela de Início</strong>.</li>
            <li>Abra o atalho com o ícone da Acqua Pet para usar em modo app.</li>
          </ol>
        )}

        <div className="install-gate__actions">
          <button type="button" className="install-gate__install-btn" onClick={handleInstall}>
            {deferredPrompt ? 'Instalar app agora' : 'Ver como instalar'}
          </button>
          <button type="button" className="install-gate__secondary-btn" onClick={() => window.location.reload()}>
            Já instalei, recarregar
          </button>
        </div>

        <p className="install-gate__hint">
          O atalho instalado usa o ícone oficial da Acqua Pet e abre com aparência de aplicativo.
        </p>
      </div>
    </div>
  );
}
