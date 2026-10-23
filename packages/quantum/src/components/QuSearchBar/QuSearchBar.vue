<script lang="ts">
  // Framework
  import { Combobox, createContext, isNull, useLocale, useLogger } from '@vuetify/v0'

  // Composables
  import { useSearch } from '../../composables/useSearch'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  // Types
  import type { Ref } from 'vue'

  // Components
  import QuButton from '../QuButton/QuButton.vue'

  export interface QuSearchBarProps {
    /** Hint text in the empty field; it also names the field and the search landmark. Defaults to the locale's "Search". */
    placeholder?: string
    /** Show the microphone action: voice search is supported (search page). Emits `voice`. */
    voice?: boolean
    /**
     * The raised Search button to the right of the field (text-fields page,
     * "On desktop, a raised search button should appear to the right of the
     * search field"). Always shown under a fine pointer, whatever this says.
     */
    button?: boolean
    /** Content scrolls under the bar: the sheet rises from 2 dp to 3 dp. */
    scrolled?: boolean
    /** Removes the bar from interaction: no focus, no suggestions, inert actions. */
    disabled?: boolean
    /** Root id; the field is `${id}-input` and the suggestion list `${id}-listbox`. */
    id?: string
    /** Context key of the combobox the field and the suggestions share. Change it only to nest two bars. */
    namespace?: string
  }

  export interface QuSearchBarContext {
    /** The v0 Combobox namespace the parts join. */
    namespace: Readonly<Ref<string>>
    /** Something is typed: completions show, and so does the empty row. */
    typing: Readonly<Ref<boolean>>
    /** Reports the query through `submit` and releases the field. */
    submit: () => void
    /** Registers an `Empty` part, so the list may open on no match; returns the release. */
    track: () => () => void
  }

  const [useQuSearchBar, provideQuSearchBar] = createContext<QuSearchBarContext | null>('quantum:search-bar', null)

  export { useQuSearchBar }

  /** Dev warning for a part rendered outside QuSearchBar: the part renders nothing. */
  export function orphan (part: string, context: QuSearchBarContext | null): void {
    if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <QuSearchBar>; it renders nothing`)
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuSearchBar' })

  defineSlots<{
    /** The suggestion list: `QuSearchBar.Item` rows, recent queries first, and an optional `QuSearchBar.Empty`. */
    default?: () => any
  }>()

  const {
    placeholder,
    voice = false,
    button = false,
    scrolled = false,
    disabled = false,
    id,
    namespace = 'quantum:search-bar:combobox',
  } = defineProps<QuSearchBarProps>()

  const emit = defineEmits<{
    /** The trimmed query: Enter, the Search button, or a chosen suggestion. */
    submit: [value: string]
    /** The microphone was pressed; speech capture is the app's. */
    voice: []
    /** The X emptied the field. */
    clear: []
  }>()

  const query = defineModel<string>({ default: '' })

  const locale = useLocale()

  const search = useSearch({
    query,
    namespace,
    id,
    disabled: () => disabled,
    onSubmit: value => emit('submit', value),
    onClear: () => emit('clear'),
  })

  const combobox = search.combobox

  // The field has focus, or focus moved from it to one of the sheet's actions:
  // the nav glyph is the up arrow. Focus landing on the glyph at rest (Tab into
  // the bar) leaves it the search glyph, which leads into the field.
  const focused = shallowRef(false)
  const empties = shallowRef(0)

  const label = toRef(() => placeholder ?? locale.ti('Quantum.search') ?? 'Search')
  const typing = toRef(() => combobox.query.value.trim() !== '')
  // Nothing to offer hides the sheet; an Empty part keeps it while something is typed.
  const bare = toRef(() => combobox.isEmpty.value && !(typing.value && empties.value > 0))
  // The suggestions are showing: open, with something to show.
  const open = toRef(() => combobox.isOpen.value && !bare.value)

  function track () {
    empties.value++

    return () => {
      empties.value--
    }
  }

  provideQuSearchBar({
    namespace: toRef(() => namespace),
    typing,
    submit: search.submit,
    track,
  })

  function sheet (): HTMLElement | null {
    const el = combobox.inputEl.value?.closest('[data-state]')

    return el instanceof HTMLElement ? el : null
  }

  function onFocusin (event: FocusEvent) {
    if (event.target === combobox.inputEl.value) focused.value = true
  }

  function onFocusout (event: FocusEvent) {
    const next = event.relatedTarget

    if (next instanceof Node && sheet()?.contains(next)) return

    focused.value = false
  }

  // The up arrow releases focus and dismisses the suggestions; at rest the glyph only leads into the field.
  function onNav () {
    if (!focused.value) {
      combobox.inputEl.value?.focus()
      return
    }

    search.release()

    const active = document.activeElement

    if (active instanceof HTMLElement && sheet()?.contains(active)) active.blur()
  }

  function onClear () {
    search.clear()
  }

  function onVoice () {
    emit('voice')
  }

  function onButton () {
    search.submit()
  }
</script>

<template>
  <form
    :aria-label="label"
    class="quantum-search-bar"
    :data-button="button || undefined"
    :data-disabled="disabled || undefined"
    :data-focused="focused || undefined"
    :data-open="open || undefined"
    :data-scrolled="scrolled || undefined"
    role="search"
    @submit.prevent
  >
    <Combobox.Activator
      class="quantum-search-bar__field"
      :namespace
      @focusin="onFocusin"
      @focusout="onFocusout"
    >
      <QuButton
        :aria-label="focused ? (locale.ti('Quantum.back') ?? 'Back') : label"
        class="quantum-search-bar__nav"
        :disabled
        :icon="focused ? 'arrow-back' : 'search'"
        @click="onNav"
        @mousedown.prevent
      />

      <Combobox.Control
        :aria-label="label"
        class="quantum-search-bar__input"
        :namespace
        :placeholder="label"
        @keydown="search.onKeydown"
      />

      <QuButton
        v-if="search.text.value !== ''"
        :aria-label="locale.ti('Quantum.clear') ?? 'Clear'"
        class="quantum-search-bar__clear"
        :disabled
        icon="close"
        @click="onClear"
        @mousedown.prevent
      />

      <QuButton
        v-if="voice"
        :aria-label="locale.ti('Quantum.voice') ?? 'Voice search'"
        class="quantum-search-bar__voice"
        :disabled
        icon="mic"
        @click="onVoice"
        @mousedown.prevent
      />
    </Combobox.Activator>

    <QuButton
      class="quantum-search-bar__button"
      :disabled
      variant="raised"
      @click="onButton"
    >
      {{ locale.ti('Quantum.search') ?? 'Search' }}
    </QuButton>

    <Combobox.Content
      class="quantum-search-bar__list"
      :data-empty="bare || undefined"
      :namespace
    >
      <slot />
    </Combobox.Content>
  </form>
</template>

<!-- Unscoped: the Combobox parts and QuButton render their own roots; a scoped data-v would miss them. -->
<style>
  /* The persistent search bar: the solo field's sheet, then the desktop Search button. */
  .quantum-search-bar {
    display: flex;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    box-sizing: border-box;
    min-width: 0;
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
  }

  /*
   * The inset box: QuTextField's solo sheet. 48 dp tall (the solo field
   * height), surface fill, 2 dp corners, 2 dp at rest and 3 dp scrolled
   * (elevation page, quick entry and search bar rows), each 2 dp lower under
   * a fine pointer (the desktop rule below). The 48 dp icon targets
   * sit 4 dp in, so their glyphs land on the 16 dp keylines.
   */
  .quantum-search-bar__field {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    box-sizing: border-box;
    min-width: 0;
    height: var(--quantum-touch-target, 48px);
    padding-inline: calc(var(--quantum-spacing-2, 16px) - (var(--quantum-touch-target, 48px) - var(--quantum-icon-size, 24px)) / 2);
    border-radius: var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    transition: box-shadow 280ms var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-search-bar[data-scrolled] .quantum-search-bar__field {
    box-shadow: var(--quantum-elevation-3, 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12));
  }

  /* Open: the field expands into the suggestion sheet below it, one card with square inner corners. */
  .quantum-search-bar[data-open] .quantum-search-bar__field {
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }

  /* The icon actions: system icons at the active 54% (100% white on dark), not the flat button's accent ink. */
  .quantum-search-bar__field > .quantum-button[data-variant] {
    flex: none;
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-search-bar__field > .quantum-button[data-disabled] {
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  /*
   * The query in Subheading 16 sp (the solo field's input text) on the 72 dp
   * text keyline the suggestion rows share: the nav target ends 52 dp in.
   * The 12 dp end padding puts the last character on the 16 dp keyline.
   */
  .quantum-search-bar__input {
    flex: 1 1 auto;
    box-sizing: border-box;
    min-width: 0;
    height: 100%;
    margin: 0;
    margin-inline-start: calc(72px - var(--quantum-spacing-2, 16px) - (var(--quantum-touch-target, 48px) + var(--quantum-icon-size, 24px)) / 2);
    padding: 0;
    padding-inline-end: calc(var(--quantum-spacing-2, 16px) - (var(--quantum-touch-target, 48px) - var(--quantum-icon-size, 24px)) / 2);
    border: 0;
    border-radius: 0;
    outline: none;
    background: transparent;
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font-family: inherit;
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    caret-color: var(--quantum-accent, #FF4081);
  }

  /* The caret marks focus in the inset box; no ring is drawn, not even a host's global one. */
  .quantum-search-bar__input:focus,
  .quantum-search-bar__input:focus-visible {
    outline: none;
  }

  .quantum-search-bar__input::placeholder {
    color: var(--quantum-text-hint, rgba(0, 0, 0, 0.38));
    opacity: 1;
  }

  .quantum-search-bar[data-disabled] .quantum-search-bar__input {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /* The desktop Search button: shown on request, and always under a fine pointer (mouse and keyboard). */
  .quantum-search-bar__button {
    display: none;
    flex: none;
  }

  .quantum-search-bar[data-button] .quantum-search-bar__button {
    display: inline-flex;
  }

  @media (pointer: fine) {
    .quantum-search-bar__button {
      display: inline-flex;
    }
  }

  /*
   * The suggestions: the lower half of the expanded card, as wide as the
   * field, under a divider. Its top shadow is clipped so it reads as one sheet
   * with the field.
   */
  .quantum-search-bar__list {
    box-sizing: border-box;
    width: anchor-size(width);
    max-height: calc(var(--quantum-touch-target, 48px) * 6 + var(--quantum-spacing-2, 16px));
    margin: 0;
    padding: var(--quantum-spacing-1, 8px) 0;
    border: 0;
    border-top: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
    border-radius: 0 0 var(--quantum-radius, 2px) var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    clip-path: inset(0 -16px -16px -16px);
    overflow-y: auto;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
  }

  .quantum-search-bar[data-scrolled] .quantum-search-bar__list {
    box-shadow: var(--quantum-elevation-3, 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12));
  }

  /*
   * Desktop (mouse and keyboard): every resting elevation sits 2 dp lower
   * (elevation page), so the closed bar rests at 0 dp, 1 dp scrolled. The open
   * sheet is not at rest: it overlaps the page like a menu and keeps 2 / 3 dp,
   * or the suggestions would float over content with no edge.
   */
  @media (pointer: fine) {
    .quantum-search-bar:not([data-open]) .quantum-search-bar__field {
      box-shadow: var(--quantum-elevation-0, none);
    }

    .quantum-search-bar[data-scrolled]:not([data-open]) .quantum-search-bar__field {
      box-shadow: var(--quantum-elevation-1, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12));
    }
  }

  /* Nothing to offer: no empty sheet. `display: none` only hides; it never shows a closed popover. */
  .quantum-search-bar__list[data-empty] {
    display: none;
  }

  /*
   * One suggestion: a 48 dp single-line row, the glyph on the 16 dp keyline
   * and the text on the 72 dp keyline (lists and navigation drawer pages), in
   * Subheading 16 sp like the query it completes.
   */
  .quantum-search-bar__item,
  .quantum-search-bar__empty {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: var(--quantum-touch-target, 48px);
    padding-inline: var(--quantum-spacing-2, 16px);
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
  }

  .quantum-search-bar__item {
    cursor: pointer;
    user-select: none;
  }

  .quantum-search-bar__icon {
    position: relative;
    display: inline-flex;
    flex: none;
    margin-inline-end: calc(72px - var(--quantum-spacing-2, 16px) - var(--quantum-icon-size, 24px));
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-search-bar__text {
    position: relative;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* The keyboard cursor and the pointer share the 6% hover overlay (lead decision 3). */
  .quantum-search-bar__item:hover,
  .quantum-search-bar__item[data-highlighted] {
    background: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  .quantum-search-bar__item[data-disabled] {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
    cursor: default;
  }

  .quantum-search-bar__item[data-disabled] .quantum-search-bar__icon {
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  .quantum-search-bar__item[data-disabled]:hover {
    background: none;
  }

  /* The no-match row: secondary ink on the text keyline, not a choice. */
  .quantum-search-bar__empty {
    padding-inline-start: 72px;
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
