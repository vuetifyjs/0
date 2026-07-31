<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import ReviewForm from './ReviewForm.vue'
  import { useReview } from './useReview'

  const { stars, comment, submitted, onSubmit, reset } = useReview()
</script>

<template>
  <div class="max-w-sm mx-auto">
    <div v-if="submitted" class="flex flex-col gap-2 p-4 rounded-lg bg-surface-variant text-on-surface">
      <p class="text-sm font-medium">Review submitted</p>

      <p class="flex items-center gap-1 text-sm">
        <span class="text-amber-500">
          {{ '★'.repeat(Math.floor(submitted.stars)) }}{{ submitted.stars % 1 ? '½' : '' }}
        </span>

        <span class="text-on-surface-variant">{{ submitted.stars }} out of 5</span>
      </p>

      <p class="text-sm text-on-surface-variant">{{ submitted.comment }}</p>

      <Button.Root
        class="self-start mt-2 px-3 py-1 rounded-lg border border-divider text-sm"
        @click="reset"
      >
        Write another
      </Button.Root>
    </div>

    <ReviewForm
      v-else
      v-model:comment="comment"
      v-model:stars="stars"
      :reset
      :submit="onSubmit"
    />

    <p class="mt-3 text-xs text-on-surface-variant">
      Stars feed the <code class="text-primary">name="review-rating"</code> hidden input; the
      review text validates through the Form before submission.
    </p>
  </div>
</template>
