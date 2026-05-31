import { afterEach, describe, expect, it } from 'vitest';
import {
  getPwaInstallDismissed,
  getServiceWorkerUrl,
  isStandalonePwa,
  PWA_INSTALL_DISMISSED_KEY,
  setPwaInstallDismissed,
} from '../src/utils/pwa';

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');

function restoreWindow() {
  if (originalWindow) {
    Object.defineProperty(globalThis, 'window', originalWindow);
  } else {
    Reflect.deleteProperty(globalThis, 'window');
  }
}

function makeStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
}

describe('PWA helpers', () => {
  afterEach(() => {
    restoreWindow();
  });

  it('builds a base-aware service worker URL', () => {
    expect(getServiceWorkerUrl('/')).toBe('/sw.js');
    expect(getServiceWorkerUrl('/web-katrain/')).toBe('/web-katrain/sw.js');
    expect(getServiceWorkerUrl('/web-katrain')).toBe('/web-katrain/sw.js');
  });

  it('persists whether the install prompt was dismissed', () => {
    const storage = makeStorage();

    expect(getPwaInstallDismissed(storage)).toBe(false);

    setPwaInstallDismissed(true, storage);
    expect(storage.getItem(PWA_INSTALL_DISMISSED_KEY)).toBe('true');
    expect(getPwaInstallDismissed(storage)).toBe(true);

    setPwaInstallDismissed(false, storage);
    expect(storage.getItem(PWA_INSTALL_DISMISSED_KEY)).toBeNull();
    expect(getPwaInstallDismissed(storage)).toBe(false);
  });

  it('checks standalone display mode without trusting matchMedia', () => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        matchMedia: () => {
          throw new Error('matchMedia blocked');
        },
      },
    });

    expect(isStandalonePwa()).toBe(false);
  });
});
