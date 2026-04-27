<template>
  <GameLayout title="Hangman" :showOverlay="mistakes >= 6 || isWon">
    <template #status>
      <span class="stat-badge life" v-for="i in 6" :key="i" :class="{ lost: i <= mistakes }">
        {{ i <= mistakes ? '💀' : '❤️' }}
      </span>
    </template>

    <div class="hangman-content">
      <div class="hangman-figure">
        <svg width="200" height="220" viewBox="0 0 200 220">
          <!-- Gallows -->
          <line x1="20" y1="210" x2="180" y2="210" stroke="white" stroke-width="3" stroke-linecap="round"/>
          <line x1="60" y1="210" x2="60" y2="20" stroke="white" stroke-width="3" stroke-linecap="round"/>
          <line x1="60" y1="20" x2="130" y2="20" stroke="white" stroke-width="3" stroke-linecap="round"/>
          <line x1="130" y1="20" x2="130" y2="50" stroke="white" stroke-width="3" stroke-linecap="round"/>
          <!-- Head -->
          <circle v-if="mistakes >= 1" cx="130" cy="70" r="20" stroke="#7c4dff" stroke-width="3" fill="none"/>
          <!-- Body -->
          <line v-if="mistakes >= 2" x1="130" y1="90" x2="130" y2="150" stroke="#7c4dff" stroke-width="3" stroke-linecap="round"/>
          <!-- Left Arm -->
          <line v-if="mistakes >= 3" x1="130" y1="110" x2="100" y2="135" stroke="#7c4dff" stroke-width="3" stroke-linecap="round"/>
          <!-- Right Arm -->
          <line v-if="mistakes >= 4" x1="130" y1="110" x2="160" y2="135" stroke="#7c4dff" stroke-width="3" stroke-linecap="round"/>
          <!-- Left Leg -->
          <line v-if="mistakes >= 5" x1="130" y1="150" x2="105" y2="185" stroke="#7c4dff" stroke-width="3" stroke-linecap="round"/>
          <!-- Right Leg -->
          <line v-if="mistakes >= 6" x1="130" y1="150" x2="155" y2="185" stroke="#e53935" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="word-display">
        <div v-for="(l, i) in secret" :key="i" class="letter-slot">
          <span v-if="guesses.has(l)" class="revealed-letter">{{ l }}</span>
          <span v-else class="hidden-letter">_</span>
        </div>
      </div>

      <div class="keyboard">
        <button v-for="l in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" :key="l"
                class="key-btn"
                :class="{ correct: guesses.has(l) && secret.includes(l), wrong: guesses.has(l) && !secret.includes(l) }"
                :disabled="guesses.has(l)"
                @click="guess(l)">
          {{ l }}
        </button>
      </div>
    </div>

    <template #overlay>
      <h2>{{ isWon ? '🎉 You Won!' : '💀 Game Over' }}</h2>
      <p v-if="!isWon">The word was: <strong>{{ secret }}</strong></p>
      <BaseButton @click="reset" variant="primary">New Word</BaseButton>
    </template>
  </GameLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './word.engines.js'

const secret = ref('')
const guesses = ref(new Set())
const mistakes = ref(0)

const reset = () => {
  secret.value = Engine.WORDS[Math.floor(Math.random() * Engine.WORDS.length)]
  guesses.value = new Set()
  mistakes.value = 0
}

const guess = (l) => {
  if (guesses.value.has(l)) return
  guesses.value = new Set([...guesses.value, l])
  if (!secret.value.includes(l)) mistakes.value++
}

const isWon = computed(() => secret.value && secret.value.split('').every(l => guesses.value.has(l)))

reset()
</script>

<style scoped>
.stat-badge { font-size: 1rem; }
.stat-badge.lost { opacity: 0.3; }

.hangman-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  min-width: 400px;
}

.hangman-figure {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.word-display {
  display: flex;
  gap: 12px;
}

.letter-slot {
  width: 40px;
  text-align: center;
}

.revealed-letter {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-accent-secondary);
}

.hidden-letter {
  font-size: 2rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.3);
}

.keyboard {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 450px;
  justify-content: center;
}

.key-btn {
  padding: 10px;
  min-width: 38px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text-primary);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.key-btn:hover:not(:disabled) { background: rgba(124, 77, 255, 0.2); }
.key-btn:disabled { cursor: default; opacity: 0.4; }
.key-btn.correct { background: rgba(46, 204, 113, 0.3); border-color: #2ecc71; }
.key-btn.wrong { background: rgba(231, 76, 60, 0.2); border-color: #e74c3c; }
</style>
