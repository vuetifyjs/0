<script setup lang="ts">
  // Framework
  import { createStep } from '@vuetify/v0'

  // Utilities
  import { computed } from 'vue'

  const steps = [
    { id: 'cart', label: 'Cart', icon: '1' },
    { id: 'shipping', label: 'Shipping', icon: '2' },
    { id: 'payment', label: 'Payment', icon: '3', disabled: true },
    { id: 'review', label: 'Review', icon: '4' },
    { id: 'confirm', label: 'Confirm', icon: '5' },
  ]

  const stepper = createStep()
  stepper.onboard(steps.map((s, i) => ({ id: s.id, value: i, disabled: s.disabled })))
  stepper.first()

  const currentIndex = computed(() => stepper.selectedIndex.value)
  const isFirst = computed(() => currentIndex.value === 0)
  const isLast = computed(() => currentIndex.value === stepper.size - 1)
</script>

<template>
  <div class="p-8 font-sans min-h-screen bg-background text-on-background">
    <!-- Stepper Track -->
    <div class="relative flex items-center justify-between mb-12">
      <div class="absolute top-5 left-0 right-0 h-0.5 bg-divider" />
      <div
        class="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-400"
        :style="{ width: (currentIndex / (steps.length - 1)) * 100 + '%' }"
      />

      <div
        v-for="(step, i) in steps"
        :key="step.id"
        class="relative z-1 flex flex-col items-center cursor-pointer"
        @click="!step.disabled && stepper.select(step.id)"
      >
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
          :class="[
            i <= currentIndex ? 'bg-primary text-on-primary' : step.disabled ? 'bg-surface border-2 border-dashed border-divider' : 'bg-surface border-2 border-solid border-divider',
            i === currentIndex ? 'scale-115 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]' : 'scale-90',
            step.disabled ? 'opacity-50' : '',
          ]"
        >
          <span v-if="i < currentIndex">&#10003;</span>
          <span v-else>{{ step.icon }}</span>
        </div>

        <span
          class="mt-2 text-xs font-medium"
          :class="[
            i === currentIndex ? 'text-primary' : 'text-on-surface-variant',
            step.disabled ? 'line-through opacity-50' : '',
          ]"
        >
          {{ step.label }}
        </span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-center gap-2">
      <button
        class="px-3 py-1.5 text-sm rounded border border-solid border-divider bg-surface disabled:opacity-40"
        :disabled="isFirst"
        @click="stepper.first()"
      >
        First
      </button>
      <button
        class="px-4 py-1.5 text-sm rounded bg-surface-tint text-primary disabled:opacity-40"
        :disabled="isFirst"
        @click="stepper.prev()"
      >
        Prev
      </button>
      <button
        class="px-4 py-1.5 text-sm rounded bg-primary text-on-primary disabled:opacity-40"
        :disabled="isLast"
        @click="stepper.next()"
      >
        Next
      </button>
      <button
        class="px-3 py-1.5 text-sm rounded border border-solid border-divider bg-surface disabled:opacity-40"
        :disabled="isLast"
        @click="stepper.last()"
      >
        Last
      </button>
    </div>

    <p class="mt-6 text-center text-xs text-on-surface-variant">
      Step {{ currentIndex + 1 }} of {{ stepper.size }} · Payment step is disabled (auto-skipped)
    </p>
  </div>
</template>
