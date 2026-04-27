// snake.engine.js

export const SIZE = 20;

export const createInitialState = () => ({
  snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
  food: { x: 5, y: 5 },
  direction: { x: 0, y: -1 },
  score: 0,
  isGameOver: false
});

export const moveSnake = (state) => {
  const head = { x: state.snake[0].x + state.direction.x, y: state.snake[0].y + state.direction.y };

  // Wall collision
  if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE) {
    return { ...state, isGameOver: true };
  }

  // Self collision
  if (state.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    return { ...state, isGameOver: true };
  }

  const newSnake = [head, ...state.snake];

  // Food collision
  if (head.x === state.food.x && head.y === state.food.y) {
    return {
      ...state,
      snake: newSnake,
      food: spawnFood(newSnake),
      score: state.score + 10
    };
  }

  newSnake.pop();
  return { ...state, snake: newSnake };
};

const spawnFood = (snake) => {
  let food;
  while (true) {
    food = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
    if (!snake.some(segment => segment.x === food.x && segment.y === food.y)) break;
  }
  return food;
};
