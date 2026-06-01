import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StatusBar } from '../src/components/layout/StatusBar';
import { getMoveInsight } from '../src/utils/moveInsight';
import type { Move } from '../src/types';

const blackMove = (x: number, y: number): Move => ({ x, y, player: 'black' });

const baseProps = {
  moveName: 'Move 1: B D4',
  blackName: 'Black',
  whiteName: 'White',
  komi: 6.5,
  boardSize: 19,
  handicap: 0,
  moveCount: 1,
  capturedBlack: 0,
  capturedWhite: 0,
  endResult: null,
};

describe('StatusBar', () => {
  it('renders Shape Coach insight as an accessible details trigger', () => {
    const moveInsight = getMoveInsight(blackMove(3, 15), 19);

    const html = renderToStaticMarkup(
      <StatusBar
        {...baseProps}
        moveInsight={moveInsight}
        shapeCoachEnabled={true}
        onToggleShapeCoach={() => undefined}
      />,
    );

    expect(html).toContain('data-status-move-insight="corner"');
    expect(html).toContain('data-status-move-insight-toggle="true"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('Open Shape Coach details for 4-4 star point');
    expect(html).toContain('Click for beginner and pro study cues');
  });

  it('hides Shape Coach insight when the coach is disabled', () => {
    const moveInsight = getMoveInsight(blackMove(3, 15), 19);

    const html = renderToStaticMarkup(
      <StatusBar
        {...baseProps}
        moveInsight={moveInsight}
        shapeCoachEnabled={false}
        onToggleShapeCoach={() => undefined}
      />,
    );

    expect(html).not.toContain('data-status-move-insight-toggle="true"');
    expect(html).not.toContain('Open Shape Coach details');
  });
});
