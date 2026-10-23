<script lang="ts">
  // Framework
  import { createInput, isNullOrUndefined, isUndefined } from '@vuetify/v0'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  export interface BFileProps {
    /**
     * Control id. `createInput` generates one with `useId` when this is omitted.
     */
    id?: string
    /**
     * @default false
     */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BFile', inheritAttrs: false })

  defineEmits(['update:model-value'])

  const files = defineModel<FileList | null>({ default: null })

  const {
    id,
    disabled = false,
  } = defineProps<BFileProps>()

  const attrs = useAttrs()

  const field = createInput<FileList | null>({
    value: files,
    id,
    disabled: () => disabled,
    dirty: value => !isNullOrUndefined(value) && value.length > 0,
  })

  function readFiles (event: Event) {
    const target = event.target
    if (!(target instanceof HTMLInputElement)) return undefined
    return target.files
  }

  function onChange (event: Event) {
    const next = readFiles(event)
    if (isUndefined(next)) return
    files.value = next
  }

  function onFocus () {
    field.isFocused.value = true
  }

  function onBlur () {
    field.isFocused.value = false
    field.isTouched.value = true
  }

  const bindings = toRef(() => mergeProps(attrs, {
    id: field.id,
    class: 'form-control',
    type: 'file',
    disabled: field.isDisabled.value || undefined,
    onBlur,
    onChange,
    onFocus,
  }))
</script>

<template>
  <input v-bind="bindings">
</template>
