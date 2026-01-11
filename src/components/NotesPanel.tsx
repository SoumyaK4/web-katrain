import React, { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { BOARD_SIZE, type CandidateMove, type Move, type Player } from '../types';

function moveToLabel(move: Move | null): string {
  if (!move) return 'Root';
  if (move.x < 0 || move.y < 0) return 'Pass';
  const col = String.fromCharCode(65 + (move.x >= 8 ? move.x + 1 : move.x));
  const row = BOARD_SIZE - move.y;
  return `${col}${row}`;
}

function playerToShort(player: Player): string {
  return player === 'black' ? 'B' : 'W';
}

function bestMoveFromCandidates(moves: CandidateMove[] | undefined): CandidateMove | null {
  if (!moves || moves.length === 0) return null;
  return moves.find((m) => m.order === 0) ?? moves[0] ?? null;
}

type PolicyMove = { prob: number; x: number; y: number; isPass: boolean };
function policyRanking(policy: number[]): PolicyMove[] {
  const out: PolicyMove[] = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const p = policy[y * BOARD_SIZE + x] ?? -1;
      if (p > 0) out.push({ prob: p, x, y, isPass: false });
    }
  }
  const pass = policy[BOARD_SIZE * BOARD_SIZE] ?? -1;
  if (pass > 0) out.push({ prob: pass, x: -1, y: -1, isPass: true });
  out.sort((a, b) => b.prob - a.prob);
  return out;
}

export const NotesPanel: React.FC = () => {
  const { currentNode, setCurrentNodeNote } = useGameStore();

  const move = currentNode.move;
  const parent = currentNode.parent;
  const parentPolicy = parent?.analysis?.policy;
  const depth = currentNode.gameState.moveHistory.length;
  const label = moveToLabel(move);
  const scoreLead = currentNode.analysis?.rootScoreLead;
  const winRate = currentNode.analysis?.rootWinRate;

  const pointsLost = useMemo(() => {
    if (!move || !parent) return null;
    const parentScore = parent.analysis?.rootScoreLead;
    const childScore = currentNode.analysis?.rootScoreLead;
    if (typeof parentScore !== 'number' || typeof childScore !== 'number') return null;
    return (move.player === 'black' ? 1 : -1) * (parentScore - childScore);
  }, [currentNode.analysis?.rootScoreLead, move, parent]);

  const policyStats = useMemo(() => {
    if (!move || !parentPolicy) return null;
    const policy = parentPolicy;
    const rankList = policyRanking(policy);
    if (rankList.length === 0) return null;

    const idx = move.x < 0 || move.y < 0 ? BOARD_SIZE * BOARD_SIZE : move.y * BOARD_SIZE + move.x;
    const prob = policy[idx] ?? -1;
    if (!(prob > 0)) return null;

    const rank =
      rankList.findIndex((m) =>
        move.x < 0 || move.y < 0 ? m.isPass : !m.isPass && m.x === move.x && m.y === move.y
      ) + 1;
    const best = rankList[0] ?? null;
    return { rank: rank > 0 ? rank : null, prob, best };
  }, [move, parentPolicy]);

  const topMove = useMemo(() => bestMoveFromCandidates(parent?.analysis?.moves), [parent?.analysis?.moves]);
  const topMoveLabel =
    topMove?.x == null
      ? null
      : topMove.x < 0 || topMove.y < 0
        ? 'Pass'
        : `${String.fromCharCode(65 + (topMove.x >= 8 ? topMove.x + 1 : topMove.x))}${BOARD_SIZE - topMove.y}`;

  return (
    <div className="flex-grow flex flex-col h-full">
      <div className="border-b border-gray-700 p-4">
        <h2 className="text-lg font-semibold mb-3">Notes</h2>
        <div className="text-xs text-gray-400 space-y-1">
          <div>
            Move <span className="font-mono text-gray-200">{depth}</span>: <span className="font-mono text-gray-200">{label}</span>{' '}
            {move ? `(${playerToShort(move.player)})` : ''}
          </div>
          <div>
            Score: <span className="font-mono text-gray-200">{typeof scoreLead === 'number' ? `${scoreLead > 0 ? '+' : ''}${scoreLead.toFixed(1)}` : '-'}</span>{' '}
            · Win% (B): <span className="font-mono text-gray-200">{typeof winRate === 'number' ? `${(winRate * 100).toFixed(1)}%` : '-'}</span>
          </div>
          <div>
            Points lost:{' '}
            <span className={`font-mono ${typeof pointsLost === 'number' ? (pointsLost > 0.5 ? 'text-red-300' : 'text-gray-200') : 'text-gray-500'}`}>
              {typeof pointsLost === 'number' ? `${pointsLost.toFixed(1)}` : '-'}
            </span>
          </div>
          {topMove && (
            <div>
              Top move: <span className="font-mono text-gray-200">{topMoveLabel}</span>{' '}
              <span className="font-mono text-gray-500">({topMove.scoreLead > 0 ? '+' : ''}{topMove.scoreLead.toFixed(1)})</span>
            </div>
          )}
          {topMove?.pv && topMove.pv.length > 0 && (
            <div className="text-gray-500">
              PV: <span className="font-mono text-gray-300">{move ? playerToShort(move.player) : ''} {topMove.pv.join(' ')}</span>
            </div>
          )}
          {policyStats && (
            <div className="text-gray-500">
              Policy rank: <span className="font-mono text-gray-300">#{policyStats.rank ?? '-'}</span>{' '}
              <span className="font-mono text-gray-400">({(policyStats.prob * 100).toFixed(2)}%)</span>
              {policyStats.best && policyStats.rank !== 1 && (
                <span className="ml-2">
                  best <span className="font-mono text-gray-300">{policyStats.best.isPass ? 'Pass' : moveToLabel({ x: policyStats.best.x, y: policyStats.best.y, player: move?.player ?? 'black' })}</span>{' '}
                  <span className="font-mono text-gray-400">({(policyStats.best.prob * 100).toFixed(2)}%)</span>
                </span>
              )}
            </div>
          )}
          {currentNode.autoUndo === true && <div className="text-purple-300">Teaching undo triggered for this move.</div>}
          {currentNode.aiThoughts && <div className="text-gray-500">AI thoughts: {currentNode.aiThoughts}</div>}
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col gap-2 overflow-y-auto">
        <label className="text-xs font-semibold text-gray-400">User Note (SGF C)</label>
        <textarea
          value={currentNode.note ?? ''}
          onChange={(e) => setCurrentNodeNote(e.target.value)}
          placeholder="Write a note for this position…"
          className="w-full flex-grow bg-gray-900 text-gray-100 rounded p-3 border border-gray-700 focus:border-green-500 outline-none text-sm font-mono resize-none"
        />
        <div className="text-[11px] text-gray-500">
          Saved to SGF `C` and KaTrain-style comment markers are preserved on export.
        </div>
      </div>
    </div>
  );
};
