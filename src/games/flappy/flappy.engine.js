// flappy.engine.js

export const createInitialState = () => ({
  birdY: 200,
  velocity: 0,
  pipes: [],
  score: 0,
  isGameOver: false,
  frame: 0
});

export const update = (state) => {
  if (state.isGameOver) return state;

  const newState = { ...state, frame: state.frame + 1 };
  
  // Gravity
  newState.velocity += 0.5;
  newState.birdY += newState.velocity;

  // Collision
  if (newState.birdY < 0 || newState.birdY > 400) newState.isGameOver = true;

  // Pipes
  if (newState.frame % 100 === 0) {
    newState.pipes.push({ x: 400, gapTop: Math.random() * 200 + 50 });
  }

  newState.pipes = newState.pipes
    .map(p => ({ ...p, x: p.x - 2 }))
    .filter(p => p.x > -50);

  newState.pipes.forEach(p => {
    if (p.x > 50 && p.x < 100) {
      if (newState.birdY < p.gapTop || newState.birdY > p.gapTop + 100) {
        newState.isGameOver = true;
      }
    }
    if (p.x === 50) newState.score++;
  });

  return newState;
};
