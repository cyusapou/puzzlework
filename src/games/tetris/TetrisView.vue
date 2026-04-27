<template>
  <div class="tetris-view animate-slide-up">
    <div class="game-header">
      <router-link to="/games" class="back-link">← Back to Library</router-link>
      <h1>Tetris</h1>
    </div>

    <div class="game-container">
      <div class="canvas-wrapper">
        <canvas ref="boardCanvas" width="300" height="600" class="game-canvas"></canvas>
        <div class="overlay" v-if="gameState !== 'playing'">
          <div class="overlay-content">
            <h2 v-if="gameState === 'ready'">Ready?</h2>
            <h2 v-if="gameState === 'paused'">Paused</h2>
            <div v-if="gameState === 'gameover'">
              <h2>Game Over</h2>
              <p>Final Score: {{ score }}</p>
            </div>
            <BaseButton @click="startGame" variant="primary" size="lg">
              {{ gameState === 'gameover' ? 'Play Again' : (gameState === 'paused' ? 'Resume' : 'Start Game') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <TetrisHUD :score="score" :level="level" :lines="lines" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import TetrisHUD from './TetrisHUD.vue'
import * as Engine from './tetris.engine.js'

const boardCanvas = ref(null)
const ctx = ref(null)
const BLOCK_SIZE = 30

// Game State
const board = ref(Engine.createBoard())
const currentPiece = ref(null)
const score = ref(0)
const level = ref(1)
const lines = ref(0)
const gameState = ref('ready') // ready, playing, paused, gameover

// Timing
let dropCounter = 0
let dropInterval = 1000
let lastTime = 0
let animationId = null

const initCanvas = () => {
  ctx.value = boardCanvas.value.getContext('2d')
  ctx.value.scale(BLOCK_SIZE, BLOCK_SIZE)
}

const drawBlock = (x, y, typeId) => {
  ctx.value.fillStyle = Engine.PIECES[typeId].color
  ctx.value.fillRect(x, y, 1, 1)
  
  // Grid line for block
  ctx.value.strokeStyle = 'rgba(0,0,0,0.3)'
  ctx.value.lineWidth = 0.05
  ctx.value.strokeRect(x, y, 1, 1)
}

const drawBoard = () => {
  // Clear canvas
  ctx.value.fillStyle = 'rgba(20, 25, 41, 0.8)'
  ctx.value.fillRect(0, 0, Engine.COLS, Engine.ROWS)

  // Draw landed blocks
  board.value.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) drawBlock(x, y, value)
    })
  })

  // Draw current piece
  if (currentPiece.value && gameState.value === 'playing') {
    currentPiece.value.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) drawBlock(currentPiece.value.x + x, currentPiece.value.y + y, value)
      })
    })
  }
}

const gameLoop = (time = 0) => {
  if (gameState.value !== 'playing') return

  const deltaTime = time - lastTime
  lastTime = time
  dropCounter += deltaTime

  if (dropCounter > dropInterval) {
    moveDown()
  }

  drawBoard()
  animationId = requestAnimationFrame(gameLoop)
}

const moveDown = () => {
  if (!Engine.checkCollision(board.value, currentPiece.value, 0, 1)) {
    currentPiece.value.y++
  } else {
    lockAndSpawn()
  }
  dropCounter = 0
}

const hardDrop = () => {
  while (!Engine.checkCollision(board.value, currentPiece.value, 0, 1)) {
    currentPiece.value.y++
  }
  lockAndSpawn()
  dropCounter = 0
  drawBoard() // force immediate draw
}

const lockAndSpawn = () => {
  if (currentPiece.value.y <= 0) {
    gameState.value = 'gameover'
    return
  }

  board.value = Engine.lockPiece(board.value, currentPiece.value)
  
  const { newBoard, linesCleared } = Engine.clearLines(board.value)
  board.value = newBoard
  
  if (linesCleared > 0) {
    lines.value += linesCleared
    score.value += Engine.calculateScore(linesCleared, level.value)
    level.value = Math.floor(lines.value / 10) + 1
    dropInterval = Math.max(100, 1000 - (level.value - 1) * 100) // Speed up
  }

  currentPiece.value = Engine.spawnPiece()
  if (Engine.checkCollision(board.value, currentPiece.value)) {
    gameState.value = 'gameover'
  }
}

const handleKeydown = (e) => {
  if (gameState.value !== 'playing') {
    if (e.code === 'Escape' && gameState.value === 'paused') {
      gameState.value = 'playing'
      lastTime = performance.now()
      gameLoop()
    }
    return
  }

  switch(e.code) {
    case 'ArrowLeft':
      if (!Engine.checkCollision(board.value, currentPiece.value, -1, 0)) currentPiece.value.x--
      break
    case 'ArrowRight':
      if (!Engine.checkCollision(board.value, currentPiece.value, 1, 0)) currentPiece.value.x++
      break
    case 'ArrowDown':
      moveDown()
      break
    case 'ArrowUp':
      const rotated = Engine.rotatePiece(currentPiece.value)
      if (!Engine.checkCollision(board.value, rotated)) currentPiece.value = rotated
      break
    case 'Space':
      hardDrop()
      break
    case 'Escape':
      gameState.value = 'paused'
      break
  }
  
  if (gameState.value === 'playing') drawBoard()
}

const startGame = () => {
  if (gameState.value === 'gameover' || gameState.value === 'ready') {
    board.value = Engine.createBoard()
    score.value = 0
    lines.value = 0
    level.value = 1
    dropInterval = 1000
    currentPiece.value = Engine.spawnPiece()
  }
  
  gameState.value = 'playing'
  lastTime = performance.now()
  gameLoop()
}

onMounted(() => {
  initCanvas()
  drawBoard()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  cancelAnimationFrame(animationId)
})
</script>

<style scoped>
.tetris-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.game-header {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.game-header h1 {
  margin: 0.5rem 0 0 0;
  color: var(--color-text-primary);
}

.back-link {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.back-link:hover {
  color: var(--color-accent-primary);
}

.game-container {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.canvas-wrapper {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 2px solid rgba(124, 77, 255, 0.5);
  box-shadow: 0 0 20px rgba(124, 77, 255, 0.2);
  background: var(--color-bg-base);
}

.game-canvas {
  display: block;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(11, 15, 26, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-content {
  text-align: center;
}

.overlay-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--color-accent-secondary);
}

@media (max-width: 768px) {
  .game-container {
    flex-direction: column;
    align-items: center;
  }
  .tetris-hud {
    width: 300px;
    flex-direction: row;
  }
}
</style>
