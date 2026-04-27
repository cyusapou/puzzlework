<template>
  <GameLayout title="Connect Four" :showOverlay="!!winner">
    <template #status>
      <span class="stat-badge" :style="{ color: turn === 'Red' ? '#ef5350' : '#ffee58' }">Turn: {{ turn }}</span>
    </template>

    <div class="c4-board">
      <div v-for="c in 7" :key="c" class="c4-column" @click="drop(c-1)">
        <div v-for="r in 6" :key="r" class="c4-cell">
          <div v-if="board[r-1][c-1]" class="token" :class="board[r-1][c-1]"></div>
        </div>
      </div>
    </div>

    <template #overlay>
      <h2 :style="{ color: winner === 'Red' ? '#ef5350' : '#ffee58' }">{{ winner }} Wins! 🎉</h2>
      <BaseButton @click="reset" variant="primary">Play Again</BaseButton>
    </template>
  </GameLayout>
</template>

<script setup>
import { ref } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './board.engines.js'

const board = ref(Array.from({length: 6}, () => Array(7).fill(null)))
const turn = ref('Red')
const winner = ref(null)

const drop = (c) => {
  if (winner.value) return
  for (let r = 5; r >= 0; r--) {
    if (!board.value[r][c]) {
      board.value[r][c] = turn.value
      winner.value = Engine.checkWinC4(board.value)
      turn.value = turn.value === 'Red' ? 'Yellow' : 'Red'
      return
    }
  }
}
const reset = () => { board.value = Array.from({length: 6}, () => Array(7).fill(null)); winner.value = null; turn.value = 'Red' }
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

.c4-board {
  display: flex;
  background: linear-gradient(135deg, #1565c0, #0d47a1);
  padding: 12px;
  border-radius: 12px;
  gap: 6px;
  box-shadow: 0 8px 32px rgba(13, 71, 161, 0.4);
}

.c4-column {
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
}
.c4-column:hover .c4-cell { background: rgba(0, 0, 0, 0.35); }

.c4-cell {
  width: 56px;
  height: 56px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.token {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  transition: transform 0.3s;
}
.token.Red {
  background: radial-gradient(circle at 35% 35%, #ff7043, #e53935);
  box-shadow: 0 4px 12px rgba(229, 57, 53, 0.5);
}
.token.Yellow {
  background: radial-gradient(circle at 35% 35%, #fff176, #fdd835);
  box-shadow: 0 4px 12px rgba(253, 216, 53, 0.5);
}
</style>
