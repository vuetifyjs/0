/**
 * @module BuPanelIcon
 *
 * @remarks
 * Bulma `span.panel-icon` — the leading glyph of a panel block. The `icon`
 * prop names the icon-font classes Bulma's docs use; the default slot takes
 * over for anything else (SVG, an image).
 */

<script lang="ts">
  export interface BuPanelIconProps {
    /** Icon font classes for the inner `<i>` (e.g. `fas fa-book`). */
    icon?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuPanelIcon' })

  defineSlots<{
    /** Custom glyph — replaces the `icon`-driven `<i>`. */
    default?: () => any
  }>()

  const { icon } = defineProps<BuPanelIconProps>()
</script>

<template>
  <span class="panel-icon">
    <slot>
      <i aria-hidden="true" :class="icon" />
    </slot>
  </span>
</template>
