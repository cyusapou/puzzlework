<template>
  <GameLayout title="Trivia Quiz" :showOverlay="current >= questions.length">
    <template #status>
      <span class="stat-badge">Score: {{ score }} / {{ questions.length }}</span>
      <span class="stat-badge">Q{{ Math.min(current + 1, questions.length) }} of {{ questions.length }}</span>
    </template>

    <div class="trivia-content" v-if="current < questions.length">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: (current / questions.length * 100) + '%' }"></div>
      </div>

      <div class="question-card">
        <h3 class="question-text">{{ questions[current].q }}</h3>
        <div class="options">
          <button 
            v-for="(opt, i) in questions[current].a" :key="i" 
            class="opt-btn"
            :class="{ 
              correct: answered && i === questions[current].c,
              wrong: answered && selectedAnswer === i && i !== questions[current].c
            }"
            :disabled="answered"
            @click="answer(i)"
          >
            <span class="opt-letter">{{ String.fromCharCode(65 + i) }}</span>
            {{ opt }}
          </button>
        </div>
      </div>
    </div>

    <template #overlay>
      <h2>Quiz Complete! 🧠</h2>
      <p>You scored {{ score }} out of {{ questions.length }}</p>
      <div class="result-grade">
        {{ score >= questions.length * 0.8 ? '🏆 Excellent!' : score >= questions.length * 0.5 ? '👍 Good Job!' : '📚 Keep Learning!' }}
      </div>
      <BaseButton @click="reset" variant="primary" style="margin-top: 1rem">Play Again</BaseButton>
    </template>
  </GameLayout>
</template>

<script setup>
import { ref } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './word.engines.js'

const questions = ref([...Engine.QUESTIONS])
const current = ref(0)
const score = ref(0)
const answered = ref(false)
const selectedAnswer = ref(null)

const answer = (i) => {
  if (answered.value) return
  answered.value = true
  selectedAnswer.value = i
  if (i === questions.value[current.value].c) score.value++
  setTimeout(() => {
    current.value++
    answered.value = false
    selectedAnswer.value = null
  }, 1200)
}

const reset = () => {
  current.value = 0
  score.value = 0
  answered.value = false
  selectedAnswer.value = null
}
</script>

<style scoped>
.stat-badge {
  font-size: 1rem;
  padding: 0.3rem 0.75rem;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: var(--radius-sm);
  font-weight: bold;
}

.trivia-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 500px;
  max-width: 90vw;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary));
  transition: width 0.4s ease;
  border-radius: 3px;
}

.question-card {
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 2rem;
}

.question-text {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  color: var(--color-text-primary);
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.opt-btn {
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
}

.opt-btn:hover:not(:disabled) {
  background: rgba(124, 77, 255, 0.15);
  border-color: var(--color-accent-primary);
}

.opt-letter {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.opt-btn.correct {
  background: rgba(46, 204, 113, 0.2);
  border-color: #2ecc71;
}

.opt-btn.wrong {
  background: rgba(231, 76, 60, 0.2);
  border-color: #e74c3c;
}

.result-grade {
  font-size: 1.5rem;
  margin-top: 0.5rem;
}
</style>
