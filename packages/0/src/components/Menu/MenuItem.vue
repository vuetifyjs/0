/**
 * @module MenuItem
 *
 * @see https://0.vuetifyjs.com/components/disclosure/menu
 *
 * @remarks
 * One action in a menu. Activating it closes the menu. Disabled items ignore
 * the pointer and the keyboard.
 *
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useMenuLayer, useMenuRoot } from './MenuRoot.vue'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { isString } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, toValue, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { MaybeRefOrGetter } from 'vue'

  export interface MenuItemProps extends AtomProps {
    /** Stable id. Auto-generated when omitted. */
    id?: ID
    /** Typeahead text. Falls back to the item's text. */
    label?: string
    /** Disables this item */
    disabled?: MaybeRefOrGetter<boolean>
    /** Injection key of the owning menu. @default 'v0:menu' */
    namespace?: string
  }

  export interface MenuItemSlotProps {
    /** Whether this item is disabled */
    isDisabled: boolean
    /** Attributes for the menuitem element */
    attrs: {
      'role': 'menuitem'
      'tabindex': number
      'aria-disabled': boolean
      'data-disabled': true | undefined
      'data-highlighted': true | undefined
      'onClick': (event: MouseEvent) => void
      'onPointerenter': () => void
      'onPointerleave': () => void
      'onFocus': () => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'MenuItem', inheritAttrs: false })

  const attrs = useAttrs()
  const atomRef = useTemplateRef<AtomExpose>('atom')

  defineSlots<{
    default: (props: MenuItemSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless = false,
    id,
    label,
    disabled = false,
    namespace = 'v0:menu',
  } = defineProps<MenuItemProps>()

  const menu = useMenuRoot(namespace)
  const layer = useMenuLayer()
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  const ticket = menu.register({
    id,
    layerId: layer.id,
    kind: 'item',
    label: () => {
      if (isString(label) && label.length > 0) return label
      return el.value?.textContent?.trim() ?? ''
    },
    disabled: () => Boolean(toValue(disabled)) || menu.disabled.value,
    el,
  })

  onBeforeUnmount(() => {
    menu.unregister(ticket.id)
  })

  const isDisabled = toRef(() => Boolean(toValue(ticket.disabled)))
  const isHighlighted = toRef(() => layer.roving.focusedId.value === ticket.id)

  function onClick (event: MouseEvent) {
    if (isDisabled.value) {
      event.preventDefault()
      return
    }
    menu.activate(ticket)
  }

  function onPointerenter () {
    menu.poke()
    if (isDisabled.value) return
    menu.collapseTo(layer.id)
    layer.roving.focus(ticket.id)
  }

  function onFocus () {
    layer.roving.focusedId.value = ticket.id
  }

  const slotProps = toRef((): MenuItemSlotProps => ({
    isDisabled: isDisabled.value,
    attrs: {
      'role': 'menuitem',
      'tabindex': isDisabled.value ? -1 : (layer.roving.isTabbable(ticket.id) ? 0 : -1),
      'aria-disabled': isDisabled.value,
      'data-disabled': isDisabled.value || undefined,
      'data-highlighted': isHighlighted.value || undefined,
      'onClick': onClick,
      'onPointerenter': onPointerenter,
      'onPointerleave': () => menu.cancel(),
      'onFocus': onFocus,
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
  </Atom>
</template>
