<script setup lang="ts">
  import { Md1Button, Md1Menu } from '@paper/md1'

  import { shallowRef } from 'vue'

  const sizes = ['Small', 'Medium', 'Large', 'Extra large']

  const size = shallowRef<unknown>('Medium')
</script>

<template>
  <div class="md1-docs-row">
    <Md1Menu v-model:selected="size">
      <Md1Menu.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs">Text size: {{ size }}</Md1Button>
      </Md1Menu.Activator>

      <Md1Menu.Content>
        <Md1Menu.Item v-for="item in sizes" :key="item" :value="item">{{ item }}</Md1Menu.Item>
      </Md1Menu.Content>
    </Md1Menu>
  </div>
</template>

<style>
  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }
</style>
