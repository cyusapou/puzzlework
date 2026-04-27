<template>
  <div class="game-2048-view animate-slide-up">
    <div class="game-header">
      <router-link to="/games" class="back-link">← Back to Library</router-link>
      <div class="header-content">
        <h1>2048</h1>
        <div class="scores">
          <BaseCard padding="sm" class="score-card">
            <span class="score-label">SCORE</span>
            <span class="score-val">{{ score }}</span>
          </BaseCard>
          <BaseButton @click="restart" variant="primary">New Game</BaseButton>
        </div>
      </div>
    </div>

    <div class="board-container">
      <div class="grid">
        <!-- Empty background cells -->
        <div class="grid-cell" v-for="n in 16" :key="'bg-'+n"></div>
        
        <!-- Active Tiles -->
        <div 
          v-for="tile in activeTiles" 
          :key="tile.id"
          class="tile"
          :class="['tile-' + tile.val, { 'tile-new': tile.isNew, 'tile-merged': tile.isMerged }]"
          :style="{
            transform: `translate(${tile.c * (80 + 10)}px, ${tile.r * (80 + 10)}px)`
          }"
        >
          <div class="tile-inner">{{ tile.val }}</div>
        </div>
      </div>

      <div class="overlay" v-if="gameState !== 'playing'">
        <div class="overlay-content">
          <h2 v-if="gameState === 'won'">You Win!</h2>
          <h2 v-else-if="gameState === 'lost'">Game Over!</h2>
          <BaseButton @click="restart" variant="primary" size="lg">Try Again</BaseButton>
        </div>
      </div>
    </div>
    
    <div class="controls-hint">
      Use <strong>Arrow Keys</strong> or <strong>Swipe</strong> to join the numbers and get to the <strong>2048</strong> tile!
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BaseCard from '../../components/ui/BaseCard.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './2048.engine.js'

const score = ref(0)
const gameState = ref('playing') // playing, won, lost

// We track tiles individually by ID to animate them moving
const nextId = ref(0)
let rawBoard = []
const activeTiles = ref([])

const restart = () => {
  score.value = 0
  gameState.value = 'playing'
  activeTiles.value = []
  rawBoard = Engine.createBoard()
  syncTiles()
}

// Convert 2D array to flat list of tiles for Vue v-for
const syncTiles = () => {
  const newActiveTiles = []
  for (let r = 0; r < Engine.SIZE; r++) {
    for (let c = 0; c < Engine.SIZE; c++) {
      if (rawBoard[r][c] !== 0) {
        // Find existing tile at this position to keep its ID if possible (simplified animation logic)
        // A robust animation system requires keeping track of merges. For now, simple ID assignment.
        newActiveTiles.push({
          id: nextId.value++,
          r,
          c,
          val: rawBoard[r][c],
          isNew: false,
          isMerged: false
        })
      }
    }
  }
  activeTiles.value = newActiveTiles
}

const handleKeydown = (e) => {
  if (gameState.value !== 'playing') return

  let result = null
  if (e.key === 'ArrowUp') result = Engine.slideUp(rawBoard)
  else if (e.key === 'ArrowDown') result = Engine.slideDown(rawBoard)
  else if (e.key === 'ArrowLeft') result = Engine.slideLeft(rawBoard)
  else if (e.key === 'ArrowRight') result = Engine.slideRight(rawBoard)
  
  if (result && result.moved) {
    e.preventDefault()
    rawBoard = result.newBoard
    score.value += result.score
    
    const spawned = Engine.spawnTile(rawBoard)
    syncTiles()
    
    // Add "new" animation class to spawned tile
    if (spawned) {
      const newTile = activeTiles.value.find(t => t.r === spawned.r && t.c === spawned.c)
      if (newTile) newTile.isNew = true
    }

    if (Engine.checkWin(rawBoard)) gameState.value = 'won'
    else if (Engine.checkLoss(rawBoard)) gameState.value = 'lost'
  }
}

let touchStartX = 0
let touchStartY = 0
const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}
const handleTouchEnd = (e) => {
  if (gameState.value !== 'playing') return
  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY
  
  const dx = touchEndX - touchStartX
  const dy = touchEndY - touchStartY
  
  if (Math.abs(dx) > Math.abs(dy)) {
    if (Math.abs(dx) > 30) {
      const eMock = { key: dx > 0 ? 'ArrowRight' : 'ArrowLeft', preventDefault: () => {} }
      handleKeydown(eMock)
    }
  } else {
    if (Math.abs(dy) > 30) {
      const eMock = { key: dy > 0 ? 'ArrowDown' : 'ArrowUp', preventDefault: () => {} }
      handleKeydown(eMock)
    }
  }
}

onMounted(() => {
  restart()
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('touchstart', handleTouchStart)
  window.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
})
</script>

<style scoped>
.game-2048-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.game-header {
  width: 100%;
  margin-bottom: 2rem;
}

.back-link {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-content h1 {
  font-size: 4rem;
  margin: 0;
  color: var(--color-text-primary);
  line-height: 1;
}

.scores {
  display: flex;
  gap: 1rem;
  align-items: stretch;
}

.score-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 80px;
  background: rgba(255,255,255,0.1);
  border: none;
}

.score-label {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  font-weight: bold;
}

.score-val {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-text-primary);
}

.board-container {
  position: relative;
  background: #bbada0; /* Classic 2048 board color */
  padding: 10px;
  border-radius: var(--radius-md);
  touch-action: none; /* Prevent scroll on swipe */
}

.grid {
  position: relative;
  width: 350px;
  height: 350px;
}

.grid-cell {
  width: 80px;
  height: 80px;
  background: rgba(238, 228, 218, 0.35);
  border-radius: 4px;
  float: left;
  margin: 0 10px 10px 0;
}
.grid-cell:nth-child(4n) {
  margin-right: 0;
}

.tile {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  transition: transform 100ms ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0; left: 0;
}

.tile-inner {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: bold;
  font-size: 2.5rem;
  color: #776e65;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee4da;
  border-radius: 4px;
}

/* Tile Colors */
.tile-2 .tile-inner { background: #eee4da; }
.tile-4 .tile-inner { background: #ede0c8; }
.tile-8 .tile-inner { background: #f2b179; color: #f9f6f2; }
.tile-16 .tile-inner { background: #f59563; color: #f9f6f2; }
.tile-32 .tile-inner { background: #f67c5f; color: #f9f6f2; }
.tile-64 .tile-inner { background: #f65e3b; color: #f9f6f2; }
.tile-128 .tile-inner { background: #edcf72; color: #f9f6f2; font-size: 2rem; box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.23), inset 0 0 0 1px rgba(255, 255, 255, 0.14); }
.tile-256 .tile-inner { background: #edcc61; color: #f9f6f2; font-size: 2rem; box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.31), inset 0 0 0 1px rgba(255, 255, 255, 0.19); }
.tile-512 .tile-inner { background: #edc850; color: #f9f6f2; font-size: 2rem; box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.39), inset 0 0 0 1px rgba(255, 255, 255, 0.24); }
.tile-1024 .tile-inner { background: #edc53f; color: #f9f6f2; font-size: 1.5rem; box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.47), inset 0 0 0 1px rgba(255, 255, 255, 0.29); }
.tile-2048 .tile-inner { background: #edc22e; color: #f9f6f2; font-size: 1.5rem; box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.34); }
.tile-super .tile-inner { background: #3c3a32; color: #f9f6f2; font-size: 1.5rem; }

/* Animations */
@keyframes appear {
  0% { opacity: 0; transform: scale(0); }
  100% { opacity: 1; transform: scale(1); }
}

.tile-new .tile-inner {
  animation: appear 200ms ease 100ms;
  animation-fill-mode: backwards;
}

@keyframes pop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.tile-merged .tile-inner {
  animation: pop 200ms ease 100ms;
  animation-fill-mode: backwards;
}

.overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(238, 228, 218, 0.73);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--radius-md);
  animation: fade-in 800ms ease 1200ms;
  animation-fill-mode: both;
}

.overlay-content {
  text-align: center;
}

.overlay-content h2 {
  font-size: 4rem;
  font-weight: bold;
  color: #776e65;
  margin-bottom: 1rem;
}

.controls-hint {
  margin-top: 2rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 400px) {
  .board-container { padding: 5px; }
  .grid { width: 280px; height: 280px; }
  .grid-cell { width: 62.5px; height: 62.5px; margin: 0 10px 10px 0; }
  .tile { width: 62.5px; height: 62.5px; }
  .tile-inner { font-size: 2rem; }
  .tile-128 .tile-inner, .tile-256 .tile-inner, .tile-512 .tile-inner { font-size: 1.5rem; }
  .tile-1024 .tile-inner, .tile-2048 .tile-inner { font-size: 1.2rem; }
}
</style>
