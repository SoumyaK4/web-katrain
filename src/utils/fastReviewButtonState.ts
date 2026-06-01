import type { AnalysisCoverageSummary } from './analysisCoverage';

type GameProgressButtonSummary = {
  buttonLabel?: string;
  title?: string;
} | null;

export interface FastReviewButtonState {
  state: 'ready' | 'running' | 'complete';
  label: string;
  title: string;
  disabled: boolean;
  ariaLabel?: string;
}

export function getFastReviewButtonState({
  isGameAnalysisRunning,
  gameProgress,
  analysisCoverage,
}: {
  isGameAnalysisRunning: boolean;
  gameProgress: GameProgressButtonSummary;
  analysisCoverage: AnalysisCoverageSummary;
}): FastReviewButtonState {
  if (isGameAnalysisRunning) {
    return {
      state: 'running',
      label: `Stop ${gameProgress?.buttonLabel ?? ''}`.trim() || 'Stop',
      title: gameProgress?.title ?? 'Stop game analysis',
      disabled: false,
    };
  }

  if (analysisCoverage.total > 1 && analysisCoverage.tone === 'complete') {
    return {
      state: 'complete',
      label: 'Reviewed',
      title: `Current line is fully analyzed (${analysisCoverage.valueLabel}). Use Re-analyze game for a deeper pass.`,
      disabled: true,
      ariaLabel: 'Current line fully analyzed',
    };
  }

  return {
    state: 'ready',
    label: 'Fast review',
    title: 'Run a fast MCTS review of the game',
    disabled: false,
  };
}
