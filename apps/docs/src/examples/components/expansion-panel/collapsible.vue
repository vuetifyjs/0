<script lang="ts" setup>
  import { ExpansionPanel } from '@vuetify/v0'

  const panels = [
    { id: 'panel-1', title: 'Panel 1', content: 'This is the content for panel 1.' },
    { id: 'panel-2', title: 'Panel 2', content: 'This is the content for panel 2.' },
    { id: 'panel-3', title: 'Panel 3', content: 'This is the content for panel 3.' },
  ]
</script>

<template>
  <ExpansionPanel.Root
    class="border border-divider rounded-lg border-solid overflow-hidden divide-y divide-divider"
    :model-value="['panel-1', 'panel-3']"
    multiple
  >
    <ExpansionPanel.Item
      v-for="item in panels"
      :key="item.id"
      :value="item.id"
    >
      <ExpansionPanel.Activator
        v-slot="{ isSelected }"
        class="w-full px-3 py-2 border-none flex items-center gap-3 text-left cursor-pointer bg-surface hover:bg-surface-tint"
      >
        <span
          class="inline-flex items-center justify-center w-5 text-sm text-on-surface opacity-60"
          :class="isSelected ? 'text-primary' : undefined"
        >
          {{ isSelected ? '−' : '+' }}
        </span>
        <span class="flex-1 font-medium text-on-surface text-base">{{ item.title }}</span>
      </ExpansionPanel.Activator>

      <ExpansionPanel.Content class="pa-4">
        {{ item.content }}
      </ExpansionPanel.Content>
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>
</template>
