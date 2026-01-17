<script setup lang="ts">
// Utilities
  import { ref } from 'vue'

  defineProps<{
    hint?: string
  }>()

  const isOpen = ref(false)

  function toggle () {
    isOpen.value = !isOpen.value
  }
</script>

<template>
  <div v-if="hint" class="skill-hint">
    <button
      :aria-expanded="isOpen"
      class="skill-hint__toggle"
      @click="toggle"
    >
      <span class="skill-hint__icon">💡</span>
      <span>{{ isOpen ? 'Hide hint' : 'Show hint' }}</span>
      <span class="skill-hint__chevron" :class="{ 'skill-hint__chevron--open': isOpen }">
        ▼
      </span>
    </button>

    <Transition name="hint">
      <div v-show="isOpen" class="skill-hint__content">
        {{ hint }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.skill-hint {
  margin-top: 1rem;
  border: 1px solid var(--v0-warning);
  border-radius: 8px;
  background: color-mix(in srgb, var(--v0-warning) 10%, transparent);
  overflow: hidden;
}

.skill-hint__toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--v0-on-surface);
  text-align: left;
}

.skill-hint__toggle:hover {
  background: color-mix(in srgb, var(--v0-warning) 5%, transparent);
}

.skill-hint__icon {
  font-size: 1rem;
}

.skill-hint__chevron {
  margin-left: auto;
  font-size: 0.625rem;
  transition: transform 0.2s;
}

.skill-hint__chevron--open {
  transform: rotate(180deg);
}

.skill-hint__content {
  padding: 0 1rem 1rem;
  font-size: 0.875rem;
  color: var(--v0-on-surface-variant);
}

.hint-enter-active,
.hint-leave-active {
  transition: all 0.2s ease;
}

.hint-enter-from,
.hint-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
