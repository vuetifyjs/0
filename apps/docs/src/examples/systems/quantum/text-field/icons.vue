<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const name = shallowRef('Ada Lovelace')
  const phone = shallowRef('')
  const listening = shallowRef(false)

  function onVoice () {
    listening.value = true
  }
</script>

<template>
  <div class="quantum-docs-fields">
    <QuTextField v-model="name" clearable icon="person" label="Name" />

    <QuTextField
      v-model="phone"
      icon="phone"
      inputmode="tel"
      label="Phone"
      voice
      @voice="onVoice"
    />

    <span v-if="listening" class="quantum-docs-note" role="status">The microphone was pressed; speech capture is the app's.</span>
  </div>
</template>

<style>
  .quantum-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    max-width: 360px;
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
