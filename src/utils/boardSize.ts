import type { BoardSize, BoardState } from '../types';

export const BOARD_SIZES: BoardSize[] = [9, 13, 19];

export const isBoardSize = (value: number): value is BoardSize =>
  value === 9 || value === 13 || value === 19;

export const normalizeBoardSize = (value: number | null | undefined, fallback: BoardSize): BoardSize =>
  typeof value === 'number' && isBoardSize(value) ? value : fallback;

export const createEmptyBoard = (size: BoardSize): BoardState =>
  Array.from({ length: size }, () => Array(size).fill(null));

const HOSHI_POINTS: Record<BoardSize, Array<[number, number]>> = {
  9: [
    [2, 2],
    [2, 6],
    [6, 2],
    [6, 6],
    [4, 4],
  ],
  13: [
    [3, 3],
    [3, 9],
    [9, 3],
    [9, 9],
    [6, 6],
  ],
  19: [
    [3, 3],
    [3, 9],
    [3, 15],
    [9, 3],
    [9, 9],
    [9, 15],
    [15, 3],
    [15, 9],
    [15, 15],
  ],
};

const HANDICAP_POINTS: Record<BoardSize, Array<[number, number]>> = {
  9: [
    [6, 2],
    [2, 6],
    [2, 2],
    [6, 6],
    [4, 4],
  ],
  13: [
    [9, 3],
    [3, 9],
    [3, 3],
    [9, 9],
    [6, 6],
  ],
  19: [
    [15, 3],
    [3, 15],
    [3, 3],
    [15, 15],
    [9, 9],
    [3, 9],
    [15, 9],
    [9, 3],
    [9, 15],
  ],
};

export const getHoshiPoints = (size: BoardSize): Array<[number, number]> => HOSHI_POINTS[size];

export const getMaxHandicap = (size: BoardSize): number => HANDICAP_POINTS[size].length;

export const getHandicapPoints = (size: BoardSize, handicap: number): Array<[number, number]> => {
  if (handicap <= 0) return [];
  const points = HANDICAP_POINTS[size];
  return points.slice(0, Math.min(points.length, handicap));
};
