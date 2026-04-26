<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface CxFaqProps {
    /** Allow multiple items to be expanded simultaneously */
    multiple?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxFaq' })

  const { multiple = true } = defineProps<CxFaqProps>()

  const model = defineModel<ID | ID[]>()
</script>

<template>
  <ExpansionPanel.Root
    v-model="model"
    class="codex-faq"
    :multiple
  >
    <slot />
  </ExpansionPanel.Root>
</template>

<style scoped>
  .codex-faq {
    display: flex;
    flex-direction: column;
  }
</style>
