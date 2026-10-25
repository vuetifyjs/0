<script setup lang="ts">
  import { Md1TimePicker } from '@paper/md1'
  import { shallowRef } from 'vue'

  const portrait = shallowRef<string | undefined>('09:10')
  const landscape = shallowRef<string | undefined>('09:10')
</script>

<template>
  <!-- data-grid opts any calendar table out of the docs prose table style; the picker paints itself. -->
  <div class="md1-docs-time-picker-dark" data-grid data-theme="md1-dark">
    <Md1TimePicker v-model="portrait" class="md1-elevation-24" />

    <div class="md1-docs-time-picker-dark-scroll">
      <Md1TimePicker v-model="landscape" class="md1-elevation-24" landscape />
    </div>
  </div>
</template>

<style>
  /* The dark theme's #303030 canvas; the frame is the query container for the landscape sheet. */
  .md1-docs-time-picker-dark {
    container-type: inline-size;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--md1-spacing-3, 24px);
    box-sizing: border-box;
    width: 100%;
    padding: var(--md1-spacing-3, 24px);
    background: var(--md1-background, #303030);
  }

  /* The 512 dp landscape sheet is wider than a phone in portrait, so a narrow frame scrolls rather than squeezing it. */
  .md1-docs-time-picker-dark-scroll {
    max-width: 100%;
  }

  @container (max-width: 559px) {
    .md1-docs-time-picker-dark-scroll {
      overflow-x: auto;
    }
  }
</style>
