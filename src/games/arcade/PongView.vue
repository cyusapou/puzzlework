<template>
  <GameLayout title="Pong" :showOverlay="!playing">
    <template #status>
      <span class="stat-badge">You {{ playerScore }} — {{ aiScore }} AI</span>
    </template>

    <div class="pong-stage">
      <canvas ref="canvas" :width="600" :height="400"></canvas>
    </div>

    <template #overlay>
      <h2 v-if="gameOver">{{ playerScore > aiScore ? 'You Win! 🏆' : 'AI Wins! 🤖' }}</h2>
      <h2 v-else>Pong</h2>
      <p v-if="!gameOver">First to 5 wins! Move your mouse to control the paddle.</p>
      <BaseButton @click="startGame" variant="primary">{{ gameOver ? 'Rematch' : 'Start Game' }}</BaseButton>
    </template>

    <template #controls>
      <strong>Move mouse</strong> up/down to control your paddle
    </template>
  </GameLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'

const canvas = ref(null)
const playing = ref(false)
const gameOver = ref(false)
const playerScore = ref(0)
const aiScore = ref(0)
let ball = { x: 300, y: 200, dx: 4, dy: 3 }
let paddleY = 160
let aiPaddleY = 160
let loopId = null

const startGame = () => {
  playerScore.value = 0
  aiScore.value = 0
  gameOver.value = false
  playing.value = true
  resetBall()
}

const resetBall = () => {
  ball = { x: 300, y: 200, dx: (Math.random() > 0.5 ? 4 : -4), dy: (Math.random() - 0.5) * 6 }
}

const update = () => {
  if (!playing.value) return
  
  ball.x += ball.dx
  ball.y += ball.dy

  if (ball.y < 5 || ball.y > 395) ball.dy *= -1

  // Player paddle collision
  if (ball.x < 25 && ball.x > 15 && ball.y > paddleY && ball.y < paddleY + 80) {
    ball.dx = Math.abs(ball.dx) * 1.05
    ball.dy += (ball.y - paddleY - 40) * 0.15
  }

  // AI paddle collision
  if (ball.x > 575 && ball.x < 585 && ball.y > aiPaddleY && ball.y < aiPaddleY + 80) {
    ball.dx = -Math.abs(ball.dx) * 1.05
    ball.dy += (ball.y - aiPaddleY - 40) * 0.15
  }

  // AI movement (imperfect to make it beatable)
  const aiTarget = ball.y - 40
  const aiSpeed = 3.5
  if (aiPaddleY < aiTarget) aiPaddleY += Math.min(aiSpeed, aiTarget - aiPaddleY)
  else aiPaddleY -= Math.min(aiSpeed, aiPaddleY - aiTarget)

  // Scoring
  if (ball.x < 0) { aiScore.value++; resetBall() }
  if (ball.x > 600) { playerScore.value++; resetBall() }

  if (playerScore.value >= 5 || aiScore.value >= 5) {
    gameOver.value = true
    playing.value = false
  }

  draw()
}

const draw = () => {
  const ctx = canvas.value.getContext('2d')
  ctx.fillStyle = '#0b0f1a'
  ctx.fillRect(0, 0, 600, 400)

  // Center line
  ctx.setLineDash([8, 8])
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(300, 0); ctx.lineTo(300, 400); ctx.stroke()
  ctx.setLineDash([])

  // Paddles with glow
  ctx.shadowColor = '#7c4dff'
  ctx.shadowBlur = 10
  ctx.fillStyle = '#7c4dff'
  ctx.fillRect(15, paddleY, 10, 80)
  ctx.shadowColor = '#00e5ff'
  ctx.fillStyle = '#00e5ff'
  ctx.fillRect(575, aiPaddleY, 10, 80)
  ctx.shadowBlur = 0

  // Ball with glow
  ctx.shadowColor = 'white'
  ctx.shadowBlur = 12
  ctx.fillStyle = 'white'
  ctx.beginPath(); ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2); ctx.fill()
  ctx.shadowBlur = 0

  // Score display
  ctx.font = 'bold 48px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  ctx.textAlign = 'center'
  ctx.fillText(playerScore.value, 200, 60)
  ctx.fillText(aiScore.value, 400, 60)
}

const handleMouseMove = (e) => {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  paddleY = Math.max(0, Math.min(320, e.clientY - rect.top - 40))
}

onMounted(() => {
  const ctx = canvas.value.getContext('2d')
  ctx.fillStyle = '#0b0f1a'
  ctx.fillRect(0, 0, 600, 400)
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
  font-size: 1.2rem;
  padding: 0.3rem 0.75rem;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: var(--radius-sm);
  font-weight: bold;
}

.pong-stage {
  border: 2px solid rgba(124, 77, 255, 0.4);
  box-shadow: 0 0 20px rgba(124, 77, 255, 0.15);
  border-radius: var(--radius-md);
  overflow: hidden;
}

canvas { display: block; }
</style>
