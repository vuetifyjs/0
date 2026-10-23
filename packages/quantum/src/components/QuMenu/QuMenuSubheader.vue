<script lang="ts">
  // Context
  import { orphan, useQuMenu } from './QuMenu.vue'

  // Components
  import QuSubheader from '../QuSubheader/QuSubheader.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuMenuSubheader' })

  defineSlots<{
    /** The group title. One line. */
    default?: () => any
  }>()

  orphan('QuMenuSubheader', useQuMenu())
</script>

<!--
  The subheader tile of the subheaders page, not sticky: a menu is short and
  scrolls as one sheet. A `menu` may own only items, groups and separators, so
  the tile is presentational there (`role="none"`, no heading level); the
  title still reads as text, and the items after it carry their own names.
-->
<template>
  <QuSubheader
    :aria-level="undefined"
    class="quantum-menu__subheader"
    role="none"
    :sticky="false"
  >
    <slot />
  </QuSubheader>
</template>
