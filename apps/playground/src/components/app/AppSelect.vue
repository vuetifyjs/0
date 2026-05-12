<script setup lang="ts">
  // Framework
  import { isArray, Select } from '@vuetify/v0'

  // Context
  import AppIcon from './AppIcon.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface AppSelectItem {
    id: ID
    label: string
  }

  const {
    items,
    mandatory,
    placeholder = 'Select...',
  } = defineProps<{
    items: AppSelectItem[]
    mandatory?: boolean
    placeholder?: string
  }>()

  const model = defineModel<ID | ID[]>()

  const selectedLabel = toRef(() => {
    const id = isArray(model.value) ? model.value[0] : model.value
    return items.find(item => item.id === id)?.label ?? placeholder
  })
</script>

<template>
  <Select.Root v-model="model" :mandatory>
    <Select.Activator class="trigger">
      <span>{{ selectedLabel }}</span>

      <Select.Cue class="cue">
        <AppIcon icon="chevron-down" :size="14" />
      </Select.Cue>
    </Select.Activator>

    <Select.Content class="content">
      <Select.Item
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        v-slot="{ isSelected }"
        class="item"
        :value="item.label"
      >
        <span>{{ item.label }}</span>

        <svg
          v-if="isSelected"
          aria-hidden="true"
          class="check"
          fill="none"
          height="12"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
          width="12"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </Select.Item>
    </Select.Content>
  </Select.Root>
</template>

<style scoped>
.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  width: 100%;
  background: var(--v0-surface-variant);
  border: 1px solid var(--v0-outline-variant, var(--v0-outline));
  border-radius: 6px;
  color: var(--v0-on-surface);
  font-size: 13px;
  padding: 6px 10px;
  text-align: left;
  transition: border-color 0.15s, background 0.15s;
}

.trigger:hover {
  border-color: var(--v0-outline);
}

.trigger:focus-visible {
  outline: 2px solid var(--v0-primary);
  outline-offset: -1px;
}

.cue {
  display: flex;
  align-items: center;
  color: var(--v0-on-surface-variant);
  flex-shrink: 0;
  transition: transform 0.15s;
}

.cue[data-state="open"] {
  transform: rotate(180deg);
}

.content {
  background: var(--v0-surface);
  border: 1px solid var(--v0-outline-variant, var(--v0-outline));
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  max-height: 260px;
  width: anchor-size(width);
  overflow-y: auto;
  padding: 4px;
}

.item {
  align-items: center;
  border-radius: 4px;
  color: var(--v0-on-surface);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 6px 8px;
  transition: background 0.1s;
  user-select: none;
}

.item:hover,
.item[data-highlighted] {
  background: var(--v0-surface-tint);
}

.item[data-selected] {
  color: var(--v0-primary);
}

.check {
  color: var(--v0-primary);
  flex-shrink: 0;
}
</style>
