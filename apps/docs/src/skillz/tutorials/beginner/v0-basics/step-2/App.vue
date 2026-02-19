<script setup>
  // Framework
  import { Tabs } from '@vuetify/v0'

  // Utilities
  import { ref } from 'vue'

  const activeTab = ref('general')
</script>

<template>
  <div class="p-8 font-sans min-h-screen bg-background text-on-background">
    <h1 class="text-2xl font-bold mb-6">
      Settings
    </h1>

    <div class="max-w-lg rounded-lg border border-solid border-divider bg-surface">
      <Tabs.Root v-model="activeTab">
        <Tabs.List class="flex border-b border-solid border-divider">
          <Tabs.Item v-slot="{ isSelected }" value="general">
            <button
              class="px-4 py-3 text-sm font-medium border-b-2 border-solid transition-colors"
              :class="isSelected
                ? 'border-primary text-on-surface'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'"
            >
              General
            </button>
          </Tabs.Item>

          <Tabs.Item v-slot="{ isSelected }" value="notifications">
            <button
              class="px-4 py-3 text-sm font-medium border-b-2 border-solid transition-colors"
              :class="isSelected
                ? 'border-primary text-on-surface'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'"
            >
              Notifications
            </button>
          </Tabs.Item>

          <Tabs.Item v-slot="{ isSelected }" value="privacy">
            <button
              class="px-4 py-3 text-sm font-medium border-b-2 border-solid transition-colors"
              :class="isSelected
                ? 'border-primary text-on-surface'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'"
            >
              Privacy
            </button>
          </Tabs.Item>
        </Tabs.List>

        <Tabs.Panel class="p-4" value="general">
          <h2 class="text-lg font-semibold mb-2">General Settings</h2>

          <p class="text-sm text-on-surface-variant">
            Configure your display name, language, and appearance preferences.
          </p>
        </Tabs.Panel>

        <Tabs.Panel class="p-4" value="notifications">
          <h2 class="text-lg font-semibold mb-2">Notification Preferences</h2>

          <p class="text-sm text-on-surface-variant">
            Choose which notifications you want to receive.
          </p>
        </Tabs.Panel>

        <Tabs.Panel class="p-4" value="privacy">
          <h2 class="text-lg font-semibold mb-2">Privacy Settings</h2>

          <p class="text-sm text-on-surface-variant">
            Control who can see your profile and activity.
          </p>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  </div>
</template>
