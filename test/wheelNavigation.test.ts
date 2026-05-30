import { describe, expect, it } from 'vitest';
import { getWheelNavigationAction } from '../src/utils/wheelNavigation';

describe('wheel navigation', () => {
  it('ignores small wheel deltas before the threshold', () => {
    expect(getWheelNavigationAction({ deltaX: 0, deltaY: 12 })).toBeNull();
    expect(getWheelNavigationAction({ deltaX: -18, deltaY: 4 })).toBeNull();
  });

  it('uses the dominant wheel axis for move navigation', () => {
    expect(getWheelNavigationAction({ deltaX: 0, deltaY: -40 })).toBe('back');
    expect(getWheelNavigationAction({ deltaX: 0, deltaY: 40 })).toBe('forward');
    expect(getWheelNavigationAction({ deltaX: -45, deltaY: 10 })).toBe('back');
  });

  it('uses shifted wheel input for mistake navigation', () => {
    expect(getWheelNavigationAction({ deltaX: 0, deltaY: -40, shiftKey: true })).toBe('prevMistake');
    expect(getWheelNavigationAction({ deltaX: 0, deltaY: 40, shiftKey: true })).toBe('nextMistake');
  });
});
