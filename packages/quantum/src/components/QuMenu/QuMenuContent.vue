<script lang="ts">
  // Framework
  import { Menu } from '@vuetify/v0'

  // Context
  import { orphan, useQuMenu } from './QuMenu.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { MenuContentProps } from '@vuetify/v0'

  /**
   * Quantum withholds `positionArea` and `positionTry`: the sheet opens below
   * the emitting element, aligned to its start edge, and moves as a whole near
   * a screen edge (menus page). `value` stays internal: one QuMenu is one layer.
   */
  export interface QuMenuContentProps extends Pick<MenuContentProps, 'eager' | 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuMenuContent' })

  defineSlots<{
    /** Items, check items, dividers, subheaders and sub menus, in order. */
    default?: () => any
  }>()

  const { eager = false, namespace: _namespace } = defineProps<QuMenuContentProps>()

  const context = useQuMenu()

  orphan('QuMenuContent', context)

  const namespace = toRef(() => _namespace ?? context?.namespace.value ?? 'v0:menu')
  const dense = toRef(() => context?.dense.value ?? false)
  const desktop = toRef(() => context?.desktop.value ?? false)
</script>

<template>
  <Menu.Content
    class="quantum-menu"
    :data-dense="dense || undefined"
    :data-desktop="desktop || undefined"
    :eager
    :namespace
    position-area="block-end span-inline-end"
    position-try="flip-block, flip-inline, --quantum-menu-fit"
  >
    <div class="quantum-menu__list">
      <slot />
    </div>
  </Menu.Content>
</template>
