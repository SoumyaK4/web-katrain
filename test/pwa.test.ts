import { describe, expect, it } from 'vitest';
import { getServiceWorkerUrl } from '../src/utils/pwa';

describe('PWA helpers', () => {
  it('builds a base-aware service worker URL', () => {
    expect(getServiceWorkerUrl('/')).toBe('/sw.js');
    expect(getServiceWorkerUrl('/web-katrain/')).toBe('/web-katrain/sw.js');
    expect(getServiceWorkerUrl('/web-katrain')).toBe('/web-katrain/sw.js');
  });
});
