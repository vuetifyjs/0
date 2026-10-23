<script lang="ts">
  // Framework
  import {
    Button,
    createContext,
    Input,
    isElement,
    isFunction,
    isNullOrUndefined,
    isNumber,
    isObject,
    isString,
    isUndefined,
    parseValidateOn,
    Select,
    toElement,
    useId,
    useLocale,
    useLogger,
  } from '@vuetify/v0'

  import { caret, format, unmask } from './mask'

  // Utilities
  import { onMounted, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'
  import type { InputRootProps } from '@vuetify/v0'
  import type { ComponentPublicInstance, Ref, SetupContext } from 'vue'

  // Components
  import QuDialog from '../QuDialog/QuDialog.vue'
  import QuDialogActions from '../QuDialog/QuDialogActions.vue'
  import QuDialogCancel from '../QuDialog/QuDialogCancel.vue'
  import QuDialogConfirm from '../QuDialog/QuDialogConfirm.vue'
  import QuDialogContent from '../QuDialog/QuDialogContent.vue'
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  /** The two pickers a text field can nest (text-fields page, "Nested menus & pickers"). */
  export type QuTextFieldPicker = 'date' | 'time'

  /** A character limit, or a word limit counting whitespace-separated words. */
  export type QuTextFieldCounter = number | { words: number }

  export interface QuTextFieldContext {
    /** Whether the field is the spec's dropdown, so `Item` children have a list to join. */
    dropdown: Readonly<Ref<boolean>>
  }

  export interface QuTextFieldSlotProps {
    /** The dropdown's value, or the value a nested picker holds while its dialog is open. */
    value: unknown
    /** Hold a value: the picker's choice until OK, or the dropdown's selection. */
    commit: (value: unknown) => void
  }

  /**
   * Quantum keeps v0's validation surface (`rules`, `validateOn`, `required`,
   * `error`) and form association (`id`, `name`). `label` is the visible
   * `<label for>`; it is not forwarded to `Input.Root`, which would duplicate
   * the accessible name as an `aria-label`.
   */
  export interface QuTextFieldProps extends Pick<
    InputRootProps,
    'id' | 'name' | 'rules' | 'validateOn' | 'error' | 'namespace'
  > {
    /** The label every text field needs: resting at input size, floating at 12 sp on focus or with content. */
    label?: string
    /**
     * The label became a heading elsewhere on the screen (the field is the
     * screen's primary action): the label is hidden visually, still names the
     * field, and the placeholder shows at rest.
     */
    heading?: boolean
    /** Helper text under the line. An error replaces it until fixed. */
    helper?: string
    /** Hint text in the field, shown once the label floats (or always without a visible label). */
    placeholder?: string
    /** Fixed text before the input, such as a currency sign; shown when pressed, focused or filled. */
    prefix?: string
    /** Fixed text after the input, such as a unit or an email domain; shown when pressed, focused or filled. */
    suffix?: string
    /** "used / limit" at the end of the details row; over the limit the field turns to its error state. */
    counter?: QuTextFieldCounter
    /** An asterisk after the label, `aria-required`, and v0's presence rule. */
    required?: boolean
    /** "(optional)" after the label, for forms where the optional fields are the fewer. */
    optional?: boolean
    /** The icon signifier: a 24 dp glyph 16 dp before the field. */
    icon?: QuIconName
    /** A clear button at the end of the field, enabled only while it has characters. */
    clearable?: boolean
    /** A microphone button at the end of the field, always enabled; emits `voice`. */
    voice?: boolean
    /** The input type. `password` disguises the text and adds the visibility toggle. */
    type?: string
    /** The text field box: a 56 dp filled rectangle with 4 dp corners masking the ends of the line. */
    box?: boolean
    /** The condensed field for crowded forms: 13 sp text and halved spacings. */
    dense?: boolean
    /** Wrap onto new lines, growing the field downward. */
    multiline?: boolean
    /** A taller, fixed-height field with a visible 1 dp border; overflow scrolls. */
    textarea?: boolean
    /** Spans its container: 56 dp tall (48 dp dense), the label acting as a hint. */
    fullWidth?: boolean
    /** The raised field for a single action such as search: no line, no floating label, 2 dp. */
    solo?: boolean
    /** A solo field over scrolled content rises from 2 dp to 3 dp. */
    scrolled?: boolean
    /** The field is a select: readonly, an arrow at the end, and its `Item` children in a menu. */
    dropdown?: boolean
    /** The icon signifier becomes a button that opens a date or time picker in a confirmation dialog. */
    picker?: QuTextFieldPicker
    /** Grouped characters, such as `'(###) ###-####'`: `#` a digit, `A` a letter, `*` either. The model stays unformatted. */
    mask?: string
    /** Removes the field from interaction: 38% ink and a dotted line. */
    disabled?: boolean
    /** Shows the value without allowing edits. */
    readonly?: boolean
    /** Error messages to show regardless of the rules. */
    errorMessages?: string | string[]
  }

  const [useQuTextField, provideQuTextField] = createContext<QuTextFieldContext | null>('quantum:text-field', null)

  export { useQuTextField }

  /** Stands in for `Select.Root` when the field is not a dropdown, so one template serves both. */
  function Pass (_props: unknown, { slots }: SetupContext) {
    return slots.default?.({ isOpen: false })
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuTextField', inheritAttrs: false })

  defineSlots<{
    /** `Item` children under `dropdown`; the date or time picker under `picker`. Unused otherwise. */
    default?: (props: QuTextFieldSlotProps) => any
  }>()

  const emit = defineEmits<{
    'update:model-value': [value: string]
    /** The clear button emptied the field. */
    'clear': []
    /** The microphone was pressed; speech capture is the app's. */
    'voice': []
  }>()

  const {
    id: _id,
    name,
    label,
    heading = false,
    helper,
    placeholder,
    prefix,
    suffix,
    counter,
    required = false,
    optional = false,
    icon,
    clearable = false,
    voice = false,
    type = 'text',
    box = false,
    dense = false,
    multiline = false,
    textarea = false,
    fullWidth = false,
    solo = false,
    scrolled = false,
    dropdown = false,
    picker,
    mask,
    disabled = false,
    readonly = false,
    rules = [],
    validateOn = 'blur',
    error = false,
    errorMessages,
    namespace,
  } = defineProps<QuTextFieldProps>()

  const model = defineModel<string>({ default: '' })

  const attrs = useAttrs()
  const locale = useLocale()
  const logger = useLogger()

  const fallback = useId()
  const id = String(_id ?? fallback)

  // `class` and `style` dress the root; every other attribute (autocomplete,
  // inputmode, maxlength, aria-*) belongs to the editable element.
  const outer = toRef(() => ({ class: attrs.class, style: attrs.style }))
  const inner = toRef(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style')))

  const control = useTemplateRef<ComponentPublicInstance>('control')
  const activator = useTemplateRef<ComponentPublicInstance>('activator')

  const area = toRef(() => multiline || textarea)
  const hidden = toRef(() => solo || heading)
  const focus = shallowRef(false)
  const visible = shallowRef(false)
  const picking = shallowRef(false)
  // The touch point the focused line washes out from; centred for keyboard focus.
  const origin = shallowRef<string>()

  const kind = toRef(() => type === 'password' && visible.value ? 'text' : type)

  // Grouped characters: Input.Root holds the formatted text, v-model the characters alone.
  const masked = shallowRef(mask ? format(model.value ?? '', mask) : '')
  const display = toRef(() => mask ? masked.value : (model.value ?? ''))

  watch(() => [model.value, mask] as const, ([value, pattern]) => {
    if (!pattern) return

    if (unmask(masked.value, pattern) !== (value ?? '')) masked.value = format(value ?? '', pattern)
  })

  // Rules judge the model value, not the separators the mask inserted.
  const checks = toRef(() => {
    if (!mask) return rules

    return rules.map(rule => isFunction(rule) ? (value: unknown) => rule(unmask(isString(value) ? value : '', mask)) : rule)
  })

  const limit = toRef(() => isNumber(counter) ? counter : counter?.words)
  const words = toRef(() => isObject(counter))

  const used = toRef(() => {
    const value = model.value ?? ''

    return words.value ? value.split(/\s+/).filter(Boolean).length : value.length
  })

  const over = toRef(() => !isUndefined(limit.value) && used.value > limit.value)

  const blur = toRef(() => parseValidateOn(validateOn).event === 'blur')

  const clearLabel = toRef(() => locale.ti('Quantum.clear') ?? 'Clear')
  const voiceLabel = toRef(() => locale.ti('Quantum.voice') ?? 'Voice input')
  const optionalLabel = toRef(() => locale.ti('Quantum.optional') ?? '(optional)')

  const visibilityLabel = toRef(() => visible.value
    ? locale.ti('Quantum.hidePassword') ?? 'Hide password'
    : locale.ti('Quantum.showPassword') ?? 'Show password',
  )

  const pickerLabel = toRef(() => picker === 'time'
    ? locale.ti('Quantum.chooseTime') ?? 'Choose time'
    : locale.ti('Quantum.chooseDate') ?? 'Choose date',
  )

  const select = toRef(() => dropdown
    ? {
      'id': `${id}-select`,
      'modelValue': model.value,
      'onUpdate:modelValue': onSelect,
      'disabled': disabled || readonly,
    }
    : {})

  provideQuTextField({
    dropdown: toRef(() => dropdown),
  })

  if (__DEV__) {
    watch(() => !label && !attrs['aria-label'], wrong => {
      if (wrong) logger.warn('[QuTextField] every text field needs a label (text-fields page); pass `label`, with `heading` when it is a heading elsewhere')
    }, { immediate: true })

    watch(() => dropdown && (area.value || !!mask || !!picker), wrong => {
      if (wrong) logger.warn('[QuTextField] a dropdown field is a single-line select; `multiline`, `textarea`, `mask` and `picker` do not apply to it')
    }, { immediate: true })
  }

  function target (): HTMLElement | undefined {
    const el = toElement(dropdown ? activator.value : control.value)

    return el instanceof HTMLElement ? el : undefined
  }

  /** Multi-line fields grow downward with their content (text-fields page). */
  function grow () {
    const el = target()

    if (!multiline || !el) return

    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  onMounted(grow)
  watch(display, grow, { flush: 'post' })

  function onText (value: string) {
    if (mask) {
      masked.value = value
      model.value = unmask(value, mask)
    } else {
      model.value = value
    }
  }

  /**
   * Runs before Input.Control's own handler (consumer listeners merge first),
   * so the element already holds the formatted text when v0 reads it.
   */
  function onInput (event: Event) {
    const el = event.target

    if (mask && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
      const forward = !(event instanceof InputEvent && event.inputType.startsWith('delete'))
      const raw = el.value
      const formatted = format(raw, mask, forward)
      const position = caret(raw, el.selectionStart ?? raw.length, formatted, mask, forward)

      el.value = formatted
      el.setSelectionRange(position, position)
    }
  }

  function onFocused (value: unknown) {
    focus.value = Boolean(value)

    if (!focus.value) origin.value = undefined
  }

  /** The chosen option's text, read from the v0 ticket; the raw value until the option registers. */
  function option (item: unknown, value: unknown): string {
    if (isObject(item) && isFunction(item.text)) {
      const text = item.text()

      if (isString(text) && text) return text
    }

    return isNullOrUndefined(value) ? '' : String(value)
  }

  function onPointerdown (event: PointerEvent) {
    const el = event.currentTarget

    if (!isElement(el)) return

    origin.value = `${event.clientX - el.getBoundingClientRect().left}px 50%`
  }

  /** A press anywhere on the field that is not one of its buttons puts the caret in the input. */
  function onField (event: MouseEvent) {
    if (isElement(event.target) && event.target.closest('button, input, textarea, [role="combobox"]')) return

    target()?.focus()
  }

  function onSelectFocus () {
    focus.value = true
  }

  function onSelectBlur (validate: () => Promise<boolean>) {
    onFocused(false)

    if (blur.value) validate()
  }

  function onSelect (value: unknown) {
    model.value = isNullOrUndefined(value) ? '' : String(value)
  }

  function onClear () {
    masked.value = ''
    model.value = ''
    emit('clear')
    target()?.focus()
  }

  function onVisibility () {
    visible.value = !visible.value
  }

  function onVoice () {
    emit('voice')
  }

  function onPicker () {
    picking.value = true
  }

  function onPick (value: unknown) {
    onSelect(value)
  }
</script>

<template>
  <Input.Root
    :id
    v-slot="{ attrs: state, errors, isDirty, isDisabled, isReadonly, validate }"
    :disabled
    :error="error || over"
    :error-messages
    :model-value="display"
    :name
    :namespace
    :readonly="readonly || dropdown"
    renderless
    :required
    :rules="checks"
    :type="kind"
    :validate-on
    @update:focused="onFocused"
    @update:model-value="onText"
  >
    <component :is="dropdown ? Select.Root : Pass" v-slot="{ isOpen }" v-bind="select">
      <div
        v-bind="{ ...state, ...outer }"
        class="quantum-text-field"
        :data-box="box || undefined"
        :data-counter="isUndefined(limit) ? undefined : (words ? 'words' : 'characters')"
        :data-dense="dense || undefined"
        :data-dropdown="dropdown || undefined"
        :data-focused="focus || isOpen || undefined"
        :data-full-width="fullWidth || undefined"
        :data-heading="heading || undefined"
        :data-mask="mask ? true : undefined"
        :data-multiline="multiline || undefined"
        :data-open="isOpen || undefined"
        :data-picker="picker"
        :data-scrolled="solo && scrolled || undefined"
        :data-solo="solo || undefined"
        :data-textarea="textarea || undefined"
      >
        <Button.Root
          v-if="picker"
          :aria-label="pickerLabel"
          class="quantum-text-field__button quantum-text-field__picker"
          :disabled="isDisabled || isReadonly"
          @click="onPicker"
        >
          <QuRipple unbounded />

          <QuIcon :name="picker === 'time' ? 'schedule' : 'event'" :size="dense ? 's' : 'm'" />
        </Button.Root>

        <QuIcon
          v-else-if="icon && !solo"
          class="quantum-text-field__icon"
          :name="icon"
          :size="dense ? 's' : 'm'"
        />

        <div class="quantum-text-field__body">
          <div
            class="quantum-text-field__field"
            :data-disabled="isDisabled || undefined"
            @click="onField"
            @pointerdown="onPointerdown"
          >
            <QuRipple v-if="box" />

            <QuIcon
              v-if="icon && solo && !picker"
              class="quantum-text-field__icon"
              :name="icon"
              :size="dense ? 's' : 'm'"
            />

            <label
              v-if="label"
              :id="`${id}-label`"
              class="quantum-text-field__label"
              :for="dropdown ? undefined : id"
            >
              {{ label }}<span v-if="required" aria-hidden="true" class="quantum-text-field__required"> *</span><span v-if="optional && !required" class="quantum-text-field__optional">&nbsp;{{ optionalLabel }}</span>
            </label>

            <span v-if="prefix" class="quantum-text-field__prefix">{{ prefix }}</span>

            <Select.Activator
              v-if="dropdown"
              ref="activator"
              :aria-describedby="errors.length > 0 ? undefined : (helper ? `${id}-description` : undefined)"
              :aria-errormessage="errors.length > 0 ? `${id}-error` : undefined"
              :aria-invalid="state['data-state'] === 'invalid' || undefined"
              :aria-labelledby="label ? `${id}-label` : undefined"
              :aria-required="required || undefined"
              as="div"
              class="quantum-text-field__input"
              :label="label ? undefined : (inner['aria-label'] as string | undefined)"
              :tabindex="isDisabled ? -1 : 0"
              @blur="onSelectBlur(validate)"
              @focus="onSelectFocus"
            >
              <Select.Value v-slot="{ selectedItem, selectedValue }" class="quantum-text-field__value">
                {{ option(selectedItem, selectedValue) }}
              </Select.Value>

              <Select.Placeholder
                v-if="placeholder && (!label || hidden || focus || isOpen)"
                class="quantum-text-field__placeholder"
              >
                {{ placeholder }}
              </Select.Placeholder>

              <span aria-hidden="true" class="quantum-text-field__dropdown">
                <QuIcon name="arrow-drop-down" :size="dense ? 's' : 'm'" />
              </span>
            </Select.Activator>

            <Input.Control
              v-else
              ref="control"
              v-bind="inner"
              :as="area ? 'textarea' : 'input'"
              class="quantum-text-field__input"
              :namespace
              :placeholder="!label || hidden || textarea || focus || isDirty ? placeholder : undefined"
              :rows="multiline ? 1 : undefined"
              @input="onInput"
            />

            <span v-if="suffix" class="quantum-text-field__suffix">{{ suffix }}</span>

            <Button.Root
              v-if="clearable && !dropdown"
              :aria-label="clearLabel"
              class="quantum-text-field__button quantum-text-field__clear"
              :disabled="isDisabled || isReadonly || !isDirty"
              @click="onClear"
              @mousedown.prevent
            >
              <QuRipple unbounded />

              <QuIcon name="close" :size="dense ? 's' : 'm'" />
            </Button.Root>

            <Button.Root
              v-if="type === 'password'"
              :aria-label="visibilityLabel"
              class="quantum-text-field__button quantum-text-field__visibility"
              :data-active="visible || undefined"
              :disabled="isDisabled"
              @click="onVisibility"
              @mousedown.prevent
            >
              <QuRipple unbounded />

              <QuIcon :name="visible ? 'visibility-off' : 'visibility'" :size="dense ? 's' : 'm'" />
            </Button.Root>

            <Button.Root
              v-if="voice"
              :aria-label="voiceLabel"
              class="quantum-text-field__button quantum-text-field__voice"
              :disabled="isDisabled"
              @click="onVoice"
              @mousedown.prevent
            >
              <QuRipple unbounded />

              <QuIcon name="mic" :size="dense ? 's' : 'm'" />
            </Button.Root>

            <span aria-hidden="true" class="quantum-text-field__line" :style="origin ? { transformOrigin: origin } : undefined" />
          </div>

          <!-- Pressing an option must not move focus off the activator, or the field would validate mid-choice. -->
          <Select.Content
            v-if="dropdown"
            class="quantum-text-field__list"
            eager
            @mousedown.prevent
          >
            <slot :commit="onSelect" :value="model" />
          </Select.Content>

          <div
            class="quantum-text-field__details"
            :data-empty="!helper && errors.length === 0 && isUndefined(limit) || undefined"
          >
            <Input.Description
              v-if="helper && errors.length === 0"
              class="quantum-text-field__helper"
              :namespace
            >
              {{ helper }}
            </Input.Description>

            <Input.Error v-slot="{ errors: messages }" class="quantum-text-field__error" :namespace>
              {{ messages[0] }}
            </Input.Error>

            <span v-if="!isUndefined(limit)" class="quantum-text-field__counter" :data-over="over || undefined">
              {{ used }} / {{ limit }}
            </span>
          </div>
        </div>

        <QuDialog
          v-if="picker"
          v-slot="{ value, commit }"
          v-model="picking"
          :value="model || undefined"
          variant="confirmation"
          @update:value="onPick"
        >
          <QuDialogContent :aria-label="pickerLabel" class="quantum-text-field__dialog">
            <slot :commit :value />

            <QuDialogActions>
              <QuDialogCancel />

              <QuDialogConfirm />
            </QuDialogActions>
          </QuDialogContent>
        </QuDialog>
      </div>
    </component>
  </Input.Root>
</template>

<!--
  Unscoped, like every Quantum stylesheet. Line and label rhythm (normal field):
  16 dp above the floating label, the 12 sp label, 8 dp to the input, the 20 px
  input line, 8 dp to the line, 8 dp to the helper. A label-only field is the
  2016 page's 72 dp tile.
-->
<style>
  .quantum-text-field {
    position: relative;
    display: flex;
    align-items: flex-start;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding-top: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-weight: var(--quantum-type-subheading-weight, 400);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    -webkit-tap-highlight-color: transparent;
  }

  .quantum-text-field__body {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .quantum-text-field__field {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-width: 0;
    padding: 20px 0 var(--quantum-spacing-1, 8px);
    cursor: text;
  }

  /* The icon signifier: 24 dp, 16 dp before the field, level with the input text. */
  .quantum-text-field__icon {
    flex: none;
    margin-top: 18px;
    margin-inline-end: var(--quantum-spacing-2, 16px);
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  /* Label: resting at input size over the input, floating to 12 sp above it. */
  .quantum-text-field__label {
    position: absolute;
    top: 20px;
    inset-inline-start: 0;
    max-width: 100%;
    overflow: hidden;
    font-size: var(--quantum-type-subheading-size, 16px);
    line-height: 20px;
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
    transition:
      transform var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      font-size var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      line-height var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-text-field[data-focused] .quantum-text-field__label,
  .quantum-text-field[data-dirty] .quantum-text-field__label,
  .quantum-text-field[data-textarea] .quantum-text-field__label {
    font-size: var(--quantum-type-caption-size, 12px);
    line-height: 12px;
    transform: translateY(-20px);
  }

  /*
   * The active colour is the accent, as for the cursor (colour page), at the
   * state table's 87% (light) and 100% (dark): the primary ink's alpha in each
   * theme, so the accent channels take it from --quantum-text-primary.
   */
  .quantum-text-field[data-focused] .quantum-text-field__label {
    color: rgb(from var(--quantum-text-primary, rgba(0, 0, 0, 0.87)) var(--quantum-accent-channels, 255 64 129) / alpha);
  }

  .quantum-text-field[data-state='invalid'] .quantum-text-field__label {
    color: var(--quantum-error, #FF1744);
  }

  /* Solo fields and labels promoted to headings keep the name and drop the visible label. */
  .quantum-text-field[data-solo] .quantum-text-field__label,
  .quantum-text-field[data-heading] .quantum-text-field__label {
    width: 1px;
    height: 1px;
    clip-path: inset(50%);
  }

  .quantum-text-field__input {
    flex: 1 1 auto;
    box-sizing: border-box;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    outline: none;
    background: transparent;
    font: inherit;
    font-size: var(--quantum-type-subheading-size, 16px);
    line-height: 20px;
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    caret-color: var(--quantum-accent, #FF4081);
    resize: none;
  }

  /* The line is the focus indicator; a host's generic focus ring would draw a second one. */
  .quantum-text-field__input:focus-visible {
    outline: none;
  }

  .quantum-text-field__input::placeholder {
    color: var(--quantum-text-hint, rgba(0, 0, 0, 0.38));
    opacity: 1;
  }

  /* Prefix and suffix: formatting shows only when the field is pressed, focused or filled. */
  .quantum-text-field__prefix,
  .quantum-text-field__suffix {
    flex: none;
    font-size: var(--quantum-type-subheading-size, 16px);
    line-height: 20px;
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    white-space: nowrap;
    visibility: hidden;
  }

  .quantum-text-field__prefix {
    padding-inline-end: 4px;
  }

  .quantum-text-field__suffix {
    padding-inline-start: 4px;
  }

  .quantum-text-field[data-focused] .quantum-text-field__prefix,
  .quantum-text-field[data-focused] .quantum-text-field__suffix,
  .quantum-text-field[data-dirty] .quantum-text-field__prefix,
  .quantum-text-field[data-dirty] .quantum-text-field__suffix {
    visibility: visible;
  }

  /*
   * The input line: 1 dp at 42% black, 70% white. No token carries that pair;
   * the hover overlay (6% black, 10% white) is exactly a seventh of it in both
   * themes, so the line derives from it rather than hard-coding one theme.
   */
  .quantum-text-field__line {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: 1px;
    background: rgb(from var(--quantum-hover, rgba(0, 0, 0, 0.06)) r g b / calc(alpha * 7));
    pointer-events: none;
    transition:
      height var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Focus: the 2 dp accent line washes out from the touch point ("ripple and wash"). */
  .quantum-text-field__line::after {
    content: '';
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: 2px;
    background: var(--quantum-accent, #FF4081);
    transform: scaleX(0);
    transform-origin: inherit;
    transition: transform var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-text-field[data-focused] .quantum-text-field__line::after {
    transform: scaleX(1);
  }

  /* Hover: 2 dp at the primary ink, "more opacity, helping make text fields more noticeable on desktop". */
  .quantum-text-field:not([data-disabled], [data-focused], [data-state='invalid']) .quantum-text-field__field:hover .quantum-text-field__line {
    height: 2px;
    background: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-text-field[data-state='invalid'] .quantum-text-field__line {
    height: 2px;
    background: var(--quantum-error, #FF1744);
  }

  .quantum-text-field[data-state='invalid'] .quantum-text-field__line::after {
    background: var(--quantum-error, #FF1744);
  }

  .quantum-text-field[data-state='invalid'] .quantum-text-field__input {
    caret-color: var(--quantum-error, #FF1744);
  }

  /* Disabled: a 1 dp dotted line, label and text at the disabled opacity. */
  .quantum-text-field[data-disabled] .quantum-text-field__line {
    height: 0;
    border-top: 1px dotted rgb(from var(--quantum-hover, rgba(0, 0, 0, 0.06)) r g b / calc(alpha * 7));
    background: none;
  }

  .quantum-text-field[data-disabled] .quantum-text-field__field {
    cursor: default;
  }

  .quantum-text-field[data-disabled] .quantum-text-field__label,
  .quantum-text-field[data-disabled] .quantum-text-field__input,
  .quantum-text-field[data-disabled] .quantum-text-field__prefix,
  .quantum-text-field[data-disabled] .quantum-text-field__suffix,
  .quantum-text-field[data-disabled] .quantum-text-field__icon,
  .quantum-text-field[data-disabled] .quantum-text-field__helper {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /*
   * Trailing buttons (clear, visibility, voice) and the picker: 24 dp glyphs in
   * a 48 dp target. The box ends level with the 20 px input line, which leaves
   * the page's 8 dp between the glyph and the input line.
   */
  .quantum-text-field__button {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin: -4px 0 0;
    margin-inline-start: var(--quantum-spacing-1, 8px);
    padding: 0;
    border: 0;
    border-radius: 50%;
    outline: none;
    background: transparent;
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
    cursor: pointer;
    transition: box-shadow var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-text-field__button::after {
    content: '';
    position: absolute;
    inset: calc((24px - var(--quantum-touch-target, 48px)) / 2);
    border-radius: 50%;
  }

  /* Keyboard focus: the 12% overlay as a 48 dp disc around the glyph. */
  .quantum-text-field__button:focus-visible {
    background: var(--quantum-focus, rgba(0, 0, 0, 0.12));
    box-shadow: 0 0 0 12px var(--quantum-focus, rgba(0, 0, 0, 0.12));
  }

  .quantum-text-field__button[data-disabled] {
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
    cursor: default;
    pointer-events: none;
  }

  /* Password: the glyph reads 38% while the text is disguised, 54% while it shows (2016 page). */
  .quantum-text-field__visibility:not([data-active]) {
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  .quantum-text-field__picker {
    margin: 18px 0 0;
    margin-inline-end: var(--quantum-spacing-2, 16px);
  }

  /* Details: helper or error at the start, the counter at the end, 12 sp, 8 dp under the line. */
  .quantum-text-field__details {
    display: flex;
    gap: var(--quantum-spacing-2, 16px);
    padding-top: var(--quantum-spacing-1, 8px);
    font-size: var(--quantum-type-caption-size, 12px);
    line-height: var(--quantum-type-caption-leading, 1);
    letter-spacing: var(--quantum-type-caption-tracking, 0.02em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-text-field__helper,
  .quantum-text-field__error {
    flex: 1 1 auto;
    min-width: 0;
  }

  /* Error text is Red A400 at 87% (light) and 100% (dark), the primary ink's alpha in each theme. */
  .quantum-text-field__error {
    color: rgb(from var(--quantum-text-primary, rgba(0, 0, 0, 0.87)) var(--quantum-error-channels, 255 23 68) / alpha);
  }

  .quantum-text-field__error:empty {
    display: none;
  }

  .quantum-text-field__counter {
    flex: none;
    margin-inline-start: auto;
  }

  .quantum-text-field__counter[data-over] {
    color: var(--quantum-error, #FF1744);
  }

  /* Dense: 13 sp, 8 dp above the label, 4 dp below it and under the line. */
  .quantum-text-field[data-dense] {
    padding-top: var(--quantum-spacing-1, 8px);
  }

  .quantum-text-field[data-dense] .quantum-text-field__field {
    padding-top: 16px;
  }

  .quantum-text-field[data-dense] .quantum-text-field__label {
    top: 16px;
    font-size: 13px;
  }

  .quantum-text-field[data-dense][data-focused] .quantum-text-field__label,
  .quantum-text-field[data-dense][data-dirty] .quantum-text-field__label,
  .quantum-text-field[data-dense][data-textarea] .quantum-text-field__label {
    font-size: var(--quantum-type-caption-size, 12px);
    transform: translateY(-16px);
  }

  .quantum-text-field[data-dense] .quantum-text-field__input,
  .quantum-text-field[data-dense] .quantum-text-field__prefix,
  .quantum-text-field[data-dense] .quantum-text-field__suffix {
    font-size: 13px;
  }

  .quantum-text-field[data-dense] .quantum-text-field__details {
    padding-top: 4px;
  }

  .quantum-text-field[data-dense] .quantum-text-field__icon,
  .quantum-text-field[data-dense] .quantum-text-field__picker {
    margin-top: 16px;
  }

  .quantum-text-field[data-dense] .quantum-text-field__button {
    width: 20px;
    height: 20px;
    margin-block: 0;
  }

  .quantum-text-field[data-dense] .quantum-text-field__button::after {
    inset: calc((20px - var(--quantum-touch-target, 48px)) / 2);
  }

  /*
   * The text field box: a 56 dp fill with 4 dp corners masking the ends of the
   * line; 6% black, 10% white (the hover overlay's pair). The label rests
   * centred and floats to 8 dp from the top; 16 dp side padding.
   */
  .quantum-text-field[data-box] {
    padding-top: 0;
  }

  .quantum-text-field[data-box] .quantum-text-field__field {
    min-height: 56px;
    padding: 28px var(--quantum-spacing-2, 16px) var(--quantum-spacing-1, 8px);
    overflow: hidden;
    border-radius: var(--quantum-radius-box, 4px);
    background: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  .quantum-text-field[data-box] .quantum-text-field__label {
    top: 18px;
    inset-inline-start: var(--quantum-spacing-2, 16px);
  }

  .quantum-text-field[data-box][data-focused] .quantum-text-field__label,
  .quantum-text-field[data-box][data-dirty] .quantum-text-field__label {
    transform: translateY(-10px);
  }

  .quantum-text-field[data-box] .quantum-text-field__icon,
  .quantum-text-field[data-box] .quantum-text-field__picker {
    margin-top: 16px;
  }

  .quantum-text-field[data-box] .quantum-text-field__details {
    padding-inline: var(--quantum-spacing-2, 16px);
  }

  .quantum-text-field[data-box][data-dense] .quantum-text-field__field {
    min-height: 44px;
    padding-top: 24px;
    padding-bottom: 0;
  }

  .quantum-text-field[data-box][data-dense] .quantum-text-field__label {
    top: 12px;
  }

  .quantum-text-field[data-box][data-dense][data-focused] .quantum-text-field__label,
  .quantum-text-field[data-box][data-dense][data-dirty] .quantum-text-field__label {
    transform: translateY(-4px);
  }

  .quantum-text-field[data-box][data-dense] .quantum-text-field__icon,
  .quantum-text-field[data-box][data-dense] .quantum-text-field__picker {
    margin-top: 12px;
  }

  /*
   * Full width: 56 dp (48 dp dense), the text 20 dp (16 dp) from the edges
   * measured to the em box of a 20 px line; fields are separated by the 1 dp
   * divider and the label is a hint that clears once the field is in use.
   */
  .quantum-text-field[data-full-width] {
    padding-top: 0;
  }

  .quantum-text-field[data-full-width] .quantum-text-field__field {
    min-height: 56px;
    padding: 18px var(--quantum-spacing-2, 16px);
  }

  .quantum-text-field[data-full-width] .quantum-text-field__label {
    top: 18px;
    inset-inline-start: var(--quantum-spacing-2, 16px);
    font-size: var(--quantum-type-subheading-size, 16px);
    line-height: 20px;
    transform: none;
  }

  .quantum-text-field[data-full-width][data-focused] .quantum-text-field__label,
  .quantum-text-field[data-full-width][data-dirty] .quantum-text-field__label {
    visibility: hidden;
  }

  .quantum-text-field[data-full-width] .quantum-text-field__line {
    height: 1px;
    background: var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-text-field[data-full-width] .quantum-text-field__line::after {
    content: none;
  }

  .quantum-text-field[data-full-width] .quantum-text-field__details {
    padding-inline: var(--quantum-spacing-2, 16px);
  }

  /* Stacked full-width fields meet at their dividers; only a details row with text keeps its 8 dp. */
  .quantum-text-field[data-full-width] .quantum-text-field__details[data-empty] {
    padding-top: 0;
  }

  .quantum-text-field[data-full-width][data-dense] .quantum-text-field__field {
    min-height: 48px;
    padding-block: 14px;
  }

  .quantum-text-field[data-full-width][data-dense] .quantum-text-field__label {
    top: 14px;
    font-size: 13px;
  }

  /*
   * Solo: a raised sheet for a single action such as search. No line and no
   * floating label; icons sit inside the 48 dp sheet. 2 dp at rest, 3 dp over
   * scrolled content (elevation page, quick entry and search bar).
   */
  .quantum-text-field[data-solo] {
    padding-top: 0;
  }

  .quantum-text-field[data-solo] .quantum-text-field__field {
    min-height: var(--quantum-touch-target, 48px);
    padding: 0 var(--quantum-spacing-2, 16px);
    border-radius: var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    transition: box-shadow 280ms var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-text-field[data-solo][data-scrolled] .quantum-text-field__field {
    box-shadow: var(--quantum-elevation-3, 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12));
  }

  .quantum-text-field[data-solo] .quantum-text-field__line {
    display: none;
  }

  .quantum-text-field[data-solo] .quantum-text-field__icon {
    margin-top: 0;
  }

  /* No line to clear: the trailing glyphs centre in the sheet like the signifier. */
  .quantum-text-field[data-solo] .quantum-text-field__button {
    margin-block: -2px;
  }

  .quantum-text-field[data-solo] .quantum-text-field__prefix,
  .quantum-text-field[data-solo] .quantum-text-field__suffix {
    visibility: visible;
  }

  /* Multi-line: grows downward from one line; the buttons stay level with the first line. */
  .quantum-text-field[data-multiline] .quantum-text-field__field {
    align-items: flex-start;
  }

  .quantum-text-field[data-multiline] .quantum-text-field__input {
    overflow: hidden;
  }

  /*
   * Text area: five 20 px lines with 8 dp of padding inside a visible border in
   * the line's colour and thickness; the label stays floated above it and the
   * content scrolls once it overflows.
   */
  .quantum-text-field[data-textarea] .quantum-text-field__field {
    align-items: flex-start;
  }

  .quantum-text-field[data-textarea] .quantum-text-field__input {
    height: 118px;
    padding: var(--quantum-spacing-1, 8px);
    overflow-y: auto;
    border: 1px solid rgb(from var(--quantum-hover, rgba(0, 0, 0, 0.06)) r g b / calc(alpha * 7));
    border-radius: var(--quantum-radius, 2px);
  }

  .quantum-text-field[data-textarea][data-focused] .quantum-text-field__input {
    border-color: var(--quantum-accent, #FF4081);
    box-shadow: inset 0 0 0 1px var(--quantum-accent, #FF4081);
  }

  .quantum-text-field[data-textarea][data-state='invalid'] .quantum-text-field__input {
    border-color: var(--quantum-error, #FF1744);
    box-shadow: inset 0 0 0 1px var(--quantum-error, #FF1744);
  }

  .quantum-text-field[data-textarea][data-disabled] .quantum-text-field__input {
    border-style: dotted;
  }

  .quantum-text-field[data-textarea] .quantum-text-field__line {
    display: none;
  }

  /* Dropdown: the readonly control is the select's activator; the arrow sits at its end. */
  .quantum-text-field[data-dropdown] .quantum-text-field__input {
    display: flex;
    align-items: center;
    min-height: 20px;
    cursor: pointer;
    user-select: none;
  }

  .quantum-text-field[data-dropdown][data-disabled] .quantum-text-field__input {
    cursor: default;
  }

  .quantum-text-field__value,
  .quantum-text-field__placeholder {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .quantum-text-field__placeholder {
    color: var(--quantum-text-hint, rgba(0, 0, 0, 0.38));
  }

  .quantum-text-field__dropdown {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin: -4px 0 0;
    margin-inline-start: auto;
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  /*
   * The dropdown's menu: QuMenu's 8 dp sheet with 8 dp above and below the
   * 48 dp rows, at least as wide as the field. Layout stays off the popover
   * element itself so the browser's closed state keeps it hidden.
   */
  .quantum-text-field__list {
    box-sizing: border-box;
    min-width: 112px;
    min-width: anchor-size(width);
    max-height: calc(100vh - 2 * var(--quantum-spacing-2, 16px));
    margin: 0;
    padding: var(--quantum-spacing-1, 8px) 0;
    overflow-y: auto;
    border: 0;
    border-radius: var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  @media (min-width: 600px) {
    .quantum-text-field__list {
      max-height: calc(100vh - 2 * var(--quantum-spacing-3, 24px));
    }
  }
</style>
