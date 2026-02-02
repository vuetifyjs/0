<script setup lang="ts">
  // Framework
  import { IN_BROWSER } from '@vuetify/v0/constants'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  const props = defineProps<{
    frontmatter?: Record<string, unknown>
  }>()

  type FeedbackState = 'idle' | 'comment' | 'submitted'
  type Rating = 'amazing' | 'helpful' | 'unhelpful' | 'confusing'

  const RATING_OPTIONS: { value: Rating, emoji: string, label: string }[] = [
    { value: 'amazing', emoji: '😀', label: 'Amazing' },
    { value: 'helpful', emoji: '🙂', label: 'Helpful' },
    { value: 'unhelpful', emoji: '🙁', label: 'Unhelpful' },
    { value: 'confusing', emoji: '😕', label: 'Confusing' },
  ]

  const API_URL = `${import.meta.env.VITE_API_SERVER_URL || 'https://api.vuetifyjs.com'}/docs/feedback`

  const route = useRoute()

  // Hide on skillz pages (they have their own focused UI)
  const isVisible = toRef(() => !route.path.startsWith('/skillz'))

  const state = shallowRef<FeedbackState>('idle')
  const rating = shallowRef<Rating | null>(null)
  const comment = shallowRef('')
  const isSubmitting = shallowRef(false)

  watch(() => route.path, () => {
    state.value = 'idle'
    rating.value = null
    comment.value = ''
    isSubmitting.value = false
  })

  function selectRating (value: Rating) {
    rating.value = value
    state.value = 'comment'
  }

  function isPositive (r: Rating | null): boolean {
    return r === 'amazing' || r === 'helpful'
  }

  async function submit () {
    if (!IN_BROWSER || !rating.value) return

    isSubmitting.value = true

    try {
      const payload = {
        rating: rating.value,
        feedback: comment.value.trim() || undefined,
        path: route.path,
        title: props.frontmatter?.title as string | undefined,
      }

      // Use sendBeacon for reliability
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
        navigator.sendBeacon(API_URL, blob)
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        })
      }

      state.value = 'submitted'
    } catch {
      // Silently fail - don't disrupt UX for analytics
      state.value = 'submitted'
    } finally {
      isSubmitting.value = false
    }
  }

  function skip () {
    submit()
  }
</script>

<template>
  <section
    v-if="isVisible"
    class="mt-8 py-6 border-t border-divider"
  >
    <!-- Idle: Show question -->
    <div
      v-if="state === 'idle'"
      class="flex items-center gap-4"
    >
      <span class="text-sm text-on-surface-variant">Was this page helpful?</span>
      <div class="flex gap-1">
        <button
          v-for="option in RATING_OPTIONS"
          :key="option.value"
          :aria-label="option.label"
          class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-transparent hover:border-divider hover:bg-surface-variant transition-colors text-xl"
          type="button"
          @click="selectRating(option.value)"
        >
          {{ option.emoji }}
        </button>
      </div>
    </div>

    <!-- Comment: Optional feedback -->
    <div
      v-else-if="state === 'comment'"
      class="max-w-md"
    >
      <p class="text-sm text-on-surface-variant mb-3">
        {{ isPositive(rating) ? 'Great! What did you find most useful?' : 'Sorry to hear that. How can we improve?' }}
      </p>
      <textarea
        v-model="comment"
        class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm resize-none focus:outline-none focus:border-primary"
        :placeholder="isPositive(rating) ? 'Optional: Tell us what helped...' : 'Optional: Tell us what was missing or confusing...'"
        rows="3"
      />
      <div class="flex justify-end gap-2 mt-3">
        <button
          class="px-3 py-1.5 rounded-lg text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          :disabled="isSubmitting"
          type="button"
          @click="skip"
        >
          Skip
        </button>
        <button
          class="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          :disabled="isSubmitting"
          type="button"
          @click="submit"
        >
          {{ isSubmitting ? 'Sending...' : 'Send feedback' }}
        </button>
      </div>
    </div>

    <!-- Submitted: Thank you -->
    <div
      v-else-if="state === 'submitted'"
      class="flex items-center gap-2 text-sm text-on-surface-variant"
    >
      <AppIcon class="text-success" icon="check-circle" :size="16" />
      <span>Thanks for your feedback!</span>
    </div>
  </section>
</template>
