<script setup lang="ts">
  import { Button } from '@vuetify/v0'
</script>

<template>
  <div class="flex gap-3">
    <Button.Root
      class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
    >
      <Button.Icon>
        <svg
          class="size-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Button.Icon>
      Add item
    </Button.Root>

    <Button.Root
      aria-label="Close"
      class="inline-flex items-center justify-center size-10 rounded-full bg-surface-variant text-on-surface-variant hover:opacity-80 transition-opacity"
    >
      <Button.Icon>
        <svg
          class="size-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </Button.Icon>
    </Button.Root>
  </div>
</template>
