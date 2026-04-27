// wordle.engine.js

export const WORDS = [
  'PIANO', 'HOUSE', 'LIGHT', 'BREAD', 'MUSIC', 'PHONE', 'TABLE', 'BRAIN', 'CLOUD', 'WATER',
  'FLAME', 'GRAPE', 'STORM', 'STONE', 'DREAM', 'OCEAN', 'DANCE', 'FROST', 'SMILE', 'EARTH',
  'CHARM', 'BLAZE', 'CRANE', 'DRIFT', 'SPARK', 'TIGER', 'WHALE', 'VIVID', 'QUEST', 'GLOBE',
  'AZURE', 'BLISS', 'BRISK', 'CLASH', 'CORAL', 'CRISP', 'DWARF', 'ELECT', 'FABLE', 'FIBER',
  'FLINT', 'FORGE', 'GLYPH', 'GRIND', 'HAVEN', 'HASTE', 'IVORY', 'JOLLY', 'KNACK', 'LEMON',
  'LUNAR', 'MAPLE', 'MARSH', 'NOBLE', 'OLIVE', 'PEARL', 'PLUME', 'PRISM', 'QUILT', 'RADAR',
  'REIGN', 'RIDGE', 'ROYAL', 'SAVOR', 'SHADE', 'SHELF', 'SHRUB', 'SIEGE', 'SLATE', 'SOLAR',
  'SPINE', 'SPORE', 'STAIR', 'STERN', 'SURGE', 'SWAMP', 'THORN', 'TORCH', 'TRAIL', 'TREND',
  'TROUT', 'TULIP', 'ULTRA', 'UNITY', 'VAPOR', 'VERSE', 'VIGOR', 'VIOLA', 'WASTE', 'WEAVE',
  'WHOLE', 'WRIST', 'YIELD', 'YOUTH', 'ALBUM', 'ANGEL', 'BADGE', 'BASIC', 'CABIN', 'CANDY'
];

export const getDailyWord = () => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return WORDS[seed % WORDS.length];
};

export const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

export const checkGuess = (guess, secret) => {
  const result = Array(5).fill('gray');
  const secretArr = secret.split('');
  const guessArr = guess.split('');

  // Pass 1: Greens
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === secretArr[i]) {
      result[i] = 'green';
      secretArr[i] = null;
      guessArr[i] = null;
    }
  }

  // Pass 2: Yellows
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] && secretArr.includes(guessArr[i])) {
      result[i] = 'yellow';
      secretArr[secretArr.indexOf(guessArr[i])] = null;
    }
  }

  return result;
};
