/**
 * @module TimePickerRoot
 *
 * @see https://0.vuetifyjs.com/components/forms/time-picker
 *
 * @remarks
 * Root component for segmented time entry. Creates the time context via
 * createTimePicker, bridges v-model, and provides it to the field
 * components (Hour, Minute, Second, Period, Description, Error,
 * HiddenInput). Renders the `role="group"` element that names the fields,
 * tracks focus across them, and runs validation when `validateOn` says so.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { parseValidateOn } from '#v0/components/Input'

  // Context
  import TimePickerHiddenInput from './TimePickerHiddenInput.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createTimePicker } from '#v0/composables/createTimePicker'
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { isElement, isNull, useId } from '#v0/utilities'
  import { mergeProps, nextTick, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ValidateEvent, ValidateOn } from '#v0/components/Input'
  import type { FormValidationRule } from '#v0/composables/createForm'
  import type { InputState } from '#v0/composables/createInput'
  import type { TimeHourCycle, TimePeriod, TimePickerContext } from '#v0/composables/createTimePicker'
  import type { RuleAlias, StandardSchemaV1 } from '#v0/composables/useRules'
  import type { MaybeArray } from '#v0/types'
  import type { Ref } from 'vue'

  export interface TimePickerRootProps extends AtomProps {
    /** Namespace shared with the field components. */
    namespace?: string
    /** Ignore every edit, show the value as given, and never emit. @default false */
    disabled?: boolean
    /** Ignore every edit, show the value as given, and never emit. @default false */
    readonly?: boolean
    /** `h12` shows 1–12 and a meridiem. `h23` shows 0–23. @default 'h23' */
    hourCycle?: TimeHourCycle
    /** Show the second field and include seconds in the value. @default false */
    seconds?: boolean
    /** Hour interval. The hour moves on its multiples. @default 1 */
    hourStep?: number
    /** Minute interval. The minute moves on its multiples. @default 1 */
    minuteStep?: number
    /** Second interval. The second moves on its multiples. @default 1 */
    secondStep?: number
    /** Inclusive lower bound, `HH:mm` or `HH:mm:ss`. */
    min?: string | null
    /** Inclusive upper bound, `HH:mm` or `HH:mm:ss`. */
    max?: string | null
    /** Submit the displayed time with a form when set. */
    name?: string
    /** Id of the form the hidden input belongs to, when it sits outside it. */
    form?: string
    /** Fail validation while a field is still empty. Read once, at setup. */
    required?: boolean
    /** Validation rules. Each receives the model value. Read once, at setup. */
    rules?: (FormValidationRule | RuleAlias | StandardSchemaV1)[]
    /** When to validate. Focus moving between the fields is not a blur. Input is an edit or a value from outside, not the picker normalizing on its own. @default 'blur' */
    validateOn?: ValidateOn
    /** Force the invalid state, whatever the rules say. @default false */
    error?: boolean
    /** Error messages shown ahead of the ones the rules produce. */
    errorMessages?: MaybeArray<string>
    /** Namespace of the parent Form to register with. @default 'v0:form' */
    formNamespace?: string
    /** Id of the group element. */
    id?: string
    /** Accessible name for the group. Falls back to the locale catalog. */
    ariaLabel?: string
    /** Id of the element that labels the group. Replaces `ariaLabel`. */
    ariaLabelledby?: string
    /** Id of the element that describes the group. */
    ariaDescribedby?: string
  }

  export interface TimePickerRootSlotProps {
    /** The time the fields show, as a 24-hour string, or `null` while a field is empty. */
    value: string | null
    /** Display hour. `0`–`23` in `h23`, `1`–`12` in `h12`. */
    hour: number | null
    /** Minute, `0`–`59`. */
    minute: number | null
    /** Second, or `null` when seconds are off or unset. */
    second: number | null
    /** Meridiem, or `null` in `h23`. */
    period: TimePeriod | null
    /** Resolved hour cycle. */
    hourCycle: TimeHourCycle
    /** Whether seconds are part of the value. */
    seconds: boolean
    /** Whether edits are ignored. */
    isDisabled: boolean
    /** Whether edits are ignored. */
    isReadonly: boolean
    /** Whether one of the fields has focus. Always false while disabled. */
    isFocused: boolean
    /** Error messages: the manual ones, then the ones the rules produced. */
    errors: string[]
    /** Whether the value is valid, or `null` before the first validation. */
    isValid: boolean | null
    /** Whether the value is still the initial one. Normalizing it does not count as a change. */
    isPristine: boolean
    /** Run the rules against the model value. */
    validate: () => Promise<boolean>
    /** Put the initial value back, drop a partly entered time, and clear the validation state. Does not emit while disabled or readonly. */
    reset: () => void
    /** Clear every field. The value becomes `null`. Does nothing while disabled or readonly. */
    clear: () => void
    /** Attributes for the group element. */
    attrs: {
      'id': string
      'role': 'group'
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
      'aria-disabled': boolean | undefined
      'disabled': true | undefined
      'data-state': InputState
      'data-dirty': true | undefined
      'data-focused': true | undefined
      'data-disabled': true | undefined
      'data-readonly': true | undefined
      'data-complete': true | undefined
      'onFocusin': () => void
      'onFocusout': (event: FocusEvent) => void
    }
  }

  export interface TimePickerRootContext extends TimePickerContext {
    /** Id of the group element; each field derives its own id from it. */
    readonly id: string
    /** Form field name. The hidden input renders while it is set. */
    readonly name: Readonly<Ref<string | undefined>>
    /** Id of the form the hidden input is associated with. */
    readonly form: Readonly<Ref<string | undefined>>
  }

  export const [useTimePickerRoot, provideTimePickerRoot] = /* @__PURE__ */ createContext<TimePickerRootContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'TimePickerRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: TimePickerRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: string | null]
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:time-picker',
    disabled = false,
    readonly: _readonly = false,
    hourCycle = 'h23',
    seconds = false,
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    min = null,
    max = null,
    name,
    form,
    required,
    rules = [],
    validateOn = 'blur',
    error = false,
    errorMessages,
    formNamespace = 'v0:form',
    id = useId(),
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
  } = defineProps<TimePickerRootProps>()

  const model = defineModel<string | null>({ default: null })
  const locale = useLocale()

  const time = createTimePicker({
    value: model,
    hourCycle: toRef(() => hourCycle),
    seconds: toRef(() => seconds),
    hourStep: toRef(() => hourStep),
    minuteStep: toRef(() => minuteStep),
    secondStep: toRef(() => secondStep),
    min: toRef(() => min),
    max: toRef(() => max),
    disabled: toRef(() => disabled),
    readonly: toRef(() => _readonly),
    id,
    name,
    form,
    formNamespace,
    required,
    rules,
    error: toRef(() => error),
    errorMessages: toRef(() => errorMessages),
  })

  const input = time.input
  const parsed = toRef(() => parseValidateOn(validateOn))

  function shouldValidate (trigger: ValidateEvent): boolean {
    const { event, modifier } = parsed.value
    if (event === 'submit') return false
    if (modifier === 'lazy' && !input.isTouched.value) return false
    if (modifier === 'eager') {
      // Eager validates on every change only after the first error, which
      // the base trigger seeds.
      if (input.isValid.value === false) return true
      if (trigger === 'input') return false
      return trigger === event
    }
    return trigger === event
  }

  // Focus counts only while the picker is enabled. A disabled field is out
  // of the tab order but still takes focus from a click or a script, and a
  // picker can be disabled or enabled with focus already inside.
  const within = shallowRef(false)

  watch(() => within.value && !time.isDisabled.value, focused => {
    input.isFocused.value = focused
  }, { flush: 'sync' })

  // Being disabled is not a blur: nothing left the picker.
  watch(input.isFocused, focused => {
    if (focused || time.isDisabled.value) return
    input.isTouched.value = true
    if (shouldValidate('blur')) void input.validate()
  })

  let resetting = false

  // Input is a value someone supplied, by an edit or from outside, once it
  // is in the model in its final form. The picker normalizing on its own,
  // at mount, on release, or for an option, is not.
  watch(time.supplied, () => {
    if (!resetting && shouldValidate('input')) void input.validate()
  })

  function reset () {
    resetting = true
    input.reset()
    void nextTick(() => {
      resetting = false
    })
  }

  function onFocusin () {
    within.value = true
  }

  // Focus that moves to another field of the same picker has not left it.
  function onFocusout (event: FocusEvent) {
    const group = event.currentTarget
    const next = event.relatedTarget
    if (isElement(group) && isElement(next) && group.contains(next)) return
    within.value = false
  }

  const context: TimePickerRootContext = {
    ...time,
    input: { ...input, reset },
    id,
    name: toRef(() => name),
    form: toRef(() => form),
  }

  provideTimePickerRoot(namespace, context)

  const atomRef = useTemplateRef<AtomExpose>('atom')

  function described (): string | undefined {
    const own = input.hasDescription.value ? input.descriptionId : undefined
    return [ariaDescribedby, own].filter(Boolean).join(' ') || undefined
  }

  const slotProps = toRef((): TimePickerRootSlotProps => {
    const button = as === 'button'
    const blocked = time.isDisabled.value

    return {
      value: time.display.value,
      hour: time.hour.value,
      minute: time.minute.value,
      second: time.second.value,
      period: time.period.value,
      hourCycle: time.hourCycle.value,
      seconds: time.seconds.value,
      isDisabled: blocked,
      isReadonly: time.isReadonly.value,
      isFocused: input.isFocused.value,
      errors: input.errors.value,
      isValid: input.isValid.value,
      isPristine: input.isPristine.value,
      validate: input.validate,
      reset,
      clear: time.clear,
      attrs: {
        id,
        'role': 'group',
        'aria-label': ariaLabelledby ? undefined : (ariaLabel || (locale.ti('TimePicker.label') ?? 'Time')),
        'aria-labelledby': ariaLabelledby || undefined,
        'aria-describedby': described(),
        'aria-disabled': button ? undefined : blocked,
        'disabled': button && blocked ? true : undefined,
        'data-state': input.state.value,
        'data-dirty': input.isDirty.value || undefined,
        'data-focused': input.isFocused.value || undefined,
        'data-disabled': blocked || undefined,
        'data-readonly': time.isReadonly.value || undefined,
        'data-complete': isNull(time.display.value) ? undefined : true,
        onFocusin,
        onFocusout,
      },
    }
  })

  // Untyped on purpose: with `AtomExpose` as the type argument,
  // vue-component-meta reports no props, slots, or events for the file.
  defineExpose({
    get element () {
      return (atomRef.value?.element ?? null) as HTMLElement | null
    },
  })
</script>

<template>
  <Atom
    ref="atom"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>

  <TimePickerHiddenInput v-if="name" :namespace />
</template>
