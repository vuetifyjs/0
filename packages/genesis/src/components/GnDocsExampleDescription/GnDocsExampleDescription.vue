<script lang="ts">
  export interface GnDocsExampleDescriptionProps {
    /** Heading text */
    title?: string
    /** Anchor id rendered on the heading for deep-linking */
    anchorId?: string
    /** Collapse the description with an expand toggle */
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
    collapse = false,
  } = defineProps<GnDocsExampleDescriptionProps>()

  defineEmits<{
    'anchor-click': [event: MouseEvent, anchorId: string]
  }>()

  const slots = useSlots()
  const expanded = defineModel<boolean>('expanded', { default: false })

  const hasContent = toRef(() => !!slots.default)
  const truncated = toRef(() => collapse && !expanded.value && hasContent.value)
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
      v-if="hasContent && collapse"
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
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--gn-divider);
    background: var(--gn-surface-tint);
    color: var(--gn-on-surface-variant);
  }

  .genesis-docs-example-description__title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--gn-on-surface);
  }

  .genesis-docs-example-description__anchor {
    color: inherit;
    text-decoration: none;
  }

  .genesis-docs-example-description__anchor:hover {
    text-decoration: underline;
  }

  .genesis-docs-example-description__body {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.5;
    transition: max-height 0.3s ease-out;
  }

  .genesis-docs-example-description__fade {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: 3rem;
    pointer-events: none;
    background: linear-gradient(transparent, var(--gn-surface-tint));
  }

  .genesis-docs-example-description__toggle {
    position: absolute;
    inset-inline-end: 0.75rem;
    top: 0.75rem;
    z-index: 1;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--gn-divider);
    border-radius: 0.25rem;
    background: transparent;
    color: var(--gn-on-surface-variant);
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background-color 0.15s, border-color 0.15s;
  }

  .genesis-docs-example-description__toggle:hover {
    background: color-mix(in srgb, var(--gn-on-surface-variant) 6%, transparent);
    border-color: var(--gn-divider);
  }
</style>
