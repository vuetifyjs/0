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
        <Tabs.List label="Settings" class="flex flex-col border-r border-divider pr-4">
          <Tabs.Tab
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            class="relative px-4 py-2 text-sm text-left font-medium text-on-surface-variant hover:text-on-surface data-[state=active]:text-primary focus:outline-none"
          >
            {{ tab.label }}
            <Tabs.Indicator class="absolute top-0 bottom-0 left-0 w-0.5 bg-primary" />
          </Tabs.Tab>
        </Tabs.List>

        <div class="flex-1 p-4">
          <Tabs.Panel
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            class="focus:outline-none"
          >
            <h3 class="text-lg font-medium mb-2">{{ tab.label }}</h3>
            <p class="text-on-surface-variant">{{ tab.content }}</p>
          </Tabs.Panel>
        </div>
      </div>
    </Tabs.Root>
  </div>
</template>
