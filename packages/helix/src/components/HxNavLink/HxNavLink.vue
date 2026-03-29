<script lang="ts">
  export interface HxNavLinkProps {
    /** Display label */
    label: string
    /** Internal route destination */
    to?: string
    /** External link destination */
    href?: string
    /** Nesting depth for indentation */
    depth?: number
    /** Whether this item is currently active */
    active?: boolean
    /** Whether this item's children are visible */
    expanded?: boolean
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'HxNavLink' })

  const {
    label,
    to,
    href,
    depth = 0,
    active = false,
    expanded = false,
  } = defineProps<HxNavLinkProps>()

  const emit = defineEmits<{
    'update:expanded': [value: boolean]
    'click': [event: MouseEvent]
  }>()

  defineSlots<{
    /** Nested HxNavLink children */
    default?: () => any
  }>()

  const tag = toRef(() => (href || to) ? 'a' : 'span')

  function onToggle () {
    emit('update:expanded', !expanded)
  }

  function onClick (event: MouseEvent) {
    emit('click', event)
  }
</script>

<template>
  <li
    class="helix-nav-link"
    :data-active="active || undefined"
    :data-depth="depth"
  >
    <div class="helix-nav-link__row" :style="{ paddingInlineStart: `${depth * 0.75}rem` }">
      <!-- Expand/collapse toggle for items with children -->
      <button
        v-if="$slots.default"
        :aria-expanded="expanded ? 'true' : 'false'"
        :aria-label="expanded ? `Collapse ${label}` : `Expand ${label}`"
        class="helix-nav-link__toggle"
        type="button"
        @click.stop="onToggle"
      >
        <span aria-hidden="true" class="helix-nav-link__chevron" :data-expanded="expanded || undefined">&#x25B8;</span>
      </button>

      <!-- Link or plain label -->
      <component
        :is="tag"
        :aria-current="active ? 'page' : undefined"
        class="helix-nav-link__label"
        :data-active="active || undefined"
        :href="href || to || undefined"
        @click="onClick"
      >
        {{ label }}
      </component>
    </div>

    <!-- Children -->
    <ul v-if="$slots.default && expanded" class="helix-nav-link__children" role="group">
      <slot />
    </ul>
  </li>
</template>

<style scoped>
  .helix-nav-link__row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    transition: background-color 150ms ease;
  }

  .helix-nav-link__row:hover {
    background-color: var(--v0-surface-tint);
  }

  .helix-nav-link__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    background: none;
    border: none;
    border-radius: 0.25rem;
    padding: 0;
    width: 1.25rem;
    height: 1.25rem;
    color: var(--v0-on-surface-variant);
    transition: background-color 150ms ease;
  }

  .helix-nav-link__toggle:hover {
    background-color: var(--v0-surface-variant);
  }

  .helix-nav-link__toggle:focus-visible {
    outline: 2px solid var(--v0-primary);
    outline-offset: -2px;
  }

  .helix-nav-link__chevron {
    display: inline-block;
    transition: transform 0.15s ease;
    font-size: 0.75rem;
  }

  .helix-nav-link__chevron[data-expanded] {
    transform: rotate(90deg);
  }

  .helix-nav-link__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-decoration: none;
    color: var(--v0-on-surface-variant);
    cursor: pointer;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    transition: color 150ms ease;
  }

  .helix-nav-link__label:hover {
    color: var(--v0-primary);
  }

  .helix-nav-link__label:focus-visible {
    outline: 2px solid var(--v0-primary);
    outline-offset: -2px;
  }

  .helix-nav-link__label[data-active] {
    color: var(--v0-primary);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 0.25rem;
    text-decoration-thickness: 2px;
  }

  .helix-nav-link__children {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
