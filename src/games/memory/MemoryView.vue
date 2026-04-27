<template>
  <GameLayout title="Memory Match" :showOverlay="matches === 12">
    <template #status>
      <span class="stat-badge">Moves: {{ moves }}</span>
      <span class="stat-badge">Pairs: {{ matches }}/12</span>
    </template>

    <div class="memory-board">
      <div 
        v-for="card in cards" :key="card.id" 
        class="mem-card"
        :class="{ flipped: card.isFlipped || card.isMatched, matched: card.isMatched }"
        @click="flipCard(card)"
      >
        <div class="card-inner">
          <div class="card-back">
            <span class="back-icon">✦</span>
          </div>
          <div class="card-front">{{ card.icon }}</div>
        </div>
      </div>
    </div>

    <template #overlay>
      <h2>🎉 All Pairs Found!</h2>
      <p>Completed in {{ moves }} moves</p>
      <BaseButton @click="reset" variant="primary">Play Again</BaseButton>
    </template>
  </GameLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './memory.engine.js'

const cards = ref([])
const moves = ref(0)
const matches = ref(0)
const flippedCards = ref([])

const reset = () => {
  cards.value = Engine.createBoard()
  moves.value = 0
  matches.value = 0
  flippedCards.value = []
}

const flipCard = (card) => {
  if (card.isFlipped || card.isMatched || flippedCards.value.length === 2) return
  card.isFlipped = true
  flippedCards.value.push(card)
  if (flippedCards.value.length === 2) {
    moves.value++
    const [c1, c2] = flippedCards.value
    if (c1.icon === c2.icon) {
      c1.isMatched = true
      c2.isMatched = true
      matches.value++
      flippedCards.value = []
    } else {
      setTimeout(() => {
        c1.isFlipped = false
        c2.isFlipped = false
        flippedCards.value = []
      }, 900)
    }
  }
}

onMounted(reset)
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

.memory-board {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.mem-card {
  width: 80px;
  height: 100px;
  cursor: pointer;
  perspective: 800px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.mem-card.flipped .card-inner { transform: rotateY(180deg); }

.card-back, .card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.card-back {
  background: linear-gradient(135deg, #7c4dff, #536dfe);
  border: 2px solid rgba(255, 255, 255, 0.15);
}

.back-icon {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.4);
}

.card-front {
  background: var(--color-bg-card);
  border: 2px solid rgba(255, 255, 255, 0.1);
  transform: rotateY(180deg);
  font-size: 2.5rem;
}

.mem-card.matched .card-front {
  border-color: rgba(46, 204, 113, 0.5);
  box-shadow: 0 0 15px rgba(46, 204, 113, 0.2);
}
</style>
