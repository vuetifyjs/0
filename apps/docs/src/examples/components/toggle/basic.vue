<script setup lang="ts">
  import { Toggle } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const saved = shallowRef(false)
</script>

<template>
  <div class="flex justify-center">
    <Toggle.Root
      v-model="saved"
      class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-divider font-medium data-[state=on]:bg-primary data-[state=on]:text-on-primary data-[state=on]:border-primary"
    >
      <svg
        class="size-5 data-[state=off]:opacity-40"
        :data-state="saved ? 'on' : 'off'"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
          :fill="saved ? 'currentColor' : 'none'"
        />
      </svg>

      Bookmark
    </Toggle.Root>
  </div>
</template>
