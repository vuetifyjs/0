<script setup lang="ts">
  import { QuAutocomplete } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const language = shallowRef<string>()
  const languages = ['Dutch', 'English', 'French', 'German', 'Italian', 'Portuguese', 'Spanish']
</script>

<template>
  <div class="quantum-docs-fields">
    <QuAutocomplete v-model="language" box label="Language">
      <QuAutocomplete.Item v-for="item in languages" :key="item" :value="item" />
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
