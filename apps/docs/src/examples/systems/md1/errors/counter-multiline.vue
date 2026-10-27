<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  const LIMIT = 140

  const review = shallowRef('Quiet rooms facing the courtyard, and breakfast ran until eleven. The front desk held our bags after checkout so we could walk the old town one last time before the train.')

  // Derived from the length, so the message clears on the keystroke that brings the text under the limit.
  const message = toRef(() => review.value.length > LIMIT ? `Shorten the review to ${LIMIT} characters` : undefined)
</script>

<template>
  <div class="md1-docs-errors-review">
    <Md1TextField
      v-model="review"
      :counter="LIMIT"
      :error-messages="message"
      label="Review"
      multiline
    />
  </div>
</template>

<style>
  /* Wide enough for a few wrapped lines, narrow enough to read as a single field. */
  .md1-docs-errors-review {
    max-width: 360px;
  }
</style>
