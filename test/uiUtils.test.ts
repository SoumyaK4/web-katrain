import { describe, expect, it } from 'vitest';
import { formatMoveLabel, formatPositionSummary } from '../src/components/layout/ui-utils';

describe('layout UI utilities', () => {
  it('formats coordinates for the active board size', () => {
    expect(formatMoveLabel(0, 0, 9)).toBe('A9');
    expect(formatMoveLabel(0, 0, 19)).toBe('A19');
    expect(formatMoveLabel(8, 8, 9)).toBe('J1');
    expect(formatMoveLabel(-1, -1, 9)).toBe('Pass');
  });

  it('summarizes the last played move rather than the side to play', () => {
    expect(
      formatPositionSummary({
        move: { x: 3, y: 15, player: 'black' },
        currentPlayer: 'white',
        moveNumber: 1,
        boardSize: 19,
      })
    ).toEqual({
      playerLabel: 'B',
      moveNumberLabel: '1',
      pointLabel: 'D4',
      title: 'Black played D4',
    });
  });

  it('summarizes the root as the side to play', () => {
    expect(
      formatPositionSummary({
        move: null,
        currentPlayer: 'black',
        moveNumber: 0,
        boardSize: 19,
      })
    ).toEqual({
      playerLabel: 'B',
      moveNumberLabel: '0',
      pointLabel: 'Root',
      title: 'Black to play at root',
    });
  });
});
