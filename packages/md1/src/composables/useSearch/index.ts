/**
 * @module useSearch
 *
 * @see https://0.vuetifyjs.com/systems/md1/toolbar
 *
 * @remarks
 * The search core shared by `Md1Toolbar.Search` (expandable search) and
 * `Md1SearchBar` (persistent search), the one Combobox core of SPEC.md lead
 * decision 5. It creates a v0 combobox, provides it to the `Combobox.*` parts
 * the component renders, and adds the MD1 search pattern on top:
 *
 * - The query is the text in the field, kept in sync with a `v-model`
 * - Enter submits the query, as does choosing a suggestion (search page)
 * - Clear empties the field; release closes the suggestions and drops focus,
 *   the way results show with the search field visible but not focused
 *
 * The composable binds no DOM events: the component binds `onKeydown` on the
 * `Combobox.Control`, after v0's own handler, and calls `submit` from a
 * suggestion's click.
 *
 * @example
 * ```ts
 * import { useSearch } from '@paper/md1'
 *
 * const query = defineModel<string>({ default: '' })
 * const search = useSearch({ query, onSubmit: value => emit('submit', value) })
 * ```
 */

// Framework
import { createCombobox, isString, provideComboboxRoot } from '@vuetify/v0'

// Utilities
import { shallowRef, toRef, watch } from 'vue'

// Types
import type { ComboboxRootContext } from '@vuetify/v0'
import type { MaybeRefOrGetter, Ref } from 'vue'

export interface SearchOptions {
  /** The query model: the text the field shows. */
  query?: Ref<string | undefined>
  /** Context key the `Combobox.*` parts read. */
  namespace?: string
  /** Root id; the input is `${id}-input` and the suggestion list `${id}-listbox`. */
  id?: string
  disabled?: MaybeRefOrGetter<boolean>
  /** Called with the trimmed query on Enter or a chosen suggestion. */
  onSubmit?: (value: string) => void
  /** Called after the field is cleared. */
  onClear?: () => void
}

export interface SearchContext {
  /** The v0 combobox the `Combobox.*` parts render against. */
  combobox: ComboboxRootContext
  /** The text the field shows. */
  text: Readonly<Ref<string>>
  /** Reports the query through `onSubmit` and releases the field. */
  submit: () => void
  /** Empties the field and the selection, keeps focus in the field. */
  clear: () => void
  /** Closes the suggestions and moves focus out of the field. */
  release: () => void
  /** Bind on `Combobox.Control` as a listener: Enter submits after v0 has selected or committed. */
  onKeydown: (event: KeyboardEvent) => void
}

export function useSearch (options: SearchOptions = {}): SearchContext {
  const {
    query,
    namespace = 'v0:combobox',
    id,
    disabled = false,
    onSubmit,
    onClear,
  } = options

  const combobox = createCombobox({ id, disabled, strict: false, multiple: false })
  const context: ComboboxRootContext = { ...combobox, listEl: shallowRef<HTMLElement | null>(null) }

  provideComboboxRoot(namespace, context)

  const text = toRef(() => combobox.display.value)

  function write (value: string) {
    if (value === '') {
      combobox.clear()
      return
    }

    combobox.query.value = value
    combobox.pristine.value = false
  }

  if (isString(query?.value) && query.value !== '') write(query.value)

  watch(text, value => {
    if (query && query.value !== value) query.value = value
  })

  watch(() => query?.value, value => {
    if (isString(value) && value !== text.value) write(value)
  })

  function release () {
    combobox.close()
    combobox.inputEl.value?.blur()
  }

  function submit () {
    const value = text.value.trim()

    if (value === '') return

    onSubmit?.(value)
    release()

    // The field keeps the submitted text as typed text, not as a reference to
    // a suggestion row the list may unmount once the query changes.
    write(value)
  }

  function clear () {
    combobox.clear()
    combobox.inputEl.value?.focus()
    onClear?.()
  }

  function onKeydown (event: KeyboardEvent) {
    if (event.key !== 'Enter' || event.isComposing) return

    // v0 already selected the highlighted suggestion or committed the text
    // while the list was open; with the list closed the text is committed here.
    if (!event.defaultPrevented) {
      event.preventDefault()
      combobox.commit()
    }

    submit()
  }

  return {
    combobox: context,
    text,
    submit,
    clear,
    release,
    onKeydown,
  }
}
