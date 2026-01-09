import type { GameState } from "../types";
import { BOARD_SIZE } from "../types";

const coordinateToSgf = (x: number, y: number): string => {
  // SGF uses 'aa' for top left 0,0. 'sa' for 18,0. 'ss' for 18,18.
  // x corresponds to letter index 'a' + x.
  const aCode = 'a'.charCodeAt(0);
  const xChar = String.fromCharCode(aCode + x);
  const yChar = String.fromCharCode(aCode + y);
  return xChar + yChar;
};

export const generateSgf = (gameState: GameState): string => {
  const { moveHistory } = gameState;
  const date = new Date().toISOString().split('T')[0];

  let sgf = `(;GM[1]FF[4]CA[UTF-8]AP[WebKatrain:0.1]ST[2]\n`;
  sgf += `SZ[${BOARD_SIZE}]KM[6.5]\n`; // Komi hardcoded for now
  sgf += `DT[${date}]\n`;
  // Add other metadata?

  // Moves
  moveHistory.forEach(move => {
      const color = move.player === 'black' ? 'B' : 'W';
      let coords = '';
      if (move.x === -1) {
          coords = ''; // Pass is B[] or W[]
      } else {
          coords = coordinateToSgf(move.x, move.y);
      }
      sgf += `;${color}[${coords}]`;
  });

  sgf += `\n)`;

  return sgf;
};

export const downloadSgf = (gameState: GameState) => {
    const sgfContent = generateSgf(gameState);
    const blob = new Blob([sgfContent], { type: 'application/x-go-sgf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game_${new Date().getTime()}.sgf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
