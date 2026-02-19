<script setup>
  // Framework
  import { Single } from '@vuetify/v0'

  // Utilities
  import { ref } from 'vue'

  const selected = ref('apple')
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">
      Headless Selection
    </h1>

    <p class="text-sm text-on-surface-variant mb-4">
      Pick your favorite fruit:
    </p>

    <Single.Root v-model="selected" class="flex gap-3">
      <Single.Item v-slot="{ isSelected }" value="apple">
        <button
          class="px-4 py-2 rounded-lg border border-solid border-divider transition-colors"
          :class="isSelected
            ? 'bg-primary text-on-primary border-primary'
            : 'bg-surface text-on-surface hover:bg-surface-tint'"
        >
          Apple {{ isSelected ? '✓' : '' }}
        </button>
      </Single.Item>

      <Single.Item v-slot="{ isSelected }" value="banana">
        <button
          class="px-4 py-2 rounded-lg border border-solid border-divider transition-colors"
          :class="isSelected
            ? 'bg-primary text-on-primary border-primary'
            : 'bg-surface text-on-surface hover:bg-surface-tint'"
        >
          Banana {{ isSelected ? '✓' : '' }}
        </button>
      </Single.Item>

      <Single.Item v-slot="{ isSelected }" value="cherry">
        <button
          class="px-4 py-2 rounded-lg border border-solid border-divider transition-colors"
          :class="isSelected
            ? 'bg-primary text-on-primary border-primary'
            : 'bg-surface text-on-surface hover:bg-surface-tint'"
        >
          Cherry {{ isSelected ? '✓' : '' }}
        </button>
      </Single.Item>
    </Single.Root>

    <p class="mt-4 text-sm text-on-surface-variant">
      Selected: <strong class="text-on-surface">{{ selected }}</strong>
    </p>
  </div>
</template>
