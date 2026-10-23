<script setup lang="ts">
  import { Md1Autocomplete } from '@paper/md1'
  import { shallowRef } from 'vue'

  const language = shallowRef<string>()
  const languages = ['Dutch', 'English', 'French', 'German', 'Italian', 'Portuguese', 'Spanish']
</script>

<template>
  <div class="md1-docs-fields">
    <Md1Autocomplete v-model="language" dense label="Language">
      <Md1Autocomplete.Item v-for="item in languages" :key="item" :value="item" />
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
