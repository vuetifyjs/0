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
  import { useNumberFieldRoot } from './NumberFieldRoot.vue'

  // Utilities
  import { toRef, useAttrs } from 'vue'

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

  const isDisabled = toRef(() => {
    return root.isDisabled.value || root.isReadonly.value || !root.canDecrement.value
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

    root.decrement()

    delayTimer = setTimeout(() => {
      spinTimer = setInterval(() => {
        root.decrement()
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
      'aria-label': 'Decrement',
      'disabled': disabled || undefined,
      'data-disabled': disabled ? true : undefined,
    }
  })

  const slotProps = toRef((): NumberFieldDecrementSlotProps => ({
    isDisabled: isDisabled.value,
    attrs: controlAttrs.value,
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...controlAttrs }"
    :as
    :renderless
    @blur="onBlur"
    @pointercancel="onPointercancel"
    @pointerdown="onPointerdown"
    @pointerup="onPointerup"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
