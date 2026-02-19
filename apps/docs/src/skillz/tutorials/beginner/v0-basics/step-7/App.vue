<script setup>
  // Framework
  import { Tabs, Checkbox, Radio } from '@vuetify/v0'

  // Components
  import ConfirmDialog from './ConfirmDialog.vue'
  import SettingsSection from './SettingsSection.vue'

  // Utilities
  import { ref } from 'vue'

  const activeTab = ref('general')
  const notifications = ref(['email', 'updates'])
  const visibility = ref('friends')

  function handleReset () {
    notifications.value = []
    visibility.value = 'friends'
    activeTab.value = 'general'
  }
</script>

<template>
  <div class="p-8 font-sans min-h-screen bg-background text-on-background">
    <h1 class="text-2xl font-bold mb-6">
      Settings
    </h1>

    <div class="max-w-lg rounded-xl border border-solid border-divider bg-surface shadow-sm">
      <Tabs.Root v-model="activeTab">
        <Tabs.List class="flex border-b border-solid border-divider">
          <Tabs.Item v-slot="{ isSelected }" value="general">
            <button
              class="relative px-4 py-3.5 text-sm font-medium transition-colors"
              :class="isSelected
                ? 'text-on-surface'
                : 'text-on-surface-variant hover:text-on-surface'"
            >
              General
              <span
                v-if="isSelected"
                class="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
              />
            </button>
          </Tabs.Item>

          <Tabs.Item v-slot="{ isSelected }" value="notifications">
            <button
              class="relative px-4 py-3.5 text-sm font-medium transition-colors"
              :class="isSelected
                ? 'text-on-surface'
                : 'text-on-surface-variant hover:text-on-surface'"
            >
              Notifications
              <span
                v-if="isSelected"
                class="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
              />
            </button>
          </Tabs.Item>

          <Tabs.Item v-slot="{ isSelected }" value="privacy">
            <button
              class="relative px-4 py-3.5 text-sm font-medium transition-colors"
              :class="isSelected
                ? 'text-on-surface'
                : 'text-on-surface-variant hover:text-on-surface'"
            >
              Privacy
              <span
                v-if="isSelected"
                class="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
              />
            </button>
          </Tabs.Item>
        </Tabs.List>

        <Tabs.Panel class="p-4" value="general">
          <h2 class="text-lg font-semibold mb-3">General Settings</h2>

          <SettingsSection />
        </Tabs.Panel>

        <Tabs.Panel class="p-4" value="notifications">
          <h2 class="text-lg font-semibold mb-2">Notification Preferences</h2>

          <Checkbox.Group v-model="notifications" class="mt-4 space-y-2">
            <Checkbox.SelectAll v-slot="{ isSelected }">
              <label
                class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150"
                :class="isSelected ? 'bg-surface-tint' : 'hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded border border-solid flex items-center justify-center text-xs transition-all duration-150"
                  :class="isSelected
                    ? 'bg-primary border-primary text-on-primary scale-105'
                    : 'border-divider bg-surface'"
                >
                  <Checkbox.Indicator v-slot="{ isMixed }">
                    <svg
                      v-if="isMixed"
                      class="w-3 h-3"
                      fill="none"
                      height="12"
                      viewBox="0 0 12 12"
                      width="12"
                    >
                      <path d="M2.5 6h7" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
                    </svg>
                    <svg
                      v-else
                      class="w-3 h-3"
                      fill="none"
                      height="12"
                      viewBox="0 0 12 12"
                      width="12"
                    >
                      <path
                        d="M2 6l3 3 5-6"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                    </svg>
                  </Checkbox.Indicator>
                </span>

                <span class="text-sm font-medium">Select all</span>
              </label>
            </Checkbox.SelectAll>

            <Checkbox.Root v-slot="{ isSelected }" value="email">
              <label
                class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150"
                :class="isSelected ? 'bg-surface-tint' : 'hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded border border-solid flex items-center justify-center text-xs transition-all duration-150"
                  :class="isSelected
                    ? 'bg-primary border-primary text-on-primary scale-105'
                    : 'border-divider bg-surface'"
                >
                  <Checkbox.Indicator>
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      height="12"
                      viewBox="0 0 12 12"
                      width="12"
                    >
                      <path
                        d="M2 6l3 3 5-6"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                    </svg>
                  </Checkbox.Indicator>
                </span>

                <span class="text-sm">Email notifications</span>
              </label>
            </Checkbox.Root>

            <Checkbox.Root v-slot="{ isSelected }" value="push">
              <label
                class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150"
                :class="isSelected ? 'bg-surface-tint' : 'hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded border border-solid flex items-center justify-center text-xs transition-all duration-150"
                  :class="isSelected
                    ? 'bg-primary border-primary text-on-primary scale-105'
                    : 'border-divider bg-surface'"
                >
                  <Checkbox.Indicator>
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      height="12"
                      viewBox="0 0 12 12"
                      width="12"
                    >
                      <path
                        d="M2 6l3 3 5-6"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                    </svg>
                  </Checkbox.Indicator>
                </span>

                <span class="text-sm">Push notifications</span>
              </label>
            </Checkbox.Root>

            <Checkbox.Root v-slot="{ isSelected }" value="updates">
              <label
                class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150"
                :class="isSelected ? 'bg-surface-tint' : 'hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded border border-solid flex items-center justify-center text-xs transition-all duration-150"
                  :class="isSelected
                    ? 'bg-primary border-primary text-on-primary scale-105'
                    : 'border-divider bg-surface'"
                >
                  <Checkbox.Indicator>
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      height="12"
                      viewBox="0 0 12 12"
                      width="12"
                    >
                      <path
                        d="M2 6l3 3 5-6"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                    </svg>
                  </Checkbox.Indicator>
                </span>

                <span class="text-sm">Product updates</span>
              </label>
            </Checkbox.Root>

            <Checkbox.Root v-slot="{ isSelected }" value="marketing">
              <label
                class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150"
                :class="isSelected ? 'bg-surface-tint' : 'hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded border border-solid flex items-center justify-center text-xs transition-all duration-150"
                  :class="isSelected
                    ? 'bg-primary border-primary text-on-primary scale-105'
                    : 'border-divider bg-surface'"
                >
                  <Checkbox.Indicator>
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      height="12"
                      viewBox="0 0 12 12"
                      width="12"
                    >
                      <path
                        d="M2 6l3 3 5-6"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                    </svg>
                  </Checkbox.Indicator>
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

          <Radio.Group v-model="visibility" class="space-y-2" mandatory>
            <Radio.Root v-slot="{ isSelected }" value="public">
              <label
                class="flex items-center gap-3 p-4 rounded-xl border border-solid cursor-pointer transition-all duration-150"
                :class="isSelected
                  ? 'border-primary bg-surface-tint shadow-sm'
                  : 'border-divider hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded-full border-2 border-solid flex items-center justify-center transition-all duration-150"
                  :class="isSelected ? 'border-primary' : 'border-divider'"
                >
                  <Radio.Indicator>
                    <span class="w-2.5 h-2.5 rounded-full bg-primary block" />
                  </Radio.Indicator>
                </span>

                <div class="flex-1">
                  <p class="text-sm font-medium">Public</p>
                  <p class="text-xs text-on-surface-variant">Anyone can see your profile</p>
                </div>
              </label>
            </Radio.Root>

            <Radio.Root v-slot="{ isSelected }" value="friends">
              <label
                class="flex items-center gap-3 p-4 rounded-xl border border-solid cursor-pointer transition-all duration-150"
                :class="isSelected
                  ? 'border-primary bg-surface-tint shadow-sm'
                  : 'border-divider hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded-full border-2 border-solid flex items-center justify-center transition-all duration-150"
                  :class="isSelected ? 'border-primary' : 'border-divider'"
                >
                  <Radio.Indicator>
                    <span class="w-2.5 h-2.5 rounded-full bg-primary block" />
                  </Radio.Indicator>
                </span>

                <div class="flex-1">
                  <p class="text-sm font-medium">Friends only</p>
                  <p class="text-xs text-on-surface-variant">Only approved friends can see your profile</p>
                </div>
              </label>
            </Radio.Root>

            <Radio.Root v-slot="{ isSelected }" value="private">
              <label
                class="flex items-center gap-3 p-4 rounded-xl border border-solid cursor-pointer transition-all duration-150"
                :class="isSelected
                  ? 'border-primary bg-surface-tint shadow-sm'
                  : 'border-divider hover:bg-surface-tint'"
              >
                <span
                  class="w-5 h-5 rounded-full border-2 border-solid flex items-center justify-center transition-all duration-150"
                  :class="isSelected ? 'border-primary' : 'border-divider'"
                >
                  <Radio.Indicator>
                    <span class="w-2.5 h-2.5 rounded-full bg-primary block" />
                  </Radio.Indicator>
                </span>

                <div class="flex-1">
                  <p class="text-sm font-medium">Private</p>
                  <p class="text-xs text-on-surface-variant">Nobody can see your profile</p>
                </div>
              </label>
            </Radio.Root>
          </Radio.Group>
        </Tabs.Panel>
      </Tabs.Root>

      <div class="p-4 border-t border-solid border-divider">
        <ConfirmDialog
          confirm-label="Reset"
          message="This will reset all settings to their default values. This action cannot be undone."
          title="Reset Settings"
          @confirm="handleReset"
        >
          <template #activator>
            <button class="px-4 py-2 text-sm font-medium rounded-lg border border-solid border-error text-error hover:bg-error hover:text-on-error transition-colors">
              Reset settings
            </button>
          </template>
        </ConfirmDialog>
      </div>
    </div>
  </div>
</template>
