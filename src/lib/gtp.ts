import { BOARD_SIZE } from '../types';

export type ParsedGtpMove =
  | { kind: 'pass' }
  | {
      kind: 'move';
      x: number;
      y: number;
    };

export function parseGtpMove(s: string): ParsedGtpMove | null {
  const t = s.trim().toUpperCase();
  if (t === 'PASS') return { kind: 'pass' };
  const m = /^([A-T])([1-9]|1[0-9])$/.exec(t);
  if (!m) return null;
  const colChar = m[1]!;
  if (colChar === 'I') return null;
  const raw = colChar.charCodeAt(0) - 65;
  const x = raw >= 9 ? raw - 1 : raw;
  const row = Number.parseInt(m[2]!, 10);
  const y = BOARD_SIZE - row;
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) return null;
  return { kind: 'move', x, y };
}
