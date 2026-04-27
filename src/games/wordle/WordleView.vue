<template>
  <GameLayout title="Wordle" :showOverlay="status !== 'playing'">
    <template #status>
      <BaseButton @click="resetRandom" variant="outline" size="sm">Random Word</BaseButton>
    </template>

    <div class="wordle-board">
      <div class="wordle-grid">
        <div v-for="(guess, i) in 6" :key="i" class="guess-row">
          <div 
            v-for="(letter, j) in 5" :key="j" 
            class="letter-box"
            :class="[getBoxClass(i, j), { active: i === guesses.length && currentGuess.length === j }]"
          >
            {{ getLetter(i, j) }}
          </div>
        </div>
      </div>

      <div class="keyboard">
        <div v-for="(row, i) in keyboardRows" :key="i" class="key-row">
          <button 
            v-for="key in row" :key="key" 
            class="key-btn"
            :class="[getKeyClass(key), { wide: key === 'ENTER' || key === 'BACK' }]"
            @click="onKeyPress(key)"
          >
            {{ key === 'BACK' ? '⌫' : key }}
          </button>
        </div>
      </div>
    </div>

    <template #overlay>
      <h2>{{ status === 'won' ? '🎉 Brilliant!' : 'Better luck next time!' }}</h2>
      <p v-if="status === 'lost'">The word was: <strong>{{ secret }}</strong></p>
      <BaseButton @click="resetRandom" variant="primary">New Game</BaseButton>
    </template>
  </GameLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './wordle.engine.js'

const secret = ref('')
const guesses = ref([])
const currentGuess = ref('')
const status = ref('playing')
const keyStates = ref({})

const keyboardRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
]

const resetRandom = () => {
  secret.value = Engine.getRandomWord()
  guesses.value = []
  currentGuess.value = ''
  status.value = 'playing'
  keyStates.value = {}
}

const getLetter = (i, j) => {
  if (i < guesses.value.length) return guesses.value[i].word[j]
  if (i === guesses.value.length) return currentGuess.value[j] || ''
  return ''
}

const getBoxClass = (i, j) => {
  if (i >= guesses.value.length) return ''
  return guesses.value[i].result[j]
}

const getKeyClass = (key) => keyStates.value[key] || ''

const onKeyPress = (key) => {
  if (status.value !== 'playing') return
  if (key === 'ENTER') {
    if (currentGuess.value.length === 5) {
      const result = Engine.checkGuess(currentGuess.value, secret.value)
      guesses.value.push({ word: currentGuess.value, result })
      currentGuess.value.split('').forEach((letter, i) => {
        const state = result[i]
        if (state === 'green') keyStates.value[letter] = 'green'
        else if (state === 'yellow' && keyStates.value[letter] !== 'green') keyStates.value[letter] = 'yellow'
        else if (!keyStates.value[letter]) keyStates.value[letter] = 'gray'
      })
      if (currentGuess.value === secret.value) status.value = 'won'
      else if (guesses.value.length === 6) status.value = 'lost'
      currentGuess.value = ''
    }
  } else if (key === 'BACK') {
    currentGuess.value = currentGuess.value.slice(0, -1)
  } else if (currentGuess.value.length < 5 && /^[A-Z]$/.test(key)) {
    currentGuess.value += key
  }
}

const handleKeydown = (e) => {
  const key = e.key.toUpperCase()
  if (key === 'ENTER') onKeyPress('ENTER')
  else if (key === 'BACKSPACE') onKeyPress('BACK')
  else if (/^[A-Z]$/.test(key)) onKeyPress(key)
}

onMounted(() => {
  resetRandom()
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.wordle-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.wordle-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.guess-row {
  display: flex;
  gap: 6px;
}

.letter-box {
  width: 58px;
  height: 58px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--color-text-primary);
  transition: all 0.3s;
}

.letter-box.active {
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 8px rgba(124, 77, 255, 0.3);
}

.letter-box.green {
  background: #538d4e;
  border-color: #538d4e;
}
.letter-box.yellow {
  background: #b59f3b;
  border-color: #b59f3b;
}
.letter-box.gray {
  background: #3a3a3c;
  border-color: #3a3a3c;
}

.keyboard {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.key-row {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.key-btn {
  padding: 0.8rem 0.6rem;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  color: var(--color-text-primary);
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  min-width: 36px;
  transition: all 0.2s;
}

.key-btn.wide {
  min-width: 60px;
  font-size: 0.8rem;
}

.key-btn:hover { background: rgba(255, 255, 255, 0.25); }
.key-btn.green { background: #538d4e; }
.key-btn.yellow { background: #b59f3b; }
.key-btn.gray { background: #3a3a3c; opacity: 0.6; }
</style>
