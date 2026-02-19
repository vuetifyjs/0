<script setup>
  // Composables
  import { useCounter } from './useCounter'

  const counterA = useCounter()
  const counterB = useCounter()
</script>

<template>
  <div class="p-8 font-sans min-h-screen bg-background text-on-background">
    <h1 class="text-2xl font-bold mb-6">
      Your First Composable
    </h1>

    <div class="grid grid-cols-2 gap-6">
      <div class="p-4 rounded-lg border border-solid border-divider bg-surface">
        <h2 class="text-lg font-bold text-on-surface mb-3">Counter A</h2>

        <p class="text-3xl font-bold text-primary mb-4">
          {{ counterA.count.value }}
        </p>

        <div class="flex gap-2">
          <button
            class="px-3 py-1.5 rounded bg-primary text-on-primary font-medium"
            @click="counterA.increment"
          >
            +
          </button>

          <button
            class="px-3 py-1.5 rounded bg-primary text-on-primary font-medium"
            @click="counterA.decrement"
          >
            -
          </button>

          <button
            class="px-3 py-1.5 rounded border border-solid border-divider text-on-surface-variant font-medium"
            @click="counterA.reset"
          >
            Reset
          </button>
        </div>
      </div>

      <div class="p-4 rounded-lg border border-solid border-divider bg-surface">
        <h2 class="text-lg font-bold text-on-surface mb-3">Counter B</h2>

        <p class="text-3xl font-bold text-primary mb-4">
          {{ counterB.count.value }}
        </p>

        <div class="flex gap-2">
          <button
            class="px-3 py-1.5 rounded bg-primary text-on-primary font-medium"
            @click="counterB.increment"
          >
            +
          </button>

          <button
            class="px-3 py-1.5 rounded bg-primary text-on-primary font-medium"
            @click="counterB.decrement"
          >
            -
          </button>

          <button
            class="px-3 py-1.5 rounded border border-solid border-divider text-on-surface-variant font-medium"
            @click="counterB.reset"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
