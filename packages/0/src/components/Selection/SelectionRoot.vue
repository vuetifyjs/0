<script lang="ts" setup>
  // Composables
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { createSelectionContext } from '#v0/composables/useSelection'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { ID } from '#v0/types'
  import { isArray } from '#v0/utilities'

  defineOptions({ name: 'SelectionRoot' })

  defineSlots<{
    default: (props: {
      disabled: boolean
      select: (id: ID) => void
      unselect: (id: ID) => void
      toggle: (id: ID) => void
    }) => any
  }>()

  const {
    namespace = 'v0:selection',
    disabled = false,
    enroll = false,
    multiple = false,
  } = defineProps<{
    namespace?: string
    disabled?: boolean
    enroll?: boolean
    multiple?: boolean
  }>()

  const model = defineModel<unknown | unknown[]>()
  const isMultiple = toRef(() => multiple || isArray(toValue(model)))

  const [, provideSelectionControl, context] = createSelectionContext({
    namespace,
    disabled: toRef(() => disabled),
    enroll,
    multiple: isMultiple.value,
    events: true,
  })

  useProxyModel(context, model, { multiple: isMultiple.value })

  provideSelectionControl(context)
</script>

<template>
  <slot
    :disabled="toValue(context.disabled)"
    :select="context.select"
    :toggle="context.toggle"
    :unselect="context.unselect"
  />
</template>
