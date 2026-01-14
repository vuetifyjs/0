<script setup lang="ts">
  import { Tabs } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref('profile')

  const tabs = [
    { value: 'profile', label: 'Profile' },
    { value: 'password', label: 'Password' },
    { value: 'billing', label: 'Billing' },
  ]
</script>

<template>
  <div class="w-full">
    <Tabs.Root v-model="selected">
      <Tabs.List
        class="flex gap-1 border-b border-divider"
        label="Account settings"
      >
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab.value"
          class="px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2 border-transparent text-on-surface-variant hover:text-on-surface hover:border-divider data-[selected]:border-primary data-[selected]:text-primary data-[selected]:hover:text-primary data-[selected]:hover:border-primary"
          :value="tab.value"
        >
          {{ tab.label }}
        </Tabs.Item>
      </Tabs.List>

      <Tabs.Panel
        v-for="tab in tabs"
        :key="tab.value"
        class="p-4"
        :value="tab.value"
      >
        <h3 class="text-lg font-medium mb-2">{{ tab.label }}</h3>
        <p class="text-on-surface-variant">
          Content for the {{ tab.label.toLowerCase() }} tab.
        </p>
      </Tabs.Panel>
    </Tabs.Root>
  </div>
</template>
