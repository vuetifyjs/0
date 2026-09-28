<script setup lang="ts">
  // Composables
  import { createTourContext } from '#v0/composables/createTour'

  // Utilities
  import { onMounted } from 'vue'

  import { Tour } from '../Tour/index'

  const [, provideTour, tour] = createTourContext()

  provideTour()

  tour.steps.onboard([
    { id: 'one' },
    { id: 'two' },
  ])

  onMounted(() => {
    tour.start()
  })
</script>

<template>
  <Tour.Highlight />

  <Tour.Activator step="one">
    <button type="button">Target</button>
  </Tour.Activator>

  <Tour.Root step="one">
    <Tour.Content>
      <Tour.Title>One</Tour.Title>
      <Tour.Description>First step.</Tour.Description>
      <Tour.Progress />
      <Tour.Next>Next</Tour.Next>
    </Tour.Content>
  </Tour.Root>
</template>
