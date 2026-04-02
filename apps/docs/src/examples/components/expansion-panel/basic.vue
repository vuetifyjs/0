<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const panels = [
    { id: 'panel-1', title: 'Panel 1', content: 'This is the content for panel 1.' },
    { id: 'panel-2', title: 'Panel 2', content: 'This is the content for panel 2.' },
    { id: 'panel-3', title: 'Panel 3', content: 'This is the content for panel 3.' },
  ]

  const model = shallowRef<string[]>([])
</script>

<template>
  <ExpansionPanel.Group
    v-model="model"
    class="border border-divider rounded-lg border-solid overflow-hidden divide-y divide-divider"
    multiple
  >
    <ExpansionPanel.Root
      v-for="item in panels"
      :key="item.id"
      :value="item.id"
    >
      <ExpansionPanel.Activator
        class="w-full px-3 py-2 border-none flex items-center gap-3 text-left cursor-pointer bg-surface hover:bg-surface-tint"
      >
        <ExpansionPanel.Cue class="inline-flex items-center justify-center w-5 text-sm text-on-surface opacity-60 data-[state=open]:text-primary">
          <span class="data-[state=open]:hidden">+</span>
          <span class="hidden data-[state=open]:inline">&minus;</span>
        </ExpansionPanel.Cue>

        <span class="flex-1 font-medium text-on-surface text-base">{{ item.title }}</span>
      </ExpansionPanel.Activator>

      <ExpansionPanel.Content class="p-4">
        {{ item.content }}
      </ExpansionPanel.Content>
    </ExpansionPanel.Root>
  </ExpansionPanel.Group>

  <p class="mt-4 text-sm text-on-surface opacity-60">
    Expanded: {{ model.join(', ') }}
  </p>
</template>
