<script lang="ts">
  // Framework
  import { isString, useId } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BCollapseProps {
    /**
     * Element id. Defaults to a generated id so a button can set `aria-controls`.
     */
    id?: string
    /**
     * Adds `.collapse-horizontal`.
     *
     * @default false
     */
    horizontal?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BCollapse' })

  defineSlots<{
    /** Panel content. Hidden by Bootstrap's `.collapse` rule until `.show`. */
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const model = defineModel<boolean>({ default: false })

  const uid = useId()

  const {
    id: _id,
    horizontal = false,
  } = defineProps<BCollapseProps>()

  const id = toRef(() => isString(_id) && _id.length > 0 ? _id : uid)

  const panelClass = toRef(() => {
    const list = ['collapse']

    if (horizontal) list.push('collapse-horizontal')
    if (model.value) list.push('show')

    return list
  })
</script>

<template>
  <div
    :id
    :class="panelClass"
  >
    <slot />
  </div>
</template>
