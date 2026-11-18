<script lang="ts">
  // Framework
  import { createInput, isNullOrUndefined, isString, isUndefined } from '@vuetify/v0'

  // Utilities
  import { mergeProps, toRef, useAttrs, useTemplateRef, watch } from 'vue'

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
  const control = useTemplateRef<HTMLInputElement>('control')

  const field = createInput<FileList | null>({
    value: files,
    id: isString(id) && id.length > 0 ? id : undefined,
    disabled: () => disabled,
    dirty: value => !isNullOrUndefined(value) && value.length > 0,
  })

  // A file input ignores a written value. Clearing the model has to clear the
  // control, or the chosen filename stays after the list is gone.
  watch(files, value => {
    const node = control.value
    if (isNullOrUndefined(node)) return
    if (!isNullOrUndefined(value) && value.length > 0) return
    if (node.value === '') return
    node.value = ''
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
  <input ref="control" v-bind="bindings">
</template>
