/**
 * @module TreeviewList
 *
 * @see https://0.vuetifyjs.com/components/disclosure/treeview
 *
 * @remarks
 * Top-level list container for the treeview. Renders a ul with role="tree".
 * Sets aria-multiselectable based on prop (should match TreeviewRoot's multiple).
 * Creates and provides useRovingFocus for keyboard navigation of tree items.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTreeviewRoot } from './TreeviewRoot.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { useRovingFocus } from '#v0/composables/useRovingFocus'

  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { isNullOrUndefined } from '#v0/utilities'
  import { toRef, toValue } from 'vue'

  // Types
  import type { RovingFocusReturn } from '#v0/composables/useRovingFocus'
  import type { ID } from '#v0/types'
  import type { TreeviewListProps, TreeviewListSlotProps } from './types'

  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]'

  export type TreeviewListContext = RovingFocusReturn

  export const [useTreeviewList, provideTreeviewList] = createContext<TreeviewListContext | null>({ suffix: 'list' })
</script>

<script setup lang="ts">
  defineOptions({ name: 'TreeviewList' })

  defineSlots<{
    default: (props: TreeviewListSlotProps) => any
  }>()

  const {
    as = 'ul',
    renderless,
    multiselectable,
    label,
    namespace = 'v0:treeview',
  } = defineProps<TreeviewListProps>()

  const nested = useTreeviewRoot(namespace)

  const roving = useRovingFocus(
    () => nested.visibleItems().map(item => ({
      id: item.id,
      el: item.el,
      disabled: toRef(() => toValue(item.disabled)),
    })),
    { orientation: 'vertical' },
  )

  provideTreeviewList(namespace, roving)

  // Sync focusedId when a treeitem receives focus via tab or click.
  // Without this, the first ArrowDown "wastes" a press by re-focusing
  // the already-focused item since focusedId starts as undefined.
  function onFocusin (e: FocusEvent) {
    const target = e.target as HTMLElement
    if (target.getAttribute('role') !== 'treeitem') return
    // Find the matching item and sync focusedId (without calling el.focus)
    const visible = nested.visibleItems()
    const match = visible.find(item => toValue(item.el) === target)
    if (match && roving.focusedId.value !== match.id) {
      roving.focusedId.value = match.id
    }
  }

  // Check if a node is expandable. Uses aria-expanded (set by TreeviewItem
  // based on hasContent) for nodes with Content-wrapped children, and falls
  // back to !isLeaf for nodes with always-visible children (no Content).
  function expandable (ticket: ReturnType<typeof nested.get>): boolean {
    /* v8 ignore next -- defensive: callers always pass a registered ticket */
    if (!ticket) return false
    const el = toValue(ticket.el) as HTMLElement | undefined
    return (el?.hasAttribute('aria-expanded') ?? false) || !toValue(ticket.isLeaf)
  }

  function isRtl (e: KeyboardEvent): boolean {
    /* v8 ignore next -- IN_BROWSER always true in happy-dom test env */
    if (!IN_BROWSER) return false
    const el = e.currentTarget as HTMLElement | null
    /* v8 ignore next -- defensive: keydown handlers always have a currentTarget */
    return el ? getComputedStyle(el).direction === 'rtl' : false
  }

  function openOrChild (ticket: NonNullable<ReturnType<typeof nested.get>>) {
    if (expandable(ticket) && !toValue(ticket.isOpen)) {
      nested.open(ticket.id)
      /* v8 ignore next 6 -- already-open + has-children path requires DOM-state interaction not exercised in happy-dom */
    } else if (toValue(ticket.isOpen)) {
      const childIds = nested.children.get(ticket.id)
      if (childIds?.length) {
        roving.focus(childIds[0]!)
      }
    }
  }

  function closeOrParent (ticket: NonNullable<ReturnType<typeof nested.get>>) {
    if (toValue(ticket.isOpen) && expandable(ticket)) {
      nested.close(ticket.id)
    } else if (!isNullOrUndefined(ticket.parentId)) {
      roving.focus(ticket.parentId)
    }
  }

  function focusableChildren (el: HTMLElement): HTMLElement[] {
    return Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE))
      .filter(child =>
        child.getAttribute('tabindex') !== '-1'
        && child.getAttribute('aria-disabled') !== 'true'
        && child.closest('[role="treeitem"]') === el,
      )
  }

  function nextItemId (id: ID | undefined): ID | undefined {
    if (isNullOrUndefined(id)) return undefined
    const visible = nested.visibleItems()
    const index = visible.findIndex(item => item.id === id)
    return index === -1 ? undefined : visible.slice(index + 1).find(item => !toValue(item.disabled))?.id
  }

  function onKeydown (e: KeyboardEvent) {
    const target = e.target as HTMLElement
    const itemEl = target.closest<HTMLElement>('[role="treeitem"]')
    const onItem = target === e.currentTarget || target.getAttribute('role') === 'treeitem'

    if (e.key === 'Tab') {
      if (!itemEl) return
      const controls = focusableChildren(itemEl)
      if (controls.length === 0) return
      if (!e.shiftKey && onItem) {
        e.preventDefault()
        controls[0]!.focus()
      } else if (!e.shiftKey && target === controls.at(-1)) {
        const source = nested.visibleItems().find(item => toValue(item.el) === itemEl)?.id
        const next = nextItemId(source)
        if (!isNullOrUndefined(next)) {
          e.preventDefault()
          roving.focus(next)
        }
      } else if (e.shiftKey && target === controls[0]) {
        e.preventDefault()
        itemEl.focus()
      }
      return
    }

    // When the event bubbles from a child that is NOT a treeitem (e.g. an
    // embedded switch or combobox inside a row), let that control handle its
    // own key events rather than intercepting them at the tree level.
    if (!onItem) return

    const id = roving.focusedId.value
    const ticket = isNullOrUndefined(id) ? undefined : nested.get(id)
    const rtl = isRtl(e)

    switch (e.key) {
      case 'ArrowUp': {
        e.preventDefault()
        roving.prev()
        break
      }
      case 'ArrowDown': {
        e.preventDefault()
        roving.next()
        break
      }
      case 'ArrowRight': {
        e.preventDefault()
        if (!ticket) break
        if (rtl) closeOrParent(ticket)
        else openOrChild(ticket)
        break
      }
      case 'ArrowLeft': {
        e.preventDefault()
        if (!ticket) break
        if (rtl) openOrChild(ticket)
        else closeOrParent(ticket)
        break
      }
      case 'Home': {
        e.preventDefault()
        roving.first()
        break
      }
      case 'End': {
        e.preventDefault()
        roving.last()
        break
      }
      case 'Enter': {
        e.preventDefault()
        if (ticket) {
          if (expandable(ticket)) {
            nested.flip(ticket.id)
          }
          nested.activate(ticket.id)
        }
        break
      }
      case ' ': {
        e.preventDefault()
        if (ticket) {
          nested.toggle(ticket.id)
        }
        break
      }
      case '*': {
        // Expand all siblings
        e.preventDefault()
        if (ticket) {
          const sibs = nested.siblings(ticket.id)
          for (const sibId of sibs) {
            if (expandable(nested.get(sibId))) {
              nested.open(sibId)
            }
          }
        }
        break
      }
    }
  }

  const slotProps = toRef((): TreeviewListSlotProps => ({
    attrs: {
      'role': 'tree',
      /* v8 ignore next -- nested.multiple fallback used when multiselectable prop is undefined */
      'aria-multiselectable': multiselectable ?? nested.multiple,
      'aria-label': label || undefined,
      onKeydown,
      onFocusin,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
