/**
 * @module ProgressRoot
 *
 * @remarks
 * Root component for progress bars. Creates progress context, provides it to
 * child components, bridges v-model via useProxyModel, and emits ARIA
 * progressbar attributes.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import ProgressHiddenInput from './ProgressHiddenInput.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createProgress } from '#v0/composables/createProgress'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { isArray, isNullOrUndefined, isUndefined } from '#v0/utilities'
  import { computed, mergeProps, shallowRef, toRef, useAttrs } from 'vue'

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
  const scalar = !isArray(model.value) && !isUndefined(model.value) && !isNullOrUndefined(model.value)

  const internal = computed({
    get: () => {
      if (isNullOrUndefined(model.value)) return []
      return isArray(model.value) ? model.value : [model.value]
    },
    set: (arr: number[]) => {
      if (isNullOrUndefined(model.value) && arr.length === 0) return
      model.value = scalar ? (arr[0] ?? 0) : arr
    },
  })

  const progress = createProgress({ min, max })

  useProxyModel(progress, internal, { multiple: true })

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
    const pct = progress.percent.value

    return {
      total,
      percent: pct,
      isIndeterminate: indeterminate,
      segments: progress.segments.value,
      attrs: {
        'role': 'progressbar',
        'aria-valuenow': indeterminate ? undefined : total,
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuetext': indeterminate ? undefined : `${Math.round(pct)}%`,
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
