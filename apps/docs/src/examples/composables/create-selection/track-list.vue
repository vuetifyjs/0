<script setup lang="ts">
  import { Button } from '@vuetify/v0'

  import TrackList from './TrackList.vue'
  import { useTracklist } from './useTracklist'

  const tracklist = useTracklist()
</script>

<template>
  <div class="space-y-4">
    <TrackList :tracklist />

    <!-- Queue summary -->
    <div
      v-if="tracklist.queue.value.length > 0"
      class="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-primary">
          Up next &middot; {{ tracklist.queue.value.length }}
        </span>

        <Button.Root
          class="text-xs text-primary hover:underline"
          @click="tracklist.clearQueue()"
        >
          Clear queue
        </Button.Root>
      </div>

      <ol class="space-y-0.5">
        <li
          v-for="(title, index) in tracklist.queue.value"
          :key="title"
          class="text-sm text-on-surface tabular-nums"
        >
          {{ index + 1 }}. {{ title }}
        </li>
      </ol>
    </div>

    <p v-else class="text-xs text-on-surface-variant text-center">
      Select tracks and add them to the queue.
    </p>
  </div>
</template>
