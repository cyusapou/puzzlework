<template>
  <nav class="app-nav">
    <div class="nav-container">
      <router-link to="/" class="logo">
        <span class="logo-icon">🧩</span>
        <span class="logo-text text-gradient">PuzzleVerse</span>
      </router-link>

      <div class="nav-links">
        <router-link to="/games" class="nav-link" active-class="active">Games</router-link>
        <router-link v-if="auth.isLoggedIn" to="/lobby" class="nav-link" active-class="active">Multiplayer</router-link>
        <router-link v-if="auth.isLoggedIn" to="/dashboard" class="nav-link" active-class="active">Dashboard</router-link>
      </div>

      <div class="nav-actions">
        <template v-if="auth.isLoggedIn">
          <div class="user-pill">
            <span class="avatar">{{ auth.user?.username?.charAt(0).toUpperCase() || 'U' }}</span>
            <span class="username">{{ auth.user?.username || 'User' }}</span>
            <BaseButton @click="auth.logout" size="sm" variant="outline">Logout</BaseButton>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/signup">
            <BaseButton size="sm">Sign Up</BaseButton>
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import BaseButton from '../ui/BaseButton.vue'

const auth = useAuthStore()
</script>

<style scoped>
.app-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(11, 15, 26, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-icon {
  font-size: 1.75rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--color-text-secondary);
  font-weight: 500;
  padding: 0.5rem;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: var(--color-text-primary);
}

.nav-link.active {
  color: var(--color-accent-primary);
  border-bottom-color: var(--color-accent-primary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-bg-surface);
  padding: 0.4rem 1rem 0.4rem 0.4rem;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  transition: background 0.2s;
}

.user-pill:hover {
  background: rgba(255,255,255,0.05);
}

.xp-badge {
  background: var(--color-accent-primary);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
}

.avatar {
  font-size: 1.2rem;
}

.username {
  font-weight: 500;
  font-size: 0.9rem;
}
</style>
