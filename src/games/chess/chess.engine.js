// chess.engine.js

export const PIECES = {
  white: {
    p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔'
  },
  black: {
    p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚'
  }
};

export const createBoard = () => {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));

  const setupRow = (row, color, isBackRow) => {
    const pieces = isBackRow ? ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'] : Array(8).fill('p');
    pieces.forEach((type, col) => {
      board[row][col] = { type, color, char: PIECES[color][type] };
    });
  };

  setupRow(0, 'black', true);
  setupRow(1, 'black', false);
  setupRow(6, 'white', false);
  setupRow(7, 'white', true);

  return board;
};

export const isValidMove = (board, from, to, turn) => {
  const piece = board[from.r][from.c];
  if (!piece || piece.color !== turn) return false;

  const target = board[to.r][to.c];
  if (target && target.color === turn) return false;

  const dr = to.r - from.r;
  const dc = to.c - from.c;

  // Simple move validation (incomplete but functional for basic play)
  switch (piece.type) {
    case 'p':
      const dir = piece.color === 'white' ? -1 : 1;
      if (dc === 0 && !target) {
        if (dr === dir) return true;
        if (dr === 2 * dir && (from.r === 1 || from.r === 6) && !board[from.r + dir][from.c]) return true;
      }
      if (Math.abs(dc) === 1 && dr === dir && target) return true;
      break;
    case 'r':
      if (dr === 0 || dc === 0) return isPathClear(board, from, to);
      break;
    case 'n':
      if ((Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2)) return true;
      break;
    case 'b':
      if (Math.abs(dr) === Math.abs(dc)) return isPathClear(board, from, to);
      break;
    case 'q':
      if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) return isPathClear(board, from, to);
      break;
    case 'k':
      if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1) return true;
      break;
  }
  return false;
};

const isPathClear = (board, from, to) => {
  const dr = Math.sign(to.r - from.r);
  const dc = Math.sign(to.c - from.c);
  let r = from.r + dr;
  let c = from.c + dc;
  while (r !== to.r || c !== to.c) {
    if (board[r][c]) return false;
    r += dr;
    c += dc;
  }
  return true;
};
