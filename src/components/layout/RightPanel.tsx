import React from 'react';
import { FaTimes } from 'react-icons/fa';
import type { Player, GameNode, Move } from '../../types';
import { useGameStore } from '../../store/gameStore';
import { ScoreWinrateGraph } from '../ScoreWinrateGraph';
import { MoveTree } from '../MoveTree';
import { NotesPanel } from '../NotesPanel';
import { Timer } from '../Timer';
import type { UiMode, UiState } from './types';
import { PanelHeaderButton, formatMoveLabel, playerToShort } from './ui';

interface RightPanelProps {
  open: boolean;
  onClose: () => void;
  width?: number;
  mode: UiMode;
  setMode: (m: UiMode) => void;
  modePanels: UiState['panels'][UiMode];
  updatePanels: (partial: Partial<UiState['panels'][UiMode]>) => void;
  // Player info
  currentPlayer: Player;
  isAiPlaying: boolean;
  aiColor: Player | null;
  capturedBlack: number;
  capturedWhite: number;
  // Timer/game
  komi: number;
  endResult: string | null;
  // Navigation
  navigateBack: () => void;
  resign: () => void;
  toggleAi: (color: Player) => void;
  toast: (msg: string, type: 'info' | 'error' | 'success') => void;
  // Analysis
  winRate: number | null;
  scoreLead: number | null;
  pointsLost: number | null;
  // Engine status
  engineDot: string;
  engineMeta: string;
  engineMetaTitle: string | undefined;
  engineError: string | null;
  statusText: string;
  lockAiDetails: boolean;
  // Notes
  currentNode: GameNode;
  moveHistory: Move[];
}

export const RightPanel: React.FC<RightPanelProps> = ({
  open,
  onClose,
  width,
  mode,
  setMode,
  modePanels,
  updatePanels,
  currentPlayer,
  isAiPlaying,
  aiColor,
  capturedBlack,
  capturedWhite,
  komi,
  endResult,
  navigateBack,
  resign,
  toggleAi,
  toast,
  winRate,
  scoreLead,
  pointsLost,
  engineDot,
  engineMeta,
  engineMetaTitle,
  engineError,
  statusText,
  lockAiDetails,
  currentNode,
  moveHistory,
}) => {
  const isAiBlack = isAiPlaying && aiColor === 'black';
  const isAiWhite = isAiPlaying && aiColor === 'white';

  const renderPlayerInfo = (player: Player) => {
    const isTurn = currentPlayer === player;
    const isAi = isAiPlaying && aiColor === player;
    const caps = player === 'black' ? capturedWhite : capturedBlack;

    return (
      <div
        className={[
          'flex-1 rounded-lg px-3 py-2 flex items-center gap-3 shadow-lg shadow-black/20',
          isTurn ? 'bg-slate-700/90 border border-slate-500/50' : 'bg-slate-800/50 border border-slate-700/30',
        ].join(' ')}
      >
        <div
          className={[
            'h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-md',
            player === 'black' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900',
          ].join(' ')}
          title={player === 'black' ? 'Black' : 'White'}
        >
          {caps}
        </div>
        <div className="flex flex-col leading-tight">
          <div className="text-xs text-slate-400">{player === 'black' ? 'Black' : 'White'}</div>
          <div className="text-sm font-semibold text-slate-100">{isAi ? 'AI' : 'Human'}</div>
        </div>
        {isTurn && <div className="ml-auto text-xs font-mono text-emerald-400">to play</div>}
      </div>
    );
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={[
          'bg-slate-800 border-l border-slate-700/50 flex flex-col',
          'fixed inset-y-0 right-0 z-40 w-full max-w-md',
          open ? 'flex' : 'hidden',
          'lg:static lg:flex lg:max-w-none lg:z-auto',
        ].join(' ')}
        style={width ? { width } : undefined}
      >
        {/* Play / Analyze tabs */}
        <div className="h-14 border-b border-slate-700/50 flex items-center p-2 gap-2">
          <button
            type="button"
            className="lg:hidden h-10 w-10 flex items-center justify-center rounded hover:bg-slate-700 text-slate-300 hover:text-white"
            onClick={onClose}
            title="Close side panel"
          >
            <FaTimes />
          </button>
          <button
            className={[
              'flex-1 h-10 rounded font-semibold border',
              mode === 'play' ? 'bg-blue-600/30 border-blue-500 text-white' : 'bg-slate-900 border-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white',
            ].join(' ')}
            onClick={() => setMode('play')}
          >
            Play
          </button>
          <button
            className={[
              'flex-1 h-10 rounded font-semibold border',
              mode === 'analyze'
                ? 'bg-blue-600/30 border-blue-500 text-white'
                : 'bg-slate-900 border-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white',
            ].join(' ')}
            onClick={() => setMode('analyze')}
          >
            Analysis
          </button>
        </div>

        {/* Players */}
        <div className="p-3 flex gap-2">{renderPlayerInfo('black')}{renderPlayerInfo('white')}</div>

        {/* Timer / MoveTree area */}
        <div className="px-3 pb-3">
          {mode === 'play' ? (
            <div className="bg-slate-900 border border-slate-700/50 rounded p-3">
              <Timer />
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">Komi</div>
                <div className="font-mono text-sm text-slate-200">{komi}</div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-slate-400">Captured</div>
                <div className="font-mono text-sm text-slate-200">
                  B:{capturedWhite} · W:{capturedBlack}
                </div>
              </div>
              {endResult && (
                <div className="flex items-center justify-between mt-1">
                  <div className="text-xs text-slate-400">Result</div>
                  <div className="font-mono text-sm text-slate-200">{endResult}</div>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-700/80 hover:bg-slate-600/80 text-sm font-medium text-slate-200"
                  onClick={() => {
                    const st = useGameStore.getState();
                    const lastMover = st.currentNode.move?.player ?? null;
                    const shouldUndoTwice = !!st.isAiPlaying && !!st.aiColor && lastMover === st.aiColor && st.currentPlayer !== st.aiColor;
                    navigateBack();
                    if (shouldUndoTwice) navigateBack();
                  }}
                  title="Undo (←)"
                >
                  Undo
                </button>
                <button
                  className="flex-1 px-3 py-2 rounded-lg bg-rose-900/40 hover:bg-rose-800/50 text-sm font-medium text-rose-200"
                  onClick={() => {
                    const result = currentPlayer === 'black' ? 'W+R' : 'B+R';
                    resign();
                    toast(`Result: ${result}`, 'info');
                  }}
                >
                  Resign
                </button>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  className={[
                    'flex-1 px-3 py-2 rounded-lg text-sm font-medium',
                    isAiWhite ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/30',
                  ].join(' ')}
                  onClick={() => toggleAi('white')}
                >
                  White AI
                </button>
                <button
                  className={[
                    'flex-1 px-3 py-2 rounded-lg text-sm font-medium',
                    isAiBlack ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/30',
                  ].join(' ')}
                  onClick={() => toggleAi('black')}
                >
                  Black AI
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-700/50 rounded overflow-hidden h-44">
              <MoveTree />
            </div>
          )}
        </div>

        {/* Graph panel */}
        <div className="px-3">
          <div className="flex items-center justify-between">
            <button
              className="text-sm font-semibold text-slate-200 hover:text-white"
              onClick={() => updatePanels({ graphOpen: !modePanels.graphOpen })}
            >
              Score / Winrate Graph
            </button>
            <div className="flex gap-1">
              <PanelHeaderButton
                label="Score"
                colorClass="bg-blue-600/30"
                active={modePanels.graph.score}
                onClick={() =>
                  updatePanels({ graph: { ...modePanels.graph, score: !modePanels.graph.score } })
                }
              />
              <PanelHeaderButton
                label="Win%"
                colorClass="bg-green-600/30"
                active={modePanels.graph.winrate}
                onClick={() =>
                  updatePanels({ graph: { ...modePanels.graph, winrate: !modePanels.graph.winrate } })
                }
              />
            </div>
          </div>
          {modePanels.graphOpen && (
            <div className="mt-2 bg-slate-900 border border-slate-700/50 rounded p-2">
              {modePanels.graph.score || modePanels.graph.winrate ? (
                <div style={{ height: 140 }}>
                  <ScoreWinrateGraph showScore={modePanels.graph.score} showWinrate={modePanels.graph.winrate} />
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center text-slate-500 text-sm">Graph hidden</div>
              )}
            </div>
          )}
        </div>

        {/* Stats panel */}
        <div className="px-3 mt-3">
          <div className="flex items-center justify-between">
            <button
              className="text-sm font-semibold text-slate-200 hover:text-white"
              onClick={() => updatePanels({ statsOpen: !modePanels.statsOpen })}
            >
              Move Stats
            </button>
            <div className="flex gap-1">
              <PanelHeaderButton
                label="Score"
                colorClass="bg-blue-600/30"
                active={modePanels.stats.score}
                onClick={() =>
                  updatePanels({ stats: { ...modePanels.stats, score: !modePanels.stats.score } })
                }
              />
              <PanelHeaderButton
                label="Win%"
                colorClass="bg-green-600/30"
                active={modePanels.stats.winrate}
                onClick={() =>
                  updatePanels({ stats: { ...modePanels.stats, winrate: !modePanels.stats.winrate } })
                }
              />
              <PanelHeaderButton
                label="Pts"
                colorClass="bg-red-600/30"
                active={modePanels.stats.points}
                onClick={() =>
                  updatePanels({ stats: { ...modePanels.stats, points: !modePanels.stats.points } })
                }
              />
            </div>
          </div>
          {modePanels.statsOpen && (
            <div className="mt-2 bg-slate-900 border border-slate-700/50 rounded overflow-hidden">
              {modePanels.stats.winrate && (
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
                  <div className="text-sm text-slate-300">Winrate</div>
                  <div className="font-mono text-sm text-green-300">
                    {typeof winRate === 'number' ? `${(winRate * 100).toFixed(1)}%` : '-'}
                  </div>
                </div>
              )}
              {modePanels.stats.score && (
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
                  <div className="text-sm text-slate-300">Score</div>
                  <div className="font-mono text-sm text-blue-300">
                    {typeof scoreLead === 'number' ? `${scoreLead > 0 ? '+' : ''}${scoreLead.toFixed(1)}` : '-'}
                  </div>
                </div>
              )}
              {modePanels.stats.points && (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-sm text-slate-300">{pointsLost != null && pointsLost < 0 ? 'Points gained' : 'Points lost'}</div>
                  <div className="font-mono text-sm text-red-300">{pointsLost != null ? Math.abs(pointsLost).toFixed(1) : '-'}</div>
                </div>
              )}
              {!modePanels.stats.winrate && !modePanels.stats.score && !modePanels.stats.points && (
                <div className="px-3 py-3 text-sm text-slate-500">Stats hidden</div>
              )}
            </div>
          )}
        </div>

        {/* Notes panel */}
        <div className="px-3 mt-3 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between">
            <button
              className="text-sm font-semibold text-slate-200 hover:text-white"
              onClick={() => updatePanels({ notesOpen: !modePanels.notesOpen })}
            >
              Info & Notes
            </button>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <PanelHeaderButton
                  label="Info"
                  colorClass="bg-slate-700"
                  active={modePanels.notes.info}
                  onClick={() => updatePanels({ notes: { ...modePanels.notes, info: !modePanels.notes.info } })}
                />
                <PanelHeaderButton
                  label="Details"
                  colorClass="bg-slate-700"
                  active={modePanels.notes.infoDetails}
                  onClick={() =>
                    updatePanels({ notes: { ...modePanels.notes, infoDetails: !modePanels.notes.infoDetails } })
                  }
                />
                <PanelHeaderButton
                  label="Notes"
                  colorClass="bg-purple-600/30"
                  active={modePanels.notes.notes}
                  onClick={() => updatePanels({ notes: { ...modePanels.notes, notes: !modePanels.notes.notes } })}
                />
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span className={['inline-block h-2.5 w-2.5 rounded-full', engineDot].join(' ')} />
                <span title={engineMetaTitle}>{engineMeta}</span>
              </div>
            </div>
          </div>
          {modePanels.notesOpen && (
            <div className="mt-2 bg-slate-900 border border-slate-700/50 rounded flex-1 min-h-0 overflow-hidden flex flex-col">
              <div className="px-3 py-2 border-b border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <div className="truncate">
                  <span className="font-mono">{playerToShort(currentPlayer)}</span> ·{' '}
                  <span className="font-mono">{moveHistory.length}</span> ·{' '}
                  <span className="font-mono">{currentNode.move ? formatMoveLabel(currentNode.move.x, currentNode.move.y) : 'Root'}</span>
                </div>
                {engineError && <span className="text-red-300">error</span>}
              </div>
              <div className="px-3 py-2 border-b border-slate-800 text-xs text-slate-400">
                {statusText}
              </div>
              <div className="flex-1 min-h-0">
                <NotesPanel
                  showInfo={modePanels.notes.info || modePanels.notes.infoDetails}
                  detailed={modePanels.notes.infoDetails && !lockAiDetails}
                  showNotes={modePanels.notes.notes}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
