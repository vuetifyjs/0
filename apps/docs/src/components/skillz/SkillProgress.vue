<script setup lang="ts">
  const props = defineProps<{
    totalSteps: number
    currentStep: number
    completedSteps: number[]
  }>()

  function getStepState (index: number): 'completed' | 'current' | 'pending' {
    if (props.completedSteps.includes(index)) return 'completed'
    if (index === props.currentStep) return 'current'
    return 'pending'
  }
</script>

<template>
  <div class="skill-progress">
    <div class="skill-progress__dots">
      <button
        v-for="i in totalSteps"
        :key="i"
        :aria-current="i - 1 === currentStep ? 'step' : undefined"
        :aria-label="`Step ${i}`"
        class="skill-progress__dot"
        :class="`skill-progress__dot--${getStepState(i - 1)}`"
      />
    </div>
    <span class="skill-progress__text">
      Step {{ currentStep + 1 }} of {{ totalSteps }}
    </span>
  </div>
</template>

<style scoped>
.skill-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.skill-progress__dots {
  display: flex;
  gap: 0.5rem;
}

.skill-progress__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--v0-divider);
  background: transparent;
  padding: 0;
  cursor: default;
  transition: all 0.2s;
}

.skill-progress__dot--completed {
  background: var(--v0-success);
  border-color: var(--v0-success);
}

.skill-progress__dot--current {
  border-color: var(--v0-primary);
  box-shadow: 0 0 0 3px rgba(var(--v0-primary-rgb), 0.2);
}

.skill-progress__dot--pending {
  background: transparent;
}

.skill-progress__text {
  font-size: 0.875rem;
  color: var(--v0-on-surface-variant);
}
</style>
