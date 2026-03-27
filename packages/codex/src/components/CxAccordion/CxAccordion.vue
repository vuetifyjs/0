<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface CxAccordionProps {
    /** Allow multiple items to be expanded simultaneously */
    multiple?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAccordion' })

  const { multiple = false } = defineProps<CxAccordionProps>()

  const model = defineModel<ID | ID[]>()
</script>

<template>
  <ExpansionPanel.Root
    v-model="model"
    class="codex-accordion"
    :multiple
  >
    <slot />
  </ExpansionPanel.Root>
</template>

<style scoped>
  .codex-accordion {
    display: flex;
    flex-direction: column;
  }
</style>
