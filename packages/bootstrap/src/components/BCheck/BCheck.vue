<script lang="ts">
  // Framework
  import { isNull, isString, isUndefined, useId } from '@vuetify/v0'

  // Utilities
  import { toRef, useTemplateRef, watch } from 'vue'

  export type BCheckSize = 'sm' | 'lg'

  export interface BCheckProps {
    disabled?: boolean
    id?: string
    /**
     * Sets the IDL property `indeterminate`. There is no HTML attribute.
     */
    indeterminate?: boolean
    name?: string
    size?: BCheckSize
    /** Adds `theme-{theme}` on the input. A single token, such as `primary`. */
    theme?: string
    /** Submitted value. The model stays a boolean. Omit to leave the attribute off. */
    value?: string | number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BCheck' })

  defineEmits(['update:model-value'])

  const model = defineModel<boolean>({ default: false })

  const {
    disabled = false,
    id: _id,
    indeterminate = false,
    name,
    size,
    theme,
    value,
  } = defineProps<BCheckProps>()

  const input = useTemplateRef<HTMLInputElement>('input')
  const autoId = useId()

  const uid = toRef(() => isString(_id) && _id.length > 0 ? _id : autoId)

  const modifiers = toRef(() => {
    const list: string[] = []
    if (size === 'sm' || size === 'lg') list.push(`check-${size}`)
    if (isString(theme) && theme.length > 0) list.push(`theme-${theme}`)
    return list
  })

  const submitted = toRef(() => isUndefined(value) ? undefined : String(value))

  function onChange (event: Event) {
    if (disabled) return
    const target = event.target
    if (!(target instanceof HTMLInputElement)) return
    model.value = target.checked
  }

  // The pin sets this from script. Re-apply after renders so a checked update cannot clear it.
  function syncIndeterminate () {
    const el = input.value
    if (isNull(el)) return
    el.indeterminate = indeterminate
  }

  watch(
    [() => indeterminate, () => model.value, input],
    syncIndeterminate,
    { flush: 'post', immediate: true },
  )
</script>

<template>
  <input
    :id="uid"
    ref="input"
    :checked="model"
    class="check"
    :class="modifiers"
    :disabled="disabled || undefined"
    :name
    type="checkbox"
    :value="submitted"
    @change="onChange"
  >
</template>
