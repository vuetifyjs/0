<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'
  import type { FaqItem } from './useFaq'

  const { items } = defineProps<{
    items: FaqItem[]
  }>()

  const open = defineModel<string>()
</script>

<template>
  <ExpansionPanel.Group
    v-model="open"
    class="border border-divider border-solid rounded-lg overflow-hidden divide-y divide-divider"
  >
    <ExpansionPanel.Root
      v-for="item in items"
      :key="item.id"
      :value="item.id"
    >
      <ExpansionPanel.Header class="m-0">
        <ExpansionPanel.Activator
          class="w-full px-4 py-3 border-none flex items-center gap-3 text-left text-base font-medium cursor-pointer bg-surface text-on-surface hover:bg-surface-tint data-[selected]:bg-surface-tint"
        >
          <span class="flex-1">{{ item.question }}</span>

          <ExpansionPanel.Cue
            class="inline-flex items-center justify-center text-on-surface-variant transition-transform duration-200 ease-in-out data-[state=open]:rotate-180 data-[state=open]:text-primary"
          >
            <svg
              aria-hidden="true"
              fill="none"
              height="20"
              viewBox="0 0 24 24"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" fill="currentColor" />
            </svg>
          </ExpansionPanel.Cue>
        </ExpansionPanel.Activator>
      </ExpansionPanel.Header>

      <ExpansionPanel.Content class="px-4 pb-4 text-sm text-on-surface-variant">
        {{ item.answer }}
      </ExpansionPanel.Content>
    </ExpansionPanel.Root>
  </ExpansionPanel.Group>
</template>
