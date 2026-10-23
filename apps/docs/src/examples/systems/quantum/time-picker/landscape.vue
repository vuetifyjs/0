<script setup lang="ts">
  import { QuTimePicker } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const time = shallowRef('09:10')
</script>

<template>
  <div class="quantum-docs-landscape">
    <div class="quantum-docs-scroll">
      <QuTimePicker v-model="time" class="quantum-elevation-24" landscape />
    </div>
  </div>
</template>

<style>
  /* The frame is the query container: the sheet only scrolls once the frame is narrower than it. */
  .quantum-docs-landscape {
    container-type: inline-size;
    padding: var(--quantum-spacing-3, 24px) 0 var(--quantum-spacing-5, 40px);
  }

  /*
   * The 512 dp landscape sheet is wider than a phone in portrait, so a narrow
   * frame scrolls rather than squeezing it. A scroller clips, and it would cut
   * the 24 dp shadow off at its box, so it only scrolls when it has to.
   */
  @container (max-width: 511px) {
    .quantum-docs-scroll {
      overflow-x: auto;
    }
  }
</style>
