// tictactoe.engine.js
export const checkWin = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.includes(null) ? null : 'draw';
};

// connect4.engine.js
export const ROWS = 6;
export const COLS = 7;
export const checkWinC4 = (board) => {
  const checkLine = (r, c, dr, dc) => {
    const color = board[r][c];
    if (!color) return false;
    for (let i = 1; i < 4; i++) {
      const nr = r + dr * i, nc = c + dc * i;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== color) return false;
    }
    return true;
  };
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (checkLine(r, c, 0, 1) || checkLine(r, c, 1, 0) || checkLine(r, c, 1, 1) || checkLine(r, c, 1, -1)) return board[r][c];
    }
  }
  return null;
};
