/**
 * @module NumberFieldIncrement
 *
 * @remarks
 * Increment button for number fields with spin-on-hold behavior.
 * On pointerdown, increments immediately then starts repeating
 * after spinDelay at spinRate interval. Must be used within a
 * NumberField.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useNumberFieldRoot } from './NumberFieldRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface NumberFieldIncrementProps extends AtomProps {
    /** Namespace for connecting to parent NumberField.Root */
    namespace?: string
  }

  export interface NumberFieldIncrementSlotProps {
    /** Whether the button is disabled */
    isDisabled: boolean
    /** Pre-computed attributes for the button */
    attrs: Record<string, unknown>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'NumberFieldIncrement', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: NumberFieldIncrementSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:number-field:root',
  } = defineProps<NumberFieldIncrementProps>()

  const root = useNumberFieldRoot(namespace)

  const isDisabled = toRef(() => {
    return root.isDisabled.value || root.isReadonly.value || !root.canIncrement.value
  })

  let delayTimer: ReturnType<typeof setTimeout> | undefined
  let spinTimer: ReturnType<typeof setInterval> | undefined

  function clearTimers () {
    if (delayTimer) {
      clearTimeout(delayTimer)
      delayTimer = undefined
    }
    if (spinTimer) {
      clearInterval(spinTimer)
      spinTimer = undefined
    }
  }

  function onPointerdown (e: PointerEvent) {
    if (isDisabled.value) return
    if (e.button !== 0) return
    e.preventDefault()

    root.increment()

    delayTimer = setTimeout(() => {
      spinTimer = setInterval(() => {
        root.increment()
      }, root.spinRate)
    }, root.spinDelay)
  }

  function onPointerup () {
    clearTimers()
  }

  function onPointercancel () {
    clearTimers()
  }

  function onBlur () {
    clearTimers()
  }

  const controlAttrs = toRef((): Record<string, unknown> => {
    const disabled = isDisabled.value

    return {
      'type': 'button',
      'tabindex': -1,
      'aria-label': 'Increment',
      'disabled': disabled || undefined,
      'data-disabled': disabled ? true : undefined,
      onBlur,
      onPointercancel,
      onPointerdown,
      onPointerup,
    }
  })

  const slotProps = toRef((): NumberFieldIncrementSlotProps => ({
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
