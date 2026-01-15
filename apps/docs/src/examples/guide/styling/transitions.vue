<script setup lang="ts">
  import { Tabs } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const selected = shallowRef('fade')
</script>

<template>
  <Tabs.Root v-model="selected">
    <Tabs.List class="flex flex-wrap gap-3" label="Transition examples">
      <Tabs.Item
        class="px-4 py-2 border rounded text-sm cursor-pointer select-none
               bg-surface border-divider text-on-surface
               transition-colors duration-200 ease-out
               data-[selected]:bg-primary data-[selected]:border-primary data-[selected]:text-on-primary"
        value="fade"
      >
        Fade
      </Tabs.Item>

      <Tabs.Item
        class="px-4 py-2 border rounded text-sm cursor-pointer select-none
               bg-surface border-divider text-on-surface
               transition-all duration-200 ease-out
               data-[selected]:bg-primary data-[selected]:border-primary data-[selected]:text-on-primary
               data-[selected]:scale-105"
        value="scale"
      >
        Scale
      </Tabs.Item>

      <Tabs.Item
        class="px-4 py-2 border rounded text-sm cursor-pointer select-none
               bg-surface border-divider text-on-surface
               transition-all duration-200 ease-out
               data-[selected]:bg-primary data-[selected]:border-primary data-[selected]:text-on-primary
               data-[selected]:shadow-lg data-[selected]:shadow-primary/25"
        value="shadow"
      >
        Shadow
      </Tabs.Item>
    </Tabs.List>
  </Tabs.Root>

  <p class="mt-4 text-sm text-on-surface-variant">
    Selected: {{ selected }}
  </p>
</template>
