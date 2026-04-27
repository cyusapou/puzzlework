<template>
  <div class="game-card" :class="{ 'is-featured': featured }">
    <div class="card-image-wrapper">
      <div class="placeholder-image" :style="{ background: fallbackColor }">
        <span class="game-emoji">{{ emoji }}</span>
      </div>
      <div class="card-overlay">
        <BaseButton @click="$emit('play', game)" variant="primary" class="play-btn">Play Now</BaseButton>
      </div>
    </div>
    <div class="card-content">
      <div class="card-header">
        <h3 class="game-title">{{ game.name }}</h3>
        <button class="fav-btn" @click.stop="$emit('toggle-fav', game)" :class="{ active: isFavourite }">
          {{ isFavourite ? '♥' : '♡' }}
        </button>
      </div>
      <p class="game-desc">{{ game.description }}</p>
      <div class="card-footer">
        <span class="difficulty-badge" :class="game.difficulty.toLowerCase()">{{ game.difficulty }}</span>
        <span class="players-count">👥 {{ game.activePlayers }} playing</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from '../ui/BaseButton.vue'

const props = defineProps({
  game: {
    type: Object,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  isFavourite: {
    type: Boolean,
    default: false
  }
})

defineEmits(['play', 'toggle-fav'])

const emojiMap = {
  'tetris': '🧱',
  '2048': '🔢',
  'sudoku': '📝',
  'minesweeper': '💣',
  'wordle': '🔤',
  'candy-crush': '🍬',
  'portal': '🌀',
  'monument-valley': '🏰',
  'bejeweled': '💎',
  'sokoban': '📦'
}

const emoji = computed(() => emojiMap[props.game.slug] || '🧩')

const colorMap = {
  'tetris': 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)',
  '2048': 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)',
  'sudoku': 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
  'minesweeper': 'linear-gradient(135deg, #e52d27 0%, #b31217 100%)',
  'wordle': 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
  'bejeweled': 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)'
}

const fallbackColor = computed(() => colorMap[props.game.slug] || 'linear-gradient(135deg, #7c4dff 0%, #1c2237 100%)')
</script>

<style scoped>
.game-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-color: rgba(124, 77, 255, 0.4);
}

.card-image-wrapper {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(11, 15, 26, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-card:hover .card-overlay {
  opacity: 1;
}

.play-btn {
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.game-card:hover .play-btn {
  transform: translateY(0);
}

.card-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.game-title {
  font-size: 1.25rem;
  margin: 0;
  color: var(--color-text-primary);
}

.fav-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
  line-height: 1;
}

.fav-btn:hover {
  transform: scale(1.1);
}

.fav-btn.active {
  color: var(--color-accent-danger);
}

.game-desc {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.difficulty-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.difficulty-badge.easy { background: rgba(0, 230, 118, 0.15); color: var(--color-accent-success); }
.difficulty-badge.medium { background: rgba(255, 171, 0, 0.15); color: var(--color-accent-warning); }
.difficulty-badge.hard { background: rgba(255, 23, 68, 0.15); color: var(--color-accent-danger); }

.players-count {
  color: var(--color-text-secondary);
}

/* Featured variation */
.is-featured {
  flex-direction: row;
  grid-column: 1 / -1;
}

.is-featured .card-image-wrapper {
  width: 40%;
  height: auto;
  min-height: 240px;
}

.is-featured .placeholder-image {
  font-size: 6rem;
}

@media (max-width: 768px) {
  .is-featured {
    flex-direction: column;
  }
  .is-featured .card-image-wrapper {
    width: 100%;
    height: 180px;
  }
}
</style>
