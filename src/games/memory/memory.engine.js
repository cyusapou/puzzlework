// memory.engine.js

export const ICONS = ['🎨', '🎭', '🎪', '🎢', '🎡', '🎰', '🎮', '🕹️', '🎲', '🧩', '🧸', '🪀'];

export const createBoard = () => {
  const pairs = [...ICONS, ...ICONS];
  return shuffle(pairs.map((icon, id) => ({ id, icon, isFlipped: false, isMatched: false })));
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
