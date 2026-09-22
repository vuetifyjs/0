<script setup lang="ts">
  import {
    EmIcon,
    EmSelect,
    EmSelectActivator,
    EmSelectContent,
    EmSelectItem,
    EmSelectPlaceholder,
    EmSelectValue,
  } from '@paper/emerald'

  import type { EmIconName } from '@paper/emerald'
  import { shallowRef } from 'vue'

  const view = shallowRef<string>()

  interface View {
    value: string
    label: string
    icon: EmIconName
    hint: string
    disabled?: boolean
  }

  const views: View[] = [
    { value: 'board', label: 'Board', icon: 'kanban', hint: 'Cards in columns' },
    { value: 'table', label: 'Table', icon: 'table', hint: 'Rows and fields' },
    { value: 'calendar', label: 'Calendar', icon: 'calendar', hint: 'By due date' },
    { value: 'archive', label: 'Archive', icon: 'layers', hint: 'Read only', disabled: true },
  ]

  function find (value: unknown) {
    return views.find(item => item.value === value)
  }
</script>

<template>
  <div class="emerald-docs-stack">
    <EmSelect v-model="view" label="Default view">
      <EmSelectActivator>
        <EmSelectValue v-slot="{ selectedValue }">
          <span class="emerald-docs-item">
            <EmIcon v-if="find(selectedValue)" :name="find(selectedValue)!.icon" size="s" />
            {{ find(selectedValue)?.label }}
          </span>
        </EmSelectValue>

        <EmSelectPlaceholder>Pick a view</EmSelectPlaceholder>
      </EmSelectActivator>

      <EmSelectContent>
        <EmSelectItem
          v-for="item in views"
          :key="item.value"
          :disabled="item.disabled"
          :value="item.value"
        >
          <span class="emerald-docs-item">
            <EmIcon :name="item.icon" size="s" />

            <span>
              {{ item.label }}
              <small>{{ item.hint }}</small>
            </span>
          </span>
        </EmSelectItem>
      </EmSelectContent>
    </EmSelect>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    max-width: 320px;
  }

  .emerald-docs-item {
    display: inline-flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .emerald-docs-item small {
    display: block;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant);
  }
</style>
