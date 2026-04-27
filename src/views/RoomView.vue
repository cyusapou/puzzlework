<template>
  <div class="room-view">
    <div class="room-container" v-if="room">
      <div class="room-header">
        <div class="room-info">
          <h1 class="room-title">Room: {{ room.roomCode }}</h1>
          <p class="room-game">{{ room.gameType }} - {{ room.difficulty }}</p>
        </div>
        <div class="room-status" :class="room.status">
          {{ room.status.toUpperCase() }}
        </div>
      </div>

      <div class="room-content">
        <!-- Players List -->
        <div class="players-section">
          <h3>Players ({{ room.players.length }}/{{ room.maxPlayers }})</h3>
          <div class="players-list">
            <div
              v-for="player in room.players"
              :key="player._id"
              class="player-card"
              :class="{ isHost: player._id === room.host._id }"
            >
              <div class="player-avatar">{{ player.username.charAt(0).toUpperCase() }}</div>
              <div class="player-info">
                <div class="player-name">{{ player.username }}</div>
                <div class="player-role" v-if="player._id === room.host._id">Host</div>
              </div>
              <div class="player-ready" :class="{ ready: isPlayerReady(player._id) }">
                {{ isPlayerReady(player._id) ? '✓ Ready' : 'Waiting' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Chat -->
        <div class="chat-section">
          <h3>Chat</h3>
          <div class="chat-messages" ref="chatMessages">
            <div
              v-for="(msg, index) in chatMessages"
              :key="index"
              class="chat-message"
              :class="{ own: msg.userId === auth.user?.id }"
            >
              <span class="chat-sender">{{ msg.username }}:</span>
              <span class="chat-text">{{ msg.message }}</span>
            </div>
          </div>
          <form @submit.prevent="sendMessage" class="chat-input">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type a message..."
              :disabled="room.status !== 'waiting'"
            />
            <BaseButton type="submit" size="sm" :disabled="!newMessage.trim()">
              Send
            </BaseButton>
          </form>
        </div>
      </div>

      <!-- Actions -->
      <div class="room-actions">
        <BaseButton
          v-if="room.status === 'waiting'"
          @click="toggleReady"
          :variant="isReady ? 'outline' : 'primary'"
          size="lg"
        >
          {{ isReady ? 'Not Ready' : 'Ready' }}
        </BaseButton>

        <BaseButton
          v-if="isHost && room.status === 'waiting'"
          @click="startGame"
          variant="accent"
          size="lg"
          :disabled="!allPlayersReady"
        >
          Start Game
        </BaseButton>

        <BaseButton
          @click="leaveRoom"
          variant="secondary"
          size="lg"
        >
          Leave Room
        </BaseButton>
      </div>

      <!-- Game Started -->
      <div v-if="room.status === 'playing'" class="game-started">
        <h2>Game in Progress!</h2>
        <BaseButton
          @click="goToGame"
          variant="primary"
          size="lg"
        >
          Enter Game
        </BaseButton>
      </div>
    </div>

    <div v-else class="loading">
      <p>Loading room...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { api } from '../services/api'
import { socketService } from '../services/socket'
import BaseButton from '../components/ui/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const room = ref(null)
const loading = ref(true)
const isReady = ref(false)
const readyPlayers = ref(new Set())
const chatMessages = ref([])
const newMessage = ref('')
const chatMessagesRef = ref(null)

const roomCode = computed(() => route.params.roomCode)
const isHost = computed(() => room.value?.host?._id === auth.user?.id)
const allPlayersReady = computed(() => {
  if (!room.value) return false
  return room.value.players.length === room.value.maxPlayers && 
         room.value.players.every(p => readyPlayers.value.has(p._id))
})

function isPlayerReady(playerId) {
  return readyPlayers.value.has(playerId)
}

async function loadRoom() {
  try {
    const data = await api.getRoom(roomCode.value)
    room.value = data
  } catch (err) {
    console.error('Failed to load room:', err)
    router.push('/lobby')
  } finally {
    loading.value = false
  }
}

function toggleReady() {
  isReady.value = !isReady.value
  if (isReady.value) {
    readyPlayers.value.add(auth.user.id)
  } else {
    readyPlayers.value.delete(auth.user.id)
  }
  socketService.setPlayerReady(roomCode.value, auth.user.id, isReady.value)
}

async function startGame() {
  socketService.startGame(roomCode.value, auth.user.id)
}

async function leaveRoom() {
  try {
    await api.leaveRoom(roomCode.value)
    socketService.leaveRoom(roomCode.value)
    router.push('/lobby')
  } catch (err) {
    console.error('Failed to leave room:', err)
  }
}

function sendMessage() {
  if (!newMessage.value.trim()) return
  socketService.sendChatMessage(
    roomCode.value,
    newMessage.value,
    auth.user.id,
    auth.user.username
  )
  newMessage.value = ''
}

function goToGame() {
  router.push({
    name: room.value.gameType,
    query: {
      mode: 'multiplayer',
      roomCode: roomCode.value,
      difficulty: room.value.difficulty
    }
  })
}

// Socket event handlers
function handlePlayerJoined(data) {
  if (data.players) {
    room.value.players = data.players
  }
}

function handlePlayerLeft(data) {
  if (data.players) {
    room.value.players = data.players
  }
}

function handlePlayerReadyUpdate(data) {
  if (data.isReady) {
    readyPlayers.value.add(data.userId)
  } else {
    readyPlayers.value.delete(data.userId)
  }
}

function handleGameStarted(data) {
  room.value.status = 'playing'
  room.value.startedAt = data.startTime
}

function handleChatMessage(data) {
  chatMessages.value.push(data)
  // Scroll to bottom
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

onMounted(async () => {
  await loadRoom()
  
  socketService.connect()
  socketService.joinRoom(roomCode.value, auth.user.id, auth.user.username)
  
  socketService.on('player-joined', handlePlayerJoined)
  socketService.on('player-left', handlePlayerLeft)
  socketService.on('player-ready-update', handlePlayerReadyUpdate)
  socketService.on('game-started', handleGameStarted)
  socketService.on('chat-message', handleChatMessage)
})

onUnmounted(() => {
  socketService.off('player-joined', handlePlayerJoined)
  socketService.off('player-left', handlePlayerLeft)
  socketService.off('player-ready-update', handlePlayerReadyUpdate)
  socketService.off('game-started', handleGameStarted)
  socketService.off('chat-message', handleChatMessage)
})
</script>

<style scoped>
.room-view {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
}

.room-container {
  max-width: 1000px;
  margin: 0 auto;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.room-title {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.room-game {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.room-status {
  padding: 0.5rem 1.5rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.875rem;
}

.room-status.waiting {
  background: rgba(255, 171, 0, 0.2);
  color: #ffab00;
}

.room-status.playing {
  background: rgba(0, 230, 118, 0.2);
  color: #00e676;
}

.room-status.completed {
  background: rgba(124, 77, 255, 0.2);
  color: #7c4dff;
}

.room-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.players-section,
.chat-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.players-section h3,
.chat-section h3 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.player-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.player-card.isHost {
  border-color: var(--color-primary);
}

.player-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
}

.player-info {
  flex: 1;
}

.player-name {
  font-weight: 500;
}

.player-role {
  font-size: 0.75rem;
  color: var(--color-primary);
}

.player-ready {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.player-ready.ready {
  color: #00e676;
  font-weight: 500;
}

.chat-messages {
  height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
}

.chat-message {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: var(--radius-sm);
}

.chat-message.own {
  background: rgba(124, 77, 255, 0.1);
}

.chat-sender {
  font-weight: 600;
  color: var(--color-primary);
  margin-right: 0.5rem;
}

.chat-text {
  color: var(--color-text-primary);
}

.chat-input {
  display: flex;
  gap: 0.5rem;
}

.chat-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.chat-input input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.room-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.game-started {
  text-align: center;
  padding: 2rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.game-started h2 {
  margin-bottom: 1rem;
  color: #00e676;
}

.loading {
  text-align: center;
  padding: 4rem;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .room-content {
    grid-template-columns: 1fr;
  }
  
  .room-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .room-actions {
    flex-direction: column;
  }
}
</style>
