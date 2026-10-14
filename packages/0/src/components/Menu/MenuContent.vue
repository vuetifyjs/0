/**
 * @module MenuContent
 *
 * @see https://0.vuetifyjs.com/components/disclosure/menu
 *
 * @remarks
 * Popup layer for one menu. Items inside share a vertical roving tabindex.
 * The layer stays mounted; its items render once the layer is open unless
 * `eager` is set.
 *
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { provideMenuLayer, useMenuRoot } from './MenuRoot.vue'

  // Composables
  import { useLazy } from '#v0/composables/useLazy'
  import { useLocale } from '#v0/composables/useLocale'
  import { usePopover } from '#v0/composables/usePopover'
  import { useRovingFocus } from '#v0/composables/useRovingFocus'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { isNull, isUndefined } from '#v0/utilities'
  import { mergeProps, nextTick, onBeforeUnmount, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

  export interface MenuContentProps extends AtomProps {
    /** Layer this popup belongs to. Omit it to use Menu.Root's `value`. */
    value?: ID
    /** Render items before the first open */
    eager?: boolean
    /** CSS position-area for the popup. @default 'bottom' */
    positionArea?: string
    /** CSS position-try fallbacks */
    positionTry?: string
    /** Injection key of the owning menu. @default 'v0:menu' */
    namespace?: string
  }

  export interface MenuContentSlotProps {
    /** Whether this layer is open */
    isOpen: boolean
    /** Attributes for the menu element */
    attrs: {
      'id': string
      'popover': ''
      'role': 'menu'
      'aria-orientation': 'vertical'
      'aria-labelledby': string | undefined
      'aria-label': string | undefined
      'tabindex': -1
      'data-open': true | undefined
      'data-orientation': 'vertical'
      'style': Record<string, string>
      'onKeydown': (event: KeyboardEvent) => void
      'onPointerenter': () => void
      'onPointerleave': () => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'MenuContent', inheritAttrs: false })

  const attrs = useAttrs()
  const atomRef = useTemplateRef<AtomExpose>('atom')

  defineSlots<{
    default: (props: MenuContentSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless = false,
    value,
    eager = false,
    positionArea,
    positionTry,
    namespace = 'v0:menu',
  } = defineProps<MenuContentProps>()

  const menu = useMenuRoot(namespace)
  const locale = useLocale()
  const layerId = value ?? menu.defaultLayer
  const isOpen = shallowRef(false)
  let suppress = false

  const ticket = menu.content.upsert(layerId, { parentId: null })

  onBeforeUnmount(() => {
    menu.content.unregister(ticket.id)
  })

  const popover = usePopover({
    id: menu.contentId(layerId),
    isOpen,
    positionArea: () => positionArea,
    positionTry: () => positionTry,
  })

  const el = toRef(() => toElement(atomRef.value?.element) ?? null)
  popover.attach(() => (el.value instanceof HTMLElement ? el.value : null))
  popover.attachAnchor(() => menu.anchor(layerId))

  const { hasContent } = useLazy(isOpen, { eager: () => eager })

  const roving = useRovingFocus(() => {
    return menu.items(layerId).map(ticket => ({
      id: ticket.id,
      disabled: ticket.disabled,
      el: ticket.el,
    }))
  }, { orientation: 'vertical', circular: true })

  provideMenuLayer({ id: layerId, roving })

  watch(() => menu.path.value.includes(layerId), open => {
    if (isOpen.value === open) return
    suppress = true
    isOpen.value = open
    nextTick(() => {
      suppress = false
    })
  }, { immediate: true })

  watch(isOpen, open => {
    if (suppress || open) return
    if (menu.path.value.includes(layerId)) menu.dismiss()
  })

  watch(() => isOpen.value && menu.pendingFocus.value === layerId, ready => {
    if (!ready) return
    const item = menu.claimFocus(layerId)
    const edge = menu.pendingEdge.value
    nextTick(() => {
      if (!isNull(item) && !isUndefined(item)) {
        roving.focus(item)
        return
      }
      if (edge === 'last') {
        roving.last()
        return
      }
      if (edge === 'first') {
        roving.first()
        return
      }
      roving.focusedId.value = undefined
      if (el.value instanceof HTMLElement) el.value.focus()
    })
  }, { immediate: true })

  const slotProps = toRef((): MenuContentSlotProps => {
    const labelled = menu.hasActivator(layerId)

    return {
      isOpen: isOpen.value,
      attrs: {
        'id': menu.contentId(layerId),
        'popover': '',
        'role': 'menu',
        'aria-orientation': 'vertical',
        'aria-labelledby': labelled ? menu.triggerId(layerId) : undefined,
        'aria-label': labelled ? undefined : (locale.ti('Menu.label') ?? 'Menu'),
        'tabindex': -1,
        'data-open': isOpen.value || undefined,
        'data-orientation': 'vertical',
        'style': popover.contentStyles.value,
        'onKeydown': event => menu.onKeydown(layerId, event, roving),
        'onPointerenter': () => menu.poke(),
        'onPointerleave': () => menu.leave(),
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
    <slot
      v-if="hasContent"
      v-bind="slotProps"
    />
  </Atom>
</template>
