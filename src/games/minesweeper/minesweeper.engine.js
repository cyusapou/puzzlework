// minesweeper.engine.js

export const createGrid = (w, h, mineCount) => {
  const grid = Array.from({ length: h }, () =>
    Array.from({ length: w }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborCount: 0
    }))
  );

  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const r = Math.floor(Math.random() * h);
    const c = Math.floor(Math.random() * w);
    if (!grid[r][c].isMine) {
      grid[r][c].isMine = true;
      minesPlaced++;
    }
  }

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (!grid[r][c].isMine) {
        grid[r][c].neighborCount = countMines(grid, r, c);
      }
    }
  }
  return grid;
};

const countMines = (grid, r, c) => {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
        if (grid[nr][nc].isMine) count++;
      }
    }
  }
  return count;
};

export const revealCell = (grid, r, c) => {
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

  grid[r][c].isRevealed = true;

  if (grid[r][c].neighborCount === 0 && !grid[r][c].isMine) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        revealCell(grid, r + dr, c + dc);
      }
    }
  }
};
