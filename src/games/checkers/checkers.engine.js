// checkers.engine.js

export const createBoard = () => {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) {
        if (r < 3) board[r][c] = { color: 'black', isKing: false };
        if (r > 4) board[r][c] = { color: 'white', isKing: false };
      }
    }
  }
  return board;
};

export const isValidMove = (board, from, to, turn) => {
  const piece = board[from.r][from.c];
  if (!piece || piece.color !== turn) return false;
  if ((to.r + to.c) % 2 === 0 || board[to.r][to.c]) return false;

  const dr = to.r - from.r;
  const dc = Math.abs(to.c - from.c);

  // Normal move
  if (dc === 1) {
    if (piece.isKing) return Math.abs(dr) === 1;
    return turn === 'white' ? dr === -1 : dr === 1;
  }

  // Jump move
  if (dc === 2 && Math.abs(dr) === 2) {
    const midR = (from.r + to.r) / 2;
    const midC = (from.c + to.c) / 2;
    const midPiece = board[midR][midC];
    if (midPiece && midPiece.color !== turn) {
      if (piece.isKing) return true;
      return turn === 'white' ? dr === -2 : dr === 2;
    }
  }

  return false;
};
