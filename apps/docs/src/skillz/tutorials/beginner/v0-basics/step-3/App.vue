<script setup>
  // Framework
  import { Tabs, Checkbox } from '@vuetify/v0'

  // Utilities
  import { ref } from 'vue'

  const activeTab = ref('notifications')
  const notifications = ref(['email', 'updates'])
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

          <Checkbox.Group v-model="notifications" class="mt-4 space-y-3">
            <Checkbox.SelectAll v-slot="{ isSelected }">
              <label
                class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                :class="isSelected ? 'bg-surface-tint' : 'hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded border border-solid flex items-center justify-center text-xs transition-colors"
                  :class="isSelected
                    ? 'bg-primary border-primary text-on-primary'
                    : 'border-divider bg-surface'"
                >
                  <Checkbox.Indicator v-slot="{ isMixed }">
                    <span v-if="isMixed">−</span>
                    <span v-else>✓</span>
                  </Checkbox.Indicator>
                </span>

                <span class="text-sm font-medium">Select all</span>
              </label>
            </Checkbox.SelectAll>

            <Checkbox.Root v-slot="{ isSelected }" value="email">
              <label
                class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                :class="isSelected ? 'bg-surface-tint' : 'hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded border border-solid flex items-center justify-center text-xs transition-colors"
                  :class="isSelected
                    ? 'bg-primary border-primary text-on-primary'
                    : 'border-divider bg-surface'"
                >
                  <Checkbox.Indicator>✓</Checkbox.Indicator>
                </span>

                <span class="text-sm">Email notifications</span>
              </label>
            </Checkbox.Root>

            <Checkbox.Root v-slot="{ isSelected }" value="push">
              <label
                class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                :class="isSelected ? 'bg-surface-tint' : 'hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded border border-solid flex items-center justify-center text-xs transition-colors"
                  :class="isSelected
                    ? 'bg-primary border-primary text-on-primary'
                    : 'border-divider bg-surface'"
                >
                  <Checkbox.Indicator>✓</Checkbox.Indicator>
                </span>

                <span class="text-sm">Push notifications</span>
              </label>
            </Checkbox.Root>

            <Checkbox.Root v-slot="{ isSelected }" value="updates">
              <label
                class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                :class="isSelected ? 'bg-surface-tint' : 'hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded border border-solid flex items-center justify-center text-xs transition-colors"
                  :class="isSelected
                    ? 'bg-primary border-primary text-on-primary'
                    : 'border-divider bg-surface'"
                >
                  <Checkbox.Indicator>✓</Checkbox.Indicator>
                </span>

                <span class="text-sm">Product updates</span>
              </label>
            </Checkbox.Root>

            <Checkbox.Root v-slot="{ isSelected }" value="marketing">
              <label
                class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                :class="isSelected ? 'bg-surface-tint' : 'hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded border border-solid flex items-center justify-center text-xs transition-colors"
                  :class="isSelected
                    ? 'bg-primary border-primary text-on-primary'
                    : 'border-divider bg-surface'"
                >
                  <Checkbox.Indicator>✓</Checkbox.Indicator>
                </span>

                <span class="text-sm">Marketing emails</span>
              </label>
            </Checkbox.Root>
          </Checkbox.Group>
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
