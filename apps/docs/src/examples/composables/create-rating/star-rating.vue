<script setup lang="ts">
  import StarRating from './StarRating.vue'
  import { useStarRating } from './useStarRating'

  const review = useStarRating()
</script>

<template>
  <div class="flex flex-col gap-6 p-6 max-w-md rounded-lg border border-divider bg-surface">
    <div class="flex flex-col gap-1">
      <h3 class="text-base font-semibold text-on-surface">Rate your purchase</h3>

      <p class="text-sm text-on-surface-variant">
        Hover to preview, click the left or right half of a star for half steps.
      </p>
    </div>

    <StarRating :review />

    <div class="flex items-center gap-2">
      <button
        class="px-3 py-1.5 text-sm rounded bg-primary text-on-primary disabled:opacity-40"
        :disabled="review.value.value === 0"
        type="button"
        @click="review.submit()"
      >
        Submit review
      </button>

      <button
        class="px-3 py-1.5 text-sm rounded bg-surface-variant text-on-surface-variant"
        type="button"
        @click="review.reset()"
      >
        Reset
      </button>
    </div>

    <p v-if="review.submitted.value !== null" class="text-sm text-success">
      Thanks! You rated this {{ review.submitted.value }} out of 5 stars.
    </p>
  </div>
</template>
