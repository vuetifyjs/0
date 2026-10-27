<script lang="ts">
  // Framework
  import { IN_BROWSER, isNull, Menu, useMenuRoot } from '@vuetify/v0'

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
   * of it, its text on the emitter's text (a list row or a labelled button) or
   * else its start edge on the emitter's; a menu with no selection opens below it.
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

  const menu = useMenuRoot(namespace.value)

  /*
   * The emitter's text, which the selected row's text lands on (menus page,
   * "Horizontal alignment"): a list row's text column, whatever keyline the
   * list sets it on, or a labelled button's content. An emitter with neither
   * keeps the sheet's start edge on its own.
   */
  function label (): Element | null {
    if (!IN_BROWSER) return null

    const trigger = document.querySelector(`#${CSS.escape(menu.triggerId(menu.defaultLayer))}`)

    return isNull(trigger) ? null : trigger.querySelector('.md1-list__content, .md1-button__content')
  }

  // The selected row lands on the emitting element (menus page, "Location"). A
  // cascading sub sheet is not a simple menu: it keeps its place beside its row.
  provideOver({
    item: sheet => Object.hasOwn(sheet.dataset, 'sub')
      ? null
      : sheet.querySelector<HTMLElement>(':scope > .md1-menu__list > [data-selected]'),
    text: row => row.querySelector('.md1-menu__label'),
    label,
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
