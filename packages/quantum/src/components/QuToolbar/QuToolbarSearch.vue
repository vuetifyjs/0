<script lang="ts">
  // Framework
  import { Combobox, IN_BROWSER, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useQuToolbar } from './QuToolbar.vue'

  // Composables
  import { useSearch } from '../../composables/useSearch'

  // Utilities
  import { nextTick, onBeforeUnmount, toRef, watch } from 'vue'

  // Components
  import QuButton from '../QuButton/QuButton.vue'
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  export interface QuToolbarSearchProps {
    /** Field placeholder. Defaults to the locale's "Search". */
    placeholder?: string
    /** Show the microphone action: voice search is supported (search page). */
    voice?: boolean
    /** Recent queries, offered before the query is complete with the history glyph. */
    history?: readonly string[]
    /** Completions matching the app's data, offered while the user types with the search glyph. */
    suggestions?: readonly string[]
    /** Context key of the combobox the field and the list share. */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuToolbarSearch' })

  defineSlots<{
    /** Extra rows at the end of the suggestion list, as v0 `Combobox.Item`s. */
    default?: () => any
  }>()

  const {
    placeholder,
    voice = false,
    history = [],
    suggestions = [],
    namespace = 'quantum:toolbar:search',
  } = defineProps<QuToolbarSearchProps>()

  const emit = defineEmits<{
    submit: [value: string]
    voice: []
    clear: []
  }>()

  const query = defineModel<string>({ default: '' })
  const open = defineModel<boolean>('open', { default: false })

  const context = useQuToolbar()

  orphan('QuToolbarSearch', context)

  const locale = useLocale()

  const search = useSearch({
    query,
    namespace,
    onSubmit: value => emit('submit', value),
    onClear: () => emit('clear'),
  })

  const combobox = search.combobox

  const label = toRef(() => placeholder ?? locale.ti('Quantum.search') ?? 'Search')
  const typing = toRef(() => combobox.query.value.trim() !== '')

  // Search mode replaces the row; the element that opened it gets focus back on close.
  let release: (() => void) | undefined
  let previous: HTMLElement | null = null

  watch(open, async value => {
    if (value) {
      release ??= context?.search()
      previous = IN_BROWSER && document.activeElement instanceof HTMLElement ? document.activeElement : null

      await nextTick()
      combobox.inputEl.value?.focus()
      return
    }

    release?.()
    release = undefined
    combobox.close()

    await nextTick()
    previous?.focus()
    previous = null
  }, { immediate: true })

  onBeforeUnmount(() => release?.())

  function onBack () {
    open.value = false
  }

  function onClear () {
    search.clear()
  }

  function onVoice () {
    emit('voice')
  }

  // Escape closes the suggestions first (v0 handles it), then the search itself.
  function onKeydown (event: KeyboardEvent) {
    if (event.key === 'Escape' && !event.defaultPrevented) {
      event.preventDefault()
      open.value = false
      return
    }

    search.onKeydown(event)
  }

  function onPick () {
    search.submit()
  }
</script>

<template>
  <form
    v-if="open"
    :aria-label="label"
    class="quantum-toolbar__search"
    role="search"
    @submit.prevent
  >
    <QuButton
      :aria-label="locale.ti('Quantum.back') ?? 'Back'"
      class="quantum-toolbar__back"
      icon="arrow-back"
      @click="onBack"
    />

    <Combobox.Activator class="quantum-toolbar__field" :namespace>
      <Combobox.Control
        :aria-label="label"
        class="quantum-toolbar__input"
        :namespace
        :placeholder="label"
        @keydown="onKeydown"
      />
    </Combobox.Activator>

    <QuButton
      v-if="search.text.value !== ''"
      :aria-label="locale.ti('Quantum.clear') ?? 'Clear'"
      class="quantum-toolbar__clear"
      icon="close"
      @click="onClear"
    />

    <QuButton
      v-if="voice"
      :aria-label="locale.ti('Quantum.voice') ?? 'Voice search'"
      class="quantum-toolbar__voice"
      icon="mic"
      @click="onVoice"
    />

    <Combobox.Content
      class="quantum-toolbar__suggestions"
      :data-empty="combobox.isEmpty.value || undefined"
      :namespace
    >
      <Combobox.Item
        v-for="value in history"
        :key="`history:${value}`"
        class="quantum-toolbar__suggestion"
        :namespace
        :value
        @click="onPick"
      >
        <QuRipple />

        <QuIcon name="history" />

        <span class="quantum-toolbar__suggestion-text">{{ value }}</span>
      </Combobox.Item>

      <template v-if="typing">
        <Combobox.Item
          v-for="value in suggestions"
          :key="`completion:${value}`"
          class="quantum-toolbar__suggestion"
          :namespace
          :value
          @click="onPick"
        >
          <QuRipple />

          <QuIcon name="search" />

          <span class="quantum-toolbar__suggestion-text">{{ value }}</span>
        </Combobox.Item>
      </template>

      <slot />
    </Combobox.Content>
  </form>
</template>

<style>
  /* The toolbar transforms into a search field: up arrow, field, clear and voice actions (search page). */
  .quantum-toolbar__search {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    align-self: stretch;
    min-width: 0;
    margin: 0;
  }

  .quantum-toolbar__field {
    display: flex;
    flex: 1 1 auto;
    align-self: stretch;
    min-width: 0;
    margin-inline-start: calc(var(--quantum-keyline-content, 72px) - var(--quantum-keyline-margin, 16px) - 36px);
  }

  @media (min-width: 600px) {
    .quantum-toolbar__field {
      margin-inline-start: calc(var(--quantum-keyline-content, 80px) - var(--quantum-keyline-margin, 24px) - 36px);
    }
  }

  /* Dense: the up arrow's target is 40 dp, so the field keeps the keyline with 4 dp less to subtract. */
  .quantum-toolbar[data-dense] .quantum-toolbar__field {
    margin-inline-start: calc(var(--quantum-keyline-content, 72px) - var(--quantum-keyline-margin, 16px) - 32px);
  }

  @media (min-width: 600px) {
    .quantum-toolbar[data-dense] .quantum-toolbar__field {
      margin-inline-start: calc(var(--quantum-keyline-content, 80px) - var(--quantum-keyline-margin, 24px) - 32px);
    }
  }

  /*
   * The query in Subheading 16 sp: the search page states no type, Vuetify 1.5
   * sets its fields at 16 px. The field fills the row so the list opens under the bar.
   */
  .quantum-toolbar__input {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    caret-color: currentcolor;
  }

  /*
   * The search mode is the focus state: the field fills the bar and the caret
   * marks it, so no ring is drawn, not even a host's global focus ring.
   */
  .quantum-toolbar__input:focus,
  .quantum-toolbar__input:focus-visible {
    outline: none;
  }

  .quantum-toolbar__input::placeholder {
    color: var(--quantum-text-hint, rgba(0, 0, 0, 0.38));
    opacity: 1;
  }

  /* On a coloured bar the hint is white at the dark theme's secondary 70%. */
  .quantum-toolbar[data-variant='primary'] .quantum-toolbar__input::placeholder {
    color: color-mix(in srgb, var(--quantum-on-primary, #FFFFFF) 70%, transparent);
  }

  /*
   * Suggestions under the bar: a surface sheet of 48 dp rows, the glyph on the
   * 16 dp keyline and the text on the 72 dp keyline (lists and navigation drawer pages).
   */
  .quantum-toolbar__suggestions {
    box-sizing: border-box;
    width: anchor-size(width);
    max-height: calc(var(--quantum-touch-target, 48px) * 6 + var(--quantum-spacing-2, 16px));
    padding: var(--quantum-spacing-1, 8px) 0;
    border: 0;
    border-radius: 0 0 var(--quantum-radius, 2px) var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    box-shadow: var(--quantum-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
    overflow-y: auto;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
  }

  /* Nothing to offer: no empty sheet. `display: none` only hides; it never shows a closed popover. */
  .quantum-toolbar__suggestions[data-empty] {
    display: none;
  }

  .quantum-toolbar__suggestion {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: var(--quantum-touch-target, 48px);
    padding-inline: var(--quantum-keyline-margin, 16px);
    cursor: pointer;
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
  }

  .quantum-toolbar__suggestion > .quantum-icon {
    margin-inline-end: calc(var(--quantum-keyline-content, 72px) - var(--quantum-keyline-margin, 16px) - var(--quantum-icon-size, 24px));
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-toolbar__suggestion-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* The keyboard cursor and the pointer share the 6% hover overlay (lead decision 3). */
  .quantum-toolbar__suggestion:hover,
  .quantum-toolbar__suggestion[data-highlighted] {
    background: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }
</style>
