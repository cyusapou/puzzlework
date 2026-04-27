import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) return this.socket;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Room events
  joinRoom(roomCode, userId, username) {
    this.socket.emit('join-room', { roomCode, userId, username });
  }

  leaveRoom(roomCode) {
    this.socket.emit('leave-room', { roomCode });
  }

  // Game events
  updateGameState(roomCode, gameState, userId) {
    this.socket.emit('game-state-update', { roomCode, gameState, userId });
  }

  updateProgress(roomCode, progress, userId) {
    this.socket.emit('progress-update', { roomCode, progress, userId });
  }

  completeGame(roomCode, userId, score, timeElapsed) {
    this.socket.emit('game-complete', { roomCode, userId, score, timeElapsed });
  }

  // Chat
  sendChatMessage(roomCode, message, userId, username) {
    this.socket.emit('chat-message', { roomCode, message, userId, username });
  }

  // Lobby events
  setPlayerReady(roomCode, userId, isReady) {
    this.socket.emit('player-ready', { roomCode, userId, isReady });
  }

  startGame(roomCode, userId) {
    this.socket.emit('start-game', { roomCode, userId });
  }

  // Event listeners
  on(event, callback) {
    if (!this.socket) this.connect();
    
    this.socket.on(event, callback);
    
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
    
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  removeAllListeners(event) {
    if (this.socket) {
      this.socket.off(event);
    }
    this.listeners.delete(event);
  }
}

export const socketService = new SocketService();
