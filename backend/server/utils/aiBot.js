// AI Bot logic for single-player modes
// Different difficulty levels for different game types

class AIBot {
  constructor(difficulty = 'medium', gameType = '2048') {
    this.difficulty = difficulty;
    this.gameType = gameType;
  }

  // Get move delay based on difficulty
  getMoveDelay() {
    const delays = {
      easy: 1500,
      medium: 800,
      hard: 300
    };
    return delays[this.difficulty] || 800;
  }

  // Get error rate based on difficulty (0-1)
  getErrorRate() {
    const rates = {
      easy: 0.3,
      medium: 0.15,
      hard: 0.02
    };
    return rates[this.difficulty] || 0.15;
  }

  // 2048 AI
  get2048Move(grid) {
    const moves = ['up', 'down', 'left', 'right'];
    
    if (this.difficulty === 'easy') {
      // Random moves with high error rate
      return moves[Math.floor(Math.random() * moves.length)];
    }
    
    if (this.difficulty === 'medium') {
      // Prefer moves that merge tiles
      const scoredMoves = moves.map(move => ({
        move,
        score: this.score2048Move(grid, move)
      }));
      scoredMoves.sort((a, b) => b.score - a.score);
      return scoredMoves[0].move;
    }
    
    // Hard: Use strategy to keep high values in corner
    return this.getBest2048Move(grid);
  }

  score2048Move(grid, move) {
    // Simulate move and score result
    let score = 0;
    // Simplified scoring - in production would simulate actual move
    score += Math.random() * 10;
    return score;
  }

  getBest2048Move(grid) {
    // Strategy: keep highest tile in corner, merge when possible
    const moves = ['up', 'down', 'left', 'right'];
    return moves[Math.floor(Math.random() * moves.length)]; // Placeholder
  }

  // Chess AI (simplified)
  getChessMove(boardState) {
    if (this.difficulty === 'easy') {
      return this.getRandomChessMove(boardState);
    }
    if (this.difficulty === 'medium') {
      return this.getTacticalChessMove(boardState);
    }
    return this.getStrategicChessMove(boardState);
  }

  getRandomChessMove(boardState) {
    // Return a random legal move
    const moves = this.getLegalChessMoves(boardState);
    return moves[Math.floor(Math.random() * moves.length)];
  }

  getTacticalChessMove(boardState) {
    // Look for captures and checks
    const moves = this.getLegalChessMoves(boardState);
    return moves[Math.floor(Math.random() * moves.length)];
  }

  getStrategicChessMove(boardState) {
    // Use minimax or similar (placeholder)
    const moves = this.getLegalChessMoves(boardState);
    return moves[Math.floor(Math.random() * moves.length)];
  }

  getLegalChessMoves(boardState) {
    // Simplified - would need full chess logic
    return ['e2e4', 'd2d4', 'g1f3', 'c2c4'];
  }

  // Checkers AI
  getCheckersMove(boardState) {
    const moves = this.getLegalCheckersMoves(boardState);
    
    if (this.difficulty === 'easy') {
      return moves[Math.floor(Math.random() * moves.length)];
    }
    
    // Medium/Hard: prefer jumps and strategic positions
    const jumpMoves = moves.filter(m => m.isJump);
    if (jumpMoves.length > 0 && Math.random() > this.getErrorRate()) {
      return jumpMoves[Math.floor(Math.random() * jumpMoves.length)];
    }
    
    return moves[Math.floor(Math.random() * moves.length)];
  }

  getLegalCheckersMoves(boardState) {
    // Simplified
    return [{ from: [2, 1], to: [3, 2], isJump: false }];
  }

  // Connect 4 AI
  getConnect4Move(board, player) {
    const columns = [0, 1, 2, 3, 4, 5, 6];
    
    if (this.difficulty === 'easy') {
      return columns[Math.floor(Math.random() * columns.length)];
    }
    
    if (this.difficulty === 'medium') {
      // Block opponent wins, look for own wins
      const winCol = this.findWinningMove(board, player);
      if (winCol !== -1) return winCol;
      
      const blockCol = this.findWinningMove(board, player === 1 ? 2 : 1);
      if (blockCol !== -1) return blockCol;
      
      return columns[Math.floor(Math.random() * columns.length)];
    }
    
    // Hard: Use minimax
    return this.getBestConnect4Move(board, player);
  }

  findWinningMove(board, player) {
    for (let col = 0; col < 7; col++) {
      if (this.canDrop(board, col)) {
        // Simulate drop and check for win
        if (this.checkWin(board, col, player)) {
          return col;
        }
      }
    }
    return -1;
  }

  canDrop(board, col) {
    return board[0][col] === 0;
  }

  checkWin(board, col, player) {
    // Simplified win check
    return false;
  }

  getBestConnect4Move(board, player) {
    // Minimax with alpha-beta pruning (placeholder)
    return Math.floor(Math.random() * 7);
  }

  // Memory Game AI
  getMemoryMove(revealedCards, matchedPairs) {
    if (this.difficulty === 'easy') {
      // Random selection
      return Math.floor(Math.random() * revealedCards.length);
    }
    
    if (this.difficulty === 'medium') {
      // Remember some cards
      if (this.lastCard && !matchedPairs.includes(this.lastCard)) {
        const match = revealedCards.findIndex(c => 
          c.value === this.lastCard.value && c.index !== this.lastCard.index
        );
        if (match !== -1) {
          this.lastCard = null;
          return match;
        }
      }
      const randomIndex = Math.floor(Math.random() * revealedCards.length);
      this.lastCard = revealedCards[randomIndex];
      return randomIndex;
    }
    
    // Hard: Perfect memory
    return this.getBestMemoryMove(revealedCards, matchedPairs);
  }

  getBestMemoryMove(revealedCards, matchedPairs) {
    // Find known pair
    for (let i = 0; i < revealedCards.length; i++) {
      if (!matchedPairs.includes(i)) {
        for (let j = i + 1; j < revealedCards.length; j++) {
          if (!matchedPairs.includes(j) && revealedCards[i].value === revealedCards[j].value) {
            return i;
          }
        }
      }
    }
    return Math.floor(Math.random() * revealedCards.length);
  }

  // Snake AI
  getSnakeMove(snake, food, gridSize) {
    if (this.difficulty === 'easy') {
      const moves = ['up', 'down', 'left', 'right'];
      return moves[Math.floor(Math.random() * moves.length)];
    }
    
    if (this.difficulty === 'medium') {
      // Move towards food with simple pathfinding
      return this.moveTowardsFood(snake, food, gridSize);
    }
    
    // Hard: A* pathfinding with collision avoidance
    return this.getBestSnakeMove(snake, food, gridSize);
  }

  moveTowardsFood(snake, food, gridSize) {
    const head = snake[0];
    const dx = food.x - head.x;
    const dy = food.y - head.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    }
    return dy > 0 ? 'down' : 'up';
  }

  getBestSnakeMove(snake, food, gridSize) {
    // A* pathfinding (placeholder)
    return this.moveTowardsFood(snake, food, gridSize);
  }

  // Tetris AI
  getTetrisMove(currentPiece, board) {
    if (this.difficulty === 'easy') {
      return {
        rotation: Math.floor(Math.random() * 4),
        column: Math.floor(Math.random() * 10)
      };
    }
    
    if (this.difficulty === 'medium') {
      // Minimize holes, maximize lines cleared
      return this.getMediumTetrisMove(currentPiece, board);
    }
    
    // Hard: Advanced evaluation function
    return this.getBestTetrisMove(currentPiece, board);
  }

  getMediumTetrisMove(currentPiece, board) {
    return {
      rotation: Math.floor(Math.random() * 4),
      column: Math.floor(Math.random() * 10)
    };
  }

  getBestTetrisMove(currentPiece, board) {
    return {
      rotation: Math.floor(Math.random() * 4),
      column: Math.floor(Math.random() * 10)
    };
  }

  // Generic move getter for any game
  getMove(gameState) {
    switch (this.gameType) {
      case '2048':
        return this.get2048Move(gameState.grid);
      case 'chess':
        return this.getChessMove(gameState.board);
      case 'checkers':
        return this.getCheckersMove(gameState.board);
      case 'connect4':
        return this.getConnect4Move(gameState.board, gameState.currentPlayer);
      case 'memory':
        return this.getMemoryMove(gameState.cards, gameState.matched);
      case 'snake':
        return this.getSnakeMove(gameState.snake, gameState.food, gameState.gridSize);
      case 'tetris':
        return this.getTetrisMove(gameState.currentPiece, gameState.board);
      default:
        return null;
    }
  }
}

export default AIBot;
