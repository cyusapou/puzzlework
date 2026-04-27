<template>
  <div class="sudoku-view animate-slide-up">
    <div class="game-header">
      <router-link to="/games" class="back-link">← Back to Library</router-link>
      <h1>Sudoku</h1>
      <div class="game-meta">
        <span class="difficulty-tag" :class="difficulty">{{ difficulty }}</span>
        <span class="timer">Time: {{ formattedTime }}</span>
      </div>
    </div>

    <div class="game-layout">
      <div class="board-container">
        <div class="sudoku-grid">
          <div v-for="(row, rIndex) in grid" :key="'r'+rIndex" class="sudoku-row">
            <div 
              v-for="(cell, cIndex) in row" 
              :key="'c'+cIndex" 
              class="sudoku-cell"
              :class="{
                'is-given': initialGrid[rIndex][cIndex] !== 0,
                'is-selected': selectedCell.r === rIndex && selectedCell.c === cIndex,
                'is-highlighted': isHighlighted(rIndex, cIndex),
                'is-conflict': hasConflict(rIndex, cIndex),
                'border-right': (cIndex + 1) % 3 === 0 && cIndex !== 8,
                'border-bottom': (rIndex + 1) % 3 === 0 && rIndex !== 8
              }"
              @click="selectCell(rIndex, cIndex)"
            >
              <span v-if="cell !== 0" class="cell-value">{{ cell }}</span>
              <div v-else class="notes-grid">
                <span v-for="n in 9" :key="n" class="note-digit" :class="{ visible: notes[rIndex][cIndex].has(n) }">
                  {{ n }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="game-over-overlay" v-if="isWon">
          <div class="overlay-content">
            <h2>Puzzle Solved!</h2>
            <p>Well done! Time: {{ formattedTime }}</p>
            <BaseButton @click="startNewGame" variant="primary">New Game</BaseButton>
          </div>
        </div>
      </div>

      <div class="controls-panel">
        <div class="number-pad">
          <button v-for="n in 9" :key="n" class="pad-btn" @click="enterNumber(n)">{{ n }}</button>
          <button class="pad-btn action-btn" @click="clearCell">Clear</button>
        </div>

        <div class="tool-pad">
          <BaseButton 
            :variant="isNotesMode ? 'primary' : 'outline'" 
            class="full-width"
            @click="isNotesMode = !isNotesMode"
          >
            Notes: {{ isNotesMode ? 'ON' : 'OFF' }}
          </BaseButton>
          <BaseButton variant="outline" class="full-width mt-2" @click="getHint">Hint</BaseButton>
          <BaseButton variant="secondary" class="full-width mt-2" @click="startNewGame">New Game</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './sudoku.engine.js'

const difficulty = ref('easy')
const grid = ref(Engine.createEmptyGrid())
const initialGrid = ref(Engine.createEmptyGrid())
const solution = ref(Engine.createEmptyGrid())
const notes = ref(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set())))
const selectedCell = ref({ r: -1, c: -1 })
const isNotesMode = ref(false)
const isWon = ref(false)
const time = ref(0)
let timerId = null

const formattedTime = computed(() => {
  const mins = Math.floor(time.value / 60)
  const secs = time.value % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

const startNewGame = () => {
  const game = Engine.generatePuzzle(difficulty.value)
  grid.value = game.puzzle.map(r => [...r])
  initialGrid.value = game.puzzle.map(r => [...r])
  solution.value = game.solution
  notes.value = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()))
  selectedCell.value = { r: -1, c: -1 }
  isWon.value = false
  time.value = 0
  startTimer()
}

const startTimer = () => {
  if (timerId) clearInterval(timerId)
  timerId = setInterval(() => time.value++, 1000)
}

const selectCell = (r, c) => {
  selectedCell.value = { r, c }
}

const enterNumber = (n) => {
  const { r, c } = selectedCell.value
  if (r === -1 || initialGrid.value[r][c] !== 0) return

  if (isNotesMode.value) {
    if (notes.value[r][c].has(n)) notes.value[r][c].delete(n)
    else notes.value[r][c].add(n)
  } else {
    grid.value[r][c] = n
    if (checkWin()) {
      isWon.value = true
      clearInterval(timerId)
    }
  }
}

const clearCell = () => {
  const { r, c } = selectedCell.value
  if (r === -1 || initialGrid.value[r][c] !== 0) return
  grid.value[r][c] = 0
  notes.value[r][c].clear()
}

const checkWin = () => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid.value[r][c] !== solution.value[r][c]) return false
    }
  }
  return true
}

const getHint = () => {
  const { r, c } = selectedCell.value
  if (r !== -1 && initialGrid.value[r][c] === 0) {
    grid.value[r][c] = solution.value[r][c]
  }
}

const isHighlighted = (r, c) => {
  const { r: sr, c: sc } = selectedCell.value
  if (sr === -1) return false
  return r === sr || c === sc || (Math.floor(r/3) === Math.floor(sr/3) && Math.floor(c/3) === Math.floor(sc/3))
}

const hasConflict = (r, c) => {
  const val = grid.value[r][c]
  if (val === 0 || initialGrid.value[r][c] !== 0) return false
  
  for (let i = 0; i < 9; i++) {
    if (i !== c && grid.value[r][i] === val) return true
    if (i !== r && grid.value[i][c] === val) return true
  }
  
  const startR = Math.floor(r / 3) * 3
  const startC = Math.floor(c / 3) * 3
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const nr = startR + i
      const nc = startC + j
      if ((nr !== r || nc !== c) && grid.value[nr][nc] === val) return true
    }
  }
  return false
}

const handleKeydown = (e) => {
  if (e.key >= '1' && e.key <= '9') enterNumber(parseInt(e.key))
  if (e.key === 'Backspace' || e.key === 'Delete') clearCell()
  if (e.key === 'n' || e.key === 'N') isNotesMode.value = !isNotesMode.value
}

onMounted(() => {
  startNewGame()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  clearInterval(timerId)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.sudoku-view {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.game-header {
  margin-bottom: 2rem;
}

.game-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  align-items: center;
}

.difficulty-tag {
  text-transform: uppercase;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  background: var(--color-bg-surface);
}

.difficulty-tag.easy { color: var(--color-accent-success); }

.game-layout {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}

.board-container {
  position: relative;
  background: var(--color-bg-card);
  border: 2px solid var(--color-border);
  padding: 4px;
}

.sudoku-grid {
  display: flex;
  flex-direction: column;
}

.sudoku-row {
  display: flex;
}

.sudoku-cell {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
  font-size: 1.5rem;
  font-weight: bold;
}

.sudoku-cell:hover { background: rgba(124, 77, 255, 0.1); }
.sudoku-cell.is-selected { background: rgba(124, 77, 255, 0.3) !important; }
.sudoku-cell.is-highlighted { background: rgba(255, 255, 255, 0.05); }
.sudoku-cell.is-given { color: var(--color-text-secondary); background: rgba(255, 255, 255, 0.02); }
.sudoku-cell.is-conflict { color: var(--color-accent-danger); }

.border-right { border-right: 2px solid var(--color-accent-primary); }
.border-bottom { border-bottom: 2px solid var(--color-accent-primary); }

.notes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  padding: 2px;
}

.note-digit {
  font-size: 0.6rem;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}

.note-digit.visible { opacity: 1; }

.controls-panel {
  width: 250px;
}

.number-pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.pad-btn {
  height: 60px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.pad-btn:hover { background: var(--color-accent-primary); }

.action-btn {
  grid-column: span 3;
  font-size: 1rem;
}

.full-width { width: 100%; }
.mt-2 { margin-top: 1rem; }

.game-over-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(11, 15, 26, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.overlay-content { text-align: center; }

@media (max-width: 800px) {
  .game-layout { flex-direction: column; align-items: center; }
  .controls-panel { width: 300px; }
  .sudoku-cell { width: 40px; height: 40px; font-size: 1.2rem; }
}
</style>
