import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PhotoBoardModal } from '../src/components/PhotoBoardModal';
import type { BoardState } from '../src/types';

function boardWithStone(size: number, x: number, y: number, stone: 'black' | 'white'): BoardState {
  const board: BoardState = Array.from({ length: size }, () => Array.from({ length: size }, () => null));
  board[y]![x] = stone;
  return board;
}

describe('PhotoBoardModal', () => {
  it('renders current-board diff markers on the trace grid', () => {
    const html = renderToStaticMarkup(
      <PhotoBoardModal
        onClose={() => undefined}
        onImportSgf={() => undefined}
        defaultBoardSize={9}
        defaultKomi={6.5}
        currentBoard={boardWithStone(9, 0, 0, 'black')}
        currentPlayer="white"
      />,
    );

    expect(html).toContain('data-photo-board-delta-summary="true"');
    expect(html).toContain('data-photo-board-delta-toggle="true"');
    expect(html).toContain('Overlay on');
    expect(html).toContain('data-photo-board-delta-overlay="removed"');
    expect(html).toContain('data-photo-board-delta-marker="removed"');
    expect(html).toContain('data-photo-board-delta-player="black"');
  });
});
