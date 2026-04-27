<template>
  <div class="game-view animate-slide-up">
    <div class="game-header">
      <router-link to="/games" class="back-link">← Back to Library</router-link>
      <div class="header-row">
        <h1>{{ title }}</h1>
        <div class="header-actions">
          <slot name="status" />
        </div>
      </div>
    </div>

    <div class="game-body">
      <div class="game-area" :class="{ 'with-sidebar': $slots.sidebar }">
        <div class="game-stage">
          <slot />
          <Transition name="overlay-fade">
            <div v-if="showOverlay" class="game-overlay">
              <div class="overlay-box">
                <slot name="overlay" />
              </div>
            </div>
          </Transition>
        </div>
        <aside v-if="$slots.sidebar" class="game-sidebar">
          <slot name="sidebar" />
        </aside>
      </div>
      <div v-if="$slots.controls" class="game-controls">
        <slot name="controls" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  showOverlay: { type: Boolean, default: false }
})
</script>

<style scoped>
.game-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: calc(100vh - 80px);
}

.game-header {
  width: 100%;
  max-width: 900px;
  margin-bottom: 2rem;
}

.game-header h1 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 2.5rem;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.back-link {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--color-accent-primary);
}

.game-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.game-area {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  justify-content: center;
}

.game-stage {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.game-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 200px;
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(11, 15, 26, 0.88);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.overlay-box {
  text-align: center;
  padding: 2rem;
}

.overlay-box h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--color-accent-secondary);
}

.overlay-box p {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.overlay-fade-enter-active { animation: overlay-in 0.4s ease; }
.overlay-fade-leave-active { animation: overlay-in 0.3s ease reverse; }

@keyframes overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.game-controls {
  margin-top: 1rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 768px) {
  .game-area {
    flex-direction: column;
    align-items: center;
  }
  .game-sidebar {
    width: 100%;
    min-width: unset;
  }
}
</style>
