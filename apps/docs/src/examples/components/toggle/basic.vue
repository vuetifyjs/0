<script setup lang="ts">
  import { Toggle } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const saved = shallowRef(false)
</script>

<template>
  <Toggle.Root
    v-model="saved"
    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-divider font-medium transition-colors data-[state=on]:bg-primary data-[state=on]:text-on-primary data-[state=on]:border-primary"
  >
    <Toggle.Indicator v-slot="{ isPressed }">
      <svg
        class="size-5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path
          v-if="isPressed"
          d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
          fill="currentColor"
        />
        <path
          v-else
          d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        />
      </svg>
    </Toggle.Indicator>

    {{ saved ? 'Saved' : 'Save' }}
  </Toggle.Root>
</template>
