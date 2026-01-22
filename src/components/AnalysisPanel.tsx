import React from 'react';
import { ScoreWinrateGraph } from './ScoreWinrateGraph';
import type { UiMode, UiState } from './layout/types';
import { EngineStatusBadge, SectionHeader } from './layout/ui';

interface AnalysisPanelProps {
  mode: UiMode;
  modePanels: UiState['panels'][UiMode];
  updatePanels: (
    partial: Partial<UiState['panels'][UiMode]> | ((current: UiState['panels'][UiMode]) => Partial<UiState['panels'][UiMode]>)
  ) => void;
  statusText: string;
  engineDot: string;
  engineMeta: string;
  engineMetaTitle?: string;
  isGameAnalysisRunning: boolean;
  gameAnalysisType: string | null;
  gameAnalysisDone: number;
  gameAnalysisTotal: number;
  startQuickGameAnalysis: () => void;
  startFastGameAnalysis: () => void;
  stopGameAnalysis: () => void;
  onOpenGameAnalysis: () => void;
  onOpenGameReport: () => void;
  winRate: number | null;
  scoreLead: number | null;
  pointsLost: number | null;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  mode,
  modePanels,
  updatePanels,
  statusText,
  engineDot,
  engineMeta,
  engineMetaTitle,
  isGameAnalysisRunning,
  gameAnalysisType,
  gameAnalysisDone,
  gameAnalysisTotal,
  startQuickGameAnalysis,
  startFastGameAnalysis,
  stopGameAnalysis,
  onOpenGameAnalysis,
  onOpenGameReport,
  winRate,
  scoreLead,
  pointsLost,
}) => {
  void mode;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 text-xs ui-text-faint">
        <EngineStatusBadge
          label={engineMeta}
          title={engineMetaTitle}
          dotClass={engineDot}
          variant="inline"
          className="lg:hidden"
          maxWidthClassName="max-w-[180px]"
        />
        <span className="ml-auto">{statusText}</span>
      </div>
      {isGameAnalysisRunning && gameAnalysisTotal > 0 && (
        <div>
          <div className="h-2 rounded bg-[var(--ui-surface-2)] overflow-hidden">
            <div
              className="h-full bg-[var(--ui-accent)] opacity-70"
              style={{ width: `${Math.min(100, Math.round((gameAnalysisDone / gameAnalysisTotal) * 100))}%` }}
            />
          </div>
          <div className="mt-1 text-[11px] ui-text-faint">
            {gameAnalysisDone}/{gameAnalysisTotal} analyzed
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button
          className={[
            'px-2 py-1 rounded text-xs font-medium',
            isGameAnalysisRunning && gameAnalysisType === 'quick'
              ? 'ui-danger-soft border'
              : 'bg-[var(--ui-surface-2)] text-[var(--ui-text)] border border-[var(--ui-border)] hover:brightness-110',
          ].join(' ')}
          onClick={() => {
            if (isGameAnalysisRunning && gameAnalysisType === 'quick') stopGameAnalysis();
            else startQuickGameAnalysis();
          }}
        >
          {isGameAnalysisRunning && gameAnalysisType === 'quick'
            ? `Stop quick (${gameAnalysisDone}/${gameAnalysisTotal})`
            : 'Run quick graph'}
        </button>
        <button
          className={[
            'px-2 py-1 rounded text-xs font-medium',
            isGameAnalysisRunning && gameAnalysisType === 'fast'
              ? 'ui-danger-soft border'
              : 'bg-[var(--ui-surface-2)] text-[var(--ui-text)] border border-[var(--ui-border)] hover:brightness-110',
          ].join(' ')}
          onClick={() => {
            if (isGameAnalysisRunning && gameAnalysisType === 'fast') stopGameAnalysis();
            else startFastGameAnalysis();
          }}
        >
          {isGameAnalysisRunning && gameAnalysisType === 'fast'
            ? `Stop fast (${gameAnalysisDone}/${gameAnalysisTotal})`
            : 'Run fast MCTS'}
        </button>
        {isGameAnalysisRunning && (
          <button
            className="px-2 py-1 rounded text-xs font-medium ui-danger-soft border"
            onClick={stopGameAnalysis}
          >
            Stop
          </button>
        )}
        <div className="ml-auto flex items-center gap-2 text-xs">
          <button
            className="text-[var(--ui-text-muted)] hover:text-white"
            onClick={onOpenGameAnalysis}
          >
            Re-analyze…
          </button>
          <button
            className="text-[var(--ui-text-muted)] hover:text-white"
            onClick={onOpenGameReport}
          >
            Game report…
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-[var(--ui-border)]">
        <SectionHeader
          title="Score / Winrate Graph"
          open={modePanels.graphOpen}
          onToggle={() => updatePanels((current) => ({ graphOpen: !current.graphOpen }))}
        />
        {modePanels.graphOpen && (
          <div className="mt-2" style={{ height: 130 }}>
            <ScoreWinrateGraph showScore showWinrate />
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-[var(--ui-border)]">
        <SectionHeader
          title="Move Stats"
          open={modePanels.statsOpen}
          onToggle={() => updatePanels((current) => ({ statsOpen: !current.statsOpen }))}
        />
        {modePanels.statsOpen && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div className="px-2 py-1.5">
              <div className="text-[11px] ui-text-faint">Winrate</div>
              <div className="font-mono text-sm text-[var(--ui-success)]">
                {typeof winRate === 'number' ? `${(winRate * 100).toFixed(1)}%` : '-'}
              </div>
            </div>
            <div className="px-2 py-1.5">
              <div className="text-[11px] ui-text-faint">Score</div>
              <div className="font-mono text-sm text-[var(--ui-warning)]">
                {typeof scoreLead === 'number' ? `${scoreLead > 0 ? '+' : ''}${scoreLead.toFixed(1)}` : '-'}
              </div>
            </div>
            <div className="px-2 py-1.5">
              <div className="text-[11px] ui-text-faint">
                {pointsLost != null && pointsLost < 0 ? 'Gained' : 'Lost'}
              </div>
              <div className="font-mono text-sm text-[var(--ui-danger)]">
                {pointsLost != null ? Math.abs(pointsLost).toFixed(1) : '-'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
