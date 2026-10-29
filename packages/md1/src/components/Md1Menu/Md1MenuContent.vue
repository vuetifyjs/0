<script lang="ts">
  // Framework
  import { IN_BROWSER, isNull, Menu, useMenuRoot } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Menu } from './Md1Menu.vue'

  // Placement
  import { provideOver } from './over'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  // Types
  import type { MenuContentProps } from '@vuetify/v0'

  /**
   * Material Design 1 withholds `positionArea` and `positionTry`: a simple menu
   * with a selected item opens over the emitting element with that item on top
   * of it, its start edge on the start of a list row's text, or else on the
   * emitter's own start edge; a menu with no selection opens below it.
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
   * A list row's text column, which the sheet's start edge lands on: "simple
   * menus are always left-aligned with the start of the list item text" (menus
   * page, "Simple menus"), whatever keyline the list sets it on. Any other
   * emitter keeps the sheet's start edge on its own.
   */
  function label (): Element | null {
    if (!IN_BROWSER) return null

    const trigger = document.querySelector(`#${CSS.escape(menu.triggerId(menu.defaultLayer))}`)

    return isNull(trigger) ? null : trigger.querySelector('.md1-list__content')
  }

  /*
   * The sheet opens toward the side of the screen with the room: an action
   * menu at the end of an app bar grows down and start-ward by intent rather
   * than by edge pressure (menus page: menus position "based on their
   * proximity to screen edges"). Measured once per open and held through the
   * close: the path empties while the exit still plays, and a reset to the
   * default would re-seat a start-aligned sheet mid-fade wherever both sides
   * fit — position-try only pulls it back at a screen edge. The server keeps
   * the default.
   */
  const area = shallowRef('block-end span-inline-end')

  watch(() => menu.path.value.length > 0, open => {
    if (!open || !IN_BROWSER) return

    const trigger = document.querySelector(`#${CSS.escape(menu.triggerId(menu.defaultLayer))}`)

    if (isNull(trigger)) {
      area.value = 'block-end span-inline-end'
      return
    }

    const rect = trigger.getBoundingClientRect()
    const after = rect.left + rect.width / 2 > document.documentElement.clientWidth / 2
    const rtl = getComputedStyle(trigger).direction === 'rtl'

    area.value = after === rtl ? 'block-end span-inline-end' : 'block-end span-inline-start'
  }, { immediate: true })

  // The selected row lands on the emitting element (menus page, "Location"). A
  // cascading sub sheet is not a simple menu: it keeps its place beside its row.
  provideOver({
    item: sheet => Object.hasOwn(sheet.dataset, 'sub')
      ? null
      : sheet.querySelector<HTMLElement>(':scope > .md1-menu__list > [data-selected]'),
    // The row spans the sheet, so its start edge is the sheet's.
    text: row => row,
    label,
  })
</script>

<template>
  <Menu.Content
    class="md1-menu"
    :data-dense="dense || undefined"
    :data-desktop="desktop || undefined"
    :data-start="area.endsWith('span-inline-start') || undefined"
    :eager
    :namespace
    :position-area="area"
    position-try="flip-block, flip-inline, flip-block flip-inline, --md1-menu-wide, --md1-menu-wide-flip, --md1-menu-fit, --md1-menu-fit-wide"
  >
    <div class="md1-menu__list">
      <slot />
    </div>
  </Menu.Content>
</template>
