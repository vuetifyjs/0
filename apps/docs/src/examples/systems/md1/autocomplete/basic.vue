<script setup lang="ts">
  import { Md1Autocomplete } from '@paper/md1'
  import { shallowRef } from 'vue'

  const fruit = shallowRef<string>()
  const fruits = ['Apple', 'Apricot', 'Banana', 'Blackberry', 'Blueberry', 'Cherry', 'Grape', 'Lemon', 'Mango', 'Peach']
</script>

<template>
  <div class="md1-docs-fields">
    <Md1Autocomplete v-model="fruit" helper="Type to narrow the list" label="Fruit">
      <Md1Autocomplete.Item v-for="item in fruits" :key="item" :value="item" />
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
