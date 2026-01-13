<script setup lang="ts">
  import { Tabs } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref('general')

  const tabs = [
    { value: 'general', label: 'General', content: 'Configure general application settings.' },
    { value: 'appearance', label: 'Appearance', content: 'Customize the look and feel of the app.' },
    { value: 'notifications', label: 'Notifications', content: 'Manage your notification preferences.' },
    { value: 'privacy', label: 'Privacy', content: 'Control your privacy and data settings.' },
  ]
</script>

<template>
  <div class="w-full">
    <Tabs.Root v-model="selected" orientation="vertical">
      <div class="flex gap-4">
        <Tabs.List class="flex flex-col border-r border-divider pr-4" label="Settings">
          <Tabs.Item
            v-for="tab in tabs"
            :key="tab.value"
            class="relative px-4 py-2 text-sm text-left font-medium text-on-surface-variant hover:text-on-surface data-[state=active]:text-primary focus:outline-none"
            :value="tab.value"
          >
            {{ tab.label }}
            <Tabs.Indicator class="absolute top-0 bottom-0 left-0 w-0.5 bg-primary" />
          </Tabs.Item>
        </Tabs.List>

        <div class="flex-1 p-4">
          <Tabs.Panel
            v-for="tab in tabs"
            :key="tab.value"
            class="focus:outline-none"
            :value="tab.value"
          >
            <h3 class="text-lg font-medium mb-2">{{ tab.label }}</h3>
            <p class="text-on-surface-variant">{{ tab.content }}</p>
          </Tabs.Panel>
        </div>
      </div>
    </Tabs.Root>
  </div>
</template>
