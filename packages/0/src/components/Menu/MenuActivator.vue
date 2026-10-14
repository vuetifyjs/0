/**
 * @module MenuActivator
 *
 * @see https://0.vuetifyjs.com/components/disclosure/menu
 *
 * @remarks
 * Opens one menu layer. An activator outside a bar is a button. An activator
 * inside Menu.Bar is a menubar item. ArrowDown opens on the first item;
 * ArrowUp opens on the last.
 *
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useMenuBar } from './MenuBar.vue'
  import { useMenuRoot } from './MenuRoot.vue'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { isNullOrUndefined } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, toValue, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { MaybeRefOrGetter } from 'vue'

  export interface MenuActivatorProps extends AtomProps {
    /** Layer this activator opens. Omit it to use Menu.Root's `value`. */
    value?: ID
    /** Disables this activator */
    disabled?: MaybeRefOrGetter<boolean>
    /** Injection key of the owning menu. @default 'v0:menu' */
    namespace?: string
  }

  export interface MenuActivatorSlotProps {
    /** Whether this activator's menu is open */
    isOpen: boolean
    /** Whether this activator is disabled */
    isDisabled: boolean
    /** Attributes for the activator element */
    attrs: {
      'id': string
      'type': 'button' | undefined
      'role': 'button' | 'menuitem' | undefined
      'tabindex': number
      'aria-haspopup': 'menu'
      'aria-expanded': boolean
      'aria-controls': string
      'aria-disabled': boolean | undefined
      'disabled': true | undefined
      'data-open': true | undefined
      'data-state': 'open' | 'closed'
      'data-disabled': true | undefined
      'data-highlighted': true | undefined
      'style': { anchorName: string }
      'onClick': (event: MouseEvent) => void
      'onKeydown': (event: KeyboardEvent) => void
      'onPointerenter': () => void
      'onPointerleave': () => void
      'onFocus': () => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'MenuActivator', inheritAttrs: false })

  const attrs = useAttrs()
  const atomRef = useTemplateRef<AtomExpose>('atom')

  defineSlots<{
    default: (props: MenuActivatorSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless = false,
    value,
    disabled = false,
    namespace = 'v0:menu',
  } = defineProps<MenuActivatorProps>()

  const menu = useMenuRoot(namespace)
  const bar = useMenuBar()
  const layerId = value ?? menu.defaultLayer
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  menu.bindAnchor(layerId, el)

  const ticket = menu.registerActivator({
    layerId,
    disabled: () => Boolean(toValue(disabled)) || menu.disabled.value,
    el,
  })

  onBeforeUnmount(() => {
    menu.unbindAnchor(layerId, el)
    menu.unregisterActivator(ticket.id)
  })

  const isDisabled = toRef(() => Boolean(toValue(ticket.disabled)))
  const isOpen = toRef(() => menu.path.value[0] === layerId)

  watch(isOpen, open => {
    if (!open || isNullOrUndefined(bar)) return
    bar.roving.focusedId.value = ticket.id
  }, { immediate: true })

  function onClick (event: MouseEvent) {
    if (isDisabled.value) {
      event.preventDefault()
      return
    }

    if (isOpen.value) menu.dismiss()
    else if (event.detail === 0) menu.reveal(layerId, 'keyboard', 'first')
    else menu.reveal(layerId, 'click')
  }

  function onKeydown (event: KeyboardEvent) {
    if (isDisabled.value || !isNullOrUndefined(bar)) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      menu.reveal(layerId, 'keyboard', 'first')
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      menu.reveal(layerId, 'keyboard', 'last')
      return
    }

    if (as === 'button') return
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    onClick(new MouseEvent('click'))
  }

  function onPointerenter () {
    if (isDisabled.value) return
    menu.poke()

    if (menu.path.value.length > 0 && menu.path.value[0] !== layerId) {
      menu.reveal(layerId, 'pointer')
      return
    }

    if (menu.openOnHover.value && !isOpen.value) menu.schedule(layerId, 'hover')
  }

  function onFocus () {
    if (!isNullOrUndefined(bar)) bar.roving.focusedId.value = ticket.id
  }

  const slotProps = toRef((): MenuActivatorSlotProps => {
    const open = isOpen.value
    const tabIndex = isDisabled.value
      ? -1
      : (isNullOrUndefined(bar) || bar.roving.isTabbable(ticket.id) ? 0 : -1)

    return {
      isOpen: open,
      isDisabled: isDisabled.value,
      attrs: {
        'id': menu.triggerId(layerId),
        'type': as === 'button' ? 'button' : undefined,
        'role': isNullOrUndefined(bar) ? (as === 'button' ? undefined : 'button') : 'menuitem',
        'tabindex': tabIndex,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': menu.contentId(layerId),
        'aria-disabled': as === 'button' ? undefined : isDisabled.value,
        'disabled': as === 'button' && isDisabled.value ? true : undefined,
        'data-open': open || undefined,
        'data-state': open ? 'open' : 'closed',
        'data-disabled': isDisabled.value || undefined,
        'data-highlighted': !isNullOrUndefined(bar) && bar.roving.focusedId.value === ticket.id ? true : undefined,
        'style': { anchorName: menu.anchorName(layerId) },
        'onClick': onClick,
        'onKeydown': onKeydown,
        'onPointerenter': onPointerenter,
        'onPointerleave': () => menu.leave(),
        'onFocus': onFocus,
      },
    }
  })

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
