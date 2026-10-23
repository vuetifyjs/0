<script lang="ts">
  // Framework
  import { Menu } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Menu } from './Md1Menu.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { MenuContentProps } from '@vuetify/v0'

  /**
   * MD1 withholds `positionArea` and `positionTry`: the sheet opens below
   * the emitting element, aligned to its start edge, and moves as a whole near
   * a screen edge (menus page). `value` stays internal: one Md1Menu is one layer.
   */
  export interface Md1MenuContentProps extends Pick<MenuContentProps, 'eager' | 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1MenuContent' })

  defineSlots<{
    /** Items, check items, dividers, subheaders and sub menus, in order. */
    default?: () => any
  }>()

  const { eager = false, namespace: _namespace } = defineProps<Md1MenuContentProps>()

  const context = useMd1Menu()

  orphan('Md1MenuContent', context)

  const namespace = toRef(() => _namespace ?? context?.namespace.value ?? 'v0:menu')
  const dense = toRef(() => context?.dense.value ?? false)
  const desktop = toRef(() => context?.desktop.value ?? false)
</script>

<template>
  <Menu.Content
    class="md1-menu"
    :data-dense="dense || undefined"
    :data-desktop="desktop || undefined"
    :eager
    :namespace
    position-area="block-end span-inline-end"
    position-try="flip-block, flip-inline, --md1-menu-fit"
  >
    <div class="md1-menu__list">
      <slot />
    </div>
  </Menu.Content>
</template>
