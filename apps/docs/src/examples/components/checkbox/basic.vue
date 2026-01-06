<script setup lang="ts">
  // Framework
  import { Checkbox } from '@vuetify/v0'

  // Utilities
  import { ref } from 'vue'

  const agreed = ref(false)
</script>

<template>
  <Checkbox.Root v-slot="{ isChecked }" v-model="agreed">
    <Checkbox.Indicator
      class="size-5 border rounded flex items-center justify-center cursor-pointer"
      :class="isChecked ? 'bg-primary border-primary' : 'border-divider'"
    >
      <svg
        v-if="isChecked"
        class="size-3 text-on-primary"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        viewBox="0 0 24 24"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </Checkbox.Indicator>
    <span class="ml-2">I agree to the terms and conditions</span>
  </Checkbox.Root>

  <p class="mt-4 text-sm text-on-surface-variant">
    Agreed: {{ agreed }}
  </p>
</template>
