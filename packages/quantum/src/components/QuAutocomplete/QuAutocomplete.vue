<script lang="ts">
  // Framework
  import {
    Button,
    Combobox,
    isArray,
    isElement,
    isNullOrUndefined,
    useId,
    useLocale,
    useLogger,
  } from '@vuetify/v0'

  // Components
  import QuChip from '../QuChip/QuChip.vue'
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  // Context
  import { provideQuAutocomplete } from './context'
  import QuAutocompleteSuggestion from './QuAutocompleteSuggestion.vue'

  // Utilities
  import { nextTick, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'
  import type { ComboboxRootProps } from '@vuetify/v0'

  // Styles: the field draws with QuTextField's anatomy classes, so its
  // stylesheet loads wherever the autocomplete is imported on its own.
  import '../QuTextField/QuTextField.vue'

  /**
   * Quantum keeps v0's selection surface (`strict`, `multiple`, `displayValue`),
   * form association (`id`, `name`) and the forced error state. It withholds
   * `mandatory`, the filtering `adapter`, the `positionAdapter` and `form`: the
   * suggestions filter on the client as the user types and open under the field
   * (text-fields page, auto-complete). `label` is the visible `<label for>`.
   */
  export interface QuAutocompleteProps extends Pick<
    ComboboxRootProps,
    'id' | 'name' | 'disabled' | 'strict' | 'multiple' | 'error' | 'errorMessages' | 'displayValue' | 'namespace'
  > {
    /** The label every text field needs: resting at input size, floating at 12 sp on focus or with content. */
    label?: string
    /** The label became a heading elsewhere on the screen: hidden visually, still the accessible name. */
    heading?: boolean
    /** Helper text under the line. An error replaces it. */
    helper?: string
    /** Hint text in the field, shown once the label floats (or always without a visible label). */
    placeholder?: string
    /** Fixed text before the input, shown when focused or filled. */
    prefix?: string
    /** Fixed text after the input, shown when focused or filled. */
    suffix?: string
    /** An asterisk after the label and `aria-required` on the input. */
    required?: boolean
    /** "(optional)" after the label. */
    optional?: boolean
    /** The icon signifier: a 24 dp glyph 16 dp before the field. */
    icon?: QuIconName
    /** A clear button at the end of the field, enabled only while it holds text or a choice. */
    clearable?: boolean
    /** The text field box: a 56 dp filled rectangle with 4 dp corners. */
    box?: boolean
    /** The condensed field: 13 sp text, halved spacings, 40 dp suggestion rows. */
    dense?: boolean
    /** Spans its container: 56 dp tall (48 dp dense), the divider as its line. */
    fullWidth?: boolean
    /** The raised 48 dp field for a single action such as search: no line, no floating label, 2 dp. */
    solo?: boolean
    /** A solo field over scrolled content rises from 2 dp to 3 dp. */
    scrolled?: boolean
    /**
     * In-line auto-complete: the first suggestion completes the typed text to
     * the right of the cursor at the placeholder colour, and Enter accepts it.
     * No menu opens.
     */
    inline?: boolean
  }

  function text (value: unknown): string {
    return isNullOrUndefined(value) ? '' : String(value)
  }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'QuAutocomplete', inheritAttrs: false })

  defineSlots<{
    /** The `Item` suggestions, and an `Empty` row for a query nothing matches. */
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: T | T[]]
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
    required = false,
    optional = false,
    icon,
    clearable = false,
    box = false,
    dense = false,
    fullWidth = false,
    solo = false,
    scrolled = false,
    disabled = false,
    strict = false,
    multiple = false,
    inline = false,
    error = false,
    errorMessages,
    displayValue,
    namespace = 'v0:combobox',
  } = defineProps<QuAutocompleteProps>()

  const model = defineModel<T | T[]>()

  const attrs = useAttrs()
  const locale = useLocale()
  const logger = useLogger()

  const fallback = useId()
  const id = String(_id ?? fallback)
  const input = `${id}-input`

  const root = useTemplateRef<HTMLElement>('root')

  const focus = shallowRef(false)
  // The touch point the focused line washes out from; centred for keyboard focus.
  const origin = shallowRef<string>()

  const hidden = toRef(() => solo || heading)

  // `class` and `style` dress the root; every other attribute (aria-*, inputmode) belongs to the input.
  const outer = toRef(() => ({ class: attrs.class, style: attrs.style }))
  const inner = toRef(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style')))

  // Inline completion has no list to expand: the input says so in place of v0's listbox attributes.
  const control = toRef(() => ({
    ...inner.value,
    'aria-required': required || undefined,
    ...(inline ? { 'aria-autocomplete': 'inline', 'aria-expanded': false } : {}),
  }))

  const chips = toRef((): T[] => multiple && isArray(model.value) ? model.value : [])

  const filled = toRef(() => {
    const value = model.value

    if (isArray(value)) return value.length > 0

    return text(value) !== ''
  })

  const clearLabel = toRef(() => locale.ti('Quantum.clear') ?? 'Clear')
  const optionalLabel = toRef(() => locale.ti('Quantum.optional') ?? '(optional)')

  function display (value: unknown): string {
    return displayValue ? displayValue(value) : text(value)
  }

  provideQuAutocomplete({
    namespace: toRef(() => namespace),
    dense: toRef(() => dense),
    display,
  })

  if (__DEV__) {
    watch(() => !label && !attrs['aria-label'], wrong => {
      if (wrong) logger.warn('[QuAutocomplete] every text field needs a label (text-fields page); pass `label`, with `heading` when it is a heading elsewhere')
    }, { immediate: true })
  }

  function field (): HTMLInputElement | null {
    return root.value?.querySelector<HTMLInputElement>('[role="combobox"]') ?? null
  }

  function onFocusin () {
    focus.value = true
  }

  function onFocusout (event: FocusEvent) {
    if (isElement(event.relatedTarget) && root.value?.contains(event.relatedTarget)) return

    focus.value = false
    origin.value = undefined
  }

  function onPointerdown (event: PointerEvent) {
    const el = event.currentTarget

    if (!isElement(el)) return

    origin.value = `${event.clientX - el.getBoundingClientRect().left}px 50%`
  }

  /** A press on the field that is not one of its buttons puts the caret in the input and shows the suggestions. */
  function onField (event: MouseEvent, open: () => void) {
    if (disabled || (isElement(event.target) && event.target.closest('button'))) return

    field()?.focus()
    open()
  }

  /**
   * Backspace in an empty input moves focus to the last chip, where the next
   * Backspace deletes it (QuChip's own key). Capture phase, so v0's keyboard
   * model on the input never sees the key.
   */
  function onKeydown (event: KeyboardEvent) {
    if (event.key !== 'Backspace' || event.target !== field() || field()?.value !== '' || chips.value.length === 0) return

    const all = [...root.value?.querySelectorAll<HTMLElement>('.quantum-autocomplete__chip') ?? []]
    const last = all.at(-1)

    if (!last) return

    event.preventDefault()
    last.focus()
  }

  async function onRemove (value: T) {
    if (disabled || !isArray(model.value)) return

    model.value = model.value.filter(item => item !== value)

    await nextTick()
    field()?.focus()
  }

  function onClear (clear: () => void) {
    clear()
    field()?.focus()
  }
</script>

<template>
  <Combobox.Root
    :id
    v-slot="{ isOpen, isEmpty, isValid, errors, query, clear, open }"
    v-model="model"
    :disabled
    :display-value="display"
    :error
    :error-messages
    :multiple
    :name
    :namespace
    :strict
  >
    <div
      v-bind="outer"
      class="quantum-autocomplete"
      :data-disabled="disabled || undefined"
      :data-inline="inline || undefined"
      :data-multiple="multiple || undefined"
      :data-open="isOpen && !inline || undefined"
    >
      <div
        ref="root"
        class="quantum-text-field"
        :data-box="box || undefined"
        :data-dense="dense || undefined"
        :data-dirty="filled || query !== '' || undefined"
        :data-disabled="disabled || undefined"
        :data-focused="focus || undefined"
        :data-full-width="fullWidth || undefined"
        :data-heading="heading || undefined"
        :data-scrolled="solo && scrolled || undefined"
        :data-solo="solo || undefined"
        :data-state="isValid === false ? 'invalid' : 'pristine'"
        @focusin="onFocusin"
        @focusout="onFocusout"
      >
        <QuIcon
          v-if="icon && !solo"
          class="quantum-text-field__icon"
          :name="icon"
          :size="dense ? 's' : 'm'"
        />

        <div class="quantum-text-field__body">
          <Combobox.Activator
            class="quantum-text-field__field quantum-autocomplete__field"
            :data-disabled="disabled || undefined"
            :namespace
            @click="onField($event, open)"
            @keydown.capture="onKeydown"
            @pointerdown="onPointerdown"
          >
            <QuRipple v-if="box" />

            <QuIcon
              v-if="icon && solo"
              class="quantum-text-field__icon"
              :name="icon"
              :size="dense ? 's' : 'm'"
            />

            <label
              v-if="label"
              :id="`${id}-label`"
              class="quantum-text-field__label"
              :for="input"
            >
              {{ label }}<span v-if="required" aria-hidden="true" class="quantum-text-field__required"> *</span><span v-if="optional && !required" class="quantum-text-field__optional">&nbsp;{{ optionalLabel }}</span>
            </label>

            <QuChip
              v-for="(chip, index) in chips"
              :key="index"
              class="quantum-autocomplete__chip"
              contact
              deletable
              :disabled
              @delete="onRemove(chip)"
            >
              {{ display(chip) }}
            </QuChip>

            <span v-if="prefix" class="quantum-text-field__prefix">{{ prefix }}</span>

            <span class="quantum-autocomplete__control">
              <Combobox.Control
                v-bind="control"
                class="quantum-text-field__input"
                :namespace
                :placeholder="!label || hidden || focus || filled ? placeholder : undefined"
                @input="open()"
              />

              <QuAutocompleteSuggestion v-if="inline" :namespace />
            </span>

            <span v-if="suffix" class="quantum-text-field__suffix">{{ suffix }}</span>

            <Button.Root
              v-if="clearable"
              :aria-label="clearLabel"
              class="quantum-text-field__button quantum-text-field__clear"
              :disabled="disabled || !(filled || query !== '')"
              @click="onClear(clear)"
              @mousedown.prevent
            >
              <QuRipple unbounded />

              <QuIcon name="close" :size="dense ? 's' : 'm'" />
            </Button.Root>

            <span aria-hidden="true" class="quantum-text-field__line" :style="origin ? { transformOrigin: origin } : undefined" />
          </Combobox.Activator>

          <Combobox.Content
            class="quantum-autocomplete__list"
            :data-dense="dense || undefined"
            :data-empty="isEmpty || undefined"
            eager
            :namespace
          >
            <slot />
          </Combobox.Content>

          <div
            class="quantum-text-field__details"
            :data-empty="!helper && errors.length === 0 || undefined"
          >
            <Combobox.Description
              v-if="helper && errors.length === 0"
              class="quantum-text-field__helper"
              :namespace
            >
              {{ helper }}
            </Combobox.Description>

            <Combobox.Error v-slot="{ errors: messages }" class="quantum-text-field__error" :namespace>
              {{ messages[0] }}
            </Combobox.Error>
          </div>
        </div>
      </div>
    </div>
  </Combobox.Root>
</template>

<!--
  Unscoped, like every Quantum stylesheet. The field itself is QuTextField's
  anatomy (its stylesheet paints `.quantum-text-field*`); this sheet adds the
  chips row, the in-line completion and the suggestion list.
-->
<style>
  .quantum-autocomplete {
    position: relative;
    display: block;
    width: 100%;
    min-width: 0;
  }

  /* Contact chips sit in the field ahead of the input and wrap onto more rows. */
  .quantum-autocomplete[data-multiple] .quantum-autocomplete__field {
    flex-wrap: wrap;
  }

  /*
   * The in-field contact chip: 32 dp with 4 dp above and below, which it gives
   * back as it grows to 40 dp while focused (chips page), 8 dp to its neighbour.
   */
  .quantum-autocomplete__chip {
    margin-block: 4px;
    margin-inline-end: var(--quantum-spacing-1, 8px);
  }

  .quantum-autocomplete__chip[data-focused] {
    margin-block: 0;
  }

  /* Beside chips the input keeps room to type, or wraps onto a row of its own. */
  .quantum-autocomplete[data-multiple] .quantum-autocomplete__control {
    min-width: 64px;
  }

  .quantum-autocomplete__control {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
  }

  /*
   * In-line completion: "displayed to the right of the cursor, using the same
   * font size and color as placeholder text" (text-fields page). The typed run
   * is laid out invisibly so the suggestion starts where the typing ends.
   */
  .quantum-autocomplete__suggestion {
    position: absolute;
    inset: 0;
    overflow: hidden;
    font: inherit;
    font-size: var(--quantum-type-subheading-size, 16px);
    line-height: 20px;
    color: var(--quantum-text-hint, rgba(0, 0, 0, 0.38));
    white-space: pre;
    pointer-events: none;
  }

  .quantum-text-field[data-dense] .quantum-autocomplete__suggestion {
    font-size: 13px;
  }

  .quantum-autocomplete__typed {
    visibility: hidden;
  }

  /*
   * The suggestion list: QuMenu's 8 dp sheet anchored under the field, 8 dp
   * above the first row and below the last, at least as wide as the field.
   * No display of its own, so the browser's closed popover stays hidden.
   */
  .quantum-autocomplete__list {
    box-sizing: border-box;
    min-width: 112px;
    min-width: anchor-size(width);
    max-height: calc(100vh - 2 * var(--quantum-keyline-margin, 16px) - var(--quantum-touch-target, 48px));
    margin: 0;
    padding: var(--quantum-spacing-1, 8px) 0;
    overflow-x: clip;
    overflow-y: auto;
    border: 0;
    border-radius: var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* Desktop resting elevations are 2 dp below the listed values (elevation page). */
  @media (pointer: fine) {
    .quantum-autocomplete__list {
      box-shadow: var(--quantum-elevation-6, 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12));
    }
  }

  /*
   * In-line completion opens no menu: the suggestion is in the field. A query
   * nothing matches leaves no sheet to draw unless an Empty row says so.
   */
  .quantum-autocomplete[data-inline] .quantum-autocomplete__list,
  .quantum-autocomplete__list[data-empty]:not(:has(> .quantum-autocomplete__empty)) {
    display: none;
  }

  /*
   * A row: 48 dp, Subheading text 16 dp from the sheet's edges (menus page).
   * The highlighted row takes the 6% hover overlay (lead decision 3), the
   * selected one the 12% focus shade.
   */
  .quantum-autocomplete__item,
  .quantum-autocomplete__empty {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: var(--quantum-touch-target, 48px);
    padding: 0 var(--quantum-spacing-2, 16px);
    overflow: hidden;
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    line-height: 20px;
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .quantum-autocomplete__item {
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-autocomplete__item:not([data-disabled]):hover,
  .quantum-autocomplete__item[data-highlighted] {
    background-color: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  .quantum-autocomplete__item[data-selected],
  .quantum-autocomplete__item[data-selected]:hover {
    background-color: var(--quantum-focus, rgba(0, 0, 0, 0.12));
  }

  .quantum-autocomplete__item[data-disabled] {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
    cursor: default;
  }

  /* The empty row is information, not a choice: secondary ink, no target. */
  .quantum-autocomplete__empty {
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Positioned so the text paints above the ink layer. */
  .quantum-autocomplete__label {
    position: relative;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /*
   * The leading glyph sits 16 dp from the start edge at 54% ink; a list that
   * holds one moves every row's text to the 72 dp keyline (80 dp from 600 px).
   */
  .quantum-autocomplete__icon {
    position: absolute;
    inset-inline-start: var(--quantum-spacing-2, 16px);
    top: 50%;
    translate: 0 -50%;
    display: inline-flex;
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-autocomplete__item[data-disabled] .quantum-autocomplete__icon {
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  .quantum-autocomplete__list:has(> [data-icon]) > .quantum-autocomplete__item,
  .quantum-autocomplete__list:has(> [data-icon]) > .quantum-autocomplete__empty {
    padding-inline-start: var(--quantum-keyline-content, 72px);
  }

  /* Dense: 40 dp rows at 14 sp, the dense list tile and the menus page's dense type. */
  .quantum-autocomplete__list[data-dense] > .quantum-autocomplete__item,
  .quantum-autocomplete__list[data-dense] > .quantum-autocomplete__empty {
    height: 40px;
    font-size: var(--quantum-type-body-1-size, 14px);
  }
</style>
