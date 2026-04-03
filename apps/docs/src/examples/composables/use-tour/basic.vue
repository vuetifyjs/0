<script setup lang="ts">
  import { createTour } from '@vuetify/v0'
  import { provide } from 'vue'

  const tour = createTour()
  provide('v0:tour', tour)

  tour.steps.onboard([
    { id: 'step-1' },
    { id: 'step-2' },
    { id: 'step-3', type: 'wait' },
  ])
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-2 flex-wrap">
      <button
        class="px-3 py-1.5 text-sm bg-primary text-on-primary rounded-md"
        @click="tour.start()"
      >
        Start
      </button>

      <button
        class="px-3 py-1.5 text-sm border border-divider rounded-md"
        :disabled="!tour.isActive.value"
        @click="tour.prev()"
      >
        Prev
      </button>

      <button
        class="px-3 py-1.5 text-sm border border-divider rounded-md"
        :disabled="!tour.isActive.value"
        @click="tour.next()"
      >
        Next
      </button>

      <button
        class="px-3 py-1.5 text-sm border border-divider rounded-md"
        :disabled="!tour.isActive.value"
        @click="tour.stop()"
      >
        Stop
      </button>

      <button
        v-if="!tour.isReady.value && tour.isActive.value"
        class="px-3 py-1.5 text-sm bg-success text-on-success rounded-md"
        @click="tour.ready()"
      >
        Mark Ready
      </button>
    </div>

    <div class="text-sm space-y-1 text-on-surface-variant">
      <div>Active: <span class="font-mono text-on-surface">{{ tour.isActive.value }}</span></div>
      <div>Step: <span class="font-mono text-on-surface">{{ tour.selectedId.value ?? '—' }}</span></div>
      <div>Ready: <span class="font-mono text-on-surface">{{ tour.isReady.value }}</span></div>
      <div>Complete: <span class="font-mono text-on-surface">{{ tour.isComplete.value }}</span></div>
    </div>
  </div>
</template>
