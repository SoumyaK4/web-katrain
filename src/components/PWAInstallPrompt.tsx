import { useEffect, useState } from 'react';  
  
const DISMISSAL_KEY = 'web-katrain:pwa_install_dismissed';  
const HOURS_TO_WAIT = 24;  
  
export function PWAInstallPrompt() {  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);  
  const [showInstallButton, setShowInstallButton] = useState(false);  
  const [isInstalled, setIsInstalled] = useState(false);  
  const [isDismissed, setIsDismissed] = useState(false);  
  
  useEffect(() => {  
    // Check if already installed  
    if (window.matchMedia('(display-mode: standalone)').matches) {  
      setIsInstalled(true);  
      return;  
    }  
  
    // Check if previously dismissed and if 24 hours have passed  
    const checkDismissalStatus = () => {  
      if (typeof localStorage === 'undefined') return false;  
        
      const dismissedAt = localStorage.getItem(DISMISSAL_KEY);  
      if (!dismissedAt) return false;  
        
      const dismissedTime = parseInt(dismissedAt, 10);  
      const hoursSinceDismissal = (Date.now() - dismissedTime) / (1000 * 60 * 60);  
        
      if (hoursSinceDismissal >= HOURS_TO_WAIT) {  
        localStorage.removeItem(DISMISSAL_KEY);  
        return false;  
      }  
        
      return true;  
    };  
  
    if (checkDismissalStatus()) {  
      setIsDismissed(true);  
      return;  
    }  
  
    const handleBeforeInstallPrompt = (e: any) => {  
      e.preventDefault();  
      setDeferredPrompt(e);  
      setShowInstallButton(true);  
    };  
  
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);  
  
    return () => {  
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);  
    };  
  }, []);  
  
  const handleInstallClick = async () => {  
    if (!deferredPrompt) return;  
  
    deferredPrompt.prompt();  
    const { outcome } = await deferredPrompt.userChoice;  
        
    if (outcome === 'accepted') {  
      setShowInstallButton(false);  
      setIsInstalled(true);  
    }  
        
    setDeferredPrompt(null);  
  };  
  
  const handleDismiss = () => {  
    setShowInstallButton(false);  
    setIsDismissed(true);  
      
    if (typeof localStorage !== 'undefined') {  
      localStorage.setItem(DISMISSAL_KEY, String(Date.now()));  
    }  
  };  
  
  if (isInstalled || !showInstallButton || isDismissed) return null;  
  
  return (  
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">  
      <p className="font-semibold mb-2">Install web-katrain</p>  
      <p className="text-sm mb-3 opacity-90">Install this app for offline access and a better experience.</p>  
      <div className="flex gap-2">  
        <button  
          onClick={handleInstallClick}  
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"  
        >  
          Install  
        </button>  
        <button  
          onClick={handleDismiss}  
          className="bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-800 transition-colors"  
        >  
          Later  
        </button>  
      </div>  
    </div>  
  );  
}