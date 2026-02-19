<script setup>
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Utilities
  import { ref } from 'vue'

  const expanded = ref('appearance')
</script>

<template>
  <ExpansionPanel.Root v-model="expanded">
    <ExpansionPanel.Item value="appearance">
      <ExpansionPanel.Header>
        <ExpansionPanel.Activator v-slot="{ isSelected }">
          <button
            class="w-full flex items-center justify-between p-3 text-sm font-medium text-left transition-colors hover:bg-surface-tint rounded-lg"
          >
            <span>Appearance</span>
            <span
              class="transition-transform duration-200"
              :class="isSelected ? 'rotate-180' : ''"
            >▾</span>
          </button>
        </ExpansionPanel.Activator>
      </ExpansionPanel.Header>

      <ExpansionPanel.Content>
        <div class="px-3 pb-3 space-y-3">
          <div>
            <label class="block text-xs text-on-surface-variant mb-1">Theme</label>

            <select class="w-full px-3 py-2 rounded border border-solid border-divider bg-background text-on-surface text-sm">
              <option>System</option>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>

          <div>
            <label class="block text-xs text-on-surface-variant mb-1">Font size</label>

            <select class="w-full px-3 py-2 rounded border border-solid border-divider bg-background text-on-surface text-sm">
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
            class="w-full flex items-center justify-between p-3 text-sm font-medium text-left transition-colors hover:bg-surface-tint rounded-lg"
          >
            <span>Language</span>
            <span
              class="transition-transform duration-200"
              :class="isSelected ? 'rotate-180' : ''"
            >▾</span>
          </button>
        </ExpansionPanel.Activator>
      </ExpansionPanel.Header>

      <ExpansionPanel.Content>
        <div class="px-3 pb-3">
          <label class="block text-xs text-on-surface-variant mb-1">Display language</label>

          <select class="w-full px-3 py-2 rounded border border-solid border-divider bg-background text-on-surface text-sm">
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
            class="w-full flex items-center justify-between p-3 text-sm font-medium text-left transition-colors hover:bg-surface-tint rounded-lg"
          >
            <span>Data & Storage</span>
            <span
              class="transition-transform duration-200"
              :class="isSelected ? 'rotate-180' : ''"
            >▾</span>
          </button>
        </ExpansionPanel.Activator>
      </ExpansionPanel.Header>

      <ExpansionPanel.Content>
        <div class="px-3 pb-3 space-y-2">
          <p class="text-xs text-on-surface-variant">Cache size: 24 MB</p>

          <button class="px-3 py-1.5 text-xs rounded bg-error text-on-error">
            Clear cache
          </button>
        </div>
      </ExpansionPanel.Content>
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>
</template>
