/**
 * @module MenuRoot
 *
 * @see https://0.vuetifyjs.com/components/disclosure/menu
 *
 * @remarks
 * Root for a menu opened from a button, a right-click, or a menubar.
 * One open path covers the top menu and its nested submenus. Checkbox and
 * radio items keep the menu open; an action item, Escape, or a light dismiss
 * closes it and returns focus to the opener. Tab closes it and leaves focus
 * where the browser moved it.
 *
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createRegistry } from '#v0/composables/createRegistry'
  import { useTimer } from '#v0/composables/useTimer'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Globals
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { isNull, isNullOrUndefined, isUndefined, useId } from '#v0/utilities'
  import { nextTick, shallowRef, toRef, toValue, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { RegistryTicket } from '#v0/composables/createRegistry'
  import type { RovingFocusReturn } from '#v0/composables/useRovingFocus'
  import type { ID } from '#v0/types'
  import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

  export type MenuSource = 'keyboard' | 'click' | 'context' | 'pointer' | 'hover'

  export type MenuKind = 'item' | 'submenu' | 'checkbox' | 'radio'

  export type MenuEdge = 'first' | 'last' | 'content'

  export interface MenuItemInput {
    id?: ID
    layerId: ID
    kind: MenuKind
    label: () => string
    disabled?: MaybeRefOrGetter<boolean>
    el?: MaybeRefOrGetter<Element | null | undefined>
    submenuId?: ID
    onActivate?: () => void
  }

  export interface MenuItemTicket extends RegistryTicket, MenuItemInput {
    id: ID
    layerId: ID
    kind: MenuKind
    label: () => string
  }

  export interface MenuActivatorInput {
    id?: ID
    layerId: ID
    disabled?: MaybeRefOrGetter<boolean>
    el?: MaybeRefOrGetter<Element | null | undefined>
  }

  export interface MenuActivatorTicket extends RegistryTicket, MenuActivatorInput {
    id: ID
    layerId: ID
  }

  export interface MenuRootContext {
    id: string
    defaultLayer: ID
    disabled: Readonly<Ref<boolean>>
    openOnHover: Readonly<Ref<boolean>>
    path: Readonly<ShallowRef<readonly ID[]>>
    pendingFocus: Readonly<ShallowRef<ID | null>>
    pendingEdge: Readonly<ShallowRef<MenuEdge>>
    register: (input: MenuItemInput) => MenuItemTicket
    unregister: (id: ID) => void
    items: (layerId: ID) => MenuItemTicket[]
    registerActivator: (input: MenuActivatorInput) => MenuActivatorTicket
    unregisterActivator: (id: ID) => void
    activators: () => MenuActivatorTicket[]
    registerLayer: (id: ID, parentId: ID | null) => void
    unregisterLayer: (id: ID) => void
    parentOf: (id: ID) => ID | null
    isTop: (id: ID) => boolean
    bindAnchor: (id: ID, el: MaybeRefOrGetter<Element | null | undefined>) => void
    /** Drop the anchor registered for `id` when it is still `el`. */
    unbindAnchor: (id: ID, el: MaybeRefOrGetter<Element | null | undefined>) => void
    /** Focus target used on dismiss when it differs from the positioning anchor. */
    bindReturn: (id: ID, el: MaybeRefOrGetter<Element | null | undefined>) => void
    anchor: (id: ID) => Element | null
    anchorName: (id: ID) => string
    contentId: (id: ID) => string
    triggerId: (id: ID) => string
    hasActivator: (id: ID) => boolean
    reveal: (id: ID, source: MenuSource, edge?: MenuEdge) => void
    pop: () => void
    /** Close every layer. Restores focus unless `restore` is false. */
    dismiss: (restore?: boolean) => void
    poke: () => void
    /** Drop a scheduled open. Does not start the close timer. */
    cancel: () => void
    /** Drop a scheduled open, and start the close timer when this menu was opened by hover. */
    leave: () => void
    schedule: (id: ID, source: 'hover' | 'pointer') => void
    activate: (ticket: MenuItemTicket) => void
    collapseTo: (layerId: ID) => void
    shift: (direction: 1 | -1) => void
    canShift: () => boolean
    typeahead: (layerId: ID, key: string) => ID | undefined
    claimFocus: (layerId: ID) => ID | null | undefined
    onKeydown: (layerId: ID, event: KeyboardEvent, roving: RovingFocusReturn) => void
  }

  export interface MenuRootProps extends AtomProps {
    /** DOM id prefix for the menu and the controls that open it */
    id?: string
    /** Disables every activator and item in this menu */
    disabled?: boolean
    /** Delay before a hover or pointer open. Keyboard, click, and right-click skip it. */
    openDelay?: number
    /** Delay before a hover-opened menu closes after the pointer leaves */
    closeDelay?: number
    /** Open the top menu when the pointer rests on its activator */
    openOnHover?: boolean
    /** Injection key. @default 'v0:menu' */
    namespace?: string
  }

  export interface MenuRootSlotProps {
    /** Whether any layer of this menu is open */
    isOpen: boolean
    /** Top layer id while open */
    layer: ID | null
    /** Close every layer. Restores focus unless `restore` is false. */
    dismiss: (restore?: boolean) => void
  }

  export const [useMenuRoot, provideMenuRoot] = createContext<MenuRootContext>()

  export interface MenuLayerContext {
    id: ID
    roving: RovingFocusReturn
  }

  export const [useMenuLayer, provideMenuLayer] = createContext<MenuLayerContext>('v0:menu:layer')
</script>

<script setup lang="ts">
  defineOptions({ name: 'MenuRoot' })

  defineSlots<{
    default: (props: MenuRootSlotProps) => any
  }>()

  defineEmits<{
    'update:modelValue': [value: ID | null]
  }>()

  const {
    as = null,
    id: _id,
    disabled = false,
    openDelay = 100,
    closeDelay = 250,
    openOnHover = false,
    namespace = 'v0:menu',
  } = defineProps<MenuRootProps>()

  const model = defineModel<ID | null>({ default: null })

  const rootId = _id ?? useId()
  const defaultLayer = useId()
  const items = createRegistry<MenuItemInput, MenuItemTicket>()
  const activators = createRegistry<MenuActivatorInput, MenuActivatorTicket>()
  const parents = new Map<ID, ID | null>()
  const anchors = new Map<ID, MaybeRefOrGetter<Element | null | undefined>>()
  const returns = new Map<ID, MaybeRefOrGetter<Element | null | undefined>>()

  parents.set(defaultLayer, null)

  const path = shallowRef<ID[]>([])
  const openedByHover = shallowRef(false)
  const pendingFocus = shallowRef<ID | null>(null)
  const pendingEdge = shallowRef<MenuEdge>('first')
  const pendingItem = shallowRef<ID | null>(null)
  const disabledRef = toRef(() => disabled)
  const openOnHoverRef = toRef(() => openOnHover)

  let buffer = ''
  let scheduled: { id: ID, source: 'hover' | 'pointer' } | null = null

  function contentId (id: ID) {
    return `${rootId}-menu-${id}`
  }

  function triggerId (id: ID) {
    return `${rootId}-trigger-${id}`
  }

  function anchorName (id: ID) {
    return `--${contentId(id).replace(/[^a-zA-Z0-9_-]/g, '')}`
  }

  function branch (id: ID) {
    const chain: ID[] = []
    let current: ID | null = id
    const seen = new Set<ID>()

    while (!isNull(current) && !seen.has(current)) {
      seen.add(current)
      chain.push(current)
      const parent = parents.get(current)
      current = isNullOrUndefined(parent) ? null : parent
    }

    chain.reverse()
    return chain
  }

  function assign (ids: ID[]) {
    path.value = ids
    const next = ids[0] ?? null
    if (model.value !== next) model.value = next
  }

  function layerItems (layerId: ID) {
    return items.values().filter(ticket => ticket.layerId === layerId)
  }

  function enabledActivators () {
    return activators.values().filter(ticket => !toValue(ticket.disabled))
  }

  const openTimer = useTimer(() => {
    const job = scheduled
    scheduled = null
    if (isNull(job)) return
    reveal(job.id, job.source)
  }, { duration: () => openDelay })

  const closeTimer = useTimer(() => {
    dismiss()
  }, { duration: () => closeDelay })

  const typeTimer = useTimer(() => {
    buffer = ''
  }, { duration: 500 })

  function reveal (id: ID, source: MenuSource, edge: MenuEdge = 'first') {
    openTimer.stop()
    closeTimer.stop()
    scheduled = null

    buffer = ''
    typeTimer.stop()

    if (source === 'hover') openedByHover.value = true
    else if (source !== 'pointer') openedByHover.value = false

    if (source === 'hover') {
      pendingFocus.value = null
      pendingItem.value = null
    } else {
      pendingFocus.value = id
      pendingEdge.value = source === 'keyboard' ? edge : 'content'
      pendingItem.value = null
    }

    assign(branch(id))
  }

  function pop () {
    const ids = path.value
    if (ids.length < 2) return

    const closed = ids.at(-1)
    const next = ids.slice(0, -1)
    const parent = next.at(-1)
    const item = !isNullOrUndefined(parent) && !isNullOrUndefined(closed)
      ? layerItems(parent).find(ticket => ticket.submenuId === closed)
      : undefined

    buffer = ''
    typeTimer.stop()
    pendingFocus.value = parent ?? null
    pendingItem.value = item?.id ?? null
    pendingEdge.value = 'first'
    assign(next)
  }

  function dismiss (restore = true) {
    const top = path.value[0]
    const target = isNullOrUndefined(top) ? null : (returnOf(top) ?? anchorOf(top))
    openTimer.stop()
    closeTimer.stop()
    scheduled = null
    openedByHover.value = false
    pendingFocus.value = null
    pendingItem.value = null
    buffer = ''
    typeTimer.stop()
    assign([])
    if (!restore) return
    nextTick(() => {
      if (target instanceof HTMLElement) target.focus()
    })
  }

  function poke () {
    closeTimer.stop()
  }

  function cancel () {
    scheduled = null
    openTimer.stop()
  }

  function leave () {
    cancel()
    if (openedByHover.value && path.value.length > 0) closeTimer.start()
  }

  function schedule (id: ID, source: 'hover' | 'pointer') {
    closeTimer.stop()
    scheduled = { id, source }
    openTimer.start()
  }

  function activate (ticket: MenuItemTicket) {
    if (toValue(ticket.disabled) || disabledRef.value) return

    if (ticket.kind === 'submenu' && !isNullOrUndefined(ticket.submenuId)) {
      reveal(ticket.submenuId, 'click')
      return
    }

    if (ticket.kind === 'checkbox' || ticket.kind === 'radio') {
      ticket.onActivate?.()
      return
    }

    ticket.onActivate?.()
    dismiss()
  }

  function collapseTo (layerId: ID) {
    const index = path.value.indexOf(layerId)
    if (index === -1 || index === path.value.length - 1) return
    openTimer.stop()
    scheduled = null
    buffer = ''
    typeTimer.stop()
    assign(path.value.slice(0, index + 1))
  }

  function shift (direction: 1 | -1) {
    const list = enabledActivators()
    if (list.length < 2) return

    const current = path.value[0]
    let index = list.findIndex(ticket => ticket.layerId === current)
    if (index < 0) index = 0

    const next = list[(index + direction + list.length) % list.length]
    if (isNullOrUndefined(next) || next.layerId === current) return
    reveal(next.layerId, 'keyboard')
  }

  function typeahead (layerId: ID, key: string) {
    buffer = `${buffer}${key.toLowerCase()}`
    typeTimer.start()

    const list = layerItems(layerId).filter(ticket => !toValue(ticket.disabled))
    const match = list.find(ticket => ticket.label().trim().toLowerCase().startsWith(buffer))
    return match?.id
  }

  function claimFocus (layerId: ID) {
    if (pendingFocus.value !== layerId) return undefined
    const item = pendingItem.value
    pendingFocus.value = null
    pendingItem.value = null
    return item
  }

  function isTop (id: ID) {
    return isNull(parents.get(id) ?? null)
  }

  function isRtl (event: KeyboardEvent) {
    if (!IN_BROWSER) return false
    const el = event.currentTarget
    if (!(el instanceof HTMLElement)) return false
    return getComputedStyle(el).direction === 'rtl'
  }

  function onKeydown (layerId: ID, event: KeyboardEvent, roving: RovingFocusReturn) {
    event.stopPropagation()
    if (event.isComposing || disabledRef.value) return

    const rtl = isRtl(event)
    const pushKey = rtl ? 'ArrowLeft' : 'ArrowRight'
    const popKey = rtl ? 'ArrowRight' : 'ArrowLeft'
    const current = layerItems(layerId).find(ticket => ticket.id === roving.focusedId.value)

    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      dismiss()
      return
    }

    if (event.key === 'Tab') {
      dismiss(false)
      return
    }

    if (event.key === pushKey) {
      if (current?.kind === 'submenu' && !isNullOrUndefined(current.submenuId)) {
        event.preventDefault()
        reveal(current.submenuId, 'keyboard')
        return
      }

      if (isTop(layerId) && enabledActivators().length > 1) {
        event.preventDefault()
        shift(1)
        return
      }
    }

    if (event.key === popKey) {
      if (!isTop(layerId)) {
        event.preventDefault()
        pop()
        return
      }

      if (enabledActivators().length > 1) {
        event.preventDefault()
        shift(-1)
        return
      }
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (isNullOrUndefined(current)) return
      activate(current)
      return
    }

    if (isUndefined(roving.focusedId.value) && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault()
      if (event.key === 'ArrowDown') roving.first()
      else roving.last()
      return
    }

    roving.onKeydown(event)

    if (event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) return

    const match = typeahead(layerId, event.key)
    if (!isNullOrUndefined(match)) roving.focus(match)
  }

  function readElement (source: MaybeRefOrGetter<Element | null | undefined> | undefined) {
    if (isNullOrUndefined(source)) return null
    return toElement(toValue(source)) ?? null
  }

  function anchorOf (id: ID) {
    return readElement(anchors.get(id))
  }

  function returnOf (id: ID) {
    return readElement(returns.get(id))
  }

  function bindAnchor (id: ID, el: MaybeRefOrGetter<Element | null | undefined>) {
    anchors.set(id, el)
  }

  function unbindAnchor (id: ID, el: MaybeRefOrGetter<Element | null | undefined>) {
    if (anchors.get(id) === el) anchors.delete(id)
  }

  function bindReturn (id: ID, el: MaybeRefOrGetter<Element | null | undefined>) {
    if (isNullOrUndefined(el)) {
      returns.delete(id)
      return
    }
    returns.set(id, el)
  }

  function registerLayer (id: ID, parentId: ID | null) {
    parents.set(id, parentId)
  }

  function unregisterLayer (id: ID) {
    if (id !== defaultLayer) parents.delete(id)
    if (!path.value.includes(id)) return
    if (path.value[0] === id) dismiss(false)
    else assign(path.value.slice(0, path.value.indexOf(id)))
  }

  const context: MenuRootContext = {
    id: rootId,
    defaultLayer,
    disabled: disabledRef,
    openOnHover: openOnHoverRef,
    path,
    pendingFocus,
    pendingEdge,
    register: input => items.register(input),
    unregister: id => items.unregister(id),
    items: layerItems,
    registerActivator: input => activators.register(input),
    unregisterActivator: id => activators.unregister(id),
    activators: () => activators.values().slice(),
    registerLayer,
    unregisterLayer,
    parentOf: id => parents.get(id) ?? null,
    isTop,
    bindAnchor,
    unbindAnchor,
    bindReturn,
    anchor: anchorOf,
    anchorName,
    contentId,
    triggerId,
    hasActivator: id => activators.values().some(ticket => ticket.layerId === id),
    reveal,
    pop,
    dismiss,
    poke,
    cancel,
    leave,
    schedule,
    activate,
    collapseTo,
    shift,
    canShift: () => enabledActivators().length > 1,
    typeahead,
    claimFocus,
    onKeydown,
  }

  provideMenuRoot(namespace, context)

  watch(model, value => {
    const current = path.value[0] ?? null
    if (value === current) return

    if (isNull(value)) {
      dismiss(false)
      return
    }

    reveal(value, 'click')
  }, { immediate: true })

  const slotProps = toRef((): MenuRootSlotProps => ({
    isOpen: path.value.length > 0,
    layer: path.value[0] ?? null,
    dismiss,
  }))
</script>

<template>
  <Atom
    :as
    renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
