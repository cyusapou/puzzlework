const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async register(username, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async refreshToken(refreshToken) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });
  }

  // Room endpoints
  async createRoom(gameType, mode, difficulty, maxPlayers) {
    return this.request('/rooms/create', {
      method: 'POST',
      body: JSON.stringify({ gameType, mode, difficulty, maxPlayers })
    });
  }

  async joinRoom(roomCode) {
    return this.request(`/rooms/join/${roomCode}`, {
      method: 'POST'
    });
  }

  async findRandomMatch(gameType, difficulty) {
    return this.request('/rooms/random', {
      method: 'POST',
      body: JSON.stringify({ gameType, difficulty })
    });
  }

  async getRoom(roomCode) {
    return this.request(`/rooms/${roomCode}`);
  }

  async leaveRoom(roomCode) {
    return this.request(`/rooms/leave/${roomCode}`, {
      method: 'POST'
    });
  }

  async updateRoomState(roomCode, gameState) {
    return this.request(`/rooms/${roomCode}/state`, {
      method: 'PUT',
      body: JSON.stringify({ gameState })
    });
  }

  // Game endpoints
  async getGameHistory() {
    return this.request('/games/history');
  }

  async getGameStats(gameType) {
    return this.request(`/games/stats/${gameType}`);
  }

  async saveGameSession(sessionData) {
    return this.request('/games/session', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
  }
}

export const api = new ApiService();
