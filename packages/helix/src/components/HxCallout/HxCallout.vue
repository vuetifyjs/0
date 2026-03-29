<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { CalloutType } from './calloutConfig'
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxCalloutProps extends V0PaperProps {
    /** Callout type determines icon, title, and styling */
    type: CalloutType
    /** Override the default title */
    title?: string
    /** Make the callout interactive (clickable) */
    interactive?: boolean
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  import { getCalloutConfig } from './calloutConfig'

  defineOptions({ name: 'HxCallout' })

  const {
    type,
    title,
    interactive = false,
    ...paperProps
  } = defineProps<HxCalloutProps>()

  const emit = defineEmits<{
    click: []
  }>()

  const config = toRef(() => getCalloutConfig(type))

  function onClick () {
    if (interactive) emit('click')
  }
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="helix-callout"
    :data-type="type"
    :role="interactive ? 'button' : undefined"
    :tabindex="interactive ? 0 : undefined"
    @click="onClick"
    @keydown.enter="onClick"
    @keydown.space.prevent="onClick"
  >
    <div class="helix-callout__header">
      <slot name="icon">
        <span class="helix-callout__icon">{{ config.icon }}</span>
      </slot>

      <span class="helix-callout__title">{{ title ?? config.title }}</span>
    </div>

    <div class="helix-callout__content">
      <slot />
    </div>
  </V0Paper>
</template>

<style scoped>
  .helix-callout {
    display: block;
    border-inline-start-width: 4px;
    border-inline-start-style: solid;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    margin-block: 1rem;
  }

  .helix-callout__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .helix-callout__content :deep(> p:first-child) {
    margin-top: 0;
  }

  .helix-callout__content :deep(> p:last-child) {
    margin-bottom: 0;
  }

  .helix-callout[role='button'] {
    cursor: pointer;
  }
</style>
