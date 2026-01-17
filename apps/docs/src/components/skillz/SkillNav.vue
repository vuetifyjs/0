<script setup lang="ts">
// Utilities
  import { computed } from 'vue'

  const props = defineProps<{
    currentStep: number
    totalSteps: number
    canProceed: boolean
    isValidating?: boolean
  }>()

  const emit = defineEmits<{
    prev: []
    next: []
    check: []
    complete: []
  }>()

  const isFirstStep = computed(() => props.currentStep === 0)
  const isLastStep = computed(() => props.currentStep === props.totalSteps - 1)
</script>

<template>
  <div class="skill-nav">
    <button
      class="skill-nav__btn skill-nav__btn--secondary"
      :disabled="isFirstStep"
      @click="emit('prev')"
    >
      ← Previous
    </button>

    <button
      class="skill-nav__btn skill-nav__btn--primary"
      :disabled="isValidating"
      @click="emit('check')"
    >
      {{ isValidating ? 'Checking...' : '✓ Check' }}
    </button>

    <button
      v-if="!isLastStep"
      class="skill-nav__btn skill-nav__btn--secondary"
      :disabled="!canProceed"
      @click="emit('next')"
    >
      Next →
    </button>

    <button
      v-else
      class="skill-nav__btn skill-nav__btn--success"
      :disabled="!canProceed"
      @click="emit('complete')"
    >
      🎉 Complete Skill
    </button>
  </div>
</template>

<style scoped>
.skill-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--v0-divider);
  background: var(--v0-surface);
}

.skill-nav__btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.skill-nav__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.skill-nav__btn--secondary {
  background: transparent;
  border: 1px solid var(--v0-divider);
  color: var(--v0-on-surface);
}

.skill-nav__btn--secondary:hover:not(:disabled) {
  border-color: var(--v0-primary);
  color: var(--v0-primary);
}

.skill-nav__btn--primary {
  background: var(--v0-primary);
  border: 1px solid var(--v0-primary);
  color: var(--v0-on-primary);
}

.skill-nav__btn--primary:hover:not(:disabled) {
  filter: brightness(1.1);
}

.skill-nav__btn--success {
  background: var(--v0-success);
  border: 1px solid var(--v0-success);
  color: white;
}

.skill-nav__btn--success:hover:not(:disabled) {
  filter: brightness(1.1);
}
</style>
