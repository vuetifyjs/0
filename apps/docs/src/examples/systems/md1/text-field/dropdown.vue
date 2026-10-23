<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const size = shallowRef('')
  const sizes = ['Small', 'Medium', 'Large', 'Extra large']
</script>

<template>
  <div class="md1-docs-fields">
    <Md1TextField
      v-model="size"
      dropdown
      helper="Sizes run small"
      label="Size"
      required
    >
      <Md1TextField.Item v-for="item in sizes" :key="item" :value="item" />

      <Md1TextField.Item disabled value="Sold out" />
    </Md1TextField>
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
