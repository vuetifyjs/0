<script lang="ts">
  export type GnDocsCalloutType = 'tip' | 'note' | 'warning' | 'caution' | 'important'

  export interface GnDocsCalloutProps {
    /** Admonition severity — drives color token, default icon, and default title */
    type?: GnDocsCalloutType
  }

  /** Default MDI path per type; overridable via the `icon` slot */
  const ICONS: Record<GnDocsCalloutType, string> = {
    tip: 'M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M11,18H13V15.87C14.73,15.43 16,13.86 16,12A4,4 0 0,0 12,8A4,4 0 0,0 8,12C8,13.86 9.27,15.43 11,15.87V18Z',
    note: 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z',
    warning: 'M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z',
    caution: 'M13 13H11V7H13M11 15H13V17H11M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3Z',
    important: 'M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z',
  }

  /** Default title per type; overridable via the `title` slot */
  const TITLES: Record<GnDocsCalloutType, string> = {
    tip: 'Tip',
    note: 'Note',
    warning: 'Warning',
    caution: 'Caution',
    important: 'Important',
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'GnDocsCallout' })

  const { type = 'note' } = defineProps<GnDocsCalloutProps>()

  const path = toRef(() => ICONS[type])
  const label = toRef(() => TITLES[type])
</script>

<template>
  <div class="genesis-docs-callout" :data-type="type">
    <div class="genesis-docs-callout__header">
      <slot name="icon" :type>
        <svg
          aria-hidden="true"
          class="genesis-docs-callout__icon"
          fill="currentColor"
          height="18"
          viewBox="0 0 24 24"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path :d="path" />
        </svg>
      </slot>

      <span class="genesis-docs-callout__title">
        <slot name="title" :type>{{ label }}</slot>
      </span>
    </div>

    <div class="genesis-docs-callout__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .genesis-docs-callout {
    /* Internal alias, resolved from v0 severity tokens with standalone fallbacks. */
    --gn-callout-color: var(--v0-info, #3b82f6);

    margin-block: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border-inline-start: 4px solid color-mix(in srgb, var(--gn-callout-color) 50%, transparent);
    background: color-mix(in srgb, var(--gn-callout-color) 10%, transparent);
  }

  .genesis-docs-callout[data-type='tip'] {
    --gn-callout-color: var(--v0-success, #3fb950);
  }

  .genesis-docs-callout[data-type='warning'] {
    --gn-callout-color: var(--v0-warning, #d29922);
  }

  .genesis-docs-callout[data-type='caution'] {
    --gn-callout-color: var(--v0-error, #f85149);
  }

  .genesis-docs-callout[data-type='important'] {
    --gn-callout-color: var(--v0-accent, #a371f7);
  }

  .genesis-docs-callout__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
    font-weight: 600;
    color: var(--gn-callout-color);
  }

  .genesis-docs-callout__icon {
    flex: none;
  }

  .genesis-docs-callout__body {
    color: var(--v0-on-surface, #1a1c1e);
  }

  .genesis-docs-callout__body :deep(> p:first-child) {
    margin-top: 0;
  }

  .genesis-docs-callout__body :deep(> p:last-child) {
    margin-bottom: 0;
  }
</style>
