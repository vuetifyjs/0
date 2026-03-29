<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface HxAccordionProps {
    /** Allow multiple items to be expanded simultaneously */
    multiple?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxAccordion' })

  const { multiple = false } = defineProps<HxAccordionProps>()

  const model = defineModel<ID | ID[]>()
</script>

<template>
  <ExpansionPanel.Root
    v-model="model"
    class="helix-accordion"
    :multiple
  >
    <slot />
  </ExpansionPanel.Root>
</template>

<style scoped>
  .helix-accordion {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--v0-divider);
    border-radius: 0.5rem;
    overflow: hidden;
  }
</style>
