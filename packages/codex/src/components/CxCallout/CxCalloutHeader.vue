<script lang="ts">
  // Utilities
  import { toRef } from 'vue'

  // Config
  import { type CalloutType, getCalloutConfig } from './calloutConfig'

  export interface CxCalloutHeaderProps {
    type: CalloutType
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxCalloutHeader' })

  const { type } = defineProps<CxCalloutHeaderProps>()

  const config = toRef(() => getCalloutConfig(type))
</script>

<template>
  <div class="codex-callout__header">
    <span class="codex-callout__icon" :data-icon="config.icon" />
    <span class="codex-callout__title">{{ config.title }}</span>
  </div>
</template>

<style scoped>
  .codex-callout__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }
</style>
