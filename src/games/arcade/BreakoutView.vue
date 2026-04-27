<template>
  <GameLayout title="Breakout" :showOverlay="!playing">
    <template #status>
      <span class="stat-badge">Score: {{ score }}</span>
      <span class="stat-badge">Lives: {{ lives }}</span>
    </template>

    <div class="breakout-stage">
      <canvas ref="canvas" :width="600" :height="450"></canvas>
    </div>

    <template #overlay>
      <h2 v-if="won">You Win! 🎉</h2>
      <h2 v-else-if="lives <= 0">Game Over 💔</h2>
      <h2 v-else>Breakout</h2>
      <p v-if="won || lives <= 0">Final Score: {{ score }}</p>
      <p v-else>Move your mouse to control the paddle</p>
      <BaseButton @click="startGame" variant="primary">{{ won || lives <= 0 ? 'Play Again' : 'Start Game' }}</BaseButton>
    </template>

    <template #controls>
      <strong>Move mouse</strong> to control the paddle
    </template>
  </GameLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'

const canvas = ref(null)
const playing = ref(false)
const score = ref(0)
const lives = ref(3)
const won = ref(false)
let ball = { x: 300, y: 350, dx: 3, dy: -3 }
let paddleX = 250
let bricks = []
let loopId = null

const BRICK_COLORS = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db']

const startGame = () => {
  score.value = 0
  lives.value = 3
  won.value = false
  playing.value = true
  bricks = []
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 10; c++) {
      bricks.push({ x: c * 58 + 10, y: r * 28 + 40, w: 52, h: 22, active: true, color: BRICK_COLORS[r] })
    }
  }
  resetBall()
}

const resetBall = () => { ball = { x: paddleX + 50, y: 380, dx: 3, dy: -3 } }

const update = () => {
  if (!playing.value) return
  ball.x += ball.dx; ball.y += ball.dy

  if (ball.x < 5 || ball.x > 595) ball.dx *= -1
  if (ball.y < 5) ball.dy *= -1

  // Paddle collision
  if (ball.y > 415 && ball.x > paddleX && ball.x < paddleX + 100) {
    ball.dy = -Math.abs(ball.dy)
    ball.dx += (ball.x - paddleX - 50) * 0.05
  }

  // Ball lost
  if (ball.y > 450) {
    lives.value--
    if (lives.value <= 0) { playing.value = false }
    else resetBall()
  }

  // Brick collision
  bricks.forEach(b => {
    if (b.active && ball.x > b.x && ball.x < b.x + b.w && ball.y > b.y && ball.y < b.y + b.h) {
      b.active = false
      ball.dy *= -1
      score.value += 10
    }
  })

  if (bricks.every(b => !b.active)) {
    won.value = true
    playing.value = false
  }

  draw()
}

const draw = () => {
  const ctx = canvas.value.getContext('2d')
  ctx.fillStyle = '#0b0f1a'
  ctx.fillRect(0, 0, 600, 450)

  // Bricks
  bricks.forEach(b => {
    if (!b.active) return
    ctx.fillStyle = b.color
    ctx.beginPath()
    ctx.roundRect(b.x, b.y, b.w, b.h, 3)
    ctx.fill()
  })

  // Paddle with glow
  ctx.shadowColor = '#7c4dff'
  ctx.shadowBlur = 10
  ctx.fillStyle = '#7c4dff'
  ctx.beginPath()
  ctx.roundRect(paddleX, 425, 100, 12, 6)
  ctx.fill()
  ctx.shadowBlur = 0

  // Ball
  ctx.shadowColor = 'white'
  ctx.shadowBlur = 10
  ctx.fillStyle = 'white'
  ctx.beginPath(); ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2); ctx.fill()
  ctx.shadowBlur = 0
}

const handleMouseMove = (e) => {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  paddleX = Math.max(0, Math.min(500, e.clientX - rect.left - 50))
}

onMounted(() => {
  const ctx = canvas.value.getContext('2d')
  ctx.fillStyle = '#0b0f1a'
  ctx.fillRect(0, 0, 600, 450)
  loopId = setInterval(update, 16)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  clearInterval(loopId)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.stat-badge {
  font-size: 1.1rem;
  padding: 0.3rem 0.75rem;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: var(--radius-sm);
  font-weight: bold;
}

.breakout-stage {
  border: 2px solid rgba(124, 77, 255, 0.4);
  box-shadow: 0 0 20px rgba(124, 77, 255, 0.15);
  border-radius: var(--radius-md);
  overflow: hidden;
}

canvas { display: block; }
</style>
