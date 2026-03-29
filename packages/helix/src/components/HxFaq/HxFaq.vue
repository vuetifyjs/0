<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface HxFaqProps {
    /** Allow multiple items to be expanded simultaneously */
    multiple?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxFaq' })

  const { multiple = true } = defineProps<HxFaqProps>()

  const model = defineModel<ID | ID[]>()
</script>

<template>
  <ExpansionPanel.Root
    v-model="model"
    class="helix-faq"
    :multiple
  >
    <slot />
  </ExpansionPanel.Root>
</template>

<style scoped>
  .helix-faq {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
