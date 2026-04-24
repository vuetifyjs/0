<script setup lang="ts">
  import { Treeview } from '@vuetify/v0'
  import { reactive, shallowRef } from 'vue'
  import SettingNode from './SettingNode.vue'

  interface Setting {
    label: string
    description?: string
    type?: 'toggle' | 'select'
    options?: string[]
    value?: boolean | string
    disabled?: boolean
    children?: Setting[]
  }

  const settings = reactive<Setting[]>([
    {
      label: 'Appearance',
      children: [
        { label: 'Theme', description: 'Choose between light and dark color schemes.', type: 'select', options: ['Light', 'Dark', 'System'], value: 'Dark' },
        { label: 'Font size', description: 'Base font size for the editor and UI.', type: 'select', options: ['12px', '14px', '16px', '18px'], value: '14px' },
        { label: 'Compact mode', description: 'Reduce spacing and padding throughout the interface.', type: 'toggle', value: false },
      ],
    },
    {
      label: 'Editor',
      children: [
        { label: 'Auto-save', description: 'Automatically save files after a short delay.', type: 'toggle', value: true },
        { label: 'Tab size', description: 'Number of spaces per indentation level.', type: 'select', options: ['2', '4', '8'], value: '2' },
        { label: 'Word wrap', description: 'Wrap long lines instead of horizontal scrolling.', type: 'toggle', value: false },
      ],
    },
    {
      label: 'Keyboard',
      children: [
        { label: 'Vim mode', description: 'Enable Vim keybindings for modal editing.', type: 'toggle', value: false },
      ],
    },
    {
      label: 'Experimental',
      disabled: true,
      children: [
        { label: 'AI completions', description: 'Inline AI-powered code suggestions.', type: 'toggle', value: false },
      ],
    },
  ])

  const active = shallowRef<Setting | null>(null)

  function onUpdate (setting: Setting, value: boolean | string) {
    setting.value = value
  }
</script>

<template>
  <div class="settings-panel flex gap-4">
    <Treeview.Root>
      <Treeview.List class="settings-tree flex-1 text-sm text-on-surface select-none min-w-0">
        <SettingNode
          v-for="group in settings"
          :key="group.label"
          :node="group"
          @activate="active = $event"
          @update="onUpdate"
        />
      </Treeview.List>
    </Treeview.Root>

    <div class="w-48 shrink-0 border-l border-divider pl-4 text-sm">
      <template v-if="active">
        <p class="font-medium text-on-surface">{{ active.label }}</p>
        <p class="mt-1 text-on-surface-variant text-xs leading-relaxed">{{ active.description }}</p>
      </template>

      <p v-else class="text-on-surface-variant text-xs italic">Click a setting to see its description.</p>
    </div>
  </div>
</template>

<style>
.settings-tree .row {
  padding-left: calc(var(--v0-treeview-depth, 0) * 1.25rem + 0.5rem);
}

.settings-tree [data-active] > .row,
.settings-tree [data-active] > .row:hover {
  background: color-mix(in srgb, var(--v0-primary) 10%, transparent);
  color: var(--v0-primary);
}

.settings-tree [data-disabled] > .row {
  opacity: 0.4;
  pointer-events: none;
}
</style>
