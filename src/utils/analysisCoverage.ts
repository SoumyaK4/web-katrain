import type { GameNode } from '../types';

export type AnalysisCoverageTone = 'empty' | 'partial' | 'complete';

export interface AnalysisCoverageSummary {
  analyzed: number;
  total: number;
  percent: number;
  valueLabel: string;
  stateLabel: string;
  title: string;
  tone: AnalysisCoverageTone;
}

export function summarizeAnalysisCoverage(
  nodes: readonly Pick<GameNode, 'analysis'>[]
): AnalysisCoverageSummary {
  const total = nodes.length;
  const analyzed = nodes.reduce((count, node) => count + (node.analysis ? 1 : 0), 0);
  const percent = total > 0 ? analyzed / total : 0;
  const tone: AnalysisCoverageTone =
    total === 0 || analyzed === 0 ? 'empty' : analyzed === total ? 'complete' : 'partial';
  const stateLabel =
    total === 0 ? 'No line' : analyzed === 0 ? 'No analysis' : analyzed === total ? 'Complete' : 'Partial';

  return {
    analyzed,
    total,
    percent,
    valueLabel: total > 0 ? `${analyzed}/${total}` : '-',
    stateLabel,
    title:
      total > 0
        ? `Analysis coverage for the current line: ${analyzed}/${total} positions.`
        : 'Analysis coverage is unavailable until a line is loaded.',
    tone,
  };
}
