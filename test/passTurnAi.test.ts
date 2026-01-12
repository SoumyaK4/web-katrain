import { afterEach, describe, expect, it, vi } from 'vitest';
import { useGameStore } from '../src/store/gameStore';

describe('GameStore passTurn AI behavior', () => {
  afterEach(() => {
    vi.useRealTimers();
    useGameStore.getState().resetGame();
  });

  it('schedules an AI move after passing into AI turn', () => {
    vi.useFakeTimers();

    const store = useGameStore.getState();
    store.resetGame();

    const originalMakeAiMove = store.makeAiMove;
    const makeAiMoveSpy = vi.fn();
    useGameStore.setState({ makeAiMove: makeAiMoveSpy as unknown as typeof originalMakeAiMove });

    useGameStore.setState({ isAiPlaying: true, aiColor: 'white' });

    store.passTurn();
    expect(makeAiMoveSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(499);
    expect(makeAiMoveSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(makeAiMoveSpy).toHaveBeenCalledTimes(1);

    useGameStore.setState({ makeAiMove: originalMakeAiMove });
  });

  it('does not schedule an AI move after the second consecutive pass', () => {
    vi.useFakeTimers();

    const store = useGameStore.getState();
    store.resetGame();

    const originalMakeAiMove = store.makeAiMove;
    const makeAiMoveSpy = vi.fn();
    useGameStore.setState({ makeAiMove: makeAiMoveSpy as unknown as typeof originalMakeAiMove });

    useGameStore.setState({ isAiPlaying: true, aiColor: 'black' });

    store.passTurn(); // B pass -> W to play
    store.passTurn(); // W pass -> game ended, B to play (AI), but should not auto-move

    vi.runAllTimers();
    expect(makeAiMoveSpy).not.toHaveBeenCalled();

    useGameStore.setState({ makeAiMove: originalMakeAiMove });
  });
});

