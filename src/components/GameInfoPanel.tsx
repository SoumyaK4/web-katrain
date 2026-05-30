import React from 'react';
import { shallow } from 'zustand/shallow';
import { useGameStore } from '../store/gameStore';
import { DEFAULT_BOARD_SIZE, type GameSettings } from '../types';
import { getMaxHandicap, normalizeBoardSize } from '../utils/boardSize';

type GameInfoField = {
  key: string;
  label: string;
  placeholder: string;
  className?: string;
};

const playerFields: GameInfoField[] = [
  { key: 'PB', label: 'Black', placeholder: 'Black player' },
  { key: 'BR', label: 'Rank', placeholder: 'Rank' },
  { key: 'PW', label: 'White', placeholder: 'White player' },
  { key: 'WR', label: 'Rank', placeholder: 'Rank' },
];

const detailFields: GameInfoField[] = [
  { key: 'GN', label: 'Game', placeholder: 'Game name', className: 'sm:col-span-2' },
  { key: 'EV', label: 'Event', placeholder: 'Event', className: 'sm:col-span-2' },
  { key: 'DT', label: 'Date', placeholder: 'YYYY-MM-DD' },
  { key: 'PC', label: 'Place', placeholder: 'Location' },
  { key: 'RE', label: 'Result', placeholder: 'B+R, W+2.5' },
];

const inputClass =
  'w-full ui-input border rounded px-2 py-1.5 text-xs text-[var(--ui-text)] focus:border-[var(--ui-accent)] outline-none';

export const GameInfoPanel: React.FC = () => {
  const { rootNode, komi, gameRules, setKomi, setHandicap, setRootProperty, updateSettings, treeVersion } = useGameStore(
    (state) => ({
      rootNode: state.rootNode,
      komi: state.komi,
      gameRules: state.settings.gameRules,
      setKomi: state.setKomi,
      setHandicap: state.setHandicap,
      setRootProperty: state.setRootProperty,
      updateSettings: state.updateSettings,
      treeVersion: state.treeVersion,
    }),
    shallow
  );
  void treeVersion;

  const rootProps = rootNode.properties ?? {};
  const valueFor = (key: string) => rootProps[key]?.[0] ?? '';
  const boardSize = normalizeBoardSize(rootNode.gameState.board.length, DEFAULT_BOARD_SIZE);
  const maxHandicap = getMaxHandicap(boardSize);
  const rawHandicap = Number.parseInt(rootProps.HA?.[0] ?? '0', 10);
  const handicap = Number.isFinite(rawHandicap) ? Math.max(0, Math.min(rawHandicap, maxHandicap)) : 0;
  const [komiInput, setKomiInput] = React.useState(() => String(komi));
  const [isEditingKomi, setIsEditingKomi] = React.useState(false);
  const [handicapInput, setHandicapInput] = React.useState(() => String(handicap));
  const [isEditingHandicap, setIsEditingHandicap] = React.useState(false);

  React.useEffect(() => {
    if (!isEditingKomi) setKomiInput(String(komi));
  }, [isEditingKomi, komi]);

  React.useEffect(() => {
    if (!isEditingHandicap) setHandicapInput(String(handicap));
  }, [handicap, isEditingHandicap]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const commitKomi = () => {
    const parsed = Number(komiInput.trim());
    if (Number.isFinite(parsed)) {
      setKomi(parsed);
      setKomiInput(String(Number(parsed.toFixed(2))));
    } else {
      setKomiInput(String(komi));
    }
    setIsEditingKomi(false);
  };

  const handleKomiKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(e);
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setKomiInput(String(komi));
      setIsEditingKomi(false);
      e.currentTarget.blur();
    }
  };

  const commitHandicap = () => {
    const parsed = Number.parseInt(handicapInput.trim(), 10);
    if (Number.isFinite(parsed)) {
      const next = Math.max(0, Math.min(parsed, maxHandicap));
      setHandicap(next);
      setHandicapInput(String(next));
    } else {
      setHandicapInput(String(handicap));
    }
    setIsEditingHandicap(false);
  };

  const handleHandicapKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(e);
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setHandicapInput(String(handicap));
      setIsEditingHandicap(false);
      e.currentTarget.blur();
    }
  };

  const renderField = ({ key, label, placeholder, className }: GameInfoField) => (
    <label key={key} className={['min-w-0 space-y-1', className ?? ''].join(' ')}>
      <span className="block text-[10px] font-semibold uppercase tracking-wide ui-text-faint">
        {label}
      </span>
      <input
        value={valueFor(key)}
        onChange={(e) => setRootProperty(key, e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputClass}
        spellCheck={false}
      />
    </label>
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[minmax(0,1fr)_5rem] gap-2">
        {playerFields.map(renderField)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {detailFields.map(renderField)}
        <label className="min-w-0 space-y-1">
          <span className="block text-[10px] font-semibold uppercase tracking-wide ui-text-faint">
            Komi
          </span>
          <input
            value={komiInput}
            onChange={(e) => setKomiInput(e.target.value)}
            onFocus={() => setIsEditingKomi(true)}
            onBlur={commitKomi}
            onKeyDown={handleKomiKeyDown}
            placeholder="6.5"
            className={inputClass}
            inputMode="decimal"
            spellCheck={false}
          />
        </label>
        <label className="min-w-0 space-y-1">
          <span className="block text-[10px] font-semibold uppercase tracking-wide ui-text-faint">
            Handicap
          </span>
          <input
            value={handicapInput}
            onChange={(e) => setHandicapInput(e.target.value)}
            onFocus={() => setIsEditingHandicap(true)}
            onBlur={commitHandicap}
            onKeyDown={handleHandicapKeyDown}
            placeholder="0"
            className={inputClass}
            inputMode="numeric"
            min={0}
            max={maxHandicap}
            spellCheck={false}
          />
        </label>
        <label className="min-w-0 space-y-1">
          <span className="block text-[10px] font-semibold uppercase tracking-wide ui-text-faint">
            Rules
          </span>
          <select
            value={gameRules}
            onChange={(e) => updateSettings({ gameRules: e.target.value as GameSettings['gameRules'] })}
            onKeyDown={handleKeyDown}
            className={inputClass}
          >
            <option value="japanese">Japanese</option>
            <option value="chinese">Chinese</option>
            <option value="korean">Korean</option>
          </select>
        </label>
      </div>
    </div>
  );
};
