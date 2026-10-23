<script setup lang="ts">
  import { Md1Button, Md1Radio } from '@paper/md1'
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
  <form ref="form" class="md1-docs-controls" @submit.prevent="onSubmit">
    <Md1Radio.Group v-model="plan" aria-label="Plan" mandatory="force" name="plan">
      <Md1Radio label="Monthly" value="monthly" />

      <Md1Radio label="Yearly" value="yearly" />
    </Md1Radio.Group>

    <Md1Button @click="onSubmit">Continue</Md1Button>

    <span v-if="sent" class="md1-docs-note" role="status">Submitted plan: {{ sent }}</span>
  </form>
</template>

<style>
  .md1-docs-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
