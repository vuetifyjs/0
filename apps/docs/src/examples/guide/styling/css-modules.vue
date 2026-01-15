<script setup lang="ts">
  import { Tabs } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const selected = shallowRef('apple')
  const items = ['Apple', 'Banana', 'Cherry']
</script>

<template>
  <Tabs.Root v-model="selected">
    <Tabs.List class="flex flex-wrap gap-2" label="Fruit selection">
      <Tabs.Item
        v-for="item in items"
        :key="item"
        :class="$style.btn"
        :value="item"
      >
        {{ item }}
      </Tabs.Item>
    </Tabs.List>
  </Tabs.Root>

  <p class="mt-4 text-sm text-on-surface-variant">
    Selected: {{ selected }}
  </p>
</template>

<style module>
  .btn {
    background: var(--v0-surface);
    color: var(--v0-on-surface);
    padding: 0.375rem 0.75rem;
    border-radius: 0.25rem;
    border: 1px solid var(--v0-divider);
  }

  .btn[data-selected] {
    background: var(--v0-primary);
    color: var(--v0-on-primary);
    border-color: var(--v0-primary);
  }
</style>
