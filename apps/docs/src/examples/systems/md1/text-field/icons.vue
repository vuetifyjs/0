<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const name = shallowRef('Ada Lovelace')
  const phone = shallowRef('')
  const listening = shallowRef(false)

  function onVoice () {
    listening.value = true
  }
</script>

<template>
  <div class="md1-docs-fields">
    <Md1TextField v-model="name" clearable icon="person" label="Name" />

    <Md1TextField
      v-model="phone"
      icon="phone"
      inputmode="tel"
      label="Phone"
      voice
      @voice="onVoice"
    />

    <span class="md1-docs-note md1-docs-readout" role="status">{{ listening ? 'The microphone was pressed; speech capture is the app\'s.' : 'Microphone not pressed' }}</span>
  </div>
</template>

<style>
  .md1-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 360px;
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
