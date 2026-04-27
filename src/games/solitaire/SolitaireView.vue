<template>
  <GameLayout title="Solitaire" :showOverlay="false">
    <template #status>
      <span class="stat-badge">Moves: {{ moveCount }}</span>
      <BaseButton @click="reset" variant="outline" size="sm">New Game</BaseButton>
    </template>

    <div class="solitaire-board">
      <div class="top-row">
        <div class="pile stock" @click="drawCard">
          <div v-if="state.stock.length" class="card back">
            <span class="card-count">{{ state.stock.length }}</span>
          </div>
          <div v-else class="empty-slot">♻️</div>
        </div>

        <div class="pile waste">
          <div v-if="state.waste.length" class="card face-up" :class="state.waste[state.waste.length-1].color"
               @click="selectWaste">
            <span class="card-val">{{ state.waste[state.waste.length-1].value }}{{ state.waste[state.waste.length-1].suit }}</span>
          </div>
          <div v-else class="empty-slot"></div>
        </div>

        <div class="spacer"></div>

        <div v-for="(f, i) in state.foundations" :key="'f'+i" class="pile foundation"
             @click="dropToFoundation(i)">
          <div v-if="f.length" class="card face-up" :class="f[f.length-1].color">
            <span class="card-val">{{ f[f.length-1].value }}{{ f[f.length-1].suit }}</span>
          </div>
          <div v-else class="empty-slot foundation-empty">
            <span>{{ ['♠', '♥', '♦', '♣'][i] }}</span>
          </div>
        </div>
      </div>

      <div class="tableau-row">
        <div v-for="(pile, i) in state.tableau" :key="'t'+i" class="pile tableau-pile"
             @click="dropToTableau(i)">
          <div v-if="!pile.length" class="empty-slot"></div>
          <div 
            v-for="(card, j) in pile" :key="j" 
            class="card" 
            :class="[card.isFaceUp ? 'face-up ' + card.color : 'back', { 'is-selected': isSelected(i, j) }]"
            :style="{ top: (j * 22) + 'px', zIndex: j }"
            @click.stop="selectTableau(i, j, card)"
          >
            <span v-if="card.isFaceUp" class="card-val">{{ card.value }}{{ card.suit }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #controls>
      Click stock to draw. Click face-up cards to select, then click a destination pile to move.
    </template>
  </GameLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GameLayout from '../../components/game/GameLayout.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import * as Engine from './solitaire.engine.js'

const state = ref(Engine.setupGame())
const moveCount = ref(0)
const selectedCard = ref(null) // { source: 'waste'|'tableau', pileIndex, cardIndex }

const reset = () => {
  state.value = Engine.setupGame()
  moveCount.value = 0
  selectedCard.value = null
}

const drawCard = () => {
  if (state.value.stock.length) {
    const card = state.value.stock.pop()
    card.isFaceUp = true
    state.value.waste.push(card)
  } else {
    state.value.stock = state.value.waste.reverse().map(c => ({ ...c, isFaceUp: false }))
    state.value.waste = []
  }
  selectedCard.value = null
}

const selectWaste = () => {
  if (state.value.waste.length) {
    selectedCard.value = { source: 'waste' }
  }
}

const selectTableau = (pileIndex, cardIndex, card) => {
  if (!card.isFaceUp) return
  if (selectedCard.value) {
    dropToTableau(pileIndex)
  } else {
    selectedCard.value = { source: 'tableau', pileIndex, cardIndex }
  }
}

const dropToTableau = (targetPile) => {
  if (!selectedCard.value) return
  
  if (selectedCard.value.source === 'waste') {
    const card = state.value.waste[state.value.waste.length - 1]
    state.value.waste.pop()
    state.value.tableau[targetPile].push(card)
    moveCount.value++
  } else if (selectedCard.value.source === 'tableau') {
    const srcPile = selectedCard.value.pileIndex
    if (srcPile === targetPile) { selectedCard.value = null; return }
    const cards = state.value.tableau[srcPile].splice(selectedCard.value.cardIndex)
    state.value.tableau[targetPile].push(...cards)
    // Flip top card of source
    const src = state.value.tableau[srcPile]
    if (src.length && !src[src.length - 1].isFaceUp) src[src.length - 1].isFaceUp = true
    moveCount.value++
  }
  selectedCard.value = null
}

const dropToFoundation = (foundationIndex) => {
  if (!selectedCard.value) return
  let card
  if (selectedCard.value.source === 'waste') {
    card = state.value.waste.pop()
  } else {
    const pile = state.value.tableau[selectedCard.value.pileIndex]
    card = pile.pop()
    if (pile.length && !pile[pile.length - 1].isFaceUp) pile[pile.length - 1].isFaceUp = true
  }
  state.value.foundations[foundationIndex].push(card)
  moveCount.value++
  selectedCard.value = null
}

const isSelected = (pileIndex, cardIndex) => {
  if (!selectedCard.value || selectedCard.value.source !== 'tableau') return false
  return selectedCard.value.pileIndex === pileIndex && cardIndex >= selectedCard.value.cardIndex
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

.solitaire-board {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 720px;
}

.top-row {
  display: flex;
  gap: 10px;
}

.tableau-row {
  display: flex;
  gap: 10px;
}

.spacer { flex: 1; }

.pile {
  width: 90px;
  min-height: 130px;
  border-radius: 8px;
  position: relative;
}

.tableau-pile {
  min-height: 250px;
}

.empty-slot {
  width: 90px;
  height: 130px;
  border: 2px dashed rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  opacity: 0.3;
}

.foundation-empty {
  font-size: 2rem;
  opacity: 0.2;
}

.card {
  position: absolute;
  width: 90px;
  height: 130px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.card:hover { transform: translateY(-2px); }

.card.back {
  background: linear-gradient(135deg, #1565c0, #0d47a1);
  border: 2px solid rgba(255, 255, 255, 0.15);
}

.card-count {
  font-size: 0.7rem;
  position: absolute;
  bottom: 4px;
  right: 6px;
  opacity: 0.5;
}

.card.face-up {
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.card.face-up.red .card-val { color: #ef5350; }
.card.face-up.black .card-val { color: white; }

.card-val {
  font-size: 1.3rem;
  font-weight: bold;
}

.card.is-selected {
  box-shadow: 0 0 15px rgba(124, 77, 255, 0.6);
  border-color: var(--color-accent-primary) !important;
  z-index: 100 !important;
}
</style>
