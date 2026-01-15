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
        class="px-3 py-1.5 border rounded text-sm cursor-pointer select-none
               bg-surface border-divider text-on-surface
               hover:border-primary/50
               data-[selected]:bg-primary data-[selected]:border-primary data-[selected]:text-on-primary
               data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
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
