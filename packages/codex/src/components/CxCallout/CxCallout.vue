<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { CalloutType } from './calloutConfig'
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxCalloutProps extends V0PaperProps {
    /** Callout type determines icon, title, and styling */
    type: CalloutType
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxCallout' })

  const { type, ...paperProps } = defineProps<CxCalloutProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="codex-callout"
    :data-type="type"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .codex-callout {
    display: block;
  }
</style>
