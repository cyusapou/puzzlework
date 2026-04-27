<template>
  <div class="room-lobby-view">
    <div class="lobby-container animate-slide-up">
      <div class="lobby-header">
        <h1 class="lobby-title">Game Lobby</h1>
        <p class="lobby-subtitle">Choose how you want to play</p>
      </div>

      <div class="lobby-options">
        <!-- Create Room -->
        <BaseCard class="lobby-card" padding="lg">
          <div class="card-icon">🏠</div>
          <h3>Create Room</h3>
          <p>Create a private room and share the code with friends</p>
          
          <div class="form-group">
            <label>Game</label>
            <select v-model="createRoomForm.gameType" :disabled="loading">
              <option value="2048">2048</option>
              <option value="chess">Chess</option>
              <option value="checkers">Checkers</option>
              <option value="connect4">Connect Four</option>
              <option value="snake">Snake</option>
              <option value="memory">Memory Match</option>
              <option value="tetris">Tetris</option>
              <option value="wordle">Wordle</option>
            </select>
          </div>

          <div class="form-group">
            <label>Difficulty</label>
            <select v-model="createRoomForm.difficulty" :disabled="loading">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div class="form-group">
            <label>Max Players</label>
            <select v-model="createRoomForm.maxPlayers" :disabled="loading">
              <option :value="2">2 Players</option>
              <option :value="4">4 Players</option>
            </select>
          </div>

          <BaseButton
            @click="handleCreateRoom"
            :loading="loading"
            variant="primary"
            size="lg"
            class="full-width"
          >
            Create Room
          </BaseButton>
        </BaseCard>

        <!-- Join Room -->
        <BaseCard class="lobby-card" padding="lg">
          <div class="card-icon">🔑</div>
          <h3>Join Room</h3>
          <p>Enter a room code to join a friend's game</p>
          
          <div class="form-group">
            <label>Room Code</label>
            <input
              v-model="joinRoomCode"
              type="text"
              placeholder="Enter 6-character code"
              maxlength="6"
              :disabled="loading"
            />
          </div>

          <BaseButton
            @click="handleJoinRoom"
            :loading="loading"
            variant="secondary"
            size="lg"
            class="full-width"
          >
            Join Room
          </BaseButton>
        </BaseCard>

        <!-- Random Match -->
        <BaseCard class="lobby-card" padding="lg">
          <div class="card-icon">🎲</div>
          <h3>Random Match</h3>
          <p>Get matched with a random player online</p>
          
          <div class="form-group">
            <label>Game</label>
            <select v-model="randomMatchForm.gameType" :disabled="loading">
              <option value="2048">2048</option>
              <option value="chess">Chess</option>
              <option value="checkers">Checkers</option>
              <option value="connect4">Connect Four</option>
              <option value="snake">Snake</option>
              <option value="memory">Memory Match</option>
              <option value="tetris">Tetris</option>
              <option value="wordle">Wordle</option>
            </select>
          </div>

          <div class="form-group">
            <label>Difficulty</label>
            <select v-model="randomMatchForm.difficulty" :disabled="loading">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <BaseButton
            @click="handleRandomMatch"
            :loading="loading"
            variant="accent"
            size="lg"
            class="full-width"
          >
            Find Match
          </BaseButton>
        </BaseCard>
      </div>

      <!-- Single Player with AI -->
      <BaseCard class="ai-card" padding="lg">
        <div class="card-icon">🤖</div>
        <h3>Play vs AI</h3>
        <p>Challenge the computer in single-player mode</p>
        
        <div class="form-group">
          <label>Game</label>
          <select v-model="aiForm.gameType" :disabled="loading">
            <option value="2048">2048</option>
            <option value="chess">Chess</option>
            <option value="checkers">Checkers</option>
            <option value="connect4">Connect Four</option>
            <option value="snake">Snake</option>
            <option value="memory">Memory Match</option>
            <option value="tetris">Tetris</option>
          </select>
        </div>

        <div class="form-group">
          <label>Difficulty</label>
          <select v-model="aiForm.difficulty" :disabled="loading">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <BaseButton
          @click="handlePlayAI"
          :loading="loading"
          variant="outline"
          size="lg"
          class="full-width"
        >
          Play vs AI
        </BaseButton>
      </BaseCard>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseButton from '../components/ui/BaseButton.vue'

const router = useRouter()

const loading = ref(false)
const error = ref(null)

const createRoomForm = ref({
  gameType: '2048',
  mode: 'multiplayer',
  difficulty: 'medium',
  maxPlayers: 2
})

const joinRoomCode = ref('')

const randomMatchForm = ref({
  gameType: '2048',
  difficulty: 'medium'
})

const aiForm = ref({
  gameType: '2048',
  difficulty: 'medium'
})

async function handleCreateRoom() {
  loading.value = true
  error.value = null
  try {
    const room = await api.createRoom(
      createRoomForm.value.gameType,
      createRoomForm.value.mode,
      createRoomForm.value.difficulty,
      createRoomForm.value.maxPlayers
    )
    router.push(`/room/${room.roomCode}`)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function handleJoinRoom() {
  if (!joinRoomCode.value || joinRoomCode.value.length !== 6) {
    error.value = 'Please enter a valid 6-character room code'
    return
  }

  loading.value = true
  error.value = null
  try {
    const room = await api.joinRoom(joinRoomCode.value.toUpperCase())
    router.push(`/room/${room.roomCode}`)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function handleRandomMatch() {
  loading.value = true
  error.value = null
  try {
    const room = await api.findRandomMatch(
      randomMatchForm.value.gameType,
      randomMatchForm.value.difficulty
    )
    router.push(`/room/${room.roomCode}`)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function handlePlayAI() {
  router.push({
    name: aiForm.value.gameType,
    query: {
      mode: 'ai',
      difficulty: aiForm.value.difficulty
    }
  })
}
</script>

<style scoped>
.room-lobby-view {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
}

.lobby-container {
  max-width: 1200px;
  margin: 0 auto;
}

.lobby-header {
  text-align: center;
  margin-bottom: 3rem;
}

.lobby-title {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lobby-subtitle {
  color: var(--color-text-secondary);
  font-size: 1.25rem;
}

.lobby-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.lobby-card {
  text-align: center;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.lobby-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.lobby-card p {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.ai-card {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.form-group select,
.form-group input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group select:focus,
.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group select:disabled,
.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.full-width {
  width: 100%;
}

.error-message {
  max-width: 400px;
  margin: 2rem auto 0;
  padding: 1rem;
  background: rgba(255, 23, 68, 0.1);
  border: 1px solid rgba(255, 23, 68, 0.3);
  border-radius: var(--radius-md);
  color: #ff1744;
  text-align: center;
}

@media (max-width: 768px) {
  .lobby-options {
    grid-template-columns: 1fr;
  }
  
  .lobby-title {
    font-size: 2rem;
  }
}
</style>
