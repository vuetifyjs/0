/**
 * @module MenuContext
 *
 * @see https://0.vuetifyjs.com/components/disclosure/menu
 *
 * @remarks
 * Opens the root menu at the pointer on a right-click. The anchor is a
 * zero-size sentinel rendered here, not an element created in script.
 * Focus returns to this element, not the sentinel.
 *
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useMenuRoot } from './MenuRoot.vue'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { mergeProps, onBeforeUnmount, shallowRef, toRef, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { CSSProperties } from 'vue'

  export interface MenuContextProps extends AtomProps {
    /** Injection key of the owning menu. @default 'v0:menu' */
    namespace?: string
  }

  export interface MenuContextSlotProps {
    /** Whether the menu is open */
    isOpen: boolean
    /** Attributes for the right-click target */
    attrs: {
      tabindex: -1
      onContextmenu: (event: MouseEvent) => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'MenuContext', inheritAttrs: false })

  const attrs = useAttrs()
  const atomRef = useTemplateRef<AtomExpose>('atom')
  const sentinel = useTemplateRef<HTMLElement>('sentinel')

  defineSlots<{
    default: (props: MenuContextSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless = false,
    namespace = 'v0:menu',
  } = defineProps<MenuContextProps>()

  const menu = useMenuRoot(namespace)
  const point = shallowRef({ x: 0, y: 0 })
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  function anchor () {
    return sentinel.value
  }

  menu.bindAnchor(menu.defaultLayer, anchor)
  menu.bindReturn(menu.defaultLayer, el)

  onBeforeUnmount(() => {
    menu.unbindAnchor(menu.defaultLayer, anchor)
    menu.bindReturn(menu.defaultLayer, null)
  })

  function onContextmenu (event: MouseEvent) {
    if (menu.disabled.value) return
    event.preventDefault()
    point.value = { x: event.clientX, y: event.clientY }
    menu.reveal(menu.defaultLayer, 'context')
  }

  const sentinelStyle = toRef((): CSSProperties & { anchorName: string } => ({
    position: 'fixed',
    top: `${point.value.y}px`,
    left: `${point.value.x}px`,
    width: '0',
    height: '0',
    pointerEvents: 'none',
    anchorName: menu.anchorName(menu.defaultLayer),
  }))

  const slotProps = toRef((): MenuContextSlotProps => ({
    isOpen: menu.path.value[0] === menu.defaultLayer,
    attrs: {
      tabindex: -1,
      onContextmenu,
    },
  }))

  const merged = toRef(() => mergeProps(attrs, slotProps.value.attrs))
</script>

<template>
  <Atom
    ref="atom"
    :as
    :renderless
    v-bind="merged"
  >
    <slot v-bind="slotProps" />

    <span
      ref="sentinel"
      aria-hidden="true"
      :style="sentinelStyle"
    />
  </Atom>
</template>
