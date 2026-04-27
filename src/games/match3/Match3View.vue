<template>
  <GameLayout title="Match-3" :showOverlay="false">
    <template #status>
      <span class="stat-badge">Score: {{ score }}</span>
      <BaseButton @click="initGame" variant="outline" size="sm">New Game</BaseButton>
    </template>

    <div class="match3-board">
      <div v-for="(row, r) in grid" :key="r" class="m3-row">
        <div 
          v-for="(type, c) in row" :key="c" 
          class="m3-cell"
          :class="{ selected: selected?.r === r && selected?.c === c, empty: !type }"
          @click="handleClick(r, c)"
        >
          <span v-if="type" class="gem">{{ type }}</span>
        </div>
      </div>
    </div>

    <template #controls>
      Click two adjacent gems to swap them and match 3 or more!
    </template>
  </GameLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './match3.engine.js'

const grid = ref([])
const score = ref(0)
const selected = ref(null)

const initGame = () => {
  grid.value = Engine.createGrid()
  score.value = 0
  selected.value = null
}

const handleClick = async (r, c) => {
  if (!grid.value[r][c]) return
  if (!selected.value) {
    selected.value = { r, c }
  } else {
    const { r: r1, c: c1 } = selected.value
    const isAdjacent = Math.abs(r - r1) + Math.abs(c - c1) === 1
    if (isAdjacent) {
      let nextGrid = Engine.swap(grid.value, r1, c1, r, c)
      if (Engine.hasMatches(nextGrid)) {
        grid.value = nextGrid
        await processMatches()
      }
    }
    selected.value = null
  }
}

const processMatches = async () => {
  let matched = true
  while (matched) {
    matched = false
    const toClear = new Set()
    for (let r = 0; r < Engine.SIZE; r++) {
      for (let c = 0; c < Engine.SIZE; c++) {
        const match = Engine.getMatch(grid.value, r, c)
        if (match) {
          matched = true
          if (match.type === 'horizontal') match.indices.forEach(idx => toClear.add(`${r},${idx}`))
          else match.indices.forEach(idx => toClear.add(`${idx},${c}`))
        }
      }
    }
    if (matched) {
      score.value += toClear.size * 10
      toClear.forEach(key => {
        const [r, c] = key.split(',').map(Number)
        grid.value[r][c] = null
      })
      await new Promise(r => setTimeout(r, 250))
      applyGravity()
      await new Promise(r => setTimeout(r, 250))
    }
  }
}

const applyGravity = () => {
  for (let c = 0; c < Engine.SIZE; c++) {
    let emptyRow = Engine.SIZE - 1
    for (let r = Engine.SIZE - 1; r >= 0; r--) {
      if (grid.value[r][c]) {
        grid.value[emptyRow][c] = grid.value[r][c]
        if (emptyRow !== r) grid.value[r][c] = null
        emptyRow--
      }
    }
    for (let r = emptyRow; r >= 0; r--) {
      grid.value[r][c] = Engine.TYPES[Math.floor(Math.random() * Engine.TYPES.length)]
    }
  }
}

onMounted(initGame)
</script>

<style scoped>
.stat-badge {
  font-size: 1.2rem;
  padding: 0.3rem 0.75rem;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: var(--radius-sm);
  font-weight: bold;
  color: var(--color-accent-secondary);
}

.match3-board {
  background: var(--color-bg-card);
  border: 2px solid rgba(124, 77, 255, 0.4);
  box-shadow: 0 0 20px rgba(124, 77, 255, 0.15);
  border-radius: var(--radius-md);
  padding: 6px;
}

.m3-row { display: flex; }

.m3-cell {
  width: 52px;
  height: 52px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin: 2px;
  background: rgba(255, 255, 255, 0.03);
}

.m3-cell:hover { background: rgba(124, 77, 255, 0.1); }
.m3-cell.selected {
  background: rgba(124, 77, 255, 0.3);
  transform: scale(1.1);
  z-index: 1;
  box-shadow: 0 0 12px rgba(124, 77, 255, 0.4);
}
.m3-cell.empty { opacity: 0.3; }

.gem {
  font-size: 1.8rem;
  transition: transform 0.2s;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
}
</style>
