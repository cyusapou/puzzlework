<template>
  <GameLayout title="Chess" :showOverlay="false">
    <template #status>
      <div class="turn-badge" :class="turn">
        <span class="turn-dot"></span>
        {{ turn === 'white' ? 'White' : 'Black' }}'s Turn
      </div>
      <BaseButton @click="reset" variant="outline" size="sm">New Game</BaseButton>
    </template>

    <div class="chess-board-wrapper">
      <div class="rank-labels">
        <span v-for="n in 8" :key="n">{{ 9 - n }}</span>
      </div>
      <div class="chess-board">
        <div v-for="(row, r) in board" :key="r" class="chess-row">
          <div 
            v-for="(piece, c) in row" :key="c" 
            class="chess-cell"
            :class="{ 
              dark: (r + c) % 2 === 1, 
              selected: selected?.r === r && selected?.c === c,
              highlight: isHighlight(r, c),
              'last-move': isLastMove(r, c)
            }"
            @click="handleClick(r, c)"
          >
            <span v-if="piece" class="piece" :class="piece.color">{{ piece.char }}</span>
            <span v-if="isHighlight(r, c) && !piece" class="move-dot"></span>
            <span v-if="isHighlight(r, c) && piece" class="capture-ring"></span>
          </div>
        </div>
      </div>
      <div class="file-labels">
        <span v-for="f in 'abcdefgh'" :key="f">{{ f }}</span>
      </div>
    </div>

    <template #controls>
      Click a piece to select, then click a highlighted square to move.
    </template>
  </GameLayout>
</template>

<script setup>
import { ref } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './chess.engine.js'

const board = ref(Engine.createBoard())
const turn = ref('white')
const selected = ref(null)
const lastMove = ref(null)

const reset = () => {
  board.value = Engine.createBoard()
  turn.value = 'white'
  selected.value = null
  lastMove.value = null
}

const handleClick = (r, c) => {
  if (!selected.value) {
    const piece = board.value[r][c]
    if (piece && piece.color === turn.value) {
      selected.value = { r, c }
    }
  } else {
    if (Engine.isValidMove(board.value, selected.value, { r, c }, turn.value)) {
      lastMove.value = { from: { ...selected.value }, to: { r, c } }
      board.value[r][c] = board.value[selected.value.r][selected.value.c]
      board.value[selected.value.r][selected.value.c] = null
      turn.value = turn.value === 'white' ? 'black' : 'white'
    }
    selected.value = null
  }
}

const isHighlight = (r, c) => {
  if (!selected.value) return false
  return Engine.isValidMove(board.value, selected.value, { r, c }, turn.value)
}

const isLastMove = (r, c) => {
  if (!lastMove.value) return false
  return (r === lastMove.value.from.r && c === lastMove.value.from.c) ||
         (r === lastMove.value.to.r && c === lastMove.value.to.c)
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
  font-size: 1rem;
}
.turn-badge.white { background: rgba(255,255,255,0.15); color: white; }
.turn-badge.black { background: rgba(0,0,0,0.5); color: white; border: 1px solid rgba(255,255,255,0.2); }
.turn-dot { width: 10px; height: 10px; border-radius: 50%; }
.turn-badge.white .turn-dot { background: white; }
.turn-badge.black .turn-dot { background: #555; }

.chess-board-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.rank-labels {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: -24px;
  top: 0;
  height: 100%;
}
.rank-labels span {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
}

.chess-board {
  position: relative;
  border: 3px solid rgba(124, 77, 255, 0.4);
  box-shadow: 0 0 30px rgba(124, 77, 255, 0.15);
  border-radius: 4px;
  overflow: hidden;
}

.file-labels {
  display: flex;
  width: 480px;
  justify-content: space-around;
}
.file-labels span {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
  width: 60px;
  text-align: center;
}

.chess-row { display: flex; }

.chess-cell {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: background 0.15s;
}
.chess-cell.dark { background: #779556; }
.chess-cell:not(.dark) { background: #ebecd0; }
.chess-cell.selected { background: rgba(255, 255, 100, 0.6) !important; }
.chess-cell.last-move { background: rgba(255, 255, 100, 0.25) !important; }
.chess-cell:hover { filter: brightness(1.1); }

.move-dot {
  width: 16px;
  height: 16px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 50%;
}

.capture-ring {
  position: absolute;
  width: 54px;
  height: 54px;
  border: 4px solid rgba(0, 0, 0, 0.15);
  border-radius: 50%;
}

.piece {
  font-size: 2.6rem;
  user-select: none;
  line-height: 1;
  filter: drop-shadow(1px 2px 2px rgba(0,0,0,0.3));
}
</style>
