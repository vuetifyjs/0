<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'
  import { motion } from 'motion-v'
  import { ref } from 'vue'

  const panels = [
    { id: 'panel-1', title: 'Panel 1', content: 'This is the content for panel 1.' },
    { id: 'panel-2', title: 'Panel 2', content: 'This is the content for panel 2.' },
    { id: 'panel-3', title: 'Panel 3', content: 'This is the content for panel 3.' },
  ]
  const model = ref(['panel-2'])

  const variants = {
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: {
          type: 'spring',
          stiffness: 200,
          damping: 30,
        },
        opacity: {
          duration: 0.2,
        },
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: {
          type: 'spring',
          stiffness: 200,
          damping: 30,
        },
        opacity: {
          duration: 0.1,
        },
      },
    },
  }
</script>

<template>
  <ExpansionPanel.Root
    v-model="model"
    class="border border-divider rounded-lg border-solid overflow-hidden divide-y divide-divider"
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

      <ExpansionPanel.Content
        v-slot="{ isSelected, attrs }"
        renderless
      >
        <motion.div
          v-bind="{ ...attrs, hidden: undefined }"
          :animate="isSelected ? 'open' : 'closed'"
          class="overflow-hidden bg-surface-tint/20"
          :initial="false"
          :variants="variants"
        >
          <div class="pa-4 text-sm text-on-surface/80">
            {{ item.content }}
          </div>
        </motion.div>
      </ExpansionPanel.Content>
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>
</template>
