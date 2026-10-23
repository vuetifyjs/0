<script lang="ts">
  // Framework
  import { isElement } from '@vuetify/v0'

  // Context
  import { orphan, useQuNavigationDrawer } from './context'

  /**
   * A destination: a link, or a button that is not a disclosure (a
   * `QuList.Group` header carries `aria-expanded` and only expands its level).
   */
  const DESTINATION = 'a[href], button:not([aria-expanded]), [role="option"]'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuNavigationDrawerContent' })

  defineSlots<{
    /** `QuList`, `QuSubheader` and `QuDivider` children. */
    default?: () => any
  }>()

  const context = useQuNavigationDrawer()

  orphan('QuNavigationDrawerContent', context)

  // A temporary drawer stays open above everything "until a section is
  // selected" (pattern page): choosing a destination closes it.
  function onClick (event: MouseEvent) {
    if (event.defaultPrevented || context?.type.value !== 'temporary') return
    if (!isElement(event.target) || !event.target.closest(DESTINATION)) return

    context.close()
  }
</script>

<!-- Styled by QuNavigationDrawer.vue: the root's sheet carries every part rule. -->
<template>
  <div class="quantum-navigation-drawer__content" @click="onClick">
    <slot />
  </div>
</template>
