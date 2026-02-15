<script setup lang="ts">
  // Framework
  import { createStep } from '@vuetify/v0'

  // Utilities
  import { computed } from 'vue'

  const steps = [
    { id: 'intro', label: 'Introduction' },
    { id: 'setup', label: 'Setup' },
    { id: 'finish', label: 'Finish' },
  ]

  const stepper = createStep()
  stepper.onboard(steps.map((s, i) => ({ id: s.id, value: i })))
  stepper.first()

  const currentIndex = computed(() => stepper.selectedIndex.value)
  const currentLabel = computed(() => steps[currentIndex.value]?.label)
  const isFirst = computed(() => currentIndex.value === 0)
  const isLast = computed(() => currentIndex.value === steps.length - 1)
</script>

<template>
  <div class="p-8 font-sans min-h-screen bg-background text-on-background">
    <h1 class="text-2xl font-bold mb-6">
      Step Navigator
    </h1>

    <!-- Step indicators -->
    <div class="flex items-center gap-2 mb-8">
      <div
        v-for="(step, i) in steps"
        :key="step.id"
        class="flex items-center gap-2"
      >
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
          :class="i <= currentIndex
            ? 'bg-primary text-on-primary'
            : 'bg-surface-tint text-on-surface-variant'"
        >
          {{ i + 1 }}
        </div>
        <span
          class="text-sm"
          :class="i === currentIndex ? 'text-primary font-medium' : 'text-on-surface-variant'"
        >
          {{ step.label }}
        </span>
        <span v-if="i < steps.length - 1" class="text-divider mx-1">—</span>
      </div>
    </div>

    <!-- Current step content -->
    <div class="p-6 rounded-lg bg-surface-tint mb-6">
      <p class="text-lg">
        Currently on: <strong>{{ currentLabel }}</strong>
      </p>
      <p class="text-sm text-on-surface-variant mt-2">
        Step {{ currentIndex + 1 }} of {{ steps.length }}
      </p>
    </div>

    <!-- Navigation -->
    <div class="flex gap-2">
      <button
        class="px-4 py-2 rounded bg-surface-tint text-on-surface disabled:opacity-40"
        :disabled="isFirst"
        @click="stepper.prev()"
      >
        Previous
      </button>
      <button
        class="px-4 py-2 rounded bg-primary text-on-primary disabled:opacity-40"
        :disabled="isLast"
        @click="stepper.next()"
      >
        Next
      </button>
    </div>
  </div>
</template>
