import { describe, expect, it } from 'vitest';
import type { AnalysisResult, CandidateMove } from '../src/types';
import { formatPolicyPrior, getBestMoveSummary } from '../src/utils/bestMoveSummary';

const territory = (size = 19) => Array.from({ length: size }, () => Array.from({ length: size }, () => 0));

function candidate(partial: Partial<CandidateMove> & Pick<CandidateMove, 'x' | 'y'>): CandidateMove {
  const move: CandidateMove = {
    x: partial.x,
    y: partial.y,
    order: partial.order ?? 0,
    winRate: partial.winRate ?? 0.5,
    scoreLead: partial.scoreLead ?? 0,
    visits: partial.visits ?? 100,
    pointsLost: partial.pointsLost ?? 0,
  };
  if (typeof partial.prior === 'number') move.prior = partial.prior;
  return move;
}

function analysis(moves: CandidateMove[]): AnalysisResult {
  return {
    rootWinRate: 0.5,
    rootScoreLead: 0,
    moves,
    territory: territory(),
  };
}

describe('best move summary', () => {
  it('formats the top candidate as a compact next move readout', () => {
    expect(
      getBestMoveSummary(
        analysis([
          candidate({ x: 3, y: 15, order: 0, visits: 1234, prior: 0.341, scoreLead: 2.4, winRate: 0.57 }),
        ]),
        19
      )
    ).toMatchObject({
      moveLabel: 'D4',
      detailLabel: '34% policy',
      title: 'Best move D4 - 1.2k visits - 34% policy prior - score B+2.4 - black win 57.0%',
    });
  });

  it('uses the lowest engine order even when candidates arrive unsorted', () => {
    const summary = getBestMoveSummary(
      analysis([
        candidate({ x: 15, y: 3, order: 2, visits: 20 }),
        candidate({ x: 10, y: 10, order: 0, visits: 80 }),
      ]),
      19
    );

    expect(summary?.moveLabel).toBe('L9');
    expect(summary?.detailLabel).toBe('80 visits');
  });

  it('returns null when there are no legal candidates', () => {
    expect(getBestMoveSummary(analysis([]), 19)).toBeNull();
    expect(getBestMoveSummary(null, 19)).toBeNull();
  });

  it('keeps small policy priors readable', () => {
    expect(formatPolicyPrior(0.034)).toBe('3.4%');
    expect(formatPolicyPrior(0.34)).toBe('34%');
    expect(formatPolicyPrior(0)).toBeNull();
  });
});
