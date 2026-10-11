/**
 * @module MenuSubActivator
 *
 * @see https://0.vuetifyjs.com/components/disclosure/menu
 *
 * @remarks
 * Item that opens a nested menu. Pointer rest opens it through the menu's
 * open delay. ArrowRight (ArrowLeft in RTL) opens it immediately.
 *
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useMenuLayer, useMenuRoot } from './MenuRoot.vue'
  import { useMenuSub } from './MenuSub.vue'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { isArray, isFunction, isNullOrUndefined, isString } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, toValue, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { MaybeRefOrGetter } from 'vue'

  export interface MenuSubActivatorProps extends AtomProps {
    /** Stable id. Auto-generated when omitted. */
    id?: ID
    /** Typeahead text. Falls back to the item's text. */
    label?: string
    /** Disables this item */
    disabled?: MaybeRefOrGetter<boolean>
    /** Injection key of the owning menu. @default 'v0:menu' */
    namespace?: string
  }

  export interface MenuSubActivatorSlotProps {
    isOpen: boolean
    isDisabled: boolean
    attrs: {
      'id': string
      'role': 'menuitem'
      'tabindex': number
      'aria-haspopup': 'menu'
      'aria-expanded': boolean
      'aria-controls': string
      'aria-disabled': boolean
      'data-open': true | undefined
      'data-state': 'open' | 'closed'
      'data-disabled': true | undefined
      'data-highlighted': true | undefined
      'style': { anchorName: string }
      'onClick': (event: MouseEvent) => void
      'onPointerenter': () => void
      'onPointerleave': () => void
      'onFocus': () => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'MenuSubActivator', inheritAttrs: false })

  const attrs = useAttrs()
  const atomRef = useTemplateRef<AtomExpose>('atom')

  defineSlots<{
    default: (props: MenuSubActivatorSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless = false,
    id,
    label,
    disabled = false,
    namespace = 'v0:menu',
  } = defineProps<MenuSubActivatorProps>()

  const menu = useMenuRoot(namespace)
  const layer = useMenuLayer()
  const sub = useMenuSub()
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  menu.bindAnchor(sub.id, el)

  const ticket = menu.register({
    id,
    layerId: layer.id,
    kind: 'submenu',
    submenuId: sub.id,
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
  const isOpen = toRef(() => menu.path.value.includes(sub.id))
  const isHighlighted = toRef(() => layer.roving.focusedId.value === ticket.id)

  function onClick (event: MouseEvent) {
    if (isDisabled.value) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    menu.activate(ticket)
  }

  function onPointerenter () {
    menu.poke()
    if (isDisabled.value) return
    layer.roving.focus(ticket.id)
    if (isNullOrUndefined(ticket.submenuId)) return
    if (menu.path.value.includes(ticket.submenuId)) return
    menu.schedule(ticket.submenuId, 'pointer')
  }

  function onFocus () {
    layer.roving.focusedId.value = ticket.id
  }

  const slotProps = toRef((): MenuSubActivatorSlotProps => {
    const open = isOpen.value

    return {
      isOpen: open,
      isDisabled: isDisabled.value,
      attrs: {
        'id': menu.triggerId(sub.id),
        'role': 'menuitem',
        'tabindex': isDisabled.value ? -1 : (layer.roving.isTabbable(ticket.id) ? 0 : -1),
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': menu.contentId(sub.id),
        'aria-disabled': isDisabled.value,
        'data-open': open || undefined,
        'data-state': open ? 'open' : 'closed',
        'data-disabled': isDisabled.value || undefined,
        'data-highlighted': isHighlighted.value || undefined,
        'style': { anchorName: menu.anchorName(sub.id) },
        'onClick': onClick,
        'onPointerenter': onPointerenter,
        'onPointerleave': () => menu.cancel(),
        'onFocus': onFocus,
      },
    }
  })

  const merged = toRef(() => {
    const own = slotProps.value.attrs
    const user = attrs.onClick
    const combined = mergeProps(attrs, own)
    if (isArray(user)) combined.onClick = [own.onClick, ...user]
    else if (isFunction(user)) combined.onClick = [own.onClick, user]
    return combined
  })
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
