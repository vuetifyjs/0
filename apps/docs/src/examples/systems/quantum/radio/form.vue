<script setup lang="ts">
  import { QuButton, QuRadio } from '@paper/quantum'
  import { shallowRef, useTemplateRef } from 'vue'

  const form = useTemplateRef<HTMLFormElement>('form')
  const plan = shallowRef<string>()
  const sent = shallowRef('')

  function onSubmit () {
    if (!form.value) return

    sent.value = String(new FormData(form.value).get('plan') ?? 'nothing')
  }
</script>

<template>
  <form ref="form" class="quantum-docs-controls" @submit.prevent="onSubmit">
    <QuRadio.Group v-model="plan" aria-label="Plan" mandatory="force" name="plan">
      <QuRadio label="Monthly" value="monthly" />

      <QuRadio label="Yearly" value="yearly" />
    </QuRadio.Group>

    <QuButton @click="onSubmit">Continue</QuButton>

    <span v-if="sent" class="quantum-docs-note" role="status">Submitted plan: {{ sent }}</span>
  </form>
</template>

<style>
  .quantum-docs-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
