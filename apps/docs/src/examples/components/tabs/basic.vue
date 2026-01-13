<script setup lang="ts">
  import { Tabs } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref('profile')

  const tabs = [
    { value: 'profile', label: 'Profile', content: 'Manage your profile information and preferences.' },
    { value: 'security', label: 'Security', content: 'Update your password and security settings.' },
    { value: 'billing', label: 'Billing', content: 'View and manage your billing information.' },
  ]
</script>

<template>
  <div class="w-full">
    <Tabs.Root v-model="selected">
      <Tabs.List class="flex border-b border-divider" label="Account settings">
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab.value"
          class="relative px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface data-[state=active]:text-primary focus:outline-none"
          :value="tab.value"
        >
          {{ tab.label }}
          <Tabs.Indicator class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
        </Tabs.Item>
      </Tabs.List>

      <div class="p-4">
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
    </Tabs.Root>

    <p class="mt-4 text-sm text-on-surface-variant">
      Active tab: {{ selected }}
    </p>
  </div>
</template>
