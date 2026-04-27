// tetris.engine.js
// Pure JS implementation of Tetris core mechanics

export const COLS = 10;
export const ROWS = 20;

export const PIECES = {
  0: null, // Empty
  1: { shape: [[1, 1, 1, 1]], color: '#00e5ff' }, // I (Cyan)
  2: { shape: [[2, 2], [2, 2]], color: '#ffab00' }, // O (Yellow)
  3: { shape: [[0, 3, 0], [3, 3, 3]], color: '#7c4dff' }, // T (Purple)
  4: { shape: [[0, 4, 4], [4, 4, 0]], color: '#00e676' }, // S (Green)
  5: { shape: [[5, 5, 0], [0, 5, 5]], color: '#ff1744' }, // Z (Red)
  6: { shape: [[6, 0, 0], [6, 6, 6]], color: '#2962ff' }, // J (Blue)
  7: { shape: [[0, 0, 7], [7, 7, 7]], color: '#ff6d00' }  // L (Orange)
};

export const createBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// 7-bag randomizer to prevent droughts
let bag = [];
function getNextPiece() {
  if (bag.length === 0) {
    bag = [1, 2, 3, 4, 5, 6, 7];
    // Shuffle
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  }
  return bag.pop();
}

export function spawnPiece() {
  const typeId = getNextPiece();
  const shape = PIECES[typeId].shape;
  return {
    typeId,
    shape,
    x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
    y: 0
  };
}

export function rotatePiece(piece) {
  // Transpose then reverse each row for 90deg clockwise
  const rotated = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );
  return { ...piece, shape: rotated };
}

export function checkCollision(board, piece, moveX = 0, moveY = 0) {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const boardX = piece.x + x + moveX;
        const boardY = piece.y + y + moveY;

        // Check walls and floor
        if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
          return true;
        }
        // Check collision with existing blocks
        if (boardY >= 0 && board[boardY][boardX] !== 0) {
          return true;
        }
      }
    }
  }
  return false;
}

export function lockPiece(board, piece) {
  const newBoard = board.map(row => [...row]);
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        if (piece.y + y >= 0) {
          newBoard[piece.y + y][piece.x + x] = piece.typeId;
        }
      }
    }
  }
  return newBoard;
}

export function clearLines(board) {
  let linesCleared = 0;
  const newBoard = board.filter(row => {
    const isFull = row.every(cell => cell !== 0);
    if (isFull) linesCleared++;
    return !isFull;
  });

  while (newBoard.length < ROWS) {
    newBoard.unshift(Array(COLS).fill(0));
  }

  return { newBoard, linesCleared };
}

export function calculateScore(linesCleared, level) {
  const baseScores = { 0: 0, 1: 100, 2: 300, 3: 500, 4: 800 };
  return baseScores[linesCleared] * level;
}
