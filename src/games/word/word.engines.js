// hangman.engine.js
export const WORDS = [
  'ALGORITHM', 'JAVASCRIPT', 'BACKEND', 'FRONTEND', 'DATABASE', 'NETWORK', 'BROWSER',
  'FUNCTION', 'VARIABLE', 'CONSTANT', 'PROMISE', 'CLOSURE', 'MODULES', 'PACKAGE',
  'COMPILE', 'RUNTIME', 'BOOLEAN', 'INTEGER', 'STRINGS', 'OBJECTS', 'METHODS',
  'TESTING', 'WEBPACK', 'SERVERS', 'ROUTING', 'SOCKETS', 'SESSION', 'COOKIES',
  'THREADS', 'PROCESS', 'STORAGE', 'LOADING', 'CACHING', 'QUERIES', 'SCHEMAS',
  'GRAPHIC', 'DISPLAY', 'ELEMENT', 'CONSOLE', 'LOGGING', 'CLASSES', 'EXTENDS',
  'RENDERS', 'ACTIONS', 'REDUCER', 'CONTEXT', 'PATTERN', 'FACTORY', 'ADAPTER',
  'DECODED', 'ENCODED'
];

// trivia.engine.js
export const QUESTIONS = [
  { q: 'What is the capital of France?', a: ['Paris', 'London', 'Berlin', 'Madrid'], c: 0 },
  { q: 'Which planet is known as the Red Planet?', a: ['Mars', 'Jupiter', 'Venus', 'Saturn'], c: 0 },
  { q: 'What is the largest ocean on Earth?', a: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], c: 0 },
  { q: 'Who painted the Mona Lisa?', a: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Donatello'], c: 0 },
  { q: 'What is the speed of light?', a: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'], c: 0 },
  { q: 'What is the chemical symbol for gold?', a: ['Au', 'Ag', 'Fe', 'Cu'], c: 0 },
  { q: 'Which country has the most population?', a: ['India', 'China', 'USA', 'Indonesia'], c: 0 },
  { q: 'How many continents are there?', a: ['7', '5', '6', '8'], c: 0 },
  { q: 'What year did the Titanic sink?', a: ['1912', '1905', '1920', '1898'], c: 0 },
  { q: 'What is the smallest prime number?', a: ['2', '1', '3', '0'], c: 0 },
  { q: 'Which gas do plants absorb?', a: ['Carbon Dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], c: 0 },
  { q: 'What is the hardest natural substance?', a: ['Diamond', 'Ruby', 'Iron', 'Quartz'], c: 0 },
  { q: 'Who wrote "Romeo and Juliet"?', a: ['Shakespeare', 'Dickens', 'Austen', 'Twain'], c: 0 },
  { q: 'What is the largest mammal?', a: ['Blue Whale', 'Elephant', 'Giraffe', 'Hippo'], c: 0 },
  { q: 'How many bones in the adult human body?', a: ['206', '300', '180', '215'], c: 0 }
];
