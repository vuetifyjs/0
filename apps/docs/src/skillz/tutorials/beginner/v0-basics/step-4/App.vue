<script setup>
  // Framework
  import { Tabs, Checkbox, Radio } from '@vuetify/v0'

  // Utilities
  import { ref } from 'vue'

  const activeTab = ref('privacy')
  const notifications = ref(['email', 'updates'])
  const visibility = ref('friends')
</script>

<template>
  <div class="p-8">
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

          <p class="text-sm text-on-surface-variant mb-4">
            Who can see your profile?
          </p>

          <Radio.Group v-model="visibility" class="space-y-3" mandatory>
            <Radio.Root v-slot="{ isSelected }" value="public">
              <label
                class="flex items-center gap-3 p-4 rounded-lg border border-solid cursor-pointer transition-colors"
                :class="isSelected
                  ? 'border-primary bg-surface-tint'
                  : 'border-divider hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded-full border-2 border-solid flex items-center justify-center transition-colors"
                  :class="isSelected ? 'border-primary' : 'border-divider'"
                >
                  <Radio.Indicator>
                    <span class="w-2.5 h-2.5 rounded-full bg-primary block" />
                  </Radio.Indicator>
                </span>

                <div>
                  <p class="text-sm font-medium">Public</p>
                  <p class="text-xs text-on-surface-variant">Anyone can see your profile</p>
                </div>
              </label>
            </Radio.Root>

            <Radio.Root v-slot="{ isSelected }" value="friends">
              <label
                class="flex items-center gap-3 p-4 rounded-lg border border-solid cursor-pointer transition-colors"
                :class="isSelected
                  ? 'border-primary bg-surface-tint'
                  : 'border-divider hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded-full border-2 border-solid flex items-center justify-center transition-colors"
                  :class="isSelected ? 'border-primary' : 'border-divider'"
                >
                  <Radio.Indicator>
                    <span class="w-2.5 h-2.5 rounded-full bg-primary block" />
                  </Radio.Indicator>
                </span>

                <div>
                  <p class="text-sm font-medium">Friends only</p>
                  <p class="text-xs text-on-surface-variant">Only approved friends can see your profile</p>
                </div>
              </label>
            </Radio.Root>

            <Radio.Root v-slot="{ isSelected }" value="private">
              <label
                class="flex items-center gap-3 p-4 rounded-lg border border-solid cursor-pointer transition-colors"
                :class="isSelected
                  ? 'border-primary bg-surface-tint'
                  : 'border-divider hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded-full border-2 border-solid flex items-center justify-center transition-colors"
                  :class="isSelected ? 'border-primary' : 'border-divider'"
                >
                  <Radio.Indicator>
                    <span class="w-2.5 h-2.5 rounded-full bg-primary block" />
                  </Radio.Indicator>
                </span>

                <div>
                  <p class="text-sm font-medium">Private</p>
                  <p class="text-xs text-on-surface-variant">Nobody can see your profile</p>
                </div>
              </label>
            </Radio.Root>
          </Radio.Group>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  </div>
</template>
