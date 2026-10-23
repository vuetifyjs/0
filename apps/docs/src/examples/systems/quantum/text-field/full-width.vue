<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const to = shallowRef('')
  const subject = shallowRef('')
  const body = shallowRef('')
</script>

<template>
  <div class="quantum-docs-compose">
    <QuTextField v-model="to" full-width label="To" />

    <QuTextField v-model="subject" full-width label="Subject" />

    <QuTextField v-model="body" full-width label="Message" multiline />
  </div>
</template>

<style>
  .quantum-docs-compose {
    display: flex;
    flex-direction: column;
    max-width: 480px;
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }
</style>
