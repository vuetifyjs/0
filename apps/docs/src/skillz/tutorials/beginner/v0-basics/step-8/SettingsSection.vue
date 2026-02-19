<script setup>
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Utilities
  import { ref } from 'vue'

  const expanded = ref('appearance')
</script>

<template>
  <ExpansionPanel.Root v-model="expanded" class="divide-y divide-divider">
    <ExpansionPanel.Item value="appearance">
      <ExpansionPanel.Header>
        <ExpansionPanel.Activator v-slot="{ isSelected }">
          <button
            class="w-full flex items-center justify-between p-4 text-sm font-medium text-left transition-colors"
            :class="isSelected ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'"
          >
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs">
                Th
              </span>
              <span>Appearance</span>
            </div>

            <span
              class="transition-transform duration-300 ease-out text-on-surface-variant"
              :class="isSelected ? 'rotate-180' : ''"
            >▾</span>
          </button>
        </ExpansionPanel.Activator>
      </ExpansionPanel.Header>

      <ExpansionPanel.Content>
        <div class="px-4 pb-4 space-y-3">
          <div>
            <label class="block text-xs font-medium text-on-surface-variant mb-1.5">Theme</label>

            <select class="w-full px-3 py-2 rounded-lg border border-solid border-divider bg-background text-on-surface text-sm focus:border-primary focus:outline-none transition-colors">
              <option>System</option>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-on-surface-variant mb-1.5">Font size</label>

            <select class="w-full px-3 py-2 rounded-lg border border-solid border-divider bg-background text-on-surface text-sm focus:border-primary focus:outline-none transition-colors">
              <option>Small</option>
              <option selected>Medium</option>
              <option>Large</option>
            </select>
          </div>
        </div>
      </ExpansionPanel.Content>
    </ExpansionPanel.Item>

    <ExpansionPanel.Item value="language">
      <ExpansionPanel.Header>
        <ExpansionPanel.Activator v-slot="{ isSelected }">
          <button
            class="w-full flex items-center justify-between p-4 text-sm font-medium text-left transition-colors"
            :class="isSelected ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'"
          >
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs">
                La
              </span>
              <span>Language</span>
            </div>

            <span
              class="transition-transform duration-300 ease-out text-on-surface-variant"
              :class="isSelected ? 'rotate-180' : ''"
            >▾</span>
          </button>
        </ExpansionPanel.Activator>
      </ExpansionPanel.Header>

      <ExpansionPanel.Content>
        <div class="px-4 pb-4">
          <label class="block text-xs font-medium text-on-surface-variant mb-1.5">Display language</label>

          <select class="w-full px-3 py-2 rounded-lg border border-solid border-divider bg-background text-on-surface text-sm focus:border-primary focus:outline-none transition-colors">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>Japanese</option>
          </select>
        </div>
      </ExpansionPanel.Content>
    </ExpansionPanel.Item>

    <ExpansionPanel.Item value="data">
      <ExpansionPanel.Header>
        <ExpansionPanel.Activator v-slot="{ isSelected }">
          <button
            class="w-full flex items-center justify-between p-4 text-sm font-medium text-left transition-colors"
            :class="isSelected ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'"
          >
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center text-xs">
                Da
              </span>
              <span>Data & Storage</span>
            </div>

            <span
              class="transition-transform duration-300 ease-out text-on-surface-variant"
              :class="isSelected ? 'rotate-180' : ''"
            >▾</span>
          </button>
        </ExpansionPanel.Activator>
      </ExpansionPanel.Header>

      <ExpansionPanel.Content>
        <div class="px-4 pb-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-on-surface-variant">Cache size</span>
            <span class="text-sm font-medium">24 MB</span>
          </div>

          <button class="px-3 py-1.5 text-xs font-medium rounded-lg bg-error text-on-error hover:opacity-90 transition-opacity">
            Clear cache
          </button>
        </div>
      </ExpansionPanel.Content>
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>
</template>
