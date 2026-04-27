<template>
  <GameLayout title="Flappy Bird" :showOverlay="!playing">
    <template #status>
      <span class="stat-badge">Score: {{ state.score }}</span>
    </template>

    <div class="flappy-stage" @mousedown="flap">
      <canvas ref="canvasRef" :width="400" :height="400"></canvas>
    </div>

    <template #overlay>
      <h2 v-if="state.isGameOver">Game Over! 🐦</h2>
      <h2 v-else>Flappy Bird</h2>
      <p v-if="state.isGameOver">Score: {{ state.score }}</p>
      <p v-else>Click or press Space to flap</p>
      <BaseButton @click="startGame" variant="primary">{{ state.isGameOver ? 'Try Again' : 'Start Game' }}</BaseButton>
    </template>

    <template #controls>
      <strong>Click</strong> or <strong>Space</strong> to flap
    </template>
  </GameLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './flappy.engine.js'

const canvasRef = ref(null)
const state = ref(Engine.createInitialState())
const playing = ref(false)
let loopId = null

const startGame = () => {
  state.value = Engine.createInitialState()
  playing.value = true
}

const flap = () => {
  if (playing.value && !state.value.isGameOver) {
    state.value.velocity = -8
  }
}

const draw = () => {
  const ctx = canvasRef.value.getContext('2d')
  
  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, '#1a1a2e')
  gradient.addColorStop(1, '#16213e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 400, 400)

  // Stars
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  for (let i = 0; i < 30; i++) {
    const x = (i * 137.5 + state.value.frame * 0.2) % 400
    const y = (i * 97.3) % 400
    ctx.fillRect(x, y, 1.5, 1.5)
  }

  // Pipes with gradient
  state.value.pipes.forEach(p => {
    const pipeGrad = ctx.createLinearGradient(p.x, 0, p.x + 50, 0)
    pipeGrad.addColorStop(0, '#2ecc71')
    pipeGrad.addColorStop(0.5, '#27ae60')
    pipeGrad.addColorStop(1, '#1e8449')
    ctx.fillStyle = pipeGrad
    ctx.fillRect(p.x, 0, 50, p.gapTop)
    ctx.fillRect(p.x, p.gapTop + 100, 50, 400)
    // Pipe caps
    ctx.fillStyle = '#27ae60'
    ctx.fillRect(p.x - 3, p.gapTop - 10, 56, 10)
    ctx.fillRect(p.x - 3, p.gapTop + 100, 56, 10)
  })

  // Bird
  ctx.fillStyle = '#f1c40f'
  ctx.shadowColor = '#f39c12'
  ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.arc(90, state.value.birdY, 15, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0
  // Eye
  ctx.fillStyle = 'white'
  ctx.beginPath(); ctx.arc(96, state.value.birdY - 4, 5, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'black'
  ctx.beginPath(); ctx.arc(98, state.value.birdY - 4, 2.5, 0, Math.PI * 2); ctx.fill()
}

const gameLoop = () => {
  if (!playing.value) return
  state.value = Engine.update(state.value)
  if (state.value.isGameOver) playing.value = false
  draw()
}

const handleKeydown = (e) => {
  if (e.code === 'Space') {
    e.preventDefault()
    flap()
  }
}

onMounted(() => {
  const ctx = canvasRef.value.getContext('2d')
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, 400, 400)
  loopId = setInterval(gameLoop, 20)
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

.flappy-stage {
  border: 2px solid rgba(124, 77, 255, 0.4);
  box-shadow: 0 0 20px rgba(124, 77, 255, 0.15);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
}

canvas {
  display: block;
}
</style>
