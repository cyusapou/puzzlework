<template>
  <div class="game-mode-selector">
    <div class="mode-header">
      <h2>Select Game Mode</h2>
      <p>Choose how you want to play</p>
    </div>

    <div class="mode-options">
      <!-- Single Player with AI -->
      <div 
        class="mode-card"
        :class="{ active: selectedMode === 'ai' }"
        @click="selectMode('ai')"
      >
        <div class="mode-icon">🤖</div>
        <h3>vs AI</h3>
        <p>Play against the computer</p>
        
        <div v-if="selectedMode === 'ai'" class="mode-settings">
          <div class="form-group">
            <label>Difficulty</label>
            <select v-model="aiDifficulty">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Multiplayer - Create Room -->
      <div 
        class="mode-card"
        :class="{ active: selectedMode === 'multiplayer' }"
        @click="selectMode('multiplayer')"
      >
        <div class="mode-icon">👥</div>
        <h3>Multiplayer</h3>
        <p>Play with friends or random players</p>
        
        <div v-if="selectedMode === 'multiplayer'" class="mode-settings">
          <div class="form-group">
            <label>Difficulty</label>
            <select v-model="multiplayerDifficulty">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <BaseButton @click.stop="goToLobby" variant="primary" size="sm">
            Find Players
          </BaseButton>
        </div>
      </div>

      <!-- Single Player (No AI) -->
      <div 
        class="mode-card"
        :class="{ active: selectedMode === 'solo' }"
        @click="selectMode('solo')"
      >
        <div class="mode-icon">🎮</div>
        <h3>Solo</h3>
        <p>Play alone at your own pace</p>
      </div>
    </div>

    <BaseButton 
      @click="startGame" 
      variant="accent" 
      size="lg"
      :disabled="!selectedMode"
      class="start-button"
    >
      Start Game
    </BaseButton>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseButton from '../ui/BaseButton.vue'

const props = defineProps({
  gameType: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['start'])

const router = useRouter()
const route = useRoute()

const selectedMode = ref(null)
const aiDifficulty = ref('medium')
const multiplayerDifficulty = ref('medium')

// Check if coming from room with multiplayer mode
if (route.query.mode === 'multiplayer' && route.query.roomCode) {
  selectedMode.value = 'multiplayer'
  multiplayerDifficulty.value = route.query.difficulty || 'medium'
} else if (route.query.mode === 'ai') {
  selectedMode.value = 'ai'
  aiDifficulty.value = route.query.difficulty || 'medium'
}

function selectMode(mode) {
  selectedMode.value = mode
}

function goToLobby() {
  router.push('/lobby')
}

function startGame() {
  const gameConfig = {
    mode: selectedMode.value,
    gameType: props.gameType
  }

  if (selectedMode.value === 'ai') {
    gameConfig.difficulty = aiDifficulty.value
    gameConfig.isAI = true
  } else if (selectedMode.value === 'multiplayer') {
    gameConfig.difficulty = multiplayerDifficulty.value
    gameConfig.roomCode = route.query.roomCode
    gameConfig.isMultiplayer = true
  } else {
    gameConfig.isSolo = true
  }

  emit('start', gameConfig)
}
</script>

<style scoped>
.game-mode-selector {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.mode-header {
  text-align: center;
  margin-bottom: 2rem;
}

.mode-header h2 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.mode-header p {
  color: var(--color-text-secondary);
}

.mode-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.mode-card {
  background: var(--color-bg-primary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.mode-card.active {
  border-color: var(--color-primary);
  background: rgba(124, 77, 255, 0.05);
}

.mode-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.mode-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.mode-card p {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.mode-settings {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}

.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 0.875rem;
}

.start-button {
  width: 100%;
}

@media (max-width: 640px) {
  .mode-options {
    grid-template-columns: 1fr;
  }
}
</style>
