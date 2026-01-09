import React from 'react';
import { useGameStore } from '../store/gameStore';
import { BOARD_SIZE } from '../types';

export const GoBoard: React.FC = () => {
  const { board, playMove } = useGameStore();
  const cellSize = 30; // pixels
  const boardSizePixels = cellSize * (BOARD_SIZE + 1);
  const padding = 30;

  // Hoshi points for 19x19
  const hoshiPoints = [
    [3, 3], [3, 9], [3, 15],
    [9, 3], [9, 9], [9, 15],
    [15, 3], [15, 9], [15, 15]
  ];

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - padding;
    const y = e.clientY - rect.top - padding;

    // Use Math.round to find the nearest intersection
    const col = Math.round(x / cellSize);
    const row = Math.round(y / cellSize);

    if (col >= 0 && col < BOARD_SIZE && row >= 0 && row < BOARD_SIZE) {
      playMove(col, row);
    }
  };

  return (
    <div
      className="relative bg-[#DCB35C] shadow-lg rounded-sm cursor-pointer select-none"
      style={{ width: boardSizePixels, height: boardSizePixels }}
      onClick={handleClick}
    >
      {/* Grid Lines */}
      {Array.from({ length: BOARD_SIZE }).map((_, i) => (
        <React.Fragment key={i}>
          {/* Vertical lines */}
          <div
            className="absolute bg-black"
            style={{
              left: padding + i * cellSize,
              top: padding,
              width: 1,
              height: cellSize * (BOARD_SIZE - 1)
            }}
          />
          {/* Horizontal lines */}
          <div
            className="absolute bg-black"
            style={{
              left: padding,
              top: padding + i * cellSize,
              width: cellSize * (BOARD_SIZE - 1),
              height: 1
            }}
          />
        </React.Fragment>
      ))}

      {/* Hoshi Points */}
      {hoshiPoints.map(([hx, hy], idx) => (
        <div
          key={`hoshi-${idx}`}
          className="absolute bg-black rounded-full"
          style={{
            width: 8,
            height: 8,
            left: padding + hx * cellSize - 4,
            top: padding + hy * cellSize - 4,
          }}
        />
      ))}

      {/* Stones */}
      {board.map((row, y) =>
        row.map((cell, x) => {
          if (!cell) return null;
          return (
            <div
              key={`${x}-${y}`}
              className={`absolute rounded-full shadow-md ${
                cell === 'black'
                  ? 'bg-black radial-gradient-black'
                  : 'bg-white radial-gradient-white'
              }`}
              style={{
                width: cellSize - 2,
                height: cellSize - 2,
                left: padding + x * cellSize - (cellSize / 2) + 1,
                top: padding + y * cellSize - (cellSize / 2) + 1,
              }}
            />
          );
        })
      )}

      {/* Hover Indicator (Optional) */}

    </div>
  );
};
