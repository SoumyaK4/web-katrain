import { useEffect, useState } from 'react';  
  
export function PWAUpdateNotification() {  
  const [showUpdate, setShowUpdate] = useState(false);  
  const [newWorker, setNewWorker] = useState<ServiceWorker | null>(null);  
  
  useEffect(() => {  
    if ('serviceWorker' in navigator) {  
      navigator.serviceWorker.addEventListener('controllerchange', () => {  
        window.location.reload();  
      });  
  
      navigator.serviceWorker.ready.then((registration) => {  
        registration.addEventListener('updatefound', () => {  
          const installingWorker = registration.installing;  
          if (installingWorker) {  
            installingWorker.addEventListener('statechange', () => {  
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {  
                setNewWorker(installingWorker);  
                setShowUpdate(true);  
              }  
            });  
          }  
        });  
      });  
    }  
  }, []);  
  
  const handleUpdate = () => {  
    if (newWorker) {  
      newWorker.postMessage({ type: 'SKIP_WAITING' });  
    }  
  };  
  
  if (!showUpdate) return null;  
  
  return (  
    <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">  
      <p className="font-semibold">New Version Available</p>  
      <p className="text-sm mt-1">A new version of web-katrain is ready to install.</p>  
      <div className="mt-3 flex gap-2">  
        <button  
          onClick={handleUpdate}  
          className="bg-white text-green-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"  
        >  
          Update Now  
        </button>  
        <button  
          onClick={() => setShowUpdate(false)}  
          className="bg-green-700 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-800"  
        >  
          Later  
        </button>  
      </div>  
    </div>  
  );  
}