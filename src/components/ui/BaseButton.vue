<template>
  <button 
    class="base-button" 
    :class="[`variant-${variant}`, `size-${size}`, { 'is-loading': loading }]"
    v-bind="$attrs"
  >
    <span class="button-content" :class="{ 'opacity-0': loading }">
      <slot></slot>
    </span>
    <span v-if="loading" class="loader"></span>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary', // primary, secondary, outline, ghost
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
  },
  loading: {
    type: Boolean,
    default: false,
  }
})
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  overflow: hidden;
}

.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Sizes */
.size-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}
.size-md {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}
.size-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Variants */
.variant-primary {
  background: var(--color-accent-primary);
  color: #fff;
  box-shadow: 0 4px 14px rgba(124, 77, 255, 0.3);
}
.variant-primary:hover:not(:disabled) {
  background: #8e66ff;
  box-shadow: var(--shadow-glow-purple);
  transform: translateY(-2px);
}

.variant-secondary {
  background: var(--color-accent-secondary);
  color: #000;
  box-shadow: 0 4px 14px rgba(0, 229, 255, 0.3);
}
.variant-secondary:hover:not(:disabled) {
  background: #33ebff;
  box-shadow: var(--shadow-glow-cyan);
  transform: translateY(-2px);
}

.variant-outline {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
.variant-outline:hover:not(:disabled) {
  border-color: var(--color-accent-primary);
  background: rgba(124, 77, 255, 0.1);
}

.variant-ghost {
  background: transparent;
  color: var(--color-text-secondary);
}
.variant-ghost:hover:not(:disabled) {
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.05);
}

/* Loader */
.opacity-0 {
  opacity: 0;
}
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>
