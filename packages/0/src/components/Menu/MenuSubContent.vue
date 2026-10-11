/**
 * @module MenuSubContent
 *
 * @see https://0.vuetifyjs.com/components/disclosure/menu
 *
 * @remarks
 * Nested menu rendered inside its parent menu so a light dismiss of the
 * parent still covers it. Anchors beside Menu.SubActivator, on the inline end,
 * aligned to the block start of that item.
 *
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { provideMenuLayer, useMenuLayer, useMenuRoot } from './MenuRoot.vue'
  import { useMenuSub } from './MenuSub.vue'

  // Composables
  import { useLazy } from '#v0/composables/useLazy'
  import { usePopover } from '#v0/composables/usePopover'
  import { useRovingFocus } from '#v0/composables/useRovingFocus'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { isNull, isUndefined } from '#v0/utilities'
  import { mergeProps, nextTick, onBeforeUnmount, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  export interface MenuSubContentProps extends AtomProps {
    /** Render items before the first open */
    eager?: boolean
    /** CSS position-area for the submenu. @default 'inline-end span-block-start' */
    positionArea?: string
    /** CSS position-try fallbacks. @default 'flip-inline' */
    positionTry?: string
    /** Injection key of the owning menu. @default 'v0:menu' */
    namespace?: string
  }

  export interface MenuSubContentSlotProps {
    isOpen: boolean
    attrs: {
      'id': string
      'popover': ''
      'role': 'menu'
      'aria-orientation': 'vertical'
      'aria-labelledby': string
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
  defineOptions({ name: 'MenuSubContent', inheritAttrs: false })

  const attrs = useAttrs()
  const atomRef = useTemplateRef<AtomExpose>('atom')

  defineSlots<{
    default: (props: MenuSubContentSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless = false,
    eager = false,
    positionArea,
    positionTry,
    namespace = 'v0:menu',
  } = defineProps<MenuSubContentProps>()

  const menu = useMenuRoot(namespace)
  const parent = useMenuLayer()
  const sub = useMenuSub()
  const isOpen = shallowRef(false)
  let suppress = false

  menu.registerLayer(sub.id, parent.id)

  onBeforeUnmount(() => {
    menu.unregisterLayer(sub.id)
  })

  const popover = usePopover({
    id: menu.contentId(sub.id),
    isOpen,
    positionArea: () => positionArea ?? 'inline-end span-block-start',
    positionTry: () => positionTry ?? 'flip-inline',
  })

  const el = toRef(() => toElement(atomRef.value?.element) ?? null)
  popover.attach(() => (el.value instanceof HTMLElement ? el.value : null))
  popover.attachAnchor(() => menu.anchor(sub.id))

  const { hasContent } = useLazy(isOpen, { eager: () => eager })

  const roving = useRovingFocus(() => {
    return menu.items(sub.id).map(ticket => ({
      id: ticket.id,
      disabled: ticket.disabled,
      el: ticket.el,
    }))
  }, { orientation: 'vertical', circular: true })

  provideMenuLayer({ id: sub.id, roving })

  watch(() => menu.path.value.includes(sub.id), open => {
    if (isOpen.value === open) return
    suppress = true
    isOpen.value = open
    nextTick(() => {
      suppress = false
    })
  }, { immediate: true })

  watch(isOpen, open => {
    if (suppress || open) return
    if (menu.path.value.at(-1) !== sub.id) return
    menu.pop()
  })

  watch(() => isOpen.value && menu.pendingFocus.value === sub.id, ready => {
    if (!ready) return
    const item = menu.claimFocus(sub.id)
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

  const slotProps = toRef((): MenuSubContentSlotProps => ({
    isOpen: isOpen.value,
    attrs: {
      'id': menu.contentId(sub.id),
      'popover': '',
      'role': 'menu',
      'aria-orientation': 'vertical',
      'aria-labelledby': menu.triggerId(sub.id),
      'tabindex': -1,
      'data-open': isOpen.value || undefined,
      'data-orientation': 'vertical',
      'style': popover.contentStyles.value,
      'onKeydown': event => menu.onKeydown(sub.id, event, roving),
      'onPointerenter': () => menu.poke(),
      'onPointerleave': () => menu.cancel(),
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
    <slot
      v-if="hasContent"
      v-bind="slotProps"
    />
  </Atom>
</template>
