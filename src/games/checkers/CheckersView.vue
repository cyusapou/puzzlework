<template>
  <GameLayout title="Checkers" :showOverlay="false">
    <template #status>
      <div class="turn-badge" :class="turn">
        <span class="turn-dot"></span>
        {{ turn === 'white' ? 'White' : 'Black' }}'s Turn
      </div>
      <BaseButton @click="reset" variant="outline" size="sm">New Game</BaseButton>
    </template>

    <div class="checkers-board">
      <div v-for="(row, r) in board" :key="r" class="ck-row">
        <div 
          v-for="(piece, c) in row" :key="c" 
          class="ck-cell"
          :class="{ 
            dark: (r + c) % 2 === 1, 
            selected: selected?.r === r && selected?.c === c,
            highlight: isHighlight(r, c)
          }"
          @click="handleClick(r, c)"
        >
          <div v-if="piece" class="ck-piece" :class="[piece.color, { king: piece.isKing }]">
            <span v-if="piece.isKing" class="crown">👑</span>
          </div>
          <span v-if="isHighlight(r, c) && !piece" class="move-dot"></span>
        </div>
      </div>
    </div>

    <template #controls>
      Click a piece to select, then click a highlighted square to move. Jump over opponents to capture!
    </template>
  </GameLayout>
</template>

<script setup>
import { ref } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './checkers.engine.js'

const board = ref(Engine.createBoard())
const turn = ref('white')
const selected = ref(null)

const reset = () => {
  board.value = Engine.createBoard()
  turn.value = 'white'
  selected.value = null
}

const handleClick = (r, c) => {
  if (!selected.value) {
    const piece = board.value[r][c]
    if (piece && piece.color === turn.value) {
      selected.value = { r, c }
    }
  } else {
    if (Engine.isValidMove(board.value, selected.value, { r, c }, turn.value)) {
      const piece = board.value[selected.value.r][selected.value.c]
      if (Math.abs(r - selected.value.r) === 2) {
        const midR = (r + selected.value.r) / 2
        const midC = (c + selected.value.c) / 2
        board.value[midR][midC] = null
      }
      board.value[r][c] = piece
      board.value[selected.value.r][selected.value.c] = null
      if ((turn.value === 'white' && r === 0) || (turn.value === 'black' && r === 7)) {
        piece.isKing = true
      }
      turn.value = turn.value === 'white' ? 'black' : 'white'
    }
    selected.value = null
  }
}

const isHighlight = (r, c) => {
  if (!selected.value) return false
  return Engine.isValidMove(board.value, selected.value, { r, c }, turn.value)
}
</script>

<style scoped>
.turn-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.4rem 1rem;
  border-radius: var(--radius-sm);
  font-weight: bold;
}
.turn-badge.white { background: rgba(255,255,255,0.15); color: white; }
.turn-badge.black { background: rgba(0,0,0,0.5); color: white; border: 1px solid rgba(255,255,255,0.2); }
.turn-dot { width: 10px; height: 10px; border-radius: 50%; }
.turn-badge.white .turn-dot { background: white; }
.turn-badge.black .turn-dot { background: #555; }

.checkers-board {
  border: 3px solid rgba(124, 77, 255, 0.4);
  box-shadow: 0 0 30px rgba(124, 77, 255, 0.15);
  border-radius: 4px;
  overflow: hidden;
}

.ck-row { display: flex; }

.ck-cell {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}
.ck-cell.dark { background: #5d4037; }
.ck-cell:not(.dark) { background: #d7ccc8; }
.ck-cell.selected { background: rgba(255, 255, 100, 0.5) !important; }

.move-dot {
  width: 16px;
  height: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
}

.ck-piece {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  cursor: grab;
}
.ck-piece:hover { transform: scale(1.08); }

.ck-piece.white {
  background: radial-gradient(circle at 35% 35%, #fff, #ccc);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.1);
}
.ck-piece.black {
  background: radial-gradient(circle at 35% 35%, #555, #222);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5), inset 0 -2px 4px rgba(0, 0, 0, 0.2);
}
.ck-piece.king {
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.5), 0 3px 8px rgba(0, 0, 0, 0.3);
}

.crown { font-size: 1.2rem; }
</style>
