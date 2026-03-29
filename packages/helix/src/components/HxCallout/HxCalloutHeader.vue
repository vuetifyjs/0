<script lang="ts">
  // Utilities
  import { toRef } from 'vue'

  // Config
  import { type CalloutType, getCalloutConfig } from './calloutConfig'

  export interface HxCalloutHeaderProps {
    type: CalloutType
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxCalloutHeader' })

  const { type } = defineProps<HxCalloutHeaderProps>()

  const config = toRef(() => getCalloutConfig(type))
</script>

<template>
  <div class="helix-callout__header">
    <span class="helix-callout__icon" :data-icon="config.icon" />
    <span class="helix-callout__title">{{ config.title }}</span>
  </div>
</template>

<style scoped>
  .helix-callout__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: var(--v0-on-surface);
  }
</style>
