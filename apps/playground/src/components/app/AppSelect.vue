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
    disabled,
    placeholder = 'Select...',
  } = defineProps<{
    items: AppSelectItem[]
    mandatory?: boolean
    disabled?: boolean
    placeholder?: string
  }>()

  const model = defineModel<ID | ID[]>()

  const selectedLabel = toRef(() => {
    const id = isArray(model.value) ? model.value[0] : model.value
    return items.find(item => item.id === id)?.label ?? placeholder
  })
</script>

<template>
  <Select.Root v-model="model" :disabled :mandatory>
    <Select.Activator class="flex items-center justify-between gap-1.5 w-full bg-surface-variant border border-outline-variant rounded-md text-on-surface text-[13px] px-2.5 py-1.5 text-left transition-colors hover:not-data-[disabled]:border-outline data-[disabled]:opacity-60 data-[disabled]:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-1">
      <span>{{ selectedLabel }}</span>

      <Select.Cue class="flex items-center shrink-0 text-on-surface-variant transition-transform data-[state=open]:rotate-180">
        <AppIcon icon="chevron-down" :size="14" />
      </Select.Cue>
    </Select.Activator>

    <Select.Content class="bg-surface border border-outline-variant rounded-md shadow-lg text-[13px] max-h-[260px] overflow-y-auto p-1" style="width: anchor-size(width)">
      <Select.Item
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        v-slot="{ isSelected }"
        class="flex items-center justify-between rounded text-on-surface cursor-pointer px-2 py-1.5 transition-colors select-none hover:bg-surface-tint data-[highlighted]:bg-surface-tint data-[selected]:text-primary"
        :value="item.id"
      >
        <span>{{ item.label }}</span>

        <svg
          v-if="isSelected"
          aria-hidden="true"
          class="text-primary shrink-0"
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
