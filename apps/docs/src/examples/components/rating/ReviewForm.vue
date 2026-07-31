<script setup lang="ts">
  import { Form, Input, Rating } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const {
    submit,
    reset,
  } = defineProps<{
    submit: (valid: boolean) => void
    reset: () => void
  }>()

  const stars = defineModel<number>('stars', { default: 0 })
  const comment = defineModel<string>('comment', { default: '' })

  // Rating is not a createValidation field, so it does not auto-register
  // with the Form — gate its requirement with a local flag instead.
  const starsError = shallowRef(false)

  const labels = ['Terrible', 'Poor', 'Average', 'Good', 'Excellent']

  function onSubmit (payload: { valid: boolean }) {
    starsError.value = stars.value < 1
    submit(payload.valid && !starsError.value)
  }

  function onReset () {
    starsError.value = false
    reset()
  }
</script>

<template>
  <Form
    class="flex flex-col gap-4"
    @reset="onReset"
    @submit="onSubmit"
  >
    <div class="flex flex-col gap-1">
      <span class="text-sm font-medium text-on-surface">Your rating</span>

      <div class="flex items-center gap-3">
        <Rating.Root
          v-slot="{ attrs, value }"
          v-model="stars"
          class="focus:outline-none"
          half
          name="review-rating"
          renderless
        >
          <div v-bind="attrs" class="flex gap-0.5">
            <Rating.Item
              v-for="i in 5"
              :key="i"
              as="button"
              class="relative size-8 text-2xl cursor-pointer focus:outline-none"
              :index="i"
              type="button"
            >
              <template #default="{ state }">
                <span v-if="state === 'half'" class="relative inline-flex">
                  <span class="text-on-surface-variant/40">☆</span>
                  <span class="absolute inset-0 overflow-hidden w-1/2 text-amber-500">★</span>
                </span>

                <span v-else :class="state === 'full' ? 'text-amber-500' : 'text-on-surface-variant/40'">
                  {{ state === 'full' ? '★' : '☆' }}
                </span>
              </template>
            </Rating.Item>

            <span class="ml-2 self-center text-sm text-on-surface-variant">
              {{ value > 0 ? labels[Math.ceil(value) - 1] : 'Tap to rate' }}
            </span>
          </div>
        </Rating.Root>
      </div>

      <span v-if="starsError" class="text-xs text-error">Please select a rating</span>
    </div>

    <Input.Root
      v-model="comment"
      label="Review"
      :rules="[
        (v: string) => !!v || 'A short review is required',
        (v: string) => v.length >= 10 || 'At least 10 characters',
      ]"
      validate-on="blur lazy"
    >
      <Input.Control
        as="textarea"
        autocomplete="off"
        class="w-full min-h-24 px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant/50 outline-none data-[focused]:border-primary data-[state=invalid]:border-error transition-colors resize-y"
        placeholder="What did you like or dislike?"
      />

      <Input.Error v-slot="{ errors }" class="text-xs text-error">
        <span v-for="error in errors" :key="error">{{ error }}</span>
      </Input.Error>
    </Input.Root>

    <div class="flex gap-2">
      <button
        class="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium"
        type="submit"
      >
        Submit review
      </button>

      <button
        class="px-4 py-2 rounded-lg border border-divider text-on-surface text-sm"
        type="reset"
      >
        Reset
      </button>
    </div>
  </Form>
</template>
