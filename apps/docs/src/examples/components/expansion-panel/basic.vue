<script lang="ts" setup>
  import { ExpansionPanel } from '@vuetify/v0'
  import { ref } from 'vue'

  const expanded = ref(['panel-1'])

  const panels = [
    { id: 'panel-1', title: 'Panel 1', content: 'This is the content for panel 1.' },
    { id: 'panel-2', title: 'Panel 2', content: 'This is the content for panel 2.' },
    { id: 'panel-3', title: 'Panel 3', content: 'This is the content for panel 3.' },
  ]

  function isLast (index: number) {
    return index === panels.length - 1
  }
</script>

<template>
  <ExpansionPanel.Root v-model="expanded" class="border border-divider rounded-lg border-solid overflow-hidden" multiple>
    <ExpansionPanel.Item
      v-for="(item, index) in panels"
      :key="item.id"
      :value="item.id"
    >
      <ExpansionPanel.Activator
        v-slot="{ isSelected }"
        class="w-full px-6 py-2 border-none border-b border-divider flex items-center gap-3 cursor-pointer transition-all text-base text-left bg-surface hover:bg-surface-tint"
      >
        <span class="inline-flex items-center justify-center w-5 text-sm text-on-surface opacity-60">
          {{ isSelected ? '−' : '+' }}
        </span>
        <span class="flex-1 font-medium text-on-surface">{{ item.title }}</span>
      </ExpansionPanel.Activator>

      <ExpansionPanel.Content v-slot="{ isSelected }">
        <div
          v-show="isSelected"
          class="px-6 py-6 bg-surface"
          :class="{ 'border-b border-divider': !isLast(index) }"
        >
          <p class="m-0 text-on-surface leading-relaxed">
            {{ item.content }}
          </p>
        </div>
      </ExpansionPanel.Content>
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>

  <p class="mt-4 text-sm text-on-surface opacity-60">
    Expanded: {{ expanded.join(', ') }}
  </p>
</template>
