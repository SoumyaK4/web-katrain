import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AnalysisCoverageReadout } from '../src/components/AnalysisPanel';
import { summarizeAnalysisCoverage } from '../src/utils/analysisCoverage';
import type { GameNode } from '../src/types';

const analyzedNode = (): Pick<GameNode, 'analysis'> => ({
  analysis: {} as NonNullable<GameNode['analysis']>,
});

const unanalyzedNode = (): Pick<GameNode, 'analysis'> => ({
  analysis: null,
});

describe('analysis coverage summary', () => {
  it('summarizes empty, partial, and complete current lines', () => {
    expect(summarizeAnalysisCoverage([])).toMatchObject({
      analyzed: 0,
      total: 0,
      valueLabel: '-',
      stateLabel: 'No line',
      tone: 'empty',
    });

    expect(summarizeAnalysisCoverage([unanalyzedNode(), analyzedNode(), unanalyzedNode()])).toMatchObject({
      analyzed: 1,
      total: 3,
      valueLabel: '1/3',
      stateLabel: 'Partial',
      tone: 'partial',
    });

    expect(summarizeAnalysisCoverage([analyzedNode(), analyzedNode()])).toMatchObject({
      analyzed: 2,
      total: 2,
      percent: 1,
      valueLabel: '2/2',
      stateLabel: 'Complete',
      tone: 'complete',
    });
  });

  it('renders a compact graph coverage readout', () => {
    const summary = summarizeAnalysisCoverage([analyzedNode(), unanalyzedNode()]);
    const html = renderToStaticMarkup(
      <AnalysisCoverageReadout summary={summary} className="coverage-card" />
    );

    expect(html).toContain('data-analysis-coverage="true"');
    expect(html).toContain('data-analysis-coverage-tone="partial"');
    expect(html).toContain('Analyzed');
    expect(html).toContain('1/2');
    expect(html).toContain('Partial');
    expect(html).toContain('Analysis coverage for the current line: 1/2 positions.');
  });
});
