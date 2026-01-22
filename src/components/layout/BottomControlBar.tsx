import React, { useEffect, useRef, useState } from 'react';
import {
  FaExclamationTriangle,
  FaStepBackward,
  FaFastBackward,
  FaChevronLeft,
  FaChevronRight,
  FaFastForward,
  FaStepForward,
  FaSyncAlt,
  FaEllipsisH,
} from 'react-icons/fa';
import type { Player, Move } from '../../types';
import { IconButton } from './ui';
import { STONE_SIZE } from './types';
import { publicUrl } from '../../utils/publicUrl';

interface BottomControlBarProps {
  passTurn: () => void;
  navigateBack: () => void;
  navigateForward: () => void;
  navigateStart: () => void;
  navigateEnd: () => void;
  findMistake: (dir: 'undo' | 'redo') => void;
  rotateBoard: () => void;
  currentPlayer: Player;
  moveHistory: Move[];
  isInsertMode: boolean;
  passPolicyColor: string | null;
  passPv: { idx: number; player: Player } | null;
  jumpBack: (n: number) => void;
  jumpForward: (n: number) => void;
  isMobile?: boolean;
}

export const BottomControlBar: React.FC<BottomControlBarProps> = ({
  passTurn,
  navigateBack,
  navigateForward,
  navigateStart,
  navigateEnd,
  findMistake,
  rotateBoard,
  currentPlayer,
  moveHistory,
  isInsertMode,
  passPolicyColor,
  passPv,
  jumpBack,
  jumpForward,
  isMobile = false,
}) => {
  const passBtnRef = useRef<HTMLButtonElement>(null);
  const [passBtnHeight, setPassBtnHeight] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const el = passBtnRef.current;
    if (!el) return;
    const update = () => setPassBtnHeight(el.getBoundingClientRect().height);
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const obs = new ResizeObserver(() => update());
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-bottom-more]')) return;
      setMoreOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [moreOpen]);

  if (isMobile) {
    return (
      <div className="ui-bar ui-bar-height ui-bar-pad border-t flex items-center gap-2 select-none">
        <div className="relative">
          {passPolicyColor && (
            <div
              className="absolute inset-y-0 left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
              style={{ height: '100%', aspectRatio: '1 / 1', backgroundColor: passPolicyColor }}
            />
          )}
          <button
            ref={passBtnRef}
            className="relative px-3 py-2 bg-[var(--ui-surface-2)] hover:brightness-110 rounded-lg text-xs font-medium text-[var(--ui-text)] transition-colors"
            onClick={passTurn}
            aria-label="Pass turn"
            title="Pass (P)"
          >
            Pass
          </button>
          {passPv && (
            <div
              className="absolute pointer-events-none flex items-center justify-center"
              style={{
                left: '100%',
                top: '50%',
                width: passBtnHeight > 0 ? passBtnHeight : 32,
                height: passBtnHeight > 0 ? passBtnHeight : 32,
                transform: 'translate(0, -50%)',
                zIndex: 20,
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url('${publicUrl(`katrain/${passPv.player === 'black' ? 'B_stone.png' : 'W_stone.png'}`)}')`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <div
                className="font-bold"
                style={{
                  color: passPv.player === 'black' ? 'white' : 'black',
                  fontSize: passBtnHeight > 0 ? passBtnHeight / (2 * STONE_SIZE * 1.55) : 12,
                  lineHeight: 1,
                }}
              >
                {passPv.idx}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center gap-1">
          <IconButton title="Back (←)" onClick={navigateBack} disabled={isInsertMode}>
            <FaChevronLeft />
          </IconButton>
          <div className="px-2 py-1 rounded-md bg-[var(--ui-surface)] border border-[var(--ui-border)] text-xs font-mono text-[var(--ui-text-muted)] flex items-center gap-1">
            <span className={currentPlayer === 'black' ? 'text-white font-semibold' : 'text-slate-500'}>B</span>
            <span className="text-slate-600">·</span>
            <span className={currentPlayer === 'white' ? 'text-white font-semibold' : 'text-slate-500'}>W</span>
            <span className="text-slate-600 mx-1">|</span>
            <span className="ui-text-faint">#{moveHistory.length}</span>
          </div>
          <IconButton title="Forward (→)" onClick={navigateForward} disabled={isInsertMode}>
            <FaChevronRight />
          </IconButton>
        </div>

        <div className="relative" data-bottom-more>
          <IconButton title="More controls" onClick={() => setMoreOpen((prev) => !prev)}>
            <FaEllipsisH />
          </IconButton>
          {moreOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-56 ui-panel border rounded-lg shadow-xl overflow-hidden z-50">
              <button
                className="w-full px-3 py-2 text-left hover:bg-[var(--ui-surface-2)] flex items-center justify-between"
                onClick={() => {
                  navigateStart();
                  setMoreOpen(false);
                }}
                disabled={isInsertMode}
              >
                <span className="flex items-center gap-2">
                  <FaStepBackward /> Start
                </span>
                <span className="text-xs ui-text-faint">Home</span>
              </button>
              <button
                className="w-full px-3 py-2 text-left hover:bg-[var(--ui-surface-2)] flex items-center justify-between"
                onClick={() => {
                  jumpBack(10);
                  setMoreOpen(false);
                }}
                disabled={isInsertMode}
              >
                <span className="flex items-center gap-2">
                  <FaFastBackward /> Back 10
                </span>
                <span className="text-xs ui-text-faint">Shift+←</span>
              </button>
              <button
                className="w-full px-3 py-2 text-left hover:bg-[var(--ui-surface-2)] flex items-center justify-between"
                onClick={() => {
                  jumpForward(10);
                  setMoreOpen(false);
                }}
                disabled={isInsertMode}
              >
                <span className="flex items-center gap-2">
                  <FaFastForward /> Forward 10
                </span>
                <span className="text-xs ui-text-faint">Shift+→</span>
              </button>
              <button
                className="w-full px-3 py-2 text-left hover:bg-[var(--ui-surface-2)] flex items-center justify-between"
                onClick={() => {
                  navigateEnd();
                  setMoreOpen(false);
                }}
                disabled={isInsertMode}
              >
                <span className="flex items-center gap-2">
                  <FaStepForward /> End
                </span>
                <span className="text-xs ui-text-faint">End</span>
              </button>
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--ui-border-strong)] to-transparent my-1" />
              <button
                className="w-full px-3 py-2 text-left hover:bg-[var(--ui-surface-2)] flex items-center justify-between text-[var(--ui-danger)]"
                onClick={() => {
                  findMistake('undo');
                  setMoreOpen(false);
                }}
                disabled={isInsertMode}
              >
                <span className="flex items-center gap-2">
                  <FaExclamationTriangle /> Prev mistake
                </span>
                <span className="text-xs ui-text-faint">N</span>
              </button>
              <button
                className="w-full px-3 py-2 text-left hover:bg-[var(--ui-surface-2)] flex items-center justify-between text-[var(--ui-danger)]"
                onClick={() => {
                  findMistake('redo');
                  setMoreOpen(false);
                }}
                disabled={isInsertMode}
              >
                <span className="flex items-center gap-2">
                  <FaExclamationTriangle /> Next mistake
                </span>
                <span className="text-xs ui-text-faint">Shift+N</span>
              </button>
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--ui-border-strong)] to-transparent my-1" />
              <button
                className="w-full px-3 py-2 text-left hover:bg-[var(--ui-surface-2)] flex items-center justify-between"
                onClick={() => {
                  rotateBoard();
                  setMoreOpen(false);
                }}
              >
                <span className="flex items-center gap-2">
                  <FaSyncAlt /> Rotate
                </span>
                <span className="text-xs ui-text-faint">O</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="ui-bar ui-bar-height ui-bar-pad border-t flex items-center gap-3 select-none">
      <div className="relative">
        {passPolicyColor && (
          <div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
            style={{ height: '100%', aspectRatio: '1 / 1', backgroundColor: passPolicyColor }}
          />
        )}
        <button
          ref={passBtnRef}
          className="relative px-4 py-2 bg-[var(--ui-surface-2)] hover:brightness-110 rounded-lg text-sm font-medium text-[var(--ui-text)] transition-colors"
          onClick={passTurn}
          aria-label="Pass turn"
          title="Pass (P)"
        >
          Pass
        </button>
        {passPv && (
          <div
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              left: '100%',
              top: '50%',
              width: passBtnHeight > 0 ? passBtnHeight : 32,
              height: passBtnHeight > 0 ? passBtnHeight : 32,
              transform: 'translate(0, -50%)',
              zIndex: 20,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${publicUrl(`katrain/${passPv.player === 'black' ? 'B_stone.png' : 'W_stone.png'}`)}')`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <div
              className="font-bold"
              style={{
                color: passPv.player === 'black' ? 'white' : 'black',
                fontSize: passBtnHeight > 0 ? passBtnHeight / (2 * STONE_SIZE * 1.45) : 14,
                lineHeight: 1,
              }}
            >
              {passPv.idx}
            </div>
          </div>
        )}
      </div>

      {/* Navigation controls */}
      <div className="flex-1 flex items-center justify-center gap-1">
        <IconButton
          title="Previous mistake (N)"
          onClick={() => findMistake('undo')}
          disabled={isInsertMode}
          className="text-[var(--ui-danger)] hover:text-[var(--ui-danger)]"
        >
          <FaExclamationTriangle />
        </IconButton>

        <div className="h-6 w-px bg-[var(--ui-border)] mx-0.5" />

        <IconButton title="Start (Home)" onClick={navigateStart} disabled={isInsertMode}>
          <FaStepBackward />
        </IconButton>
        <IconButton title="Back 10 (Shift+←)" onClick={() => jumpBack(10)} disabled={isInsertMode}>
          <FaFastBackward />
        </IconButton>
        <IconButton title="Back (←)" onClick={navigateBack}>
          <FaChevronLeft />
        </IconButton>

        {/* Move counter */}
        <div className="px-3 py-1.5 rounded-md bg-[var(--ui-surface)] border border-[var(--ui-border)] text-sm text-[var(--ui-text-muted)] font-mono flex items-center gap-2 min-w-[120px] justify-center">
          <span className={currentPlayer === 'black' ? 'text-white font-semibold' : 'text-slate-500'}>B</span>
          <span className="text-slate-600">·</span>
          <span className={currentPlayer === 'white' ? 'text-white font-semibold' : 'text-slate-500'}>W</span>
          <span className="text-slate-600 mx-1">|</span>
          <span className="ui-text-faint">Move</span>
          <span className="text-white font-semibold">{moveHistory.length}</span>
        </div>

        <IconButton title="Forward (→)" onClick={navigateForward} disabled={isInsertMode}>
          <FaChevronRight />
        </IconButton>
        <IconButton title="Forward 10 (Shift+→)" onClick={() => jumpForward(10)} disabled={isInsertMode}>
          <FaFastForward />
        </IconButton>
        <IconButton title="End (End)" onClick={navigateEnd} disabled={isInsertMode}>
          <FaStepForward />
        </IconButton>

        <div className="h-6 w-px bg-[var(--ui-border)] mx-0.5" />

        <IconButton
          title="Next mistake (Shift+N)"
          onClick={() => findMistake('redo')}
          disabled={isInsertMode}
          className="text-[var(--ui-danger)] hover:text-[var(--ui-danger)]"
        >
          <FaExclamationTriangle />
        </IconButton>
        <IconButton title="Rotate (O)" onClick={rotateBoard}>
          <FaSyncAlt />
        </IconButton>
      </div>

    </div>
  );
};
