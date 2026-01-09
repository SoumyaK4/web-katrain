import React from 'react';
import { useGameStore } from '../store/gameStore';
import { BOARD_SIZE } from '../types';

export const GoBoard: React.FC = () => {
  const { board, playMove, moveHistory } = useGameStore();
  const cellSize = 30; // pixels
  const padding = 30;
  // Increase board size to accommodate coordinates
  const boardSizePixels = cellSize * (BOARD_SIZE + 1) + padding; // Extra padding for coords

  // Hoshi points for 19x19
  const hoshiPoints = [
    [3, 3], [3, 9], [3, 15],
    [9, 3], [9, 9], [9, 15],
    [15, 3], [15, 9], [15, 15]
  ];

  // Coordinates
  const xLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
  const yLabels = Array.from({ length: 19 }, (_, i) => 19 - i);

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

  const lastMove = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;

  return (
    <div
      className="relative bg-[#DCB35C] shadow-lg rounded-sm cursor-pointer select-none"
      style={{ width: boardSizePixels, height: boardSizePixels }}
      onClick={handleClick}
    >
      {/* Coordinates */}
      {/* Top Labels */}
      {xLabels.map((label, i) => (
        <div
           key={`top-${i}`}
           className="absolute text-xs font-bold text-black"
           style={{
             left: padding + i * cellSize - 4,
             top: 5,
             width: 10,
             textAlign: 'center'
           }}
        >
          {label}
        </div>
      ))}
      {/* Bottom Labels */}
      {xLabels.map((label, i) => (
         <div
            key={`bottom-${i}`}
            className="absolute text-xs font-bold text-black"
            style={{
              left: padding + i * cellSize - 4,
              bottom: 5,
              width: 10,
              textAlign: 'center'
            }}
         >
           {label}
         </div>
       ))}
       {/* Left Labels */}
       {yLabels.map((label, i) => (
         <div
            key={`left-${i}`}
            className="absolute text-xs font-bold text-black"
            style={{
              left: 5,
              top: padding + i * cellSize - 8,
              width: 15,
              textAlign: 'center'
            }}
         >
           {label}
         </div>
       ))}
       {/* Right Labels */}
       {yLabels.map((label, i) => (
         <div
            key={`right-${i}`}
            className="absolute text-xs font-bold text-black"
            style={{
              right: 5,
              top: padding + i * cellSize - 8,
              width: 15,
              textAlign: 'center'
            }}
         >
           {label}
         </div>
       ))}


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
          const isLastMove = lastMove && lastMove.x === x && lastMove.y === y;
          return (
            <div
              key={`${x}-${y}`}
              className={`absolute rounded-full shadow-md flex items-center justify-center ${
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
            >
              {isLastMove && (
                 <div className={`w-3 h-3 rounded-full border-2 ${cell === 'black' ? 'border-white' : 'border-black'}`} />
              )}
            </div>
          );
        })
      )}

    </div>
  );
};
