export const PWA_OFFLINE_READY_EVENT = 'web-katrain:pwa-offline-ready';
export const PWA_UPDATE_READY_EVENT = 'web-katrain:pwa-update-ready';

export function getServiceWorkerUrl(baseUrl: string): string {
  const normalized = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalized}sw.js`;
}

export function registerServiceWorker(): void {
  if (import.meta.env.DEV) return;
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  const swUrl = getServiceWorkerUrl(import.meta.env.BASE_URL || '/');
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(swUrl, { scope: import.meta.env.BASE_URL || '/' })
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state !== 'installed') return;
            const eventName = navigator.serviceWorker.controller
              ? PWA_UPDATE_READY_EVENT
              : PWA_OFFLINE_READY_EVENT;
            window.dispatchEvent(new Event(eventName));
          });
        });
      })
      .catch((err: unknown) => {
        console.warn('[pwa] service worker registration failed', err);
      });
  });
}
