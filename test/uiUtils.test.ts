import { describe, expect, it } from 'vitest';
import { formatMoveLabel } from '../src/components/layout/ui-utils';

describe('layout UI utilities', () => {
  it('formats coordinates for the active board size', () => {
    expect(formatMoveLabel(0, 0, 9)).toBe('A9');
    expect(formatMoveLabel(0, 0, 19)).toBe('A19');
    expect(formatMoveLabel(8, 8, 9)).toBe('J1');
    expect(formatMoveLabel(-1, -1, 9)).toBe('Pass');
  });
});
