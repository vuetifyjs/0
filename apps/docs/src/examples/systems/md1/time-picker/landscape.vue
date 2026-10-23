<script setup lang="ts">
  import { Md1TimePicker } from '@paper/md1'
  import { shallowRef } from 'vue'

  const time = shallowRef('09:10')
</script>

<template>
  <div class="md1-docs-landscape">
    <div class="md1-docs-scroll">
      <Md1TimePicker v-model="time" class="md1-elevation-24" landscape />
    </div>
  </div>
</template>

<style>
  /* The frame is the query container: the sheet only scrolls once the frame is narrower than it. */
  .md1-docs-landscape {
    container-type: inline-size;
    padding: var(--md1-spacing-3, 24px) 0;
  }

  /*
   * The 512 dp landscape sheet is wider than a phone in portrait, so a narrow
   * frame scrolls rather than squeezing it. A scroller clips, and it would cut
   * the 24 dp shadow off at its box, so it only scrolls when it has to.
   */
  @container (max-width: 511px) {
    .md1-docs-scroll {
      overflow-x: auto;
    }
  }
</style>
