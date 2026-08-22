/**
 * @module BuNumberField
 *
 * @remarks
 * Bulma has no number input, so this is the first Tier 2 composite: it renders
 * Bulma's own `.field.has-addons` markup — `.control > button.button` steppers
 * around `.control > input.input` — and takes every behavior from v0's
 * `NumberField`. Zero custom CSS.
 *
 * DOM order is load-bearing: `bulma.css:6251-6270` keys the addon corner radii
 * off `.control:first-child` / `:last-child`, so each part renders its own
 * `.control` wrapper and userland cannot compose a group with broken radii.
 *
 * `color` lands on the steppers only — Bulma's `.input` color modifier paints
 * the border, which would fight the `is-danger` validation class.
 *
 * Inside an ambient `NumberField.Root` no second root is created and the
 * ambient root owns the whole behavioral surface: `v-model`, bounds, and every
 * validation prop passed here are ignored (see SPEC.md). Only the
 * presentational modifiers still apply.
 */

<script lang="ts">
  // Framework
  import { createContext, NumberFieldRoot, useNumberFieldRoot } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ID, NumberFieldRootContext, NumberFieldRootProps } from '@vuetify/v0'

  export type BuNumberFieldColor = 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'
  export type BuNumberFieldSize = 'small' | 'normal' | 'medium' | 'large'

  export interface BuNumberFieldProps {
    /** Alignment of the attached group: `has-addons-{centered|right}` */
    addons?: 'centered' | 'right'
    /** Id of the element labelling the spinbutton */
    ariaLabelledby?: string
    /** Whether `commit()` clamps to min/max (v0 default: true) */
    clamp?: boolean
    /** Color modifier on the steppers: `is-{color}` */
    color?: BuNumberFieldColor
    /** Disables the field and both steppers */
    disabled?: boolean
    /** Manual error state override — forces `is-danger` */
    error?: boolean
    /** Manual error messages — merged with rule-based errors */
    errorMessages?: NumberFieldRootProps['errorMessages']
    /** Associate with a form by id */
    form?: string
    /** Intl.NumberFormat options for the blurred display */
    format?: Intl.NumberFormatOptions
    /** Unique identifier (auto-generated when omitted) */
    id?: ID
    /** Accessible label */
    label?: string
    /** Large step for PageUp/PageDown */
    leap?: number
    /** BCP 47 locale tag (v0 default: en-US) */
    locale?: string
    /** Maximum value */
    max?: number
    /** Minimum value */
    min?: number
    /** Form field name */
    name?: string
    /** Namespace of the NumberField.Root context */
    namespace?: string
    /** Makes the input readonly and both steppers inert */
    readonly?: boolean
    /** Marks the field required */
    required?: boolean
    /** Rounded corners on the input and both steppers: `is-rounded` */
    rounded?: boolean
    /** Validation rules */
    rules?: NumberFieldRootProps['rules']
    /** Size modifier on the input and both steppers: `is-{size}` */
    size?: BuNumberFieldSize
    /** Delay in ms before spin-on-hold starts (v0 default: 400) */
    spinDelay?: number
    /** Interval in ms for repeated spin (v0 default: 60) */
    spinRate?: number
    /** Step increment for the steppers and Arrow keys */
    step?: number
    /** When to trigger validation (v0 default: blur) */
    validateOn?: NumberFieldRootProps['validateOn']
    /** Whether the mouse wheel adjusts the value while focused */
    wheel?: boolean
    /** Wrap around at the bounds */
    wrap?: boolean
  }

  export interface BuNumberFieldContext {
    /** Namespace of the NumberField.Root context the parts bind to. */
    namespace: string
    /** Color modifier for the steppers. */
    color: () => BuNumberFieldColor | undefined
    /** Size modifier for the input and steppers. */
    size: () => BuNumberFieldSize | undefined
    /** Whether the input and steppers render `is-rounded`. */
    rounded: () => boolean
  }

  // Only the parent provides, so the provider stays module-local; parts import
  // the hook.
  const [useBuNumberField, provideBuNumberField] = createContext<BuNumberFieldContext | null>('bulma:number-field', null)

  export { useBuNumberField }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuNumberField' })

  defineSlots<{
    /** `.field.has-addons` children — the decrement, input, and increment parts. */
    default: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: number | null]
  }>()

  const {
    addons,
    ariaLabelledby,
    clamp,
    color,
    disabled = false,
    error = false,
    errorMessages,
    form,
    format,
    id,
    label,
    leap,
    locale,
    max,
    min,
    name,
    namespace = 'v0:number-field:root',
    readonly = false,
    required,
    rounded = false,
    rules,
    size,
    spinDelay,
    spinRate,
    step,
    validateOn,
    wheel,
    wrap,
  } = defineProps<BuNumberFieldProps>()

  const model = defineModel<number | null>({ default: null })

  // Optional injection: inside an ambient NumberField.Root the parts bind to it
  // directly and no second root is created (a nested root would shadow it).
  // A null default returns instead of throwing — only undefined throws.
  const root = useNumberFieldRoot(namespace, null as unknown as NumberFieldRootContext) as NumberFieldRootContext | null

  provideBuNumberField({
    namespace,
    color: () => color,
    size: () => size,
    rounded: () => rounded,
  })

  const classes = toRef(() => addons && `has-addons-${addons}`)
</script>

<template>
  <NumberFieldRoot
    v-if="!root"
    :id
    v-model="model"
    :aria-labelledby
    as="div"
    :clamp
    class="field has-addons"
    :class="classes"
    :disabled
    :error
    :error-messages
    :form
    :format
    :label
    :leap
    :locale
    :max
    :min
    :name
    :namespace
    :readonly
    :required
    :rules
    :spin-delay
    :spin-rate
    :step
    :validate-on
    :wheel
    :wrap
  >
    <slot />
  </NumberFieldRoot>

  <div v-else class="field has-addons" :class="classes">
    <slot />
  </div>
</template>
