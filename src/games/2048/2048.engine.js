// 2048.engine.js
// Pure JS implementation of 2048 core mechanics

export const SIZE = 4;

export const createBoard = () => {
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  spawnTile(board);
  spawnTile(board);
  return board;
};

export const spawnTile = (board) => {
  const emptyCells = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length > 0) {
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
    return { r, c, val: board[r][c] };
  }
  return null;
};

const slideRowLeft = (row) => {
  let filteredRow = row.filter(val => val !== 0);
  let scoreDelta = 0;
  for (let i = 0; i < filteredRow.length - 1; i++) {
    if (filteredRow[i] !== 0 && filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      scoreDelta += filteredRow[i];
      filteredRow.splice(i + 1, 1);
    }
  }
  while (filteredRow.length < SIZE) {
    filteredRow.push(0);
  }
  return { row: filteredRow, scoreDelta };
};

export const slideLeft = (board) => {
  const newBoard = [];
  let score = 0;
  let moved = false;

  for (let r = 0; r < SIZE; r++) {
    const { row, scoreDelta } = slideRowLeft(board[r]);
    newBoard.push(row);
    score += scoreDelta;
    if (board[r].join(',') !== row.join(',')) {
      moved = true;
    }
  }
  return { newBoard, score, moved };
};

const rotateRight = (matrix) => {
  const result = [];
  for (let c = 0; c < SIZE; c++) {
    const newRow = [];
    for (let r = SIZE - 1; r >= 0; r--) {
      newRow.push(matrix[r][c]);
    }
    result.push(newRow);
  }
  return result;
};

const rotateLeft = (matrix) => {
  const result = [];
  for (let c = SIZE - 1; c >= 0; c--) {
    const newRow = [];
    for (let r = 0; r < SIZE; r++) {
      newRow.push(matrix[r][c]);
    }
    result.push(newRow);
  }
  return result;
};

export const slideRight = (board) => {
  let rotated = rotateRight(rotateRight(board));
  let result = slideLeft(rotated);
  return {
    newBoard: rotateRight(rotateRight(result.newBoard)),
    score: result.score,
    moved: result.moved
  };
};

export const slideUp = (board) => {
  let rotated = rotateLeft(board);
  let result = slideLeft(rotated);
  return {
    newBoard: rotateRight(result.newBoard),
    score: result.score,
    moved: result.moved
  };
};

export const slideDown = (board) => {
  let rotated = rotateRight(board);
  let result = slideLeft(rotated);
  return {
    newBoard: rotateLeft(result.newBoard),
    score: result.score,
    moved: result.moved
  };
};

export const checkWin = (board) => {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] >= 2048) return true;
    }
  }
  return false;
};

export const checkLoss = (board) => {
  // Any empty cells?
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return false;
    }
  }
  // Any adjacent equal cells?
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const current = board[r][c];
      if (
        (r < SIZE - 1 && current === board[r + 1][c]) ||
        (c < SIZE - 1 && current === board[r][c + 1])
      ) {
        return false;
      }
    }
  }
  return true;
};
