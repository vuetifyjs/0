<script lang="ts">
  export interface GnDocsExampleDescriptionProps {
    /** Heading text */
    title?: string
    /** Anchor id rendered on the heading for deep-linking */
    anchorId?: string
    /** Accepted for API compatibility; the description always collapses behind an expand toggle */
    collapse?: boolean
  }
</script>

<script setup lang="ts">
  // Utilities
  import { shallowRef, toRef, useSlots } from 'vue'

  defineOptions({ name: 'GnDocsExampleDescription' })

  const {
    title,
    anchorId,
  } = defineProps<GnDocsExampleDescriptionProps>()

  defineEmits<{
    'anchor-click': [event: MouseEvent, anchorId: string]
  }>()

  const slots = useSlots()
  const expanded = defineModel<boolean>('expanded', { default: false })

  const hasContent = toRef(() => !!slots.default)
  // Truncate by default with an always-available toggle, matching the legacy
  // DocsExampleDescription. `collapse` is a boolean prop, so it casts to false
  // when absent — gating truncation on it would make long prose never collapse.
  const truncated = toRef(() => !expanded.value && hasContent.value)
  const maxHeight = shallowRef('4.5rem')

  function onToggle () {
    expanded.value = !expanded.value
  }
</script>

<template>
  <div
    v-if="title || hasContent"
    class="genesis-docs-example-description"
    :data-collapsed="truncated || undefined"
    :data-expanded="expanded || undefined"
  >
    <h3
      v-if="title"
      :id="anchorId"
      class="genesis-docs-example-description__title"
    >
      <a
        v-if="anchorId"
        class="genesis-docs-example-description__anchor"
        :href="`#${anchorId}`"
        @click="$emit('anchor-click', $event, anchorId)"
      >{{ title }}</a>

      <template v-else>{{ title }}</template>
    </h3>

    <div
      v-if="hasContent"
      class="genesis-docs-example-description__body"
      :style="truncated ? { maxHeight, overflow: 'hidden' } : undefined"
    >
      <slot />
    </div>

    <div v-if="truncated" aria-hidden="true" class="genesis-docs-example-description__fade" />

    <button
      v-if="hasContent"
      :aria-expanded="expanded ? 'true' : 'false'"
      :aria-label="expanded ? 'Collapse description' : 'Expand description'"
      class="genesis-docs-example-description__toggle"
      type="button"
      @click="onToggle"
    >
      {{ expanded ? 'Collapse' : 'Expand' }}
    </button>
  </div>
</template>

<style scoped>
  .genesis-docs-example-description {
    position: relative;
    padding: 1rem 1.25rem 0;
    border-bottom: 1px solid color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
    background: var(--v0-surface-tint, var(--v0-surface, #f5f5f8));
    color: var(--v0-on-surface-variant, rgb(0 0 0 / 0.6));
  }

  .genesis-docs-example-description__title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--v0-on-surface, #1a1c1e);
  }

  .genesis-docs-example-description__anchor {
    color: inherit;
    text-decoration: none;
  }

  .genesis-docs-example-description__anchor:hover {
    text-decoration: underline;
  }

  .genesis-docs-example-description__body {
    margin-top: 0;
    font-size: 0.875rem;
    line-height: 1.5;
    transition: max-height 0.3s ease-out;
  }

  /* The body renders forwarded markdown prose. Match the legacy
     DocsExampleDescription's compact heading scale so a `### Title` inside the
     description reads as a heading, not body text. */
  .genesis-docs-example-description__body :deep(h3) {
    margin: 0 0 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--v0-on-surface, #1a1c1e);
  }

  .genesis-docs-example-description__body :deep(h4),
  .genesis-docs-example-description__body :deep(h5),
  .genesis-docs-example-description__body :deep(h6) {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--v0-on-surface, #1a1c1e);
  }

  .genesis-docs-example-description__fade {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: 3rem;
    pointer-events: none;
    background: linear-gradient(transparent, var(--v0-surface-tint, var(--v0-surface, #f5f5f8)));
  }

  .genesis-docs-example-description__toggle {
    position: absolute;
    inset-inline-end: 0.75rem;
    top: 0.75rem;
    z-index: 1;
    padding: 0.25rem 0.5rem;
    border: 1px solid color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
    border-radius: 0.25rem;
    background: transparent;
    color: var(--v0-on-surface-variant, rgb(0 0 0 / 0.6));
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background-color 0.15s, border-color 0.15s;
  }

  .genesis-docs-example-description__toggle:hover {
    background: color-mix(in srgb, var(--v0-on-surface-variant, rgb(0 0 0 / 0.6)) 6%, transparent);
    border-color: color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
  }
</style>
