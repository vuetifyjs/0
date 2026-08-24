/**
 * @module BuFile
 *
 * @remarks
 * Bulma `div.file` slot host. Owns the native file input and the `has-name`
 * modifier (`filename` boolean). Compose BuFileCta / BuFileIcon / BuFileName
 * — the CTA tree is not generated. `has-name` is not inferred from Name.
 */

<script lang="ts">
  // Framework
  import { createContext, createInput, isNull } from '@vuetify/v0'

  // Utilities
  import { createValidateOn } from '../../utilities/validate'
  import { shallowReadonly, shallowRef, toRef, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { ID, InputOptions, ValidateOn } from '@vuetify/v0'
  import type { ShallowRef, StyleValue } from 'vue'

  export type BuFileColor = 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'
  export type BuFileSize = 'small' | 'normal' | 'medium' | 'large'

  export interface BuFileProps {
    /** Renders `is-boxed` — block layout with the icon above the label. */
    boxed?: boolean
    /** Renders `is-centered`. */
    centered?: boolean
    /** Color modifier rendered as `is-{color}` on the root. */
    color?: BuFileColor
    /** Disables the native file input. */
    disabled?: boolean
    /** Manual error state override — forces invalid. */
    error?: boolean
    /** Manual error messages — merged with rule-based errors. */
    errorMessages?: string | string[]
    /** Renders `has-name`. Compose `BuFileName` for the span — not inferred. */
    filename?: boolean
    /** Associate with a form by id. Snapshotted at setup (createInput takes a plain value). */
    form?: string
    /** Renders `is-fullwidth`. */
    fullwidth?: boolean
    /** Unique identifier for the native input (auto-generated if omitted). Snapshotted at setup. */
    id?: ID
    /** Form field name. Snapshotted at setup (createInput takes a plain value). */
    name?: string
    /** Text shown in `.file-name` before a file is selected. */
    placeholder?: string
    /** Whether required. Snapshotted at setup for validation; the DOM attr stays reactive. */
    required?: boolean
    /** Renders `is-right` — CTA on the right of the file name. */
    right?: boolean
    /** Validation rules. Snapshotted at setup (createInput takes a plain value). */
    rules?: InputOptions['rules']
    /** Size modifier rendered as `is-{size}` (emitted only when explicitly passed). */
    size?: BuFileSize
    /** When to trigger validation. */
    validateOn?: ValidateOn
  }

  export interface BuFileSlotProps {
    /** Merged error messages. */
    errors: string[]
    /** Currently selected files (null until a selection is made). */
    files: FileList | null
    /** Whether the native input is focused. */
    isFocused: boolean
    /** Whether the field is valid. */
    isValid: boolean | null
  }

  export interface BuFileExpose {
    /** Currently selected files (null until a selection is made). */
    files: Readonly<ShallowRef<FileList | null>>
    /** Clear the selection — resets both the v0 value and the native input. */
    clear: () => void
  }

  export interface BuFileContext {
    /** Selected-file label currently shown in BuFileName. */
    filename: () => string
  }

  // Only the parent provides, so the provider stays module-local; parts import
  // the hook.
  const [useBuFile, provideBuFile] = createContext<BuFileContext | null>('bulma:file', null)

  export { useBuFile }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuFile', inheritAttrs: false })

  // class/style merge onto the div.file root; all other fallthrough attrs
  // (multiple, accept, aria-*, data-testid, …) target the native file input.
  const attrs = useAttrs()
  const rest = toRef(() => Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
  ))
  const style = toRef(() => attrs.style as StyleValue | undefined)

  defineSlots<{
    default: (props: BuFileSlotProps) => any
  }>()

  const emit = defineEmits<{
    change: [files: FileList | null]
  }>()

  const {
    boxed = false,
    centered = false,
    color,
    disabled = false,
    error = false,
    errorMessages,
    filename = false,
    form,
    fullwidth = false,
    id,
    name,
    placeholder = 'No file uploaded',
    required,
    right = false,
    rules = [],
    size,
    validateOn = 'blur',
  } = defineProps<BuFileProps>()

  const files = shallowRef<FileList | null>(null)
  const control = useTemplateRef<HTMLInputElement>('control')

  const input = createInput<FileList | null>({
    value: files,
    id,
    name,
    form,
    required,
    disabled: () => disabled,
    rules,
    error: () => error,
    errorMessages: () => errorMessages,
    dirty: value => !isNull(value) && value.length > 0,
  })

  const label = toRef(() => {
    const list = files.value
    if (isNull(list) || list.length === 0) return placeholder
    return Array.from(list, file => file.name).join(', ')
  })

  provideBuFile({
    filename: () => label.value,
  })

  const classes = toRef(() => [
    'file',
    {
      'has-name': filename,
      'is-boxed': boxed,
      'is-centered': centered,
      'is-danger': input.isValid.value === false,
      'is-fullwidth': fullwidth,
      'is-right': right,
    },
    color && `is-${color}`,
    size && `is-${size}`,
  ])

  const slotProps = toRef((): BuFileSlotProps => ({
    errors: input.errors.value,
    files: files.value,
    isFocused: input.isFocused.value,
    isValid: input.isValid.value,
  }))

  const { should, onFocus, onBlur } = createValidateOn(input, () => validateOn)

  function onChange (event: Event) {
    files.value = (event.target as HTMLInputElement).files
    emit('change', files.value)
    if (should('input')) input.validate()
  }

  function clear () {
    files.value = null
    if (control.value) control.value.value = ''
    emit('change', null)
  }

  defineExpose<BuFileExpose>({ files: shallowReadonly(files), clear })
</script>

<template>
  <div :class="[classes, attrs.class]" :style>
    <label class="file-label">
      <input
        :id="String(input.id)"
        ref="control"
        v-bind="rest"
        :aria-invalid="input.isValid.value === false || undefined"
        class="file-input"
        :disabled="disabled || undefined"
        :form
        :name
        :required="required || undefined"
        type="file"
        @blur="onBlur"
        @change="onChange"
        @focus="onFocus"
      >

      <slot v-bind="slotProps" />
    </label>
  </div>
</template>
