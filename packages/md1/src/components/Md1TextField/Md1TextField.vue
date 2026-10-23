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
  import type { Md1IconName } from '../../icons'
  import type { InputRootProps } from '@vuetify/v0'
  import type { ComponentPublicInstance, Ref, SetupContext } from 'vue'

  // Components
  import Md1Dialog from '../Md1Dialog/Md1Dialog.vue'
  import Md1DialogActions from '../Md1Dialog/Md1DialogActions.vue'
  import Md1DialogCancel from '../Md1Dialog/Md1DialogCancel.vue'
  import Md1DialogConfirm from '../Md1Dialog/Md1DialogConfirm.vue'
  import Md1DialogContent from '../Md1Dialog/Md1DialogContent.vue'
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /** The two pickers a text field can nest (text-fields page, "Nested menus & pickers"). */
  export type Md1TextFieldPicker = 'date' | 'time'

  /** A character limit, or a word limit counting whitespace-separated words. */
  export type Md1TextFieldCounter = number | { words: number }

  export interface Md1TextFieldContext {
    /** Whether the field is the spec's dropdown, so `Item` children have a list to join. */
    dropdown: Readonly<Ref<boolean>>
  }

  export interface Md1TextFieldSlotProps {
    /** The dropdown's value, or the value a nested picker holds while its dialog is open. */
    value: unknown
    /** Hold a value: the picker's choice until OK, or the dropdown's selection. */
    commit: (value: unknown) => void
  }

  /**
   * Material Design 1 keeps v0's validation surface (`rules`, `validateOn`, `required`,
   * `error`) and form association (`id`, `name`). `label` is the visible
   * `<label for>`; it is not forwarded to `Input.Root`, which would duplicate
   * the accessible name as an `aria-label`.
   */
  export interface Md1TextFieldProps extends Pick<
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
    counter?: Md1TextFieldCounter
    /** An asterisk after the label, `aria-required`, and v0's presence rule. */
    required?: boolean
    /** "(optional)" after the label, for forms where the optional fields are the fewer. */
    optional?: boolean
    /** The icon signifier: a 24 dp glyph 16 dp before the field. */
    icon?: Md1IconName
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
    picker?: Md1TextFieldPicker
    /** Grouped characters, such as `'(###) ###-####'`: `#` a digit, `A` a letter, `*` either. The model stays unformatted. */
    mask?: string
    /** Removes the field from interaction: 38% ink and a dotted line. */
    disabled?: boolean
    /** Shows the value without allowing edits. */
    readonly?: boolean
    /** Error messages to show regardless of the rules. */
    errorMessages?: string | string[]
  }

  const [useMd1TextField, provideMd1TextField] = createContext<Md1TextFieldContext | null>('md1:text-field', null)

  export { useMd1TextField }

  /** Stands in for `Select.Root` when the field is not a dropdown, so one template serves both. */
  function Pass (_props: unknown, { slots }: SetupContext) {
    return slots.default?.({ isOpen: false })
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1TextField', inheritAttrs: false })

  defineSlots<{
    /** `Item` children under `dropdown`; the date or time picker under `picker`. Unused otherwise. */
    default?: (props: Md1TextFieldSlotProps) => any
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
  } = defineProps<Md1TextFieldProps>()

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

  const clearLabel = toRef(() => locale.ti('Md1.clear') ?? 'Clear')
  const voiceLabel = toRef(() => locale.ti('Md1.voice') ?? 'Voice input')
  const optionalLabel = toRef(() => locale.ti('Md1.optional') ?? '(optional)')

  const visibilityLabel = toRef(() => visible.value
    ? locale.ti('Md1.hidePassword') ?? 'Hide password'
    : locale.ti('Md1.showPassword') ?? 'Show password',
  )

  const pickerLabel = toRef(() => picker === 'time'
    ? locale.ti('Md1.chooseTime') ?? 'Choose time'
    : locale.ti('Md1.chooseDate') ?? 'Choose date',
  )

  const select = toRef(() => dropdown
    ? {
      'id': `${id}-select`,
      'modelValue': model.value,
      'onUpdate:modelValue': onSelect,
      'disabled': disabled || readonly,
    }
    : {})

  provideMd1TextField({
    dropdown: toRef(() => dropdown),
  })

  if (__DEV__) {
    watch(() => !label && !attrs['aria-label'], wrong => {
      if (wrong) logger.warn('[Md1TextField] every text field needs a label (text-fields page); pass `label`, with `heading` when it is a heading elsewhere')
    }, { immediate: true })

    watch(() => dropdown && (area.value || !!mask || !!picker), wrong => {
      if (wrong) logger.warn('[Md1TextField] a dropdown field is a single-line select; `multiline`, `textarea`, `mask` and `picker` do not apply to it')
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
        class="md1-text-field"
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
          class="md1-text-field__button md1-text-field__picker"
          :disabled="isDisabled || isReadonly"
          @click="onPicker"
        >
          <Md1Ripple unbounded />

          <Md1Icon :name="picker === 'time' ? 'schedule' : 'event'" :size="dense ? 's' : 'm'" />
        </Button.Root>

        <Md1Icon
          v-else-if="icon && !solo"
          class="md1-text-field__icon"
          :name="icon"
          :size="dense ? 's' : 'm'"
        />

        <div class="md1-text-field__body">
          <div
            class="md1-text-field__field"
            :data-disabled="isDisabled || undefined"
            @click="onField"
            @pointerdown="onPointerdown"
          >
            <Md1Ripple v-if="box" />

            <Md1Icon
              v-if="icon && solo && !picker"
              class="md1-text-field__icon"
              :name="icon"
              :size="dense ? 's' : 'm'"
            />

            <label
              v-if="label"
              :id="`${id}-label`"
              class="md1-text-field__label"
              :for="dropdown ? undefined : id"
            >
              {{ label }}<span v-if="required" aria-hidden="true" class="md1-text-field__required"> *</span><span v-if="optional && !required" class="md1-text-field__optional">&nbsp;{{ optionalLabel }}</span>
            </label>

            <span v-if="prefix" class="md1-text-field__prefix">{{ prefix }}</span>

            <Select.Activator
              v-if="dropdown"
              ref="activator"
              :aria-describedby="errors.length > 0 ? undefined : (helper ? `${id}-description` : undefined)"
              :aria-errormessage="errors.length > 0 ? `${id}-error` : undefined"
              :aria-invalid="state['data-state'] === 'invalid' || undefined"
              :aria-labelledby="label ? `${id}-label` : undefined"
              :aria-required="required || undefined"
              as="div"
              class="md1-text-field__input"
              :label="label ? undefined : (inner['aria-label'] as string | undefined)"
              :tabindex="isDisabled ? -1 : 0"
              @blur="onSelectBlur(validate)"
              @focus="onSelectFocus"
            >
              <Select.Value v-slot="{ selectedItem, selectedValue }" class="md1-text-field__value">
                {{ option(selectedItem, selectedValue) }}
              </Select.Value>

              <Select.Placeholder
                v-if="placeholder && (!label || hidden || focus || isOpen)"
                class="md1-text-field__placeholder"
              >
                {{ placeholder }}
              </Select.Placeholder>

              <span aria-hidden="true" class="md1-text-field__dropdown">
                <Md1Icon name="arrow-drop-down" :size="dense ? 's' : 'm'" />
              </span>
            </Select.Activator>

            <Input.Control
              v-else
              ref="control"
              v-bind="inner"
              :as="area ? 'textarea' : 'input'"
              class="md1-text-field__input"
              :namespace
              :placeholder="!label || hidden || textarea || focus || isDirty ? placeholder : undefined"
              :rows="multiline ? 1 : undefined"
              @input="onInput"
            />

            <span v-if="suffix" class="md1-text-field__suffix">{{ suffix }}</span>

            <Button.Root
              v-if="clearable && !dropdown"
              :aria-label="clearLabel"
              class="md1-text-field__button md1-text-field__clear"
              :disabled="isDisabled || isReadonly || !isDirty"
              @click="onClear"
              @mousedown.prevent
            >
              <Md1Ripple unbounded />

              <Md1Icon name="close" :size="dense ? 's' : 'm'" />
            </Button.Root>

            <Button.Root
              v-if="type === 'password'"
              :aria-label="visibilityLabel"
              class="md1-text-field__button md1-text-field__visibility"
              :data-active="visible || undefined"
              :disabled="isDisabled"
              @click="onVisibility"
              @mousedown.prevent
            >
              <Md1Ripple unbounded />

              <Md1Icon :name="visible ? 'visibility-off' : 'visibility'" :size="dense ? 's' : 'm'" />
            </Button.Root>

            <Button.Root
              v-if="voice"
              :aria-label="voiceLabel"
              class="md1-text-field__button md1-text-field__voice"
              :disabled="isDisabled"
              @click="onVoice"
              @mousedown.prevent
            >
              <Md1Ripple unbounded />

              <Md1Icon name="mic" :size="dense ? 's' : 'm'" />
            </Button.Root>

            <span aria-hidden="true" class="md1-text-field__line" :style="origin ? { transformOrigin: origin } : undefined" />
          </div>

          <!-- Pressing an option must not move focus off the activator, or the field would validate mid-choice. -->
          <Select.Content
            v-if="dropdown"
            class="md1-text-field__list"
            eager
            @mousedown.prevent
          >
            <slot :commit="onSelect" :value="model" />
          </Select.Content>

          <div
            class="md1-text-field__details"
            :data-empty="!helper && errors.length === 0 && isUndefined(limit) || undefined"
          >
            <Input.Description
              v-if="helper && errors.length === 0"
              class="md1-text-field__helper"
              :namespace
            >
              {{ helper }}
            </Input.Description>

            <Input.Error v-slot="{ errors: messages }" class="md1-text-field__error" :namespace>
              {{ messages[0] }}
            </Input.Error>

            <span v-if="!isUndefined(limit)" class="md1-text-field__counter" :data-over="over || undefined">
              {{ used }} / {{ limit }}
            </span>
          </div>
        </div>

        <Md1Dialog
          v-if="picker"
          v-slot="{ value, commit }"
          v-model="picking"
          :value="model || undefined"
          variant="confirmation"
          @update:value="onPick"
        >
          <Md1DialogContent :aria-label="pickerLabel" class="md1-text-field__dialog">
            <slot :commit :value />

            <Md1DialogActions>
              <Md1DialogCancel />

              <Md1DialogConfirm />
            </Md1DialogActions>
          </Md1DialogContent>
        </Md1Dialog>
      </div>
    </component>
  </Input.Root>
</template>

<!--
  Unscoped, like every Material Design 1 stylesheet. Line and label rhythm (normal field):
  16 dp above the floating label, the 12 sp label, 8 dp to the input, the 20 px
  input line, 8 dp to the line, 8 dp to the helper. A label-only field is the
  2016 page's 72 dp tile.
-->
<style>
  .md1-text-field {
    position: relative;
    display: flex;
    align-items: flex-start;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding-top: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-weight: var(--md1-type-subheading-weight, 400);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    -webkit-tap-highlight-color: transparent;
  }

  .md1-text-field__body {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .md1-text-field__field {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-width: 0;
    padding: 20px 0 var(--md1-spacing-1, 8px);
    cursor: text;
  }

  /* The icon signifier: 24 dp, 16 dp before the field, level with the input text. */
  .md1-text-field__icon {
    flex: none;
    margin-top: 18px;
    margin-inline-end: var(--md1-spacing-2, 16px);
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  /* Label: resting at input size over the input, floating to 12 sp above it. */
  .md1-text-field__label {
    position: absolute;
    top: 20px;
    inset-inline-start: 0;
    max-width: 100%;
    overflow: hidden;
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: 20px;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
    transition:
      transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      font-size var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      line-height var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-text-field[data-focused] .md1-text-field__label,
  .md1-text-field[data-dirty] .md1-text-field__label,
  .md1-text-field[data-textarea] .md1-text-field__label {
    font-size: var(--md1-type-caption-size, 12px);
    line-height: 12px;
    transform: translateY(-20px);
  }

  /*
   * The active colour is the accent, as for the cursor (colour page), at the
   * state table's 87% (light) and 100% (dark): the primary ink's alpha in each
   * theme, so the accent channels take it from --md1-text-primary.
   */
  .md1-text-field[data-focused] .md1-text-field__label {
    color: rgb(from var(--md1-text-primary, rgba(0, 0, 0, 0.87)) var(--md1-accent-channels, 255 64 129) / alpha);
  }

  .md1-text-field[data-state='invalid'] .md1-text-field__label {
    color: var(--md1-error, #FF1744);
  }

  /* Solo fields and labels promoted to headings keep the name and drop the visible label. */
  .md1-text-field[data-solo] .md1-text-field__label,
  .md1-text-field[data-heading] .md1-text-field__label {
    width: 1px;
    height: 1px;
    clip-path: inset(50%);
  }

  .md1-text-field__input {
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
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: 20px;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    caret-color: var(--md1-accent, #FF4081);
    resize: none;
  }

  /* The line is the focus indicator; a host's generic focus ring would draw a second one. */
  .md1-text-field__input:focus-visible {
    outline: none;
  }

  .md1-text-field__input::placeholder {
    color: var(--md1-text-hint, rgba(0, 0, 0, 0.38));
    opacity: 1;
  }

  /* `type="search"`: the clear button is the field's own; the engine's cancel glyph would draw a second one. */
  .md1-text-field__input::-webkit-search-cancel-button,
  .md1-text-field__input::-webkit-search-decoration {
    appearance: none;
  }

  /* Prefix and suffix: formatting shows only when the field is pressed, focused or filled. */
  .md1-text-field__prefix,
  .md1-text-field__suffix {
    flex: none;
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: 20px;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    white-space: nowrap;
    visibility: hidden;
  }

  .md1-text-field__prefix {
    padding-inline-end: 4px;
  }

  .md1-text-field__suffix {
    padding-inline-start: 4px;
  }

  .md1-text-field[data-focused] .md1-text-field__prefix,
  .md1-text-field[data-focused] .md1-text-field__suffix,
  .md1-text-field[data-dirty] .md1-text-field__prefix,
  .md1-text-field[data-dirty] .md1-text-field__suffix {
    visibility: visible;
  }

  /*
   * The input line: 1 dp at 42% black, 70% white. No token carries that pair,
   * so the line takes the primary ink's channels (black or white) and maps the
   * red channel onto the alpha: 0 gives 42%, 255 gives 70%. Scaling the hover
   * token by 7 drifted to 41% / 71%, because the 8-digit hex rounds 10% white
   * to 26/255.
   */
  .md1-text-field__line {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: 1px;
    background: rgb(from var(--md1-text-primary, rgba(0, 0, 0, 0.87)) r g b / calc(0.42 + 0.28 * r / 255));
    pointer-events: none;
    transition:
      height var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Focus: the 2 dp accent line washes out from the touch point ("ripple and wash"). */
  .md1-text-field__line::after {
    content: '';
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: 2px;
    background: var(--md1-accent, #FF4081);
    transform: scaleX(0);
    transform-origin: inherit;
    transition: transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-text-field[data-focused] .md1-text-field__line::after {
    transform: scaleX(1);
  }

  /* Hover: 2 dp at the primary ink, "more opacity, helping make text fields more noticeable on desktop". */
  .md1-text-field:not([data-disabled], [data-focused], [data-state='invalid']) .md1-text-field__field:hover .md1-text-field__line {
    height: 2px;
    background: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-text-field[data-state='invalid'] .md1-text-field__line {
    height: 2px;
    background: var(--md1-error, #FF1744);
  }

  .md1-text-field[data-state='invalid'] .md1-text-field__line::after {
    background: var(--md1-error, #FF1744);
  }

  .md1-text-field[data-state='invalid'] .md1-text-field__input {
    caret-color: var(--md1-error, #FF1744);
  }

  /* Disabled: a 1 dp dotted line, label and text at the disabled opacity. */
  .md1-text-field[data-disabled] .md1-text-field__line {
    height: 0;
    border-top: 1px dotted rgb(from var(--md1-text-primary, rgba(0, 0, 0, 0.87)) r g b / calc(0.42 + 0.28 * r / 255));
    background: none;
  }

  .md1-text-field[data-disabled] .md1-text-field__field {
    cursor: default;
  }

  .md1-text-field[data-disabled] .md1-text-field__label,
  .md1-text-field[data-disabled] .md1-text-field__input,
  .md1-text-field[data-disabled] .md1-text-field__prefix,
  .md1-text-field[data-disabled] .md1-text-field__suffix,
  .md1-text-field[data-disabled] .md1-text-field__icon,
  .md1-text-field[data-disabled] .md1-text-field__helper {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /*
   * Trailing buttons (clear, visibility, voice) and the picker: 24 dp glyphs in
   * a 48 dp target. The box ends level with the 20 px input line, which leaves
   * the page's 8 dp between the glyph and the input line.
   */
  .md1-text-field__button {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin: -4px 0 0;
    margin-inline-start: var(--md1-spacing-1, 8px);
    padding: 0;
    border: 0;
    border-radius: 50%;
    outline: none;
    background: transparent;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
    cursor: pointer;
    transition: box-shadow var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-text-field__button::after {
    content: '';
    position: absolute;
    inset: calc((24px - var(--md1-touch-target, 48px)) / 2);
    border-radius: 50%;
  }

  /* Keyboard focus: the 12% overlay as a 48 dp disc around the glyph. */
  .md1-text-field__button:focus-visible {
    background: var(--md1-focus, rgba(0, 0, 0, 0.12));
    box-shadow: 0 0 0 12px var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  .md1-text-field__button[data-disabled] {
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
    cursor: default;
    pointer-events: none;
  }

  /* Password: the glyph reads 38% while the text is disguised, 54% while it shows (2016 page). */
  .md1-text-field__visibility:not([data-active]) {
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  .md1-text-field__picker {
    margin: 18px 0 0;
    margin-inline-end: var(--md1-spacing-2, 16px);
  }

  /* Details: helper or error at the start, the counter at the end, 12 sp, 8 dp under the line. */
  .md1-text-field__details {
    display: flex;
    gap: var(--md1-spacing-2, 16px);
    padding-top: var(--md1-spacing-1, 8px);
    font-size: var(--md1-type-caption-size, 12px);
    line-height: var(--md1-type-caption-leading, 1);
    letter-spacing: var(--md1-type-caption-tracking, 0.02em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-text-field__helper,
  .md1-text-field__error {
    flex: 1 1 auto;
    min-width: 0;
  }

  /* Error text is Red A400 at 87% (light) and 100% (dark), the primary ink's alpha in each theme. */
  .md1-text-field__error {
    color: rgb(from var(--md1-text-primary, rgba(0, 0, 0, 0.87)) var(--md1-error-channels, 255 23 68) / alpha);
  }

  .md1-text-field__error:empty {
    display: none;
  }

  .md1-text-field__counter {
    flex: none;
    margin-inline-start: auto;
  }

  .md1-text-field__counter[data-over] {
    color: var(--md1-error, #FF1744);
  }

  /* Dense: 13 sp, 8 dp above the label, 4 dp below it and under the line. */
  .md1-text-field[data-dense] {
    padding-top: var(--md1-spacing-1, 8px);
  }

  .md1-text-field[data-dense] .md1-text-field__field {
    padding-top: 16px;
  }

  .md1-text-field[data-dense] .md1-text-field__label {
    top: 16px;
    font-size: 13px;
  }

  .md1-text-field[data-dense][data-focused] .md1-text-field__label,
  .md1-text-field[data-dense][data-dirty] .md1-text-field__label,
  .md1-text-field[data-dense][data-textarea] .md1-text-field__label {
    font-size: var(--md1-type-caption-size, 12px);
    transform: translateY(-16px);
  }

  .md1-text-field[data-dense] .md1-text-field__input,
  .md1-text-field[data-dense] .md1-text-field__prefix,
  .md1-text-field[data-dense] .md1-text-field__suffix {
    font-size: 13px;
  }

  .md1-text-field[data-dense] .md1-text-field__details {
    padding-top: 4px;
  }

  .md1-text-field[data-dense] .md1-text-field__icon,
  .md1-text-field[data-dense] .md1-text-field__picker {
    margin-top: 16px;
  }

  .md1-text-field[data-dense] .md1-text-field__button {
    width: 20px;
    height: 20px;
    margin-block: 0;
  }

  .md1-text-field[data-dense] .md1-text-field__button::after {
    inset: calc((20px - var(--md1-touch-target, 48px)) / 2);
  }

  /*
   * The text field box: a 56 dp fill with 4 dp corners masking the ends of the
   * line; 6% black, 10% white (the hover overlay's pair). The label rests
   * centred and floats to 8 dp from the top; 16 dp side padding.
   */
  .md1-text-field[data-box] {
    padding-top: 0;
  }

  .md1-text-field[data-box] .md1-text-field__field {
    min-height: 56px;
    padding: 28px var(--md1-spacing-2, 16px) var(--md1-spacing-1, 8px);
    overflow: hidden;
    border-radius: var(--md1-radius-box, 4px);
    background: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  .md1-text-field[data-box] .md1-text-field__label {
    top: 18px;
    inset-inline-start: var(--md1-spacing-2, 16px);
  }

  .md1-text-field[data-box][data-focused] .md1-text-field__label,
  .md1-text-field[data-box][data-dirty] .md1-text-field__label {
    transform: translateY(-10px);
  }

  .md1-text-field[data-box] .md1-text-field__icon,
  .md1-text-field[data-box] .md1-text-field__picker {
    margin-top: 16px;
  }

  .md1-text-field[data-box] .md1-text-field__details {
    padding-inline: var(--md1-spacing-2, 16px);
  }

  .md1-text-field[data-box][data-dense] .md1-text-field__field {
    min-height: 44px;
    padding-top: 24px;
    padding-bottom: 0;
  }

  .md1-text-field[data-box][data-dense] .md1-text-field__label {
    top: 12px;
  }

  .md1-text-field[data-box][data-dense][data-focused] .md1-text-field__label,
  .md1-text-field[data-box][data-dense][data-dirty] .md1-text-field__label {
    transform: translateY(-4px);
  }

  .md1-text-field[data-box][data-dense] .md1-text-field__icon,
  .md1-text-field[data-box][data-dense] .md1-text-field__picker {
    margin-top: 12px;
  }

  /*
   * Full width: 56 dp (48 dp dense), the text 20 dp (16 dp) from the edges
   * measured to the em box of a 20 px line; fields are separated by the 1 dp
   * divider and the label is a hint that clears once the field is in use.
   */
  .md1-text-field[data-full-width] {
    padding-top: 0;
  }

  .md1-text-field[data-full-width] .md1-text-field__field {
    min-height: 56px;
    padding: 18px var(--md1-spacing-2, 16px);
  }

  .md1-text-field[data-full-width] .md1-text-field__label {
    top: 18px;
    inset-inline-start: var(--md1-spacing-2, 16px);
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: 20px;
    transform: none;
  }

  .md1-text-field[data-full-width][data-focused] .md1-text-field__label,
  .md1-text-field[data-full-width][data-dirty] .md1-text-field__label {
    visibility: hidden;
  }

  .md1-text-field[data-full-width] .md1-text-field__line {
    height: 1px;
    background: var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-text-field[data-full-width] .md1-text-field__line::after {
    content: none;
  }

  .md1-text-field[data-full-width] .md1-text-field__details {
    padding-inline: var(--md1-spacing-2, 16px);
  }

  /* Stacked full-width fields meet at their dividers; only a details row with text keeps its 8 dp. */
  .md1-text-field[data-full-width] .md1-text-field__details[data-empty] {
    padding-top: 0;
  }

  .md1-text-field[data-full-width][data-dense] .md1-text-field__field {
    min-height: 48px;
    padding-block: 14px;
  }

  .md1-text-field[data-full-width][data-dense] .md1-text-field__label {
    top: 14px;
    font-size: 13px;
  }

  /*
   * Solo: a raised sheet for a single action such as search. No line and no
   * floating label; icons sit inside the 48 dp sheet. 2 dp at rest, 3 dp over
   * scrolled content (elevation page, quick entry and search bar).
   */
  .md1-text-field[data-solo] {
    padding-top: 0;
  }

  .md1-text-field[data-solo] .md1-text-field__field {
    min-height: var(--md1-touch-target, 48px);
    padding: 0 var(--md1-spacing-2, 16px);
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    transition: box-shadow 280ms var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-text-field[data-solo][data-scrolled] .md1-text-field__field {
    box-shadow: var(--md1-elevation-3, 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12));
  }

  /*
   * Mouse and keyboard: every resting elevation sits 2 dp lower (elevation
   * page), so the solo sheet rests at 0 dp and 1 dp scrolled, the same row
   * Md1SearchBar draws.
   */
  @media (pointer: fine) {
    .md1-text-field[data-solo] .md1-text-field__field {
      box-shadow: var(--md1-elevation-0, none);
    }

    .md1-text-field[data-solo][data-scrolled] .md1-text-field__field {
      box-shadow: var(--md1-elevation-1, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12));
    }
  }

  .md1-text-field[data-solo] .md1-text-field__line {
    display: none;
  }

  .md1-text-field[data-solo] .md1-text-field__icon {
    margin-top: 0;
  }

  /* No line to clear: the trailing glyphs centre in the sheet like the signifier. */
  .md1-text-field[data-solo] .md1-text-field__button {
    margin-block: -2px;
  }

  .md1-text-field[data-solo] .md1-text-field__prefix,
  .md1-text-field[data-solo] .md1-text-field__suffix {
    visibility: visible;
  }

  /* Multi-line: grows downward from one line; the buttons stay level with the first line. */
  .md1-text-field[data-multiline] .md1-text-field__field {
    align-items: flex-start;
  }

  .md1-text-field[data-multiline] .md1-text-field__input {
    overflow: hidden;
  }

  /*
   * Text area: five 20 px lines with 8 dp of padding inside a visible border in
   * the line's colour and thickness; the label stays floated above it and the
   * content scrolls once it overflows.
   */
  .md1-text-field[data-textarea] .md1-text-field__field {
    align-items: flex-start;
  }

  .md1-text-field[data-textarea] .md1-text-field__input {
    height: 118px;
    padding: var(--md1-spacing-1, 8px);
    overflow-y: auto;
    border: 1px solid rgb(from var(--md1-text-primary, rgba(0, 0, 0, 0.87)) r g b / calc(0.42 + 0.28 * r / 255));
    border-radius: var(--md1-radius, 2px);
  }

  .md1-text-field[data-textarea][data-focused] .md1-text-field__input {
    border-color: var(--md1-accent, #FF4081);
    box-shadow: inset 0 0 0 1px var(--md1-accent, #FF4081);
  }

  .md1-text-field[data-textarea][data-state='invalid'] .md1-text-field__input {
    border-color: var(--md1-error, #FF1744);
    box-shadow: inset 0 0 0 1px var(--md1-error, #FF1744);
  }

  .md1-text-field[data-textarea][data-disabled] .md1-text-field__input {
    border-style: dotted;
  }

  .md1-text-field[data-textarea] .md1-text-field__line {
    display: none;
  }

  /* Dropdown: the readonly control is the select's activator; the arrow sits at its end. */
  .md1-text-field[data-dropdown] .md1-text-field__input {
    display: flex;
    align-items: center;
    min-height: 20px;
    cursor: pointer;
    user-select: none;
  }

  .md1-text-field[data-dropdown][data-disabled] .md1-text-field__input {
    cursor: default;
  }

  .md1-text-field__value,
  .md1-text-field__placeholder {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .md1-text-field__placeholder {
    color: var(--md1-text-hint, rgba(0, 0, 0, 0.38));
  }

  .md1-text-field__dropdown {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin: -4px 0 0;
    margin-inline-start: auto;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  /*
   * The dropdown's menu: Md1Menu's 8 dp sheet with 8 dp above and below the
   * 48 dp rows, at least as wide as the field. Layout stays off the popover
   * element itself so the browser's closed state keeps it hidden.
   */
  .md1-text-field__list {
    box-sizing: border-box;
    min-width: 112px;
    min-width: anchor-size(width);
    max-height: calc(100vh - 2 * var(--md1-spacing-2, 16px));
    margin: 0;
    padding: var(--md1-spacing-1, 8px) 0;
    overflow-y: auto;
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  @media (min-width: 600px) {
    .md1-text-field__list {
      max-height: calc(100vh - 2 * var(--md1-spacing-3, 24px));
    }
  }
</style>
