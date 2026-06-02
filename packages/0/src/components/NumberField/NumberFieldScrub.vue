/**
 * @module NumberFieldScrub
 *
 * @remarks
 * Click-and-drag scrub control for number fields. Uses Pointer Lock API
 * to allow unbounded horizontal dragging to adjust the value. Shows
 * ew-resize cursor on hover. Must be used within a NumberField.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useNumberFieldRoot } from './NumberFieldRoot.vue'

  // Composables
  import { useRaf } from '#v0/composables/useRaf'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface NumberFieldScrubProps extends AtomProps {
    /** Namespace for connecting to parent NumberField.Root */
    namespace?: string
    /** Pixels of movement per step (default: 1) */
    sensitivity?: number
  }

  export interface NumberFieldScrubSlotProps {
    /** Pre-computed attributes for the scrub element */
    attrs: {
      'style': { cursor: string }
      'data-disabled': true | undefined
      'data-readonly': true | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'NumberFieldScrub', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: NumberFieldScrubSlotProps) => any
  }>()

  const {
    as = 'label',
    renderless,
    namespace = 'v0:number-field:root',
    sensitivity = 1,
  } = defineProps<NumberFieldScrubProps>()

  const root = useNumberFieldRoot(namespace)

  let accumulator = 0
  let locked = false

  const raf = useRaf(() => {
    const steps = Math.trunc(accumulator / sensitivity)
    if (steps === 0) return

    accumulator -= steps * sensitivity

    if (steps > 0) {
      root.increment(steps)
    } else {
      root.decrement(-steps)
    }
  })

  function onPointermove (e: PointerEvent) {
    if (!locked) return
    if (root.isDisabled.value || root.isReadonly.value) return

    accumulator += e.movementX
    raf()
  }

  function onPointerdown (e: PointerEvent) {
    if (root.isDisabled.value || root.isReadonly.value) return
    if (e.button !== 0) return

    const target = e.currentTarget as HTMLElement
    target.requestPointerLock()
    locked = true
    accumulator = 0
  }

  function onPointerup () {
    if (!locked) return
    locked = false
    raf.cancel()
    document.exitPointerLock()
  }

  const scrubAttrs = toRef((): Record<string, unknown> => ({
    'style': { cursor: 'ew-resize' },
    'data-disabled': root.isDisabled.value ? true : undefined,
    'data-readonly': root.isReadonly.value ? true : undefined,
    onPointerdown,
    onPointermove,
    onPointerup,
  }))

  const slotProps = toRef((): NumberFieldScrubSlotProps => ({
    attrs: {
      'style': { cursor: 'ew-resize' },
      'data-disabled': root.isDisabled.value ? true : undefined,
      'data-readonly': root.isReadonly.value ? true : undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, scrubAttrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
