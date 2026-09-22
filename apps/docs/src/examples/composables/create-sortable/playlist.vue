<script setup lang="ts">
  import PlaylistQueue from './PlaylistQueue.vue'
  import { usePlaylist } from './usePlaylist'

  const { proxy, status, moveUp, moveDown } = usePlaylist()
</script>

<template>
  <div class="mx-auto flex max-w-md flex-col gap-3">
    <PlaylistQueue
      :move-down
      :move-up
      :proxy
    />

    <p
      aria-live="polite"
      class="rounded-lg bg-surface-variant px-3 py-2 text-xs text-on-surface-variant"
      role="status"
    >
      {{ status }}
    </p>
  </div>
</template>
