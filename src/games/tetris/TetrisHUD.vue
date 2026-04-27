<template>
  <div class="tetris-hud">
    <BaseCard padding="sm" class="hud-panel">
      <div class="stat">
        <span class="label">SCORE</span>
        <span class="value">{{ score }}</span>
      </div>
      <div class="stat">
        <span class="label">LEVEL</span>
        <span class="value">{{ level }}</span>
      </div>
      <div class="stat">
        <span class="label">LINES</span>
        <span class="value">{{ lines }}</span>
      </div>
    </BaseCard>

    <BaseCard padding="sm" class="hud-panel">
      <span class="label">CONTROLS</span>
      <div class="controls-info">
        <p><strong>← →</strong> Move</p>
        <p><strong>↑</strong> Rotate</p>
        <p><strong>↓</strong> Soft Drop</p>
        <p><strong>Space</strong> Hard Drop</p>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '../../components/ui/BaseCard.vue'

defineProps({
  score: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  lines: { type: Number, default: 0 }
})
</script>

<style scoped>
.tetris-hud {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 200px;
}

.hud-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-weight: 700;
  letter-spacing: 1px;
}

.value {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent-secondary);
}

.controls-info {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.controls-info p {
  margin: 0;
}

.controls-info strong {
  color: var(--color-text-primary);
  display: inline-block;
  width: 50px;
}
</style>
