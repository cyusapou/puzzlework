<template>
  <GameLayout title="Tic-Tac-Toe" :showOverlay="!!winner">
    <template #status>
      <span class="stat-badge">Turn: {{ turn }}</span>
    </template>

    <div class="ttt-board">
      <div v-for="(cell, i) in board" :key="i" class="ttt-cell" @click="move(i)">
        <span v-if="cell" :class="['mark', cell === 'X' ? 'x' : 'o']">{{ cell }}</span>
      </div>
    </div>

    <template #overlay>
      <h2>{{ winner === 'draw' ? 'It\'s a Draw! 🤝' : winner + ' Wins! 🏆' }}</h2>
      <BaseButton @click="reset" variant="primary">Play Again</BaseButton>
    </template>
  </GameLayout>
</template>

<script setup>
import { ref } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './board.engines.js'

const board = ref(Array(9).fill(null))
const turn = ref('X')
const winner = ref(null)

const move = (i) => {
  if (board.value[i] || winner.value) return
  board.value[i] = turn.value
  winner.value = Engine.checkWin(board.value)
  turn.value = turn.value === 'X' ? 'O' : 'X'
}
const reset = () => { board.value = Array(9).fill(null); winner.value = null; turn.value = 'X' }
</script>

<style scoped>
.stat-badge {
  font-size: 1.2rem;
  padding: 0.3rem 0.75rem;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: var(--radius-sm);
  font-weight: bold;
}

.ttt-board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  gap: 8px;
  padding: 12px;
  background: var(--color-bg-card);
  border: 2px solid rgba(124, 77, 255, 0.4);
  box-shadow: 0 0 20px rgba(124, 77, 255, 0.15);
  border-radius: var(--radius-md);
}

.ttt-cell {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}
.ttt-cell:hover { background: rgba(124, 77, 255, 0.12); }

.mark {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1;
}
.mark.x { color: #7c4dff; }
.mark.o { color: #00e5ff; }
</style>
