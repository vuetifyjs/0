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
  import { mergeProps, shallowRef, toRef, useAttrs, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ProgressContext, ProgressTicket } from '#v0/composables/createProgress'
  import type { ShallowRef } from 'vue'

  export interface ProgressRootContext extends ProgressContext {
    readonly name?: string
    labelId: ShallowRef<string | undefined>
  }

  export interface ProgressRootProps extends AtomProps {
    modelValue?: number | number[]
    min?: number
    max?: number
    name?: string
    namespace?: string
  }

  export interface ProgressRootSlotProps {
    total: number
    percent: number
    isIndeterminate: boolean
    segments: readonly ProgressTicket[]
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

  const progress = createProgress({ min, max, value: isNullOrUndefined(model.value) ? undefined : 0 })

  const managed = shallowRef<ProgressTicket[]>([])
  let syncing = false

  function sync () {
    const value = model.value

    if (isNullOrUndefined(value)) {
      for (const segment of managed.value) {
        progress.unregister(segment.id)
      }
      managed.value = []
      return
    }

    const values = isArray(value) ? value : [value]
    const current = managed.value

    if (values.length > current.length) {
      const added = [...current]
      for (let index = current.length; index < values.length; index++) {
        added.push(progress.register({ value: values[index] }))
      }
      managed.value = added
    }

    if (values.length < current.length) {
      const kept = current.slice(0, values.length)
      const removed = current.slice(values.length)
      for (const segment of removed) {
        progress.unregister(segment.id)
      }
      managed.value = kept
    }

    syncing = true
    for (const [index, v] of values.entries()) {
      if (managed.value[index]) {
        managed.value[index].value.value = v
      }
    }
    syncing = false
  }

  watch(() => model.value, sync, { immediate: true, deep: true })

  watch(
    () => managed.value.map(s => s.value.value),
    values => {
      if (syncing) return
      if (isNullOrUndefined(model.value)) return
      model.value = isArray(model.value) ? values : (values[0] ?? 0)
    },
  )

  const labelId = shallowRef<string | undefined>()

  const context: ProgressRootContext = {
    ...progress,
    name,
    labelId,
  }

  provideProgressRoot(namespace, context)

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
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>

  <ProgressHiddenInput v-if="name" />
</template>
