import { BOARD_SIZE, type BoardState, type Player } from '../types';

export const getOpponent = (player: Player): Player => player === 'black' ? 'white' : 'black';

export const getLiberties = (board: BoardState, x: number, y: number): { liberties: number, group: {x: number, y: number}[] } => {
  const player = board[y][x];
  if (!player) return { liberties: 0, group: [] };

  const group: {x: number, y: number}[] = [];
  const visited = new Set<string>();
  const liberties = new Set<string>();
  const stack = [{x, y}];

  visited.add(`${x},${y}`);
  group.push({x, y});

  while (stack.length > 0) {
    const current = stack.pop()!;
    const neighbors = [
      {x: current.x + 1, y: current.y},
      {x: current.x - 1, y: current.y},
      {x: current.x, y: current.y + 1},
      {x: current.x, y: current.y - 1},
    ];

    for (const n of neighbors) {
      if (n.x < 0 || n.x >= BOARD_SIZE || n.y < 0 || n.y >= BOARD_SIZE) continue;

      const key = `${n.x},${n.y}`;
      const content = board[n.y][n.x];

      if (content === null) {
        liberties.add(key);
      } else if (content === player && !visited.has(key)) {
        visited.add(key);
        group.push(n);
        stack.push(n);
      }
    }
  }

  return { liberties: liberties.size, group };
};

export const checkCaptures = (board: BoardState, x: number, y: number, player: Player): { captured: {x: number, y: number}[], newBoard: BoardState } => {
  const opponent = getOpponent(player);
  const neighbors = [
    {x: x + 1, y},
    {x: x - 1, y},
    {x, y: y + 1},
    {x, y: y - 1},
  ];

  let captured: {x: number, y: number}[] = [];
  const newBoard = board.map(row => [...row]);

  for (const n of neighbors) {
    if (n.x < 0 || n.x >= BOARD_SIZE || n.y < 0 || n.y >= BOARD_SIZE) continue;

    if (newBoard[n.y][n.x] === opponent) {
      const { liberties, group } = getLiberties(newBoard, n.x, n.y);
      if (liberties === 0) {
        captured.push(...group);
        for (const stone of group) {
          newBoard[stone.y][stone.x] = null;
        }
      }
    }
  }

  return { captured, newBoard };
};
