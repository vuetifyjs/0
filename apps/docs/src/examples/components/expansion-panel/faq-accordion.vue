<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import FaqAccordion from './FaqAccordion.vue'
  import { useFaq } from './useFaq'

  const { items, open, current, collapse } = useFaq()
</script>

<template>
  <div class="max-w-xl mx-auto flex flex-col gap-4">
    <FaqAccordion v-model="open" :items />

    <div class="flex items-center justify-between gap-3 text-sm">
      <p class="text-on-surface-variant">
        <template v-if="current">
          Reading: <span class="text-on-surface font-medium">{{ current.question }}</span>
        </template>

        <template v-else>
          All answers collapsed.
        </template>
      </p>

      <Button.Root
        v-if="current"
        class="px-3 py-1 rounded-lg border border-divider border-solid text-on-surface"
        @click="collapse"
      >
        Collapse
      </Button.Root>
    </div>

    <p class="text-xs text-on-surface-variant">
      One question opens at a time. Pass <code class="text-primary">multiple</code> to <code class="text-primary">ExpansionPanel.Group</code> to let several answers stay open together.
    </p>
  </div>
</template>
