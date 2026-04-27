<template>
  <div class="dashboard-view">
    <div class="welcome-section animate-slide-up">
      <div class="welcome-text">
        <h1 class="greeting">Welcome back, <span class="text-gradient">{{ auth.user.username }}</span></h1>
        <p class="subtitle">You have a 5-day streak! Keep it up. 🔥</p>
      </div>
      <div class="welcome-stats">
        <BaseCard class="stat-card" padding="sm">
          <div class="stat-value">{{ auth.user.xp }}</div>
          <div class="stat-label">Total XP</div>
        </BaseCard>
        <BaseCard class="stat-card" padding="sm">
          <div class="stat-value">{{ auth.user.level }}</div>
          <div class="stat-label">Current Rank</div>
        </BaseCard>
      </div>
    </div>

    <div class="dashboard-grid stagger-2 animate-slide-up">
      <section class="main-column">
        <div class="section-header">
          <h2>Continue Playing</h2>
        </div>
        <div class="games-list">
          <BaseCard v-for="session in activeSessions" :key="session.id" padding="md" class="session-card" hoverable>
            <div class="session-info">
              <h3>{{ session.gameName }}</h3>
              <p>Difficulty: {{ session.difficulty }} • {{ session.timeElapsed }} played</p>
            </div>
            <BaseButton variant="primary">Resume</BaseButton>
          </BaseCard>
        </div>

        <div class="section-header mt-4">
          <h2>Your Favourites</h2>
          <router-link to="/games" class="view-all">View All Games</router-link>
        </div>
        <div class="favourites-grid">
          <GameCard 
            v-for="game in favourites" 
            :key="game.slug" 
            :game="game" 
            :isFavourite="true"
            @play="handlePlay"
          />
        </div>
      </section>

      <aside class="side-column">
        <BaseCard class="challenge-card" padding="md">
          <div class="card-icon">⚔️</div>
          <h3>Challenge a Friend</h3>
          <p>Create a private room and send the code to a friend to play together.</p>
          <BaseButton variant="secondary" class="full-width mt-2">Create Room</BaseButton>
        </BaseCard>

        <BaseCard class="daily-card mt-3" padding="md">
          <div class="card-icon">⭐</div>
          <h3>Daily Challenge</h3>
          <p>Sudoku - Expert Mode</p>
          <div class="time-left">Closes in 5h 20m</div>
          <BaseButton variant="outline" class="full-width mt-2">Play Now</BaseButton>
        </BaseCard>
        
        <div class="section-header mt-4">
          <h3>Recent Activity</h3>
        </div>
        <div class="activity-feed">
          <div class="activity-item" v-for="i in 3" :key="i">
            <div class="activity-dot"></div>
            <div class="activity-content">
              <div>Completed <strong>Wordle</strong></div>
              <div class="activity-time">{{ i * 2 }} hours ago</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import GameCard from '../components/game/GameCard.vue'

const auth = useAuthStore()
const router = useRouter()

// Mock data
const activeSessions = ref([
  { id: 1, gameName: 'Sudoku', difficulty: 'Hard', timeElapsed: '12:45' },
  { id: 2, gameName: 'Chess', difficulty: 'Medium', timeElapsed: '08:30' }
])

const favourites = ref([
  {
    slug: 'tetris',
    name: 'Tetris',
    description: 'The classic block-stacking puzzle game.',
    difficulty: 'Medium',
    activePlayers: 1205
  },
  {
    slug: '2048',
    name: '2048',
    description: 'Slide tiles and merge them to reach 2048.',
    difficulty: 'Easy',
    activePlayers: 342
  },
  {
    slug: 'match-3',
    name: 'Match-3',
    description: 'Swap and clear items in a colorful grid.',
    difficulty: 'Easy',
    activePlayers: 2100
  },
  {
    slug: 'snake',
    name: 'Snake',
    description: 'Classic arcade snake movement and growth.',
    difficulty: 'Easy',
    activePlayers: 4500
  }
])

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
.dashboard-view {
  padding: 1rem 0;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  background: var(--glass-bg);
  padding: 2rem;
  border-radius: var(--radius-lg);
  border: var(--glass-border);
}

.greeting {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
}

.welcome-stats {
  display: flex;
  gap: 1rem;
}

.stat-card {
  text-align: center;
  min-width: 120px;
}

.stat-value {
  font-size: 1.8rem;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-accent-secondary);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  gap: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.5rem;
}

.section-header h2, .section-header h3 {
  margin: 0;
}

.view-all {
  font-size: 0.9rem;
}

.mt-4 { margin-top: 3rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-2 { margin-top: 1rem; }
.full-width { width: 100%; }

.session-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.session-info h3 {
  margin-bottom: 0.25rem;
}

.session-info p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.favourites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.challenge-card, .daily-card {
  text-align: center;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.challenge-card p, .daily-card p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.time-left {
  font-size: 0.85rem;
  color: var(--color-accent-warning);
  font-weight: 600;
}

.activity-feed {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.activity-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-accent-primary);
  box-shadow: var(--shadow-glow-purple);
}

.activity-content {
  font-size: 0.9rem;
}

.activity-time {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

@media (max-width: 992px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .welcome-section {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
}
</style>
