import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AnalysisStatsActions } from '../src/components/AnalysisPanel';

const noop = () => undefined;

describe('AnalysisStatsActions', () => {
  it('surfaces report and analysis actions with cache status', () => {
    const html = renderToStaticMarkup(
      <AnalysisStatsActions
        analysisCacheSize={1}
        onOpenGameAnalysis={noop}
        onOpenGameReport={noop}
      />
    );

    expect(html).toContain('data-analysis-stats-actions="true"');
    expect(html).toContain('Open game report');
    expect(html).toContain('Open analysis options');
    expect(html).toContain('1 cached analysis');
    expect(html).toContain('1 cached');
  });

  it('pluralizes cached analyses', () => {
    const html = renderToStaticMarkup(
      <AnalysisStatsActions
        analysisCacheSize={4}
        onOpenGameAnalysis={noop}
        onOpenGameReport={noop}
      />
    );

    expect(html).toContain('4 cached analyses');
    expect(html).toContain('4 cached');
  });
});
