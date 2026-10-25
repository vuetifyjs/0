<script lang="ts">
  // Framework
  import { Menu } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Menu } from './Md1Menu.vue'

  // Placement
  import { provideOver } from './over'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { MenuContentProps } from '@vuetify/v0'

  /**
   * Material Design 1 withholds `positionArea` and `positionTry`: a simple menu
   * with a selected item opens over the emitting element with that item on top
   * of it, aligned to its start edge; a menu with no selection opens below it.
   * Either way the sheet moves as a whole near a screen edge (menus page).
   * `value` stays internal: one Md1Menu is one layer.
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

  // The selected row lands on the emitting element (menus page, "Location"). A
  // cascading sub sheet is not a simple menu: it keeps its place beside its row.
  provideOver({
    item: sheet => Object.hasOwn(sheet.dataset, 'sub')
      ? null
      : sheet.querySelector<HTMLElement>(':scope > .md1-menu__list > [data-selected]'),
  })
</script>

<template>
  <Menu.Content
    class="md1-menu"
    :data-dense="dense || undefined"
    :data-desktop="desktop || undefined"
    :eager
    :namespace
    position-area="block-end span-inline-end"
    position-try="flip-block, flip-inline, flip-block flip-inline, --md1-menu-wide, --md1-menu-wide-flip, --md1-menu-fit, --md1-menu-fit-wide"
  >
    <div class="md1-menu__list">
      <slot />
    </div>
  </Menu.Content>
</template>
