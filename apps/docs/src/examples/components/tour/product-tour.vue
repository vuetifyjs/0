<script setup lang="ts">
  import OnboardingTour from './OnboardingTour.vue'
  import { useOnboarding } from './useOnboarding'

  const { tour } = useOnboarding()
  const isActive = tour.isActive
  const isComplete = tour.isComplete

  function onStart () {
    tour.start()
  }
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <OnboardingTour />

    <div class="flex items-center gap-3">
      <button
        class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-on-primary disabled:opacity-50"
        :disabled="isActive"
        type="button"
        @click="onStart"
      >
        Start tour
      </button>

      <p v-if="isComplete" class="text-sm text-on-surface-variant">
        Tour complete.
      </p>

      <p v-else-if="!isActive" class="text-sm text-on-surface-variant">
        Press Start to walk the chrome.
      </p>
    </div>
  </div>
</template>
