<script lang="ts" setup>
  // Composables
  import { useSelection } from '#v0/composables/useSelection'

  // Utilities
  import { onUnmounted, toRef, toValue } from 'vue'

  defineOptions({ name: 'SelectionItem' })

  defineSlots<{
    default: (props: {
      id: string
      label?: string
      value: unknown
      isSelected: boolean
      disabled: boolean
      select: () => void
      unselect: () => void
      toggle: () => void
    }) => any
  }>()

  const {
    id,
    label,
    value,
    disabled,
    namespace = 'v0:selection',
  } = defineProps<{
    label?: string
    id?: string
    disabled?: boolean
    value?: unknown
    namespace?: string
  }>()

  const selection = useSelection(namespace)
  const radio = selection.register({ id, value, disabled })
  const isDisabled = toRef(() => radio.disabled || selection.disabled)

  onUnmounted(() => {
    selection.unregister(radio.id)
  })
</script>

<template>
  <slot
    :id="String(radio.id)"
    :disabled="toValue(isDisabled)"
    :is-selected="toValue(radio.isSelected)"
    :label
    :select="radio.select"
    :toggle="radio.toggle"
    :unselect="radio.unselect"
    :value
  />
</template>
