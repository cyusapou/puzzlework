<template>
  <div class="base-card" :class="[paddingClass, { 'glass': glass, 'hoverable': hoverable }]">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: 'md' // none, sm, md, lg
  },
  glass: {
    type: Boolean,
    default: true
  },
  hoverable: {
    type: Boolean,
    default: false
  }
})

const paddingClass = computed(() => {
  return `p-${props.padding}`
})
</script>

<style scoped>
.base-card {
  border-radius: var(--radius-lg);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

/* Padding utilities just for the card */
.p-none { padding: 0; }
.p-sm { padding: 1rem; }
.p-md { padding: 1.5rem; }
.p-lg { padding: 2.5rem; }

.glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
}

.hoverable:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border-color: rgba(124, 77, 255, 0.4);
}
</style>
