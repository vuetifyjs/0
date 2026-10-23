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

  // Context
  import Md1AutocompleteSuggestion from './Md1AutocompleteSuggestion.vue'

  import { provideMd1Autocomplete } from './context'

  // Utilities
  import { nextTick, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { Md1IconName } from '../../icons'
  import type { ComboboxRootProps } from '@vuetify/v0'

  import Md1Chip from '../Md1Chip/Md1Chip.vue'
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'
  // Styles: the field draws with Md1TextField's anatomy classes, so its
  // stylesheet loads wherever the autocomplete is imported on its own.
  import '../Md1TextField/Md1TextField.vue'

  /**
   * MD1 keeps v0's selection surface (`strict`, `multiple`, `displayValue`),
   * form association (`id`, `name`) and the forced error state. It withholds
   * `mandatory`, the filtering `adapter`, the `positionAdapter` and `form`: the
   * suggestions filter on the client as the user types and open under the field
   * (text-fields page, auto-complete). `label` is the visible `<label for>`.
   */
  export interface Md1AutocompleteProps extends Pick<
    ComboboxRootProps,
    'id' | 'name' | 'disabled' | 'strict' | 'multiple' | 'error' | 'displayValue' | 'namespace'
  > {
    /**
     * Messages shown under the line in the error colour. Declared here rather
     * than picked from v0, because the declaration bundler drops v0's
     * `MaybeArray` from a generic component's inlined props.
     */
    errorMessages?: string | string[]
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
    icon?: Md1IconName
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
  defineOptions({ name: 'Md1Autocomplete', inheritAttrs: false })

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
  } = defineProps<Md1AutocompleteProps>()

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

  const clearLabel = toRef(() => locale.ti('Md1.clear') ?? 'Clear')
  const optionalLabel = toRef(() => locale.ti('Md1.optional') ?? '(optional)')

  function display (value: unknown): string {
    return displayValue ? displayValue(value) : text(value)
  }

  provideMd1Autocomplete({
    namespace: toRef(() => namespace),
    dense: toRef(() => dense),
    display,
  })

  if (__DEV__) {
    watch(() => !label && !attrs['aria-label'], wrong => {
      if (wrong) logger.warn('[Md1Autocomplete] every text field needs a label (text-fields page); pass `label`, with `heading` when it is a heading elsewhere')
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
   * Backspace deletes it (Md1Chip's own key). Capture phase, so v0's keyboard
   * model on the input never sees the key.
   */
  function onKeydown (event: KeyboardEvent) {
    if (event.key !== 'Backspace' || event.target !== field() || field()?.value !== '' || chips.value.length === 0) return

    const all = [...root.value?.querySelectorAll<HTMLElement>('.md1-autocomplete__chip') ?? []]
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
      class="md1-autocomplete"
      :data-disabled="disabled || undefined"
      :data-inline="inline || undefined"
      :data-multiple="multiple || undefined"
      :data-open="isOpen && !inline || undefined"
    >
      <div
        ref="root"
        class="md1-text-field"
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
        <Md1Icon
          v-if="icon && !solo"
          class="md1-text-field__icon"
          :name="icon"
          :size="dense ? 's' : 'm'"
        />

        <div class="md1-text-field__body">
          <Combobox.Activator
            class="md1-text-field__field md1-autocomplete__field"
            :data-disabled="disabled || undefined"
            :namespace
            @click="onField($event, open)"
            @keydown.capture="onKeydown"
            @pointerdown="onPointerdown"
          >
            <Md1Ripple v-if="box" />

            <Md1Icon
              v-if="icon && solo"
              class="md1-text-field__icon"
              :name="icon"
              :size="dense ? 's' : 'm'"
            />

            <label
              v-if="label"
              :id="`${id}-label`"
              class="md1-text-field__label"
              :for="input"
            >
              {{ label }}<span v-if="required" aria-hidden="true" class="md1-text-field__required"> *</span><span v-if="optional && !required" class="md1-text-field__optional">&nbsp;{{ optionalLabel }}</span>
            </label>

            <Md1Chip
              v-for="(chip, index) in chips"
              :key="index"
              class="md1-autocomplete__chip"
              contact
              deletable
              :disabled
              @delete="onRemove(chip)"
            >
              {{ display(chip) }}
            </Md1Chip>

            <span v-if="prefix" class="md1-text-field__prefix">{{ prefix }}</span>

            <span class="md1-autocomplete__control">
              <Combobox.Control
                v-bind="control"
                class="md1-text-field__input"
                :namespace
                :placeholder="!label || hidden || focus || filled ? placeholder : undefined"
                @input="open()"
              />

              <Md1AutocompleteSuggestion v-if="inline" :namespace />
            </span>

            <span v-if="suffix" class="md1-text-field__suffix">{{ suffix }}</span>

            <Button.Root
              v-if="clearable"
              :aria-label="clearLabel"
              class="md1-text-field__button md1-text-field__clear"
              :disabled="disabled || !(filled || query !== '')"
              @click="onClear(clear)"
              @mousedown.prevent
            >
              <Md1Ripple unbounded />

              <Md1Icon name="close" :size="dense ? 's' : 'm'" />
            </Button.Root>

            <span aria-hidden="true" class="md1-text-field__line" :style="origin ? { transformOrigin: origin } : undefined" />
          </Combobox.Activator>

          <Combobox.Content
            class="md1-autocomplete__list"
            :data-dense="dense || undefined"
            :data-empty="isEmpty || undefined"
            eager
            :namespace
          >
            <slot />
          </Combobox.Content>

          <div
            class="md1-text-field__details"
            :data-empty="!helper && errors.length === 0 || undefined"
          >
            <Combobox.Description
              v-if="helper && errors.length === 0"
              class="md1-text-field__helper"
              :namespace
            >
              {{ helper }}
            </Combobox.Description>

            <Combobox.Error v-slot="{ errors: messages }" class="md1-text-field__error" :namespace>
              {{ messages[0] }}
            </Combobox.Error>
          </div>
        </div>
      </div>
    </div>
  </Combobox.Root>
</template>

<!--
  Unscoped, like every MD1 stylesheet. The field itself is Md1TextField's
  anatomy (its stylesheet paints `.md1-text-field*`); this sheet adds the
  chips row, the in-line completion and the suggestion list.
-->
<style>
  .md1-autocomplete {
    position: relative;
    display: block;
    width: 100%;
    min-width: 0;
  }

  /* Contact chips sit in the field ahead of the input and wrap onto more rows. */
  .md1-autocomplete[data-multiple] .md1-autocomplete__field {
    flex-wrap: wrap;
  }

  /*
   * The in-field contact chip: 32 dp with 4 dp above and below, which it gives
   * back as it grows to 40 dp while focused (chips page), 8 dp to its neighbour.
   */
  .md1-autocomplete__chip {
    margin-block: 4px;
    margin-inline-end: var(--md1-spacing-1, 8px);
  }

  .md1-autocomplete__chip[data-focused] {
    margin-block: 0;
  }

  /* Beside chips the input keeps room to type, or wraps onto a row of its own. */
  .md1-autocomplete[data-multiple] .md1-autocomplete__control {
    min-width: 64px;
  }

  .md1-autocomplete__control {
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
  .md1-autocomplete__suggestion {
    position: absolute;
    inset: 0;
    overflow: hidden;
    font: inherit;
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: 20px;
    color: var(--md1-text-hint, rgba(0, 0, 0, 0.38));
    white-space: pre;
    pointer-events: none;
  }

  .md1-text-field[data-dense] .md1-autocomplete__suggestion {
    font-size: 13px;
  }

  .md1-autocomplete__typed {
    visibility: hidden;
  }

  /*
   * The suggestion list: Md1Menu's 8 dp sheet anchored under the field, 8 dp
   * above the first row and below the last, at least as wide as the field.
   * No display of its own, so the browser's closed popover stays hidden.
   */
  .md1-autocomplete__list {
    box-sizing: border-box;
    min-width: 112px;
    min-width: anchor-size(width);
    max-height: calc(100vh - 2 * var(--md1-keyline-margin, 16px) - var(--md1-touch-target, 48px));
    margin: 0;
    padding: var(--md1-spacing-1, 8px) 0;
    overflow-x: clip;
    overflow-y: auto;
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* Desktop resting elevations are 2 dp below the listed values (elevation page). */
  @media (pointer: fine) {
    .md1-autocomplete__list {
      box-shadow: var(--md1-elevation-6, 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12));
    }
  }

  /*
   * In-line completion opens no menu: the suggestion is in the field. A query
   * nothing matches leaves no sheet to draw unless an Empty row says so.
   */
  .md1-autocomplete[data-inline] .md1-autocomplete__list,
  .md1-autocomplete__list[data-empty]:not(:has(> .md1-autocomplete__empty)) {
    display: none;
  }

  /*
   * A row: 48 dp, Subheading text 16 dp from the sheet's edges (menus page).
   * The highlighted row takes the 6% hover overlay (lead decision 3), the
   * selected one the 12% focus shade.
   */
  .md1-autocomplete__item,
  .md1-autocomplete__empty {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: var(--md1-touch-target, 48px);
    padding: 0 var(--md1-spacing-2, 16px);
    overflow: hidden;
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-type-subheading-weight, 400);
    line-height: 20px;
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .md1-autocomplete__item {
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-autocomplete__item:not([data-disabled]):hover,
  .md1-autocomplete__item[data-highlighted] {
    background-color: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  .md1-autocomplete__item[data-selected],
  .md1-autocomplete__item[data-selected]:hover {
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  .md1-autocomplete__item[data-disabled] {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
    cursor: default;
  }

  /* The empty row is information, not a choice: secondary ink, no target. */
  .md1-autocomplete__empty {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Positioned so the text paints above the ink layer. */
  .md1-autocomplete__label {
    position: relative;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /*
   * The leading glyph sits 16 dp from the start edge at 54% ink; a list that
   * holds one moves every row's text to the 72 dp keyline (80 dp from 600 px).
   */
  .md1-autocomplete__icon {
    position: absolute;
    inset-inline-start: var(--md1-spacing-2, 16px);
    top: 50%;
    translate: 0 -50%;
    display: inline-flex;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-autocomplete__item[data-disabled] .md1-autocomplete__icon {
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  .md1-autocomplete__list:has(> [data-icon]) > .md1-autocomplete__item,
  .md1-autocomplete__list:has(> [data-icon]) > .md1-autocomplete__empty {
    padding-inline-start: var(--md1-keyline-content, 72px);
  }

  /* Dense: 40 dp rows at 14 sp, the dense list tile and the menus page's dense type. */
  .md1-autocomplete__list[data-dense] > .md1-autocomplete__item,
  .md1-autocomplete__list[data-dense] > .md1-autocomplete__empty {
    height: 40px;
    font-size: var(--md1-type-body-1-size, 14px);
  }
</style>
