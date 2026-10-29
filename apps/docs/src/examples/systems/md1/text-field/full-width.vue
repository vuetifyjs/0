<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const to = shallowRef('')
  const subject = shallowRef('')
  const body = shallowRef('')

  const recipient = shallowRef('')
  const topic = shallowRef('')
  const note = shallowRef('')
</script>

<template>
  <div class="md1-docs-composes">
    <div class="md1-docs-compose">
      <Md1TextField v-model="to" full-width label="To" />

      <Md1TextField v-model="subject" full-width label="Subject" />

      <Md1TextField v-model="body" full-width label="Message" multiline />
    </div>

    <div class="md1-docs-compose">
      <Md1TextField v-model="recipient" dense full-width label="To" />

      <Md1TextField v-model="topic" dense full-width label="Subject" />

      <Md1TextField
        v-model="note"
        dense
        full-width
        label="Message"
        multiline
      />
    </div>
  </div>
</template>

<style>
  .md1-docs-composes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: var(--md1-spacing-3, 24px);
    align-items: start;
    width: 100%;
  }

  .md1-docs-compose {
    display: flex;
    flex-direction: column;
    max-width: 480px;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }
</style>
