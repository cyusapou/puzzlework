// solitaire.engine.js

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = () => {
  const deck = [];
  SUITS.forEach(suit => {
    VALUES.forEach((value, index) => {
      deck.push({ suit, value, rank: index + 1, color: (suit === '♥' || suit === '♦') ? 'red' : 'black', isFaceUp: false });
    });
  });
  return shuffle(deck);
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const setupGame = () => {
  const deck = createDeck();
  const tableau = Array.from({ length: 7 }, (_, i) => {
    const pile = deck.splice(0, i + 1);
    pile[pile.length - 1].isFaceUp = true;
    return pile;
  });
  return { tableau, stock: deck, waste: [], foundations: [[], [], [], []] };
};
