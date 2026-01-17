import React from 'react';
import type { GameRules } from '../types';

interface NewGameModalProps {
  onClose: () => void;
  onStart: (opts: { komi: number; rules: GameRules }) => void;
  defaultKomi: number;
  defaultRules: GameRules;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  onClose,
  onStart,
  defaultKomi,
  defaultRules,
}) => {
  const [komi, setKomi] = React.useState(() => defaultKomi);
  const [rules, setRules] = React.useState<GameRules>(() => defaultRules);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-800 rounded-lg shadow-xl w-96 max-w-[90vw] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-white">New Game</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 text-sm">Board Size</label>
              <input
                value="19"
                disabled
                className="w-full bg-slate-700/50 text-slate-400 rounded px-2 py-2 text-sm border border-slate-700/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 text-sm">Rules</label>
              <select
                value={rules}
                onChange={(e) => setRules(e.target.value as GameRules)}
                className="w-full bg-slate-700 text-white rounded px-2 py-2 text-sm border border-slate-600"
              >
                <option value="japanese">Japanese</option>
                <option value="chinese">Chinese</option>
                <option value="korean">Korean</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-slate-300 text-sm">Komi</label>
            <input
              type="number"
              step="0.5"
              value={komi}
              onChange={(e) => setKomi(Number(e.target.value))}
              className="w-full bg-slate-700 text-white rounded px-2 py-2 text-sm border border-slate-600"
            />
          </div>
          <div className="text-xs text-slate-400">
            Start a new 19×19 game with the selected rules and komi.
          </div>
        </div>
        <div className="px-4 py-3 border-t border-slate-700/50 flex justify-end gap-2">
          <button
            className="px-3 py-2 rounded bg-slate-700 text-slate-200 hover:bg-slate-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-2 rounded bg-emerald-600/80 text-white hover:bg-emerald-500"
            onClick={() => onStart({ komi: Number.isFinite(komi) ? komi : defaultKomi, rules })}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

