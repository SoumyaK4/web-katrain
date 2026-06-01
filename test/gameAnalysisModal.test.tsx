import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GameAnalysisModal } from '../src/components/GameAnalysisModal';

describe('GameAnalysisModal', () => {
  it('uses explicit labels for re-analysis form controls', () => {
    const html = renderToStaticMarkup(<GameAnalysisModal onClose={() => undefined} />);

    for (const id of [
      'game-analysis-max-visits',
      'game-analysis-limit-moves',
      'game-analysis-start-move',
      'game-analysis-end-move',
      'game-analysis-mistakes-only',
    ]) {
      expect(html).toContain(`for="${id}"`);
      expect(html).toContain(`id="${id}"`);
    }
  });
});
