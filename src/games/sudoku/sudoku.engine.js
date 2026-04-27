// sudoku.engine.js

export const SIZE = 9;
export const BOX_SIZE = 3;

export const createEmptyGrid = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

export const isValid = (grid, r, c, val) => {
  for (let i = 0; i < SIZE; i++) {
    if (grid[r][i] === val || grid[i][c] === val) return false;
  }
  const startR = Math.floor(r / BOX_SIZE) * BOX_SIZE;
  const startC = Math.floor(c / BOX_SIZE) * BOX_SIZE;
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (grid[startR + i][startC + j] === val) return false;
    }
  }
  return true;
};

export const solve = (grid) => {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) {
        for (let val = 1; val <= 9; val++) {
          if (isValid(grid, r, c, val)) {
            grid[r][c] = val;
            if (solve(grid)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

export const generatePuzzle = (difficulty = 'easy') => {
  const grid = createEmptyGrid();
  // Fill diagonal boxes first to speed up solving
  for (let i = 0; i < SIZE; i += BOX_SIZE) {
    fillBox(grid, i, i);
  }
  solve(grid);
  
  const solution = grid.map(row => [...row]);
  const puzzle = grid.map(row => [...row]);
  
  let attempts = {
    easy: 30,
    medium: 45,
    hard: 55,
    expert: 60
  }[difficulty] || 30;

  while (attempts > 0) {
    let r = Math.floor(Math.random() * SIZE);
    let c = Math.floor(Math.random() * SIZE);
    while (puzzle[r][c] === 0) {
      r = Math.floor(Math.random() * SIZE);
      c = Math.floor(Math.random() * SIZE);
    }
    
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;
    
    // Check for unique solution (simplified for now)
    attempts--;
  }
  
  return { puzzle, solution };
};

const fillBox = (grid, r, c) => {
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      let val;
      do {
        val = Math.floor(Math.random() * 9) + 1;
      } while (!isUnusedInBox(grid, r, c, val));
      grid[r + i][c + j] = val;
    }
  }
};

const isUnusedInBox = (grid, startR, startC, val) => {
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (grid[startR + i][startC + j] === val) return false;
    }
  }
  return true;
};
