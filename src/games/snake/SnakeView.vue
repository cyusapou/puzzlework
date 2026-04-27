<template>
  <GameLayout title="Snake" :showOverlay="!playing">
    <template #status>
      <span class="stat-badge">Score: {{ state.score }}</span>
    </template>

    <div class="snake-stage">
      <canvas ref="canvasRef" :width="400" :height="400"></canvas>
    </div>

    <template #overlay>
      <h2 v-if="state.isGameOver">Game Over! 🐍</h2>
      <h2 v-else>Snake</h2>
      <p v-if="state.isGameOver">Score: {{ state.score }}</p>
      <p v-else>Use arrow keys to move</p>
      <BaseButton @click="startGame" variant="primary">{{ state.isGameOver ? 'Try Again' : 'Start Game' }}</BaseButton>
    </template>

    <template #controls>
      <strong>Arrow Keys</strong> to move
    </template>
  </GameLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './snake.engine.js'

const canvasRef = ref(null)
const state = ref(Engine.createInitialState())
const playing = ref(false)
let loopId = null

const startGame = () => {
  state.value = Engine.createInitialState()
  playing.value = true
}

const draw = () => {
  const ctx = canvasRef.value.getContext('2d')
  const scale = 400 / Engine.SIZE
  
  ctx.fillStyle = '#141929'
  ctx.fillRect(0, 0, 400, 400)
  
  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'
  ctx.lineWidth = 0.5
  for (let i = 0; i <= Engine.SIZE; i++) {
    ctx.beginPath(); ctx.moveTo(i * scale, 0); ctx.lineTo(i * scale, 400); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i * scale); ctx.lineTo(400, i * scale); ctx.stroke()
  }

  // Food with glow
  ctx.shadowColor = '#ff1744'
  ctx.shadowBlur = 10
  ctx.fillStyle = '#ff1744'
  ctx.beginPath()
  ctx.arc(state.value.food.x * scale + scale/2, state.value.food.y * scale + scale/2, scale/2 - 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  // Snake with gradient
  state.value.snake.forEach((segment, i) => {
    const alpha = 1 - (i / state.value.snake.length) * 0.4
    ctx.fillStyle = i === 0 ? '#00e676' : `rgba(0, 230, 118, ${alpha})`
    ctx.beginPath()
    ctx.roundRect(segment.x * scale + 1, segment.y * scale + 1, scale - 2, scale - 2, 3)
    ctx.fill()
  })
}

const gameLoop = () => {
  if (!playing.value || state.value.isGameOver) {
    if (state.value.isGameOver) playing.value = false
    return
  }
  state.value = Engine.moveSnake(state.value)
  if (state.value.isGameOver) playing.value = false
  draw()
}

const handleKeydown = (e) => {
  if (!playing.value) return
  const dir = state.value.direction
  if (e.key === 'ArrowUp' && dir.y === 0) state.value.direction = { x: 0, y: -1 }
  if (e.key === 'ArrowDown' && dir.y === 0) state.value.direction = { x: 0, y: 1 }
  if (e.key === 'ArrowLeft' && dir.x === 0) state.value.direction = { x: -1, y: 0 }
  if (e.key === 'ArrowRight' && dir.x === 0) state.value.direction = { x: 1, y: 0 }
  e.preventDefault()
}

onMounted(() => {
  const ctx = canvasRef.value.getContext('2d')
  ctx.fillStyle = '#141929'
  ctx.fillRect(0, 0, 400, 400)
  loopId = setInterval(gameLoop, 130)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  clearInterval(loopId)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.stat-badge {
  font-size: 1.2rem;
  padding: 0.3rem 0.75rem;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: var(--radius-sm);
  color: var(--color-accent-secondary);
  font-weight: bold;
}

.snake-stage {
  border: 2px solid rgba(124, 77, 255, 0.4);
  box-shadow: 0 0 20px rgba(124, 77, 255, 0.15);
  border-radius: var(--radius-md);
  overflow: hidden;
}

canvas {
  display: block;
}
</style>
