<script lang="ts">
  // Framework
  import { isString, isUndefined, useId } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export type BRadioSize = 'sm' | 'lg'

  export type BRadioValue = string | number

  export interface BRadioProps {
    disabled?: boolean
    id?: string
    name?: string
    size?: BRadioSize
    /** Adds `theme-{theme}` on the input. A single token, such as `primary`. */
    theme?: string
    /** This radio's value. The group shares one model. */
    value?: BRadioValue
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BRadio' })

  defineEmits(['update:model-value'])

  const model = defineModel<BRadioValue | null>({ default: null })

  const {
    disabled = false,
    id: _id,
    name,
    size,
    theme,
    value,
  } = defineProps<BRadioProps>()

  const autoId = useId()

  const uid = toRef(() => isString(_id) && _id.length > 0 ? _id : autoId)

  const modifiers = toRef(() => {
    const list: string[] = []
    if (size === 'sm' || size === 'lg') list.push(`radio-${size}`)
    if (isString(theme) && theme.length > 0) list.push(`theme-${theme}`)
    return list
  })

  const submitted = toRef(() => isUndefined(value) ? undefined : String(value))

  const checked = toRef(() => !isUndefined(value) && model.value === value)

  function onChange () {
    if (disabled || isUndefined(value)) return
    model.value = value
  }
</script>

<template>
  <input
    :id="uid"
    :checked
    class="radio"
    :class="modifiers"
    :disabled="disabled || undefined"
    :name
    type="radio"
    :value="submitted"
    @change="onChange"
  >
</template>
