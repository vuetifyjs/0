<script setup lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Utilities
  import { processLinks } from '@/utilities/processLinks'
  import { computed } from 'vue'

  interface FaqItem {
    id: string
    question: string
    answer: string
  }

  const props = defineProps<{
    items: FaqItem[]
  }>()

  const processedItems = computed(() =>
    props.items.map(item => ({
      ...item,
      answer: processLinks(item.answer),
    })),
  )
</script>

<template>
  <ExpansionPanel.Root class="flex flex-col gap-4 mt-8" multiple>
    <ExpansionPanel.Item
      v-for="item in processedItems"
      :key="item.id"
      :value="item.id"
    >
      <ExpansionPanel.Activator
        v-slot="{ isSelected }"
        class="w-full px-4 py-2 border border-divider rounded-lg bg-surface hover:bg-surface-tint cursor-pointer flex items-center gap-3 text-left"
      >
        <span class="text-lg font-mono">{{ isSelected ? '−' : '+' }}</span>
        <span class="font-semibold">{{ item.question }}</span>
      </ExpansionPanel.Activator>

      <ExpansionPanel.Content class="px-4 pb-4 pt-2 text-on-surface [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80">
        <span v-html="item.answer" />
      </ExpansionPanel.Content>
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>
</template>
