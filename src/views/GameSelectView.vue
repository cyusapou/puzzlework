<template>
  <div class="games-library-view animate-slide-up">
    <div class="header-section">
      <h1>Games Library</h1>
      <p class="subtitle">Choose a game to play solo or start a multiplayer room.</p>
    </div>

    <div class="filters">
      <div class="filter-group">
        <BaseButton 
          v-for="filter in ['All', 'Logic', 'Match-3', 'Words', 'Board', 'Arcade']" 
          :key="filter"
          :variant="activeFilter === filter ? 'primary' : 'ghost'"
          size="sm"
          @click="activeFilter = filter"
        >
          {{ filter }}
        </BaseButton>
      </div>
      <div class="search-box">
        <input type="text" placeholder="Search games..." v-model="searchQuery" class="search-input" />
      </div>
    </div>

    <div class="games-grid">
      <GameCard 
        v-for="(game, index) in filteredGames" 
        :key="game.slug" 
        :game="game"
        :featured="index === 0 && activeFilter === 'All' && !searchQuery"
        class="stagger-1"
        :style="{ animationDelay: `${index * 0.05}s` }"
        @play="handlePlay"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../components/ui/BaseButton.vue'
import GameCard from '../components/game/GameCard.vue'

const router = useRouter()
const activeFilter = ref('All')
const searchQuery = ref('')

// Mock games list based on dev brief
const games = ref([
  {
    slug: 'tetris',
    name: 'Tetris',
    category: 'Logic',
    description: 'Clear lines by arranging falling geometric pieces. The ultimate classic.',
    difficulty: 'Medium',
    activePlayers: 4051
  },
  {
    slug: '2048',
    name: '2048',
    category: 'Logic',
    description: 'Slide numbered tiles on a grid to combine them into the 2048 tile.',
    difficulty: 'Easy',
    activePlayers: 1540
  },
  {
    slug: 'sudoku',
    name: 'Sudoku',
    category: 'Logic',
    description: 'Fill the 9x9 grid so every row, column, and box has numbers 1-9.',
    difficulty: 'Hard',
    activePlayers: 2100
  },
  {
    slug: 'minesweeper',
    name: 'Minesweeper',
    category: 'Logic',
    description: 'Clear the board without detonating any hidden mines using numeric clues.',
    difficulty: 'Hard',
    activePlayers: 850
  },
  {
    slug: 'wordle',
    name: 'Wordle',
    category: 'Words',
    description: 'Guess the hidden 5-letter word in 6 tries. A daily challenge.',
    difficulty: 'Medium',
    activePlayers: 8900
  },
  {
    slug: 'match-3',
    name: 'Match-3',
    category: 'Match-3',
    description: 'Swap items to match 3 or more in a row to clear the board and cascade.',
    difficulty: 'Easy',
    activePlayers: 3200
  },
  {
    slug: 'chess',
    name: 'Chess',
    category: 'Board',
    description: 'The classic game of strategy and tactics. Checkmate your opponent.',
    difficulty: 'Hard',
    activePlayers: 12500
  },
  {
    slug: 'checkers',
    name: 'Checkers',
    category: 'Board',
    description: 'Jump over your opponent\'s pieces to capture them all.',
    difficulty: 'Medium',
    activePlayers: 4500
  },
  {
    slug: 'snake',
    name: 'Snake',
    category: 'Arcade',
    description: 'Eat food to grow longer, but don\'t hit the walls or yourself!',
    difficulty: 'Easy',
    activePlayers: 6700
  },
  {
    slug: 'flappy',
    name: 'Flappy Bird',
    category: 'Arcade',
    description: 'Flap your wings to avoid pipes in this high-intensity arcade classic.',
    difficulty: 'Hard',
    activePlayers: 15200
  },
  {
    slug: 'solitaire',
    name: 'Solitaire',
    category: 'Logic',
    description: 'The ultimate solo card game. Stack the suits from Ace to King.',
    difficulty: 'Medium',
    activePlayers: 9800
  },
  {
    slug: 'memory-match',
    name: 'Memory Match',
    category: 'Logic',
    description: 'Flip cards and find pairs to clear the board as fast as possible.',
    difficulty: 'Easy',
    activePlayers: 3400
  },
  {
    slug: 'tic-tac-toe',
    name: 'Tic-Tac-Toe',
    category: 'Board',
    description: 'The classic 3x3 grid game. Get three in a row to win.',
    difficulty: 'Easy',
    activePlayers: 5600
  },
  {
    slug: 'connect-four',
    name: 'Connect Four',
    category: 'Board',
    description: 'Drop discs into columns to get four in a row.',
    difficulty: 'Medium',
    activePlayers: 2900
  },
  {
    slug: 'hangman',
    name: 'Hangman',
    category: 'Words',
    description: 'Guess the hidden word letter by letter before it\'s too late.',
    difficulty: 'Medium',
    activePlayers: 4200
  },
  {
    slug: 'trivia',
    name: 'Trivia Quiz',
    category: 'Words',
    description: 'Test your knowledge across various topics in this multiple choice quiz.',
    difficulty: 'Medium',
    activePlayers: 7800
  },
  {
    slug: 'simon-says',
    name: 'Simon Says',
    category: 'Arcade',
    description: 'Watch the sequence and repeat it. How long can you last?',
    difficulty: 'Medium',
    activePlayers: 3100
  },
  {
    slug: 'pong',
    name: 'Pong',
    category: 'Arcade',
    description: 'The classic table tennis simulation. Simple and addictive.',
    difficulty: 'Easy',
    activePlayers: 8900
  },
  {
    slug: 'breakout',
    name: 'Breakout',
    category: 'Arcade',
    description: 'Use your paddle to bounce the ball and clear the bricks.',
    difficulty: 'Medium',
    activePlayers: 6200
  },
  {
    slug: 'crossword',
    name: 'Crossword',
    category: 'Words',
    description: 'Solve the clues to fill the grid with the correct words.',
    difficulty: 'Hard',
    activePlayers: 4500
  }
])

const filteredGames = computed(() => {
  return games.value.filter(game => {
    const matchesFilter = activeFilter.value === 'All' || game.category === activeFilter.value
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesFilter && matchesSearch
  })
})

const handlePlay = (game) => {
  const implemented = [
    'tetris', '2048', 'sudoku', 'minesweeper', 'wordle', 'match-3',
    'chess', 'checkers', 'snake', 'flappy', 'solitaire', 'memory-match',
    'tic-tac-toe', 'connect-four', 'hangman', 'trivia', 'simon-says',
    'pong', 'breakout', 'crossword'
  ]
  if (implemented.includes(game.slug)) {
    router.push(`/games/${game.slug}`)
  } else {
    alert(`${game.name} is not implemented yet!`)
  }
}
</script>

<style scoped>
.header-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.header-section h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: var(--glass-bg);
  padding: 1rem;
  border-radius: var(--radius-md);
  border: var(--glass-border);
}

.filter-group {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  width: 250px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
  box-shadow: var(--shadow-glow-purple);
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  .search-input {
    width: 100%;
  }
}
</style>
