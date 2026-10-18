/**
 * @module MenuRadioItem
 *
 * @see https://0.vuetifyjs.com/components/disclosure/menu
 *
 * @remarks
 * One option in a Menu.RadioGroup. Activating it selects this value and
 * leaves the menu open.
 *
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useMenuRadio } from './MenuRadioGroup.vue'
  import { useMenuLayer, useMenuRoot } from './MenuRoot.vue'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { isArray, isFunction, isString } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, toValue, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { MaybeRefOrGetter } from 'vue'

  export interface MenuRadioItemProps extends AtomProps {
    /** Value written to the group model when this item is selected */
    value: unknown
    /** Stable id. Auto-generated when omitted. */
    id?: ID
    /** Typeahead text. Falls back to the item's text. */
    label?: string
    /** Disables the gesture. The group model can still be written. */
    disabled?: MaybeRefOrGetter<boolean>
    /** Injection key of the owning menu. @default 'v0:menu' */
    namespace?: string
  }

  export interface MenuRadioItemSlotProps {
    isChecked: boolean
    isDisabled: boolean
    attrs: {
      'role': 'menuitemradio'
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
  defineOptions({ name: 'MenuRadioItem', inheritAttrs: false })

  const attrs = useAttrs()
  const atomRef = useTemplateRef<AtomExpose>('atom')

  defineSlots<{
    default: (props: MenuRadioItemSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless = false,
    value,
    id,
    label,
    disabled = false,
    namespace = 'v0:menu',
  } = defineProps<MenuRadioItemProps>()

  const menu = useMenuRoot(namespace)
  const layer = useMenuLayer()
  const group = useMenuRadio()
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  const selection = group.single.register({
    id,
    value,
    disabled: () => Boolean(toValue(disabled)) || group.disabled.value || menu.disabled.value,
  })

  const ticket = menu.register({
    layerId: layer.id,
    kind: 'radio',
    label: () => {
      if (isString(label) && label.length > 0) return label
      return el.value?.textContent?.trim() ?? ''
    },
    disabled: () => Boolean(toValue(selection.disabled)),
    el,
    onActivate: () => {
      selection.select()
    },
  })

  onBeforeUnmount(() => {
    menu.unregister(ticket.id)
    selection.unregister()
  })

  const isDisabled = toRef(() => Boolean(toValue(ticket.disabled)))
  const isChecked = toRef(() => selection.isSelected.value)
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
    menu.collapseTo(layer.id)
    layer.roving.focus(ticket.id)
  }

  function onFocus () {
    layer.roving.focusedId.value = ticket.id
  }

  const slotProps = toRef((): MenuRadioItemSlotProps => ({
    isChecked: isChecked.value,
    isDisabled: isDisabled.value,
    attrs: {
      'role': 'menuitemradio',
      'aria-checked': isChecked.value,
      'tabindex': isDisabled.value ? -1 : (layer.roving.isTabbable(ticket.id) ? 0 : -1),
      'aria-disabled': isDisabled.value,
      'data-state': isChecked.value ? 'checked' : 'unchecked',
      'data-disabled': isDisabled.value || undefined,
      'data-highlighted': isHighlighted.value || undefined,
      'onClick': onClick,
      'onPointerenter': onPointerenter,
      'onPointerleave': () => menu.cancel(),
      'onFocus': onFocus,
    },
  }))

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
