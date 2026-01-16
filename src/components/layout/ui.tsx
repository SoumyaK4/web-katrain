import React from 'react';

export function rgba(color: readonly [number, number, number, number], alphaOverride?: number): string {
  const a = typeof alphaOverride === 'number' ? alphaOverride : color[3];
  return `rgba(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)}, ${a})`;
}

export const IconButton: React.FC<{
  title: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ title, onClick, disabled, className, children }) => {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={[
        'h-10 w-10 flex items-center justify-center rounded',
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-700 text-slate-300 hover:text-white',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  );
};

export const TogglePill: React.FC<{
  label: string;
  shortcut?: string;
  active: boolean;
  disabled?: boolean;
  onToggle: () => void;
}> = ({ label, shortcut, active, disabled, onToggle }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={[
        'px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2',
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-700/50',
        active ? 'bg-slate-700/80 text-white' : 'bg-slate-800/50 text-slate-400',
      ].join(' ')}
      title={shortcut ? `${label} (${shortcut})` : label}
    >
      <span
        className={[
          'inline-block h-2.5 w-2.5 rounded-full',
          active ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-600',
        ].join(' ')}
      />
      <span>{shortcut ? `${shortcut} ${label}` : label}</span>
    </button>
  );
};

export const PanelHeaderButton: React.FC<{
  label: string;
  colorClass: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, colorClass, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-2 py-1 rounded text-xs font-semibold border',
        active ? `${colorClass} border-slate-500 text-white` : 'bg-slate-900 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700',
      ].join(' ')}
    >
      {label}
    </button>
  );
};

export function formatMoveLabel(x: number, y: number): string {
  if (x < 0 || y < 0) return 'Pass';
  const col = String.fromCharCode(65 + (x >= 8 ? x + 1 : x));
  const row = 19 - y;
  return `${col}${row}`;
}

export function playerToShort(p: 'black' | 'white'): string {
  return p === 'black' ? 'B' : 'W';
}
