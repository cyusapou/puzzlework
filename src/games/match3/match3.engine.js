// match3.engine.js

export const SIZE = 8;
export const TYPES = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍍'];

export const createGrid = () => {
  const grid = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => TYPES[Math.floor(Math.random() * TYPES.length)])
  );
  // Ensure no initial matches
  while (hasMatches(grid)) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (getMatch(grid, r, c)) {
          grid[r][c] = TYPES[Math.floor(Math.random() * TYPES.length)];
        }
      }
    }
  }
  return grid;
};

export const getMatch = (grid, r, c) => {
  const type = grid[r][c];
  if (!type) return null;

  // Horizontal
  let hMatch = [c];
  for (let i = c - 1; i >= 0 && grid[r][i] === type; i--) hMatch.push(i);
  for (let i = c + 1; i < SIZE && grid[r][i] === type; i++) hMatch.push(i);
  if (hMatch.length >= 3) return { type: 'horizontal', indices: hMatch };

  // Vertical
  let vMatch = [r];
  for (let i = r - 1; i >= 0 && grid[i][c] === type; i--) vMatch.push(i);
  for (let i = r + 1; i < SIZE && grid[i][c] === type; i++) vMatch.push(i);
  if (vMatch.length >= 3) return { type: 'vertical', indices: vMatch };

  return null;
};

export const hasMatches = (grid) => {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (getMatch(grid, r, c)) return true;
    }
  }
  return false;
};

export const swap = (grid, r1, c1, r2, c2) => {
  const newGrid = grid.map(row => [...row]);
  const temp = newGrid[r1][c1];
  newGrid[r1][c1] = newGrid[r2][c2];
  newGrid[r2][c2] = temp;
  return newGrid;
};
