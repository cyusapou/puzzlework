// arcade.engines.js
// Simplified engines for the remaining arcade games

export const PADDLE_WIDTH = 10;
export const PADDLE_HEIGHT = 80;
export const BALL_SIZE = 10;
export const WIDTH = 600;
export const HEIGHT = 400;

export const createSimonState = () => ({
  sequence: [],
  userSequence: [],
  status: 'playing',
  round: 0
});

export const nextSimonRound = (state) => {
  const newState = { ...state, round: state.round + 1, userSequence: [] };
  newState.sequence.push(Math.floor(Math.random() * 4));
  return newState;
};
