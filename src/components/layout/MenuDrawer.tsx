import React from 'react';
import { FaTimes, FaPlay, FaSave, FaFolderOpen, FaCog } from 'react-icons/fa';

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onSave: () => void;
  onLoad: () => void;
  onSettings: () => void;
  isAiWhite: boolean;
  isAiBlack: boolean;
  onToggleAi: (color: 'white' | 'black') => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  open,
  onClose,
  onNewGame,
  onSave,
  onLoad,
  onSettings,
  isAiWhite,
  isAiBlack,
  onToggleAi,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-80 bg-slate-800 border-r border-slate-700/50 shadow-xl p-3 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Menu</div>
          <button className="text-slate-400 hover:text-white" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="space-y-1">
          <button
            className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-slate-700"
            onClick={() => {
              onNewGame();
              onClose();
            }}
          >
            <span className="flex items-center gap-2">
              <FaPlay /> New Game
            </span>
            <span className="text-xs text-slate-400">Ctrl+N</span>
          </button>
          <button
            className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-slate-700"
            onClick={() => {
              onSave();
              onClose();
            }}
          >
            <span className="flex items-center gap-2">
              <FaSave /> Save SGF
            </span>
            <span className="text-xs text-slate-400">Ctrl+S</span>
          </button>
          <button
            className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-slate-700"
            onClick={() => {
              onLoad();
              onClose();
            }}
          >
            <span className="flex items-center gap-2">
              <FaFolderOpen /> Load SGF
            </span>
            <span className="text-xs text-slate-400">Ctrl+L</span>
          </button>
          <button
            className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-slate-700"
            onClick={() => {
              onSettings();
              onClose();
            }}
          >
            <span className="flex items-center gap-2">
              <FaCog /> Settings
            </span>
            <span className="text-xs text-slate-400">F8</span>
          </button>
        </div>

        <div className="mt-4 border-t border-slate-700/50 pt-3 space-y-2">
          <div className="text-xs text-slate-400">Play vs AI</div>
          <div className="flex gap-2">
            <button
              className={[
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium',
                isAiWhite ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/30',
              ].join(' ')}
              onClick={() => onToggleAi('white')}
            >
              White AI
            </button>
            <button
              className={[
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium',
                isAiBlack ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/30',
              ].join(' ')}
              onClick={() => onToggleAi('black')}
            >
              Black AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
