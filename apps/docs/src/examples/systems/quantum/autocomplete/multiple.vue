<script setup lang="ts">
  import { QuAutocomplete } from '@paper/quantum'
  import { ref } from 'vue'

  const to = ref<string[]>(['Ada Lovelace'])
  const contacts = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Katherine Johnson', 'Margaret Hamilton']
</script>

<template>
  <div class="quantum-docs-fields">
    <QuAutocomplete v-model="to" label="To" multiple>
      <QuAutocomplete.Item v-for="item in contacts" :key="item" :value="item" />
    </QuAutocomplete>
  </div>
</template>

<style>
  .quantum-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    max-width: 360px;
  }
</style>
