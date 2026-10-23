<script lang="ts">
  // Framework
  import { isUndefined, useId, useLocale, useMutationObserver, useRovingFocus } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Toolbar } from './Md1Toolbar.vue'

  // Utilities
  import { onMounted, shallowRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { RovingItem } from '@vuetify/v0'

  export interface Md1ToolbarActionsProps {
    /** Accessible name of the toolbar. Defaults to the locale's "Actions". */
    ariaLabel?: string
  }

  /** The controls the toolbar roves over: its children, or one wrapper below (a tooltip or menu host). Popover sheets are not actions. */
  const SELECTOR = [
    ':scope > :is(button, a[href], [role="button"])',
    ':scope > :not([popover]) > :is(button, a[href], [role="button"])',
  ].join(', ')

  const INERT = ':disabled, [aria-disabled="true"]'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ToolbarActions' })

  defineSlots<{
    /** Icon buttons (Md1Button with icon), the overflow Md1Menu last. */
    default?: () => any
  }>()

  const { ariaLabel } = defineProps<Md1ToolbarActionsProps>()

  const context = useMd1Toolbar()

  orphan('Md1ToolbarActions', context)

  const locale = useLocale()

  const el = useTemplateRef<HTMLElement>('el')
  const elements = shallowRef<HTMLElement[]>([])

  // Element identity is the action's id: the children are the consumer's own
  // components, so the toolbar keys them by node rather than registering them.
  const base = useId()
  const ids = new WeakMap<HTMLElement, string>()
  let count = 0

  function key (node: HTMLElement): string {
    let id = ids.get(node)

    if (isUndefined(id)) {
      id = `${base}-${count++}`
      ids.set(node, id)
    }

    return id
  }

  function items (): RovingItem[] {
    return elements.value.map(node => ({
      id: key(node),
      el: node,
      disabled: () => node.matches(INERT),
    }))
  }

  const roving = useRovingFocus(items, { orientation: 'horizontal' })

  // One tab stop: the remembered action, else the first enabled one.
  function apply () {
    const focused = elements.value.find(node => key(node) === roving.focusedId.value)

    if (focused?.matches(INERT)) roving.focusedId.value = undefined

    for (const node of elements.value) {
      node.tabIndex = !node.matches(INERT) && roving.isTabbable(key(node)) ? 0 : -1
    }
  }

  function refresh () {
    elements.value = el.value ? [...el.value.querySelectorAll<HTMLElement>(SELECTOR)] : []
    apply()
  }

  onMounted(refresh)

  useMutationObserver(el, refresh, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['disabled', 'aria-disabled'],
  })

  watch(roving.focusedId, apply)

  function find (target: EventTarget | null): HTMLElement | undefined {
    return elements.value.find(node => node === target)
  }

  // Arrow keys only move between the actions themselves: an open menu sheet
  // inside the toolbar keeps its own keyboard model.
  function onKeydown (event: KeyboardEvent) {
    if (!find(event.target)) return

    roving.onKeydown(event)
  }

  function onFocusin (event: FocusEvent) {
    const node = find(event.target)

    if (node) roving.focusedId.value = key(node)
  }
</script>

<template>
  <div
    ref="el"
    :aria-label="ariaLabel ?? locale.ti('Md1.actions') ?? 'Actions'"
    class="md1-toolbar__actions"
    role="toolbar"
    @focusin="onFocusin"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>

<style>
  /* Actions cluster at the end of the row; Md1Button icon children sit at a 48 dp pitch. */
  .md1-toolbar__actions {
    display: flex;
    flex: none;
    align-items: center;
    margin-inline-start: auto;
  }
</style>
