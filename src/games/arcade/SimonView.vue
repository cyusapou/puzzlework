<template>
  <GameLayout title="Simon Says" :showOverlay="state.status === 'gameover' || state.round === 0">
    <template #status>
      <span class="stat-badge">Round: {{ state.round }}</span>
    </template>

    <div class="simon-board">
      <div v-for="(color, i) in padColors" :key="i"
           class="pad"
           :class="{ active: activePad === i, pressed: pressedPad === i }"
           :style="{ '--pad-color': color.base, '--pad-active': color.light }"
           @click="clickPad(i)">
      </div>
    </div>

    <template #overlay>
      <h2 v-if="state.status === 'gameover'">Game Over! 🔴</h2>
      <h2 v-else>Simon Says</h2>
      <p v-if="state.status === 'gameover'">You reached round {{ state.round }}</p>
      <p v-else>Watch the pattern and repeat it!</p>
      <BaseButton @click="start" variant="primary">{{ state.status === 'gameover' ? 'Try Again' : 'Start Game' }}</BaseButton>
    </template>
  </GameLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './arcade.engines.js'

const padColors = [
  { base: '#e74c3c', light: '#ff6b6b' },
  { base: '#2ecc71', light: '#69f0ae' },
  { base: '#f1c40f', light: '#fff176' },
  { base: '#3498db', light: '#64b5f6' }
]

const state = reactive(Engine.createSimonState())
const activePad = ref(null)
const pressedPad = ref(null)
let isShowingSequence = false

const start = () => {
  state.sequence = []
  state.round = 0
  state.status = 'playing'
  state.userSequence = []
  playNextRound()
}

const playNextRound = async () => {
  isShowingSequence = true
  Object.assign(state, Engine.nextSimonRound(state))
  
  await new Promise(r => setTimeout(r, 500))
  
  for (let i of state.sequence) {
    activePad.value = i
    await new Promise(r => setTimeout(r, 500))
    activePad.value = null
    await new Promise(r => setTimeout(r, 200))
  }
  isShowingSequence = false
}

const clickPad = (i) => {
  if (state.status !== 'playing' || isShowingSequence) return
  
  pressedPad.value = i
  setTimeout(() => pressedPad.value = null, 200)
  
  state.userSequence.push(i)
  
  if (state.userSequence[state.userSequence.length - 1] !== state.sequence[state.userSequence.length - 1]) {
    state.status = 'gameover'
    return
  }
  
  if (state.userSequence.length === state.sequence.length) {
    setTimeout(playNextRound, 800)
  }
}
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

.simon-board {
  display: grid;
  grid-template-columns: repeat(2, 140px);
  gap: 12px;
  padding: 20px;
  background: var(--color-bg-card);
  border-radius: 50%;
  width: 320px;
  height: 320px;
  align-items: center;
  justify-items: center;
}

.pad {
  width: 140px;
  height: 140px;
  border-radius: 16px;
  background: var(--pad-color);
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  opacity: 0.7;
}

.pad:hover {
  opacity: 0.85;
  transform: scale(1.03);
}

.pad.active, .pad.pressed {
  opacity: 1;
  background: var(--pad-active);
  box-shadow: 0 0 30px var(--pad-active);
  transform: scale(1.05);
}
</style>
