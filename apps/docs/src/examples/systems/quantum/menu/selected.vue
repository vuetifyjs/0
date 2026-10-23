<script setup lang="ts">
  import { QuButton, QuMenu } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const sizes = ['Small', 'Medium', 'Large', 'Extra large']

  const size = shallowRef<unknown>('Medium')
</script>

<template>
  <div class="quantum-docs-row">
    <QuMenu v-model:selected="size">
      <QuMenu.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs">Text size: {{ size }}</QuButton>
      </QuMenu.Activator>

      <QuMenu.Content>
        <QuMenu.Item v-for="item in sizes" :key="item" :value="item">{{ item }}</QuMenu.Item>
      </QuMenu.Content>
    </QuMenu>
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }
</style>
