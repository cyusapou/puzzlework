<template>
  <div class="home-view">
    <section class="hero animate-slide-up">
      <div class="hero-content">
        <h1 class="hero-title">Welcome to the <span class="text-gradient">PuzzleVerse</span></h1>
        <p class="hero-subtitle">
          Explore a universe of classic and modern puzzle games. Challenge your mind, climb the leaderboards, and compete with friends in real-time.
        </p>
        <div class="hero-actions">
          <router-link to="/games">
            <BaseButton size="lg" variant="primary">Start Playing</BaseButton>
          </router-link>
          <router-link v-if="!auth.isLoggedIn" to="/signup">
            <BaseButton size="lg" variant="outline">Sign Up / Login</BaseButton>
          </router-link>
          <router-link v-else to="/lobby">
            <BaseButton size="lg" variant="outline">Go to Lobby</BaseButton>
          </router-link>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="floating-cube animate-float"></div>
        <div class="floating-cube cube-2 animate-float stagger-2"></div>
        <div class="floating-cube cube-3 animate-float stagger-3"></div>
      </div>
    </section>

    <section class="features stagger-2 animate-slide-up">
      <BaseCard class="feature-card" padding="lg">
        <div class="feature-icon">🎮</div>
        <h3>Curated Library</h3>
        <p>From Tetris to Wordle, enjoy the best logic puzzles in one place.</p>
      </BaseCard>
      <BaseCard class="feature-card" padding="lg">
        <div class="feature-icon">🏆</div>
        <h3>Global Leaderboards</h3>
        <p>Compete against players worldwide to reach the top ranks.</p>
      </BaseCard>
      <BaseCard class="feature-card" padding="lg">
        <div class="feature-icon">⚔️</div>
        <h3>Multiplayer Rooms</h3>
        <p>Challenge your friends in real-time races and co-op modes.</p>
      </BaseCard>
    </section>
  </div>
</template>

<script setup>
import BaseButton from '../components/ui/BaseButton.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<style scoped>
.home-view {
  padding: 2rem 0;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  padding: 4rem 0;
  min-height: 60vh;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 4rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.hero-visual {
  flex: 1;
  position: relative;
  height: 400px;
  perspective: 1000px;
}

.floating-cube {
  position: absolute;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, rgba(124, 77, 255, 0.4), rgba(0, 229, 255, 0.4));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(45deg) rotateZ(45deg);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.cube-2 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 20%;
  background: linear-gradient(135deg, rgba(255, 23, 68, 0.4), rgba(255, 171, 0, 0.4));
  animation-duration: 7s;
}

.cube-3 {
  width: 100px;
  height: 100px;
  top: 70%;
  left: 70%;
  background: linear-gradient(135deg, rgba(0, 230, 118, 0.4), rgba(0, 229, 255, 0.4));
  animation-duration: 8s;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.feature-card {
  text-align: center;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-card p {
  color: var(--color-text-secondary);
  line-height: 1.5;
}

@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 2rem 0;
  }
  .hero-actions {
    justify-content: center;
  }
  .hero-visual {
    width: 100%;
    height: 300px;
  }
  .hero-title {
    font-size: 3rem;
  }
}
</style>
