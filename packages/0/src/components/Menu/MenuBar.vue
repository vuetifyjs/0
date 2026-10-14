/**
 * @module MenuBar
 *
 * @see https://0.vuetifyjs.com/components/disclosure/menu
 *
 * @remarks
 * Persistent horizontal bar. Arrow keys move between activators. Once a menu
 * is open, hovering a sibling activator switches to it.
 *
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useMenuRoot } from './MenuRoot.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { useRovingFocus } from '#v0/composables/useRovingFocus'

  // Utilities
  import { isElement, isNullOrUndefined } from '#v0/utilities'
  import { mergeProps, toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { RovingFocusReturn } from '#v0/composables/useRovingFocus'

  export interface MenuBarContext {
    roving: RovingFocusReturn
  }

  const [useMenuBar, provideMenuBar] = createContext<MenuBarContext | null>('v0:menu:bar', null)

  export { useMenuBar }

  export interface MenuBarProps extends AtomProps {
    /** Injection key of the owning menu. @default 'v0:menu' */
    namespace?: string
  }

  export interface MenuBarSlotProps {
    /** Attributes for the menubar element */
    attrs: {
      'role': 'menubar'
      'aria-orientation': 'horizontal'
      'data-orientation': 'horizontal'
      'onKeydown': (event: KeyboardEvent) => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'MenuBar', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: MenuBarSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless = false,
    namespace = 'v0:menu',
  } = defineProps<MenuBarProps>()

  const menu = useMenuRoot(namespace)

  const roving = useRovingFocus(() => {
    return menu.activators.values().map(ticket => ({
      id: ticket.id,
      disabled: ticket.disabled,
      el: ticket.el,
    }))
  }, { orientation: 'horizontal', circular: true })

  provideMenuBar({ roving })

  function host (event: KeyboardEvent) {
    const target = event.target
    if (!isElement(target)) return

    return menu.activators.values().find(item => {
      const el = toValue(item.el)
      return isElement(el) && (el === target || el.contains(target))
    })
  }

  function onKeydown (event: KeyboardEvent) {
    if (menu.disabled.value || event.isComposing) return

    const aimed = host(event)
    if (!isNullOrUndefined(aimed)) roving.focusedId.value = aimed.id

    const before = roving.focusedId.value
    roving.onKeydown(event)

    const ticket = menu.activators.values().find(item => item.id === roving.focusedId.value)
    if (isNullOrUndefined(ticket)) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      menu.reveal(ticket.layerId, 'keyboard', 'first')
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      menu.reveal(ticket.layerId, 'keyboard', 'last')
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (menu.path.value[0] === ticket.layerId) menu.dismiss()
      else menu.reveal(ticket.layerId, 'keyboard')
      return
    }

    if (menu.path.value.length === 0 || ticket.id === before) return
    if (menu.path.value[0] === ticket.layerId) return
    menu.reveal(ticket.layerId, 'keyboard')
  }

  const slotProps = toRef((): MenuBarSlotProps => ({
    attrs: {
      'role': 'menubar',
      'aria-orientation': 'horizontal',
      'data-orientation': 'horizontal',
      onKeydown,
    },
  }))

  const merged = toRef(() => mergeProps(attrs, slotProps.value.attrs))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="merged"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
