<script setup lang="ts">
  import { Md1Autocomplete } from '@paper/md1'
  import { ref } from 'vue'

  const to = ref<string[]>(['Ada Lovelace'])
  const contacts = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Katherine Johnson', 'Margaret Hamilton']
</script>

<template>
  <div class="md1-docs-fields">
    <Md1Autocomplete v-model="to" label="To" multiple>
      <Md1Autocomplete.Item v-for="item in contacts" :key="item" :value="item" />
    </Md1Autocomplete>
  </div>
</template>

<style>
  .md1-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 360px;
  }
</style>
