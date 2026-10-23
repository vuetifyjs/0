<script lang="ts">
  // Framework
  import { isString, isUndefined, useId } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export type BSwitchSize = 'sm' | 'lg'

  export interface BSwitchProps {
    disabled?: boolean
    id?: string
    name?: string
    /** `switch-sm` or `switch-lg` on the wrapper, not the input. */
    size?: BSwitchSize
    /** Adds `theme-{theme}` on the wrapper. A single token, such as `primary`. */
    theme?: string
    /** Submitted value. The pin uses an empty string. The model stays a boolean. */
    value?: string | number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BSwitch' })

  defineEmits(['update:model-value'])

  const model = defineModel<boolean>({ default: false })

  const {
    disabled = false,
    id: _id,
    name,
    size,
    theme,
    value,
  } = defineProps<BSwitchProps>()

  const autoId = useId()

  const uid = toRef(() => isString(_id) && _id.length > 0 ? _id : autoId)

  const modifiers = toRef(() => {
    const list: string[] = []
    if (size === 'sm' || size === 'lg') list.push(`switch-${size}`)
    if (isString(theme) && theme.length > 0) list.push(`theme-${theme}`)
    return list
  })

  const submitted = toRef(() => isUndefined(value) ? '' : String(value))

  function onChange (event: Event) {
    if (disabled) return
    const target = event.target
    if (!(target instanceof HTMLInputElement)) return
    model.value = target.checked
  }
</script>

<template>
  <div class="switch" :class="modifiers">
    <!-- Boolean `switch` is the pin's attribute. It is not the class `check`. -->
    <input
      :id="uid"
      :checked="model"
      :disabled="disabled || undefined"
      :name
      role="switch"
      switch
      type="checkbox"
      :value="submitted"
      @change="onChange"
    >
  </div>
</template>
