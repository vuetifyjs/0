<script setup lang="ts">
  import AccordionPanel from './AccordionPanel.vue'
  import { useAccordion } from './useAccordion'

  const { panels, active, toggle } = useAccordion()
</script>

<template>
  <div class="w-full max-w-md flex flex-col gap-2">
    <div
      v-for="panel in panels"
      :key="panel.id"
      class="border border-divider rounded overflow-hidden"
    >
      <button
        class="w-full flex items-center justify-between px-4 py-3 bg-surface text-on-surface font-medium"
        @click="toggle(panel.id)"
      >
        <span>{{ panel.title }}</span>

        <svg
          class="w-4 h-4 text-on-surface-variant transition-transform duration-200"
          :class="active === panel.id ? 'rotate-180' : ''"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AccordionPanel :open="active === panel.id">
        {{ panel.body }}
      </AccordionPanel>
    </div>
  </div>
</template>
