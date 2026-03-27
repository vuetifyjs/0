<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  // Config
  import { type CalloutType, getCalloutConfig } from './calloutConfig'

  export interface CxCalloutProps extends V0PaperProps {
    /** Callout type determines icon, title, and styling */
    type: CalloutType
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxCallout' })

  const { type, ...paperProps } = defineProps<CxCalloutProps>()

  const config = toRef(() => getCalloutConfig(type))
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="codex-callout"
    :data-type="type"
  >
    <div class="codex-callout__header">
      <span class="codex-callout__icon" :data-icon="config.icon" />
      <span class="codex-callout__title">{{ config.title }}</span>
    </div>

    <div class="codex-callout__content">
      <slot />
    </div>
  </V0Paper>
</template>

<style scoped>
  .codex-callout {
    display: block;
  }

  .codex-callout__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }

  .codex-callout__content :deep(> p:first-child) {
    margin-top: 0;
  }

  .codex-callout__content :deep(> p:last-child) {
    margin-bottom: 0;
  }
</style>
