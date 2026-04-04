/**
 * @module ProgressRoot
 *
 * @remarks
 * Root component for progress bars. Creates progress context, provides it to
 * child components (Track, Fill, Buffer, Value, Label, HiddenInput),
 * bridges v-model to registry segments, and emits ARIA progressbar attributes.
 *
 * Supports both single-value (`v-model="50"`) and multi-segment
 * (`v-model="[30, 20]"`) progress. When no value is provided, the
 * progress bar enters an indeterminate state.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import ProgressHiddenInput from './ProgressHiddenInput.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createProgress } from '#v0/composables/createProgress'

  // Utilities
  import { isArray, isNullOrUndefined } from '#v0/utilities'
  import { onBeforeUnmount, shallowRef, toRef, triggerRef, useAttrs, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ProgressContext, ProgressSegment } from '#v0/composables/createProgress'
  import type { ShallowRef } from 'vue'

  export interface ProgressRootContext extends ProgressContext {
    /** Form field name */
    readonly name?: string
    /** ID of the associated label element, set by ProgressLabel */
    labelId: ShallowRef<string | undefined>
  }

  export interface ProgressRootProps extends AtomProps {
    /** Current progress value or array of segment values */
    modelValue?: number | number[]
    /** Minimum value of the range */
    min?: number
    /** Maximum value of the range */
    max?: number
    /** Form field name — triggers hidden input */
    name?: string
    /** Namespace for context provision */
    namespace?: string
  }

  export interface ProgressRootSlotProps {
    /** Sum of all segment values, clamped to [min, max] */
    total: number
    /** Overall progress as a percentage of the range */
    percent: number
    /** Whether the progress state is indeterminate */
    isIndeterminate: boolean
    /** Registered progress segments */
    segments: ProgressSegment[]
    /** Pre-computed ARIA attributes for binding */
    attrs: {
      'role': 'progressbar'
      'aria-valuenow': number | undefined
      'aria-valuemin': number
      'aria-valuemax': number
      'aria-valuetext': string | undefined
      'aria-labelledby': string | undefined
      'aria-busy': true | undefined
      'data-state': 'determinate' | 'indeterminate'
      'data-complete': true | undefined
    }
  }

  export const [useProgressRoot, provideProgressRoot] = createContext<ProgressRootContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'ProgressRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ProgressRootSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    min = 0,
    max = 100,
    name,
    namespace = 'v0:progress:root',
  } = defineProps<ProgressRootProps>()

  const model = defineModel<number | number[]>()

  const progress = createProgress({ min, max })

  // ── v-model ↔ segment bridge ──────────────────────────────────
  const managed = shallowRef<ProgressSegment[]>([])
  let syncing = false

  function sync () {
    const value = model.value

    if (isNullOrUndefined(value)) {
      // Indeterminate — remove all managed segments
      for (const segment of managed.value) {
        segment.unregister()
      }
      managed.value = []
      triggerRef(managed)
      return
    }

    const values = isArray(value) ? value : [value]
    const current = managed.value

    // Add segments if needed
    if (values.length > current.length) {
      const added = [...current]
      for (let index = current.length; index < values.length; index++) {
        added.push(progress.register({ value: values[index] }))
      }
      managed.value = added
      triggerRef(managed)
    }

    // Remove segments if needed
    if (values.length < current.length) {
      const kept = current.slice(0, values.length)
      const removed = current.slice(values.length)
      for (const segment of removed) {
        segment.unregister()
      }
      managed.value = kept
      triggerRef(managed)
    }

    // Update values
    syncing = true
    for (const [index, value_] of values.entries()) {
      if (managed.value[index]) {
        managed.value[index].value.value = value_
      }
    }
    syncing = false
  }

  // Watch model → segments
  watch(() => model.value, sync, { immediate: true, deep: true })

  // Watch segments → model (preserve number vs number[] shape)
  watch(
    () => managed.value.map(s => s.value.value),
    values => {
      if (syncing) return
      if (isNullOrUndefined(model.value)) return
      model.value = isArray(model.value) ? values : (values[0] ?? 0)
    },
  )

  // Cleanup on unmount
  onBeforeUnmount(() => {
    for (const segment of managed.value) {
      segment.unregister()
    }
    managed.value = []
  })

  // ── Label ID (set by ProgressLabel) ──────────────────────────
  const labelId = shallowRef<string | undefined>()

  // ── Context provision ─────────────────────────────────────────
  const context: ProgressRootContext = {
    ...progress,
    name,
    labelId,
  }

  provideProgressRoot(namespace, context)

  // ── Slot props with ARIA ──────────────────────────────────────
  const slotProps = toRef((): ProgressRootSlotProps => {
    const indeterminate = progress.isIndeterminate.value
    const total = progress.total.value
    const percent = progress.percent.value

    return {
      total,
      percent,
      isIndeterminate: indeterminate,
      segments: progress.segments.value,
      attrs: {
        'role': 'progressbar',
        'aria-valuenow': indeterminate ? undefined : total,
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuetext': indeterminate ? undefined : `${Math.round(percent)}%`,
        'aria-labelledby': labelId.value,
        'aria-busy': indeterminate ? true : undefined,
        'data-state': indeterminate ? 'indeterminate' : 'determinate',
        'data-complete': total >= max ? true : undefined,
      },
    }
  })
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>

  <ProgressHiddenInput v-if="name" />
</template>
