import { describe, expect, it, vi } from 'vitest';
import { getVisualViewport } from '../src/utils/visualViewport';

describe('visual viewport helpers', () => {
  it('returns a viewport only when event listeners are available', () => {
    const viewport = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    expect(getVisualViewport({ visualViewport: viewport })).toBe(viewport);
    expect(getVisualViewport({ visualViewport: null })).toBeNull();
    expect(getVisualViewport({ visualViewport: {} as VisualViewport })).toBeNull();
  });

  it('treats blocked visualViewport access as unavailable', () => {
    const source = {};
    Object.defineProperty(source, 'visualViewport', {
      configurable: true,
      get() {
        throw new Error('visualViewport blocked');
      },
    });

    expect(getVisualViewport(source)).toBeNull();
  });
});
