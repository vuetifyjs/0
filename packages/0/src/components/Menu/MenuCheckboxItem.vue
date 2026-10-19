/**
 * @module MenuCheckboxItem
 *
 * @see https://0.vuetifyjs.com/components/disclosure/menu
 *
 * @remarks
 * A menu item with a boolean checked state. Activating it toggles the
 * checkbox and leaves the menu open. `v-model:checked` still updates when
 * the item is disabled.
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

  export interface MenuCheckboxItemProps extends AtomProps {
    /** Stable id. Auto-generated when omitted. */
    id?: ID
    /** Typeahead text. Falls back to the item's text. */
    label?: string
    /** Disables the gesture. The checked model can still be written. */
    disabled?: MaybeRefOrGetter<boolean>
    /** Injection key of the owning menu. @default 'v0:menu' */
    namespace?: string
  }

  export interface MenuCheckboxItemSlotProps {
    isChecked: boolean
    isDisabled: boolean
    attrs: {
      'role': 'menuitemcheckbox'
      'aria-checked': boolean
      'tabindex': number
      'aria-disabled': boolean
      'data-state': 'checked' | 'unchecked'
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
  defineOptions({ name: 'MenuCheckboxItem', inheritAttrs: false })

  const attrs = useAttrs()
  const atomRef = useTemplateRef<AtomExpose>('atom')

  defineSlots<{
    default: (props: MenuCheckboxItemSlotProps) => any
  }>()

  defineEmits<{
    'update:checked': [value: boolean]
  }>()

  const {
    as = 'div',
    renderless = false,
    id,
    label,
    disabled = false,
    namespace = 'v0:menu',
  } = defineProps<MenuCheckboxItemProps>()

  const checked = defineModel<boolean>('checked', { default: false })

  const menu = useMenuRoot(namespace)
  const layer = useMenuLayer()
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  const ticket = menu.register({
    id,
    layerId: layer.id,
    kind: 'checkbox',
    label: () => {
      if (isString(label) && label.length > 0) return label
      return el.value?.textContent?.trim() ?? ''
    },
    disabled: () => Boolean(toValue(disabled)) || menu.disabled.value,
    el,
    onActivate: () => {
      checked.value = !checked.value
    },
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

  const slotProps = toRef((): MenuCheckboxItemSlotProps => ({
    isChecked: checked.value,
    isDisabled: isDisabled.value,
    attrs: {
      'role': 'menuitemcheckbox',
      'aria-checked': checked.value,
      'tabindex': isDisabled.value ? -1 : (layer.roving.isTabbable(ticket.id) ? 0 : -1),
      'aria-disabled': isDisabled.value,
      'data-state': checked.value ? 'checked' : 'unchecked',
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
