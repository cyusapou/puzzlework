<template>
  <GameLayout title="Minesweeper" :showOverlay="status !== 'playing'">
    <template #status>
      <div class="mine-stats">
        <span class="stat-badge">🚩 {{ mineCount - flaggedCount }}</span>
        <button class="emoji-btn" @click="initGame">{{ status === 'won' ? '😎' : status === 'lost' ? '😵' : '🙂' }}</button>
        <span class="stat-badge">⏱️ {{ timer }}s</span>
      </div>
    </template>

    <div class="mine-board">
      <div v-for="(row, r) in grid" :key="r" class="mine-row">
        <div 
          v-for="(cell, c) in row" :key="c" 
          class="mine-cell"
          :class="{ 
            revealed: cell.isRevealed, 
            mine: cell.isRevealed && cell.isMine, 
            flagged: cell.isFlagged 
          }"
          @click="handleClick(r, c)"
          @contextmenu.prevent="handleRightClick(r, c)"
        >
          <span v-if="cell.isRevealed && !cell.isMine && cell.neighborCount > 0" :class="'n-' + cell.neighborCount">
            {{ cell.neighborCount }}
          </span>
          <span v-else-if="cell.isRevealed && cell.isMine">💣</span>
          <span v-else-if="cell.isFlagged">🚩</span>
        </div>
      </div>
    </div>

    <template #overlay>
      <h2>{{ status === 'won' ? 'You Win! 🎉' : 'Boom! 💥' }}</h2>
      <p>Time: {{ timer }}s</p>
      <BaseButton @click="initGame" variant="primary">Play Again</BaseButton>
    </template>

    <template #controls>
      <strong>Left click</strong> to reveal · <strong>Right click</strong> to flag
    </template>
  </GameLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './minesweeper.engine.js'

const width = 10
const height = 10
const mineCount = 15

const grid = ref([])
const status = ref('playing')
const timer = ref(0)
let timerId = null

const flaggedCount = computed(() => grid.value.flat().filter(c => c.isFlagged).length)

const initGame = () => {
  grid.value = Engine.createGrid(width, height, mineCount)
  status.value = 'playing'
  timer.value = 0
  if (timerId) clearInterval(timerId)
  timerId = setInterval(() => timer.value++, 1000)
}

const handleClick = (r, c) => {
  if (status.value !== 'playing' || grid.value[r][c].isFlagged) return
  if (grid.value[r][c].isMine) {
    grid.value.flat().forEach(c => c.isRevealed = true)
    status.value = 'lost'
    clearInterval(timerId)
    return
  }
  Engine.revealCell(grid.value, r, c)
  const safeCells = grid.value.flat().filter(c => !c.isMine)
  if (safeCells.every(c => c.isRevealed)) {
    status.value = 'won'
    clearInterval(timerId)
  }
}

const handleRightClick = (r, c) => {
  if (status.value !== 'playing' || grid.value[r][c].isRevealed) return
  grid.value[r][c].isFlagged = !grid.value[r][c].isFlagged
}

onMounted(initGame)
onUnmounted(() => clearInterval(timerId))
</script>

<style scoped>
.mine-stats {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.stat-badge {
  font-size: 1.2rem;
  padding: 0.3rem 0.75rem;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: var(--radius-sm);
}

.emoji-btn {
  font-size: 1.8rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}
.emoji-btn:hover { transform: scale(1.2); }

.mine-board {
  background: var(--color-bg-card);
  border: 2px solid rgba(124, 77, 255, 0.4);
  box-shadow: 0 0 20px rgba(124, 77, 255, 0.15);
  border-radius: var(--radius-md);
  padding: 4px;
}

.mine-row { display: flex; }

.mine-cell {
  width: 38px;
  height: 38px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  background: var(--color-bg-surface);
  transition: background 0.15s;
}
.mine-cell:hover:not(.revealed) { background: rgba(124, 77, 255, 0.15); }
.mine-cell.revealed { background: rgba(255, 255, 255, 0.04); cursor: default; }
.mine-cell.mine { background: rgba(255, 23, 68, 0.3); }

.n-1 { color: #42a5f5; }
.n-2 { color: #66bb6a; }
.n-3 { color: #ef5350; }
.n-4 { color: #ab47bc; }
.n-5 { color: #ff7043; }
.n-6 { color: #26c6da; }
.n-7 { color: #ec407a; }
.n-8 { color: #bdbdbd; }
</style>
