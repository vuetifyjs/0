<script setup lang="ts">
  import { createStep } from '@vuetify/v0'
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
  <div class="w-full max-w-2xl mx-auto py-8">
    <!-- Stepper Track -->
    <div class="relative flex items-center justify-between mb-12">
      <!-- Connecting Line (Background) -->
      <div class="absolute top-5 left-0 right-0 h-0.5 bg-divider" />

      <!-- Progress Line -->
      <div
        class="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 ease-out"
        :style="{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }"
      />

      <!-- Steps -->
      <div
        v-for="(step, i) in steps"
        :key="step.id"
        class="relative z-10 flex flex-col items-center cursor-pointer group"
        @click="!step.disabled && stepper.select(step.id)"
      >
        <!-- Circle -->
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
          :class="[
            i < currentIndex ? 'bg-primary text-on-primary scale-90' : '',
            i === currentIndex ? 'bg-primary text-on-primary ring-4 ring-primary/30 scale-110' : '',
            i > currentIndex && !step.disabled ? 'bg-surface border-2 border-divider text-on-surface-variant group-hover:border-primary' : '',
            step.disabled ? 'bg-surface border-2 border-dashed border-divider text-on-surface-variant/50 cursor-not-allowed' : '',
          ]"
        >
          <template v-if="i < currentIndex">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" />
            </svg>
          </template>
          <template v-else>{{ step.icon }}</template>
        </div>

        <!-- Label -->
        <span
          class="mt-3 text-xs font-medium transition-colors duration-200"
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
        class="px-3 py-1.5 text-sm rounded border border-divider hover:bg-surface-tint disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="isFirst"
        @click="stepper.first()"
      >
        First
      </button>
      <button
        class="px-4 py-1.5 text-sm rounded bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="isFirst"
        @click="stepper.prev()"
      >
        Prev
      </button>
      <button
        class="px-4 py-1.5 text-sm rounded bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="isLast"
        @click="stepper.next()"
      >
        Next
      </button>
      <button
        class="px-3 py-1.5 text-sm rounded border border-divider hover:bg-surface-tint disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="isLast"
        @click="stepper.last()"
      >
        Last
      </button>
    </div>

    <!-- Status -->
    <p class="mt-6 text-center text-xs text-on-surface-variant">
      Step {{ currentIndex + 1 }} of {{ stepper.size }} &middot; Payment step is disabled (auto-skipped)
    </p>
  </div>
</template>
