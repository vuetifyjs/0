<script setup lang="ts">
  import { QuAutocomplete } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const fruit = shallowRef<string>()
  const fruits = ['Apple', 'Apricot', 'Banana', 'Blackberry', 'Blueberry', 'Cherry', 'Grape', 'Lemon', 'Mango', 'Peach']
</script>

<template>
  <div class="quantum-docs-fields">
    <QuAutocomplete v-model="fruit" helper="Type to narrow the list" label="Fruit">
      <QuAutocomplete.Item v-for="item in fruits" :key="item" :value="item" />
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
