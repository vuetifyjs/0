<script setup lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  defineProps<{
    question: string
  }>()
</script>

<template>
  <ExpansionPanel.Item>
    <ExpansionPanel.Activator
      v-slot="{ isSelected }"
      class="w-full px-4 py-3 border border-divider rounded-lg bg-surface hover:bg-surface-tint cursor-pointer flex items-center gap-3 text-left transition-colors"
    >
      <span
        class="w-5 h-5 rounded-full border border-divider flex items-center justify-center text-xs font-mono shrink-0 transition-colors"
        :class="isSelected ? 'bg-primary text-on-primary border-primary' : 'text-on-surface-variant'"
      >
        {{ isSelected ? '−' : '?' }}
      </span>
      <span class="font-medium">{{ question }}</span>
    </ExpansionPanel.Activator>

    <ExpansionPanel.Content class="px-4 pb-4 pt-3 text-on-surface-variant [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80 [&_p]:my-2 first:[&_p]:mt-0 [&_ul]:my-2 [&_ul]:ml-4 [&_ul]:list-disc [&_li]:my-1">
      <slot />
    </ExpansionPanel.Content>
  </ExpansionPanel.Item>
</template>
