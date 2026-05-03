/**
 * @module NumberFieldDecrement
 *
 * @remarks
 * Decrement button for number fields with spin-on-hold behavior.
 * On pointerdown, decrements immediately then starts repeating
 * after spinDelay at spinRate interval. Must be used within a
 * NumberField.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useNumberFieldRoot } from './NumberFieldRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'
  import { useTimer } from '#v0/composables/useTimer'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface NumberFieldDecrementProps extends AtomProps {
    /** Namespace for connecting to parent NumberField.Root */
    namespace?: string
  }

  export interface NumberFieldDecrementSlotProps {
    /** Whether the button is disabled */
    isDisabled: boolean
    /** Pre-computed attributes for the button */
    attrs: Record<string, unknown>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'NumberFieldDecrement', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: NumberFieldDecrementSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:number-field:root',
  } = defineProps<NumberFieldDecrementProps>()

  const root = useNumberFieldRoot(namespace)
  const locale = useLocale()

  const isDisabled = toRef(() => {
    return root.isDisabled.value || root.isReadonly.value || !root.canDecrement.value
  })

  const spin = useTimer(() => root.decrement(), { duration: root.spinRate, repeat: true })
  const delay = useTimer(() => spin.start(), { duration: root.spinDelay })

  function stop () {
    delay.stop()
    spin.stop()
  }

  function onPointerdown (e: PointerEvent) {
    if (isDisabled.value) return
    if (e.button !== 0) return
    e.preventDefault()

    root.decrement()
    delay.start()
  }

  function onPointerup () {
    stop()
  }

  function onPointercancel () {
    stop()
  }

  function onBlur () {
    stop()
  }

  const controlAttrs = toRef((): Record<string, unknown> => {
    const disabled = isDisabled.value

    return {
      'type': 'button',
      'tabindex': -1,
      'aria-label': locale.t('NumberField.decrement'),
      'disabled': disabled || undefined,
      'data-disabled': disabled ? true : undefined,
      onBlur,
      onPointercancel,
      onPointerdown,
      onPointerup,
    }
  })

  const slotProps = toRef((): NumberFieldDecrementSlotProps => ({
    isDisabled: isDisabled.value,
    attrs: controlAttrs.value,
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, controlAttrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
