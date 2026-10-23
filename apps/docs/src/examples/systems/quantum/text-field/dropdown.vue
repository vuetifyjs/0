<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const size = shallowRef('')
  const sizes = ['Small', 'Medium', 'Large', 'Extra large']
</script>

<template>
  <div class="quantum-docs-fields">
    <QuTextField
      v-model="size"
      dropdown
      helper="Sizes run small"
      label="Size"
      required
    >
      <QuTextField.Item v-for="item in sizes" :key="item" :value="item" />

      <QuTextField.Item disabled value="Sold out" />
    </QuTextField>
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
