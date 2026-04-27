<template>
  <GameLayout title="Crossword" :showOverlay="isComplete">
    <template #status>
      <span class="stat-badge">{{ filledCount }}/{{ totalCells }} filled</span>
      <BaseButton @click="checkAnswers" variant="outline" size="sm">Check</BaseButton>
    </template>

    <div class="crossword-layout">
      <div class="crossword-grid">
        <div v-for="(row, r) in grid" :key="r" class="cw-row">
          <div v-for="(cell, c) in row" :key="c"
               class="cw-cell"
               :class="{ 
                 blocked: cell.blocked, 
                 selected: selected?.r === r && selected?.c === c,
                 highlighted: isHighlighted(r, c),
                 correct: cell.checked && cell.correct,
                 wrong: cell.checked && !cell.correct && cell.userVal
               }"
               @click="selectCell(r, c)">
            <span v-if="cell.number" class="cell-number">{{ cell.number }}</span>
            <input v-if="!cell.blocked" 
                   :ref="el => { if (el) cellRefs[r + '-' + c] = el }"
                   v-model="cell.userVal" 
                   maxlength="1" 
                   class="cell-input"
                   @input="onInput(r, c)"
                   @keydown="onKeydown($event, r, c)" />
          </div>
        </div>
      </div>

      <div class="clues-panel">
        <div class="clue-section">
          <h3>Across</h3>
          <div v-for="clue in acrossClues" :key="'a'+clue.num" 
               class="clue" :class="{ active: activeClue === 'a'+clue.num }"
               @click="goToClue(clue)">
            <span class="clue-num">{{ clue.num }}.</span> {{ clue.text }}
          </div>
        </div>
        <div class="clue-section">
          <h3>Down</h3>
          <div v-for="clue in downClues" :key="'d'+clue.num" 
               class="clue" :class="{ active: activeClue === 'd'+clue.num }"
               @click="goToClue(clue)">
            <span class="clue-num">{{ clue.num }}.</span> {{ clue.text }}
          </div>
        </div>
      </div>
    </div>

    <template #overlay>
      <h2>🎉 Crossword Complete!</h2>
      <p>You solved the puzzle!</p>
      <BaseButton @click="resetPuzzle" variant="primary">New Puzzle</BaseButton>
    </template>
  </GameLayout>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'

const cellRefs = reactive({})
const selected = ref(null)
const activeClue = ref(null)
const isComplete = ref(false)

// Puzzle data — a proper small crossword
const puzzleData = {
  size: 7,
  cells: [
    // row 0
    [{ answer: 'C', number: 1 }, { answer: 'O' }, { answer: 'D', number: 2 }, { answer: 'E' }, { blocked: true }, { answer: 'J', number: 3 }, { answer: 'S' }],
    // row 1
    [{ answer: 'L' }, { blocked: true }, { answer: 'A' }, { blocked: true }, { blocked: true }, { answer: 'A' }, { blocked: true }],
    // row 2
    [{ answer: 'A', number: 4 }, { answer: 'R', number: 5 }, { answer: 'R' }, { answer: 'A', number: 6 }, { answer: 'Y' }, { answer: 'V' }, { blocked: true }],
    // row 3
    [{ answer: 'S' }, { answer: 'E' }, { answer: 'T' }, { blocked: true }, { blocked: true }, { answer: 'A' }, { blocked: true }],
    // row 4
    [{ answer: 'S', number: 7 }, { answer: 'A' }, { answer: 'A' }, { blocked: true }, { answer: 'H', number: 8 }, { blocked: true }, { blocked: true }],
    // row 5
    [{ blocked: true }, { answer: 'C' }, { blocked: true }, { answer: 'N', number: 9 }, { answer: 'O' }, { answer: 'D', number: 10 }, { answer: 'E' }],
    // row 6
    [{ blocked: true }, { answer: 'T', number: 11 }, { answer: 'Y' }, { answer: 'P' }, { answer: 'E' }, { answer: 'S' }, { blocked: true }],
  ],
  acrossClues: [
    { num: 1, text: 'Source ___ (what devs write)', r: 0, c: 0 },
    { num: 4, text: 'Data structure with indices', r: 2, c: 0 },
    { num: 7, text: 'Collection with no duplicates', r: 4, c: 0 },
    { num: 9, text: 'Server response unit', r: 5, c: 3 },
    { num: 11, text: 'TypeScript checks these', r: 6, c: 1 },
  ],
  downClues: [
    { num: 1, text: 'A programming paradigm (OOP)', r: 0, c: 0 },
    { num: 2, text: 'Information, plural', r: 0, c: 2 },
    { num: 3, text: 'Coffee language (abbr.)', r: 0, c: 5 },
    { num: 5, text: 'Vue or Angular', r: 2, c: 1 },
    { num: 6, text: 'Asynchronous keyword', r: 2, c: 3 },
    { num: 8, text: 'Web server protocol (abbr.)', r: 4, c: 4 },
    { num: 10, text: 'A function result suffix', r: 5, c: 5 },
  ]
}

const grid = reactive([])
const acrossClues = ref(puzzleData.acrossClues)
const downClues = ref(puzzleData.downClues)

const initGrid = () => {
  grid.length = 0
  puzzleData.cells.forEach(row => {
    grid.push(row.map(cell => ({
      ...cell,
      blocked: cell.blocked || false,
      userVal: '',
      checked: false,
      correct: false
    })))
  })
}

const totalCells = computed(() => grid.flat().filter(c => !c.blocked).length)
const filledCount = computed(() => grid.flat().filter(c => !c.blocked && c.userVal).length)

const selectCell = (r, c) => {
  if (grid[r][c].blocked) return
  selected.value = { r, c }
  nextTick(() => {
    const input = cellRefs[r + '-' + c]
    if (input) input.focus()
  })
}

const isHighlighted = (r, c) => {
  if (!selected.value || grid[r][c].blocked) return false
  return r === selected.value.r || c === selected.value.c
}

const onInput = (r, c) => {
  grid[r][c].userVal = grid[r][c].userVal.toUpperCase()
  grid[r][c].checked = false
  // Auto-advance to next cell in the row
  if (grid[r][c].userVal && c + 1 < puzzleData.size && !grid[r][c + 1].blocked) {
    selectCell(r, c + 1)
  }
}

const onKeydown = (e, r, c) => {
  if (e.key === 'Backspace' && !grid[r][c].userVal) {
    if (c > 0 && !grid[r][c - 1].blocked) selectCell(r, c - 1)
  }
  if (e.key === 'ArrowRight' && c + 1 < puzzleData.size) selectCell(r, c + 1)
  if (e.key === 'ArrowLeft' && c > 0) selectCell(r, c - 1)
  if (e.key === 'ArrowDown' && r + 1 < puzzleData.size) selectCell(r + 1, c)
  if (e.key === 'ArrowUp' && r > 0) selectCell(r - 1, c)
}

const goToClue = (clue) => {
  selectCell(clue.r, clue.c)
}

const checkAnswers = () => {
  let allCorrect = true
  grid.forEach(row => {
    row.forEach(cell => {
      if (cell.blocked) return
      cell.checked = true
      cell.correct = cell.userVal === cell.answer
      if (!cell.correct) allCorrect = false
    })
  })
  if (allCorrect) isComplete.value = true
}

const resetPuzzle = () => {
  isComplete.value = false
  initGrid()
}

initGrid()
</script>

<style scoped>
.stat-badge {
  font-size: 1rem;
  padding: 0.3rem 0.75rem;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: var(--radius-sm);
  font-weight: bold;
}

.crossword-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.crossword-grid {
  background: var(--color-bg-card);
  border: 2px solid rgba(124, 77, 255, 0.4);
  border-radius: 4px;
  padding: 2px;
}

.cw-row { display: flex; }

.cw-cell {
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  cursor: pointer;
}

.cw-cell.blocked {
  background: rgba(0, 0, 0, 0.6);
  cursor: default;
}

.cw-cell.selected {
  background: rgba(124, 77, 255, 0.35) !important;
}

.cw-cell.highlighted {
  background: rgba(124, 77, 255, 0.1);
}

.cw-cell.correct {
  background: rgba(46, 204, 113, 0.15);
}

.cw-cell.wrong {
  background: rgba(231, 76, 60, 0.15);
}

.cell-number {
  position: absolute;
  top: 2px;
  left: 3px;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  z-index: 1;
}

.cell-input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  outline: none;
  cursor: pointer;
}

.clues-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 280px;
  max-height: 400px;
  overflow-y: auto;
}

.clue-section h3 {
  color: var(--color-accent-secondary);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.clue {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  line-height: 1.4;
}

.clue:hover { background: rgba(255, 255, 255, 0.05); }
.clue.active { background: rgba(124, 77, 255, 0.15); color: var(--color-text-primary); }

.clue-num {
  font-weight: bold;
  color: var(--color-accent-primary);
}

@media (max-width: 700px) {
  .crossword-layout { flex-direction: column; }
}
</style>
