<script lang="ts">
  // Framework
  import { createSelection, isElement, isUndefined, useId, useLocale } from '@vuetify/v0'

  // Utilities
  import { nextTick, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  export interface BChipsItem {
    value: string
    text: string
    /** Renders `img.chip-img` when set. */
    src?: string
    /** Renders `span.chip-icon` with the pin glyph. */
    icon?: boolean
  }

  export interface BChipsProps {
    /**
     * `true` renders `div.chip-input` and treats `v-model` as the chip list.
     * `false` renders one `span.chip` per item and selects through `createSelection`.
     */
    input?: boolean
    /** Choice-face chips. Ignored on the input face. */
    items?: BChipsItem[]
    placeholder?: string
    /** Input-face commit character. Enter always commits. */
    separator?: string
    /**
     * Shows `button.chip-dismiss`. Defaults to on for the input face and off
     * for the choice face.
     */
    dismissible?: boolean
    /** Adds `theme-{theme}` on the input root, or on each choice chip. */
    theme?: string
    /** `label.chip-input-label`, input face only. */
    label?: string
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BChips', inheritAttrs: false })

  const emit = defineEmits<{
    'update:model-value': [value: string[]]
    'dismiss': [value: string]
  }>()

  const {
    input = false,
    items = [],
    placeholder = '',
    separator = ',',
    // Absent boolean props resolve to false. Keep unset distinct so the
    // input face can default the dismiss button on.
    dismissible = undefined,
    theme,
    label,
    disabled = false,
  } = defineProps<BChipsProps>()

  const model = defineModel<string[]>({ default: () => [] })
  const attrs = useAttrs()
  const locale = useLocale()
  const draft = shallowRef('')
  const selected = shallowRef<string[]>([])
  const anchor = shallowRef<string | undefined>(undefined)
  const uid = useId()
  const rootRef = useTemplateRef<HTMLElement>('root')
  const selection = createSelection({ multiple: true })

  const showDismiss = toRef(() => isUndefined(dismissible) ? input : dismissible)

  const removeLabel = toRef(() => locale.ti('Chips.remove') ?? 'Remove')

  const themeClass = toRef(() => {
    if (isUndefined(theme) || theme === '') return undefined
    return `theme-${theme}`
  })

  const picked = toRef(() => {
    const ids = new Set<string>()
    for (const id of selection.selectedIds) ids.add(String(id))
    return ids
  })

  const marked = toRef(() => new Set(selected.value))

  function syncChoice () {
    const next = new Set(items.map(item => item.value))
    for (const id of selection.keys()) {
      if (!next.has(String(id))) selection.unregister(id)
    }
    for (const item of items) {
      if (!selection.has(item.value)) selection.register({ id: item.value, value: item.value })
    }
  }

  function applySelection () {
    if (input) return
    const wanted = new Set(model.value)
    for (const id of selection.selectedIds) {
      if (!wanted.has(String(id))) selection.unselect(id)
    }
    for (const id of wanted) {
      if (selection.has(id) && !selection.selectedIds.has(id)) selection.select(id)
    }
  }

  function choiceKey () {
    return `${input}:${items.map(item => item.value).join('\0')}`
  }

  watch(choiceKey, () => {
    if (input) return
    syncChoice()
    applySelection()
  }, { immediate: true })

  watch(() => model.value.join('\0'), () => {
    if (!input) {
      applySelection()
      return
    }
    const live = new Set(model.value)
    const next = selected.value.filter(id => live.has(id))
    if (next.length !== selected.value.length) selected.value = next
    if (!isUndefined(anchor.value) && !live.has(anchor.value)) anchor.value = undefined
  })

  function onChoice (id: string) {
    if (disabled || input) return
    selection.toggle(id)
    model.value = [...selection.selectedValues.value].map(String)
  }

  function onChoiceKeydown (event: KeyboardEvent, id: string) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onChoice(id)
  }

  function onDismiss (id: string) {
    if (disabled) return
    if (!input && selection.selectedIds.has(id)) selection.unselect(id)
    model.value = model.value.filter(item => item !== id)
    selected.value = selected.value.filter(item => item !== id)
    if (anchor.value === id) anchor.value = undefined
    emit('dismiss', id)
    if (input) void nextTick(focusInput)
  }

  function commit (raw: string) {
    const parts = separator === '' ? [raw.trim()] : raw.split(separator).map(part => part.trim())
    const next = [...model.value]
    for (const part of parts) {
      if (part === '' || next.includes(part)) continue
      next.push(part)
    }
    if (next.length !== model.value.length) model.value = next
    draft.value = ''
  }

  function fieldOf (event: Event) {
    const target = event.target
    if (!isElement(target)) return undefined
    return target as HTMLInputElement
  }

  function focusInput () {
    const field = rootRef.value?.querySelector('.form-ghost')
    if (!isElement(field)) return
    ;(field as HTMLElement).focus()
  }

  function focusChip (index: number) {
    const chip = rootRef.value?.querySelectorAll(':scope > .chip')[index]
    if (!isElement(chip)) return
    ;(chip as HTMLElement).focus()
  }

  function selectOnly (id: string) {
    selected.value = [id]
    anchor.value = id
  }

  function rangeSelect (from: string, to: string, add: boolean) {
    const list = model.value
    const start = list.indexOf(from)
    const end = list.indexOf(to)
    if (start === -1 || end === -1) return
    const low = Math.min(start, end)
    const high = Math.max(start, end)
    const range = list.slice(low, high + 1)
    selected.value = add ? [...new Set([...selected.value, ...range])] : range
  }

  function onChipClick (event: MouseEvent, id: string) {
    if (disabled) return
    const target = event.target
    if (isElement(target) && !isUndefined(target.closest('.chip-dismiss'))) return
    if (event.shiftKey && !isUndefined(anchor.value)) {
      rangeSelect(anchor.value, id, event.metaKey || event.ctrlKey)
    } else if (event.metaKey || event.ctrlKey) {
      const next = selected.value.filter(item => item !== id)
      selected.value = next.length === selected.value.length ? [...next, id] : next
      anchor.value = id
    } else {
      selectOnly(id)
    }
    const current = event.currentTarget
    if (isElement(current)) (current as HTMLElement).focus()
  }

  function onRootClick (event: MouseEvent) {
    if (event.target !== event.currentTarget) return
    selected.value = []
    anchor.value = undefined
    focusInput()
  }

  function removeSelected (index: number) {
    const doomed = selected.value.length > 0 ? [...selected.value] : [model.value[index]]
    const drop = new Set(doomed.filter(id => !isUndefined(id)))
    if (drop.size === 0) return
    const nextIndex = Math.min(index, model.value.length - drop.size - 1)
    model.value = model.value.filter(item => !drop.has(item))
    for (const id of drop) emit('dismiss', id)
    selected.value = []
    void nextTick(() => {
      const remain = model.value
      if (remain.length === 0) {
        anchor.value = undefined
        focusInput()
        return
      }
      const focusIndex = Math.max(0, Math.min(nextIndex, remain.length - 1))
      selectOnly(remain[focusIndex])
      focusChip(focusIndex)
    })
  }

  function moveChip (index: number, direction: number, shift: boolean) {
    const list = model.value
    const target = index + direction
    if (direction > 0 && target >= list.length) {
      selected.value = []
      anchor.value = undefined
      focusInput()
      return
    }
    if (target < 0 || target >= list.length) return
    const id = list[target]
    if (shift && !isUndefined(anchor.value)) rangeSelect(anchor.value, id, true)
    else selectOnly(id)
    focusChip(target)
  }

  function onChipKeydown (event: KeyboardEvent, index: number) {
    if (disabled) return
    const list = model.value
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      removeSelected(index)
      return
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveChip(index, -1, event.shiftKey)
      return
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveChip(index, 1, event.shiftKey)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      if (list.length === 0) return
      if (event.shiftKey && !isUndefined(anchor.value)) rangeSelect(anchor.value, list[0], true)
      else selectOnly(list[0])
      focusChip(0)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      if (list.length === 0) return
      const last = list.at(-1)
      if (isUndefined(last)) return
      if (event.shiftKey && !isUndefined(anchor.value)) rangeSelect(anchor.value, last, true)
      else selectOnly(last)
      focusChip(list.length - 1)
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      selected.value = []
      anchor.value = undefined
      focusInput()
      return
    }
    if ((event.metaKey || event.ctrlKey) && event.key === 'a') {
      event.preventDefault()
      selected.value = [...list]
    }
  }

  function onInput (event: Event) {
    const field = fieldOf(event)
    if (isUndefined(field)) return
    if (separator !== '' && field.value.includes(separator)) {
      commit(field.value)
      field.value = ''
      return
    }
    draft.value = field.value
  }

  function onPaste (event: ClipboardEvent) {
    if (separator === '') return
    const pasted = event.clipboardData?.getData('text') ?? ''
    if (!pasted.includes(separator)) return
    event.preventDefault()
    commit(pasted)
  }

  function onBlur (event: FocusEvent) {
    const next = event.relatedTarget
    if (isElement(next) && !isUndefined(next.closest('.chip'))) return
    const field = fieldOf(event)
    if (isUndefined(field)) return
    commit(field.value)
    field.value = ''
  }

  function onFocus () {
    selected.value = []
    anchor.value = undefined
  }

  function onKeydown (event: KeyboardEvent) {
    if (disabled) return
    const field = fieldOf(event)
    if (isUndefined(field)) return
    const separatorKey = separator.length === 1 && event.key === separator
    if (event.key === 'Enter' || separatorKey) {
      event.preventDefault()
      commit(field.value)
      field.value = ''
      return
    }
    if ((event.key === 'Backspace' || event.key === 'Delete') && field.value === '') {
      event.preventDefault()
      const last = model.value.at(-1)
      if (isUndefined(last)) return
      selectOnly(last)
      focusChip(model.value.length - 1)
      return
    }
    if (event.key === 'ArrowLeft' && field.selectionStart === 0 && field.selectionEnd === 0) {
      event.preventDefault()
      const last = model.value.at(-1)
      if (isUndefined(last)) return
      if (event.shiftKey) {
        if (!selected.value.includes(last)) selected.value = [...selected.value, last]
        anchor.value = anchor.value ?? last
      } else {
        selectOnly(last)
      }
      focusChip(model.value.length - 1)
      return
    }
    if (event.key === 'Escape') {
      field.value = ''
      draft.value = ''
      selected.value = []
      anchor.value = undefined
      field.blur()
    }
  }
</script>

<template>
  <div
    v-if="input"
    ref="root"
    v-bind="attrs"
    class="chip-input"
    :class="themeClass"
    @click="onRootClick"
  >
    <label
      v-if="!isUndefined(label) && label !== ''"
      class="chip-input-label"
      :for="uid"
    >{{ label }}</label>

    <span
      v-for="(chip, index) in model"
      :key="chip"
      class="chip"
      :class="{ active: marked.has(chip) }"
      :tabindex="disabled ? -1 : 0"
      @click="onChipClick($event, chip)"
      @keydown="onChipKeydown($event, index)"
    >
      {{ chip }}
      <button
        v-if="showDismiss"
        :aria-label="removeLabel"
        class="chip-dismiss"
        :disabled="disabled || undefined"
        tabindex="-1"
        type="button"
        @click.stop="onDismiss(chip)"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="16"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="2"
          viewBox="0 0 16 16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        ><line x1="4" x2="12" y1="4" y2="12" /><line x1="12" x2="4" y1="4" y2="12" /></svg>
      </button>
    </span>

    <input
      :id="uid"
      class="form-ghost"
      :disabled="disabled || undefined"
      :placeholder
      type="text"
      :value="draft"
      @blur="onBlur"
      @focus="onFocus"
      @input="onInput"
      @keydown="onKeydown"
      @paste="onPaste"
    >
  </div>

  <template v-else>
    <span
      v-for="item in items"
      :key="item.value"
      :aria-disabled="disabled || undefined"
      :aria-pressed="picked.has(item.value)"
      class="chip"
      :class="[attrs.class, themeClass, { active: picked.has(item.value), disabled }]"
      role="button"
      :tabindex="disabled ? -1 : 0"
      @click="onChoice(item.value)"
      @keydown="onChoiceKeydown($event, item.value)"
    >
      <img
        v-if="!isUndefined(item.src)"
        alt=""
        class="chip-img"
        height="16"
        :src="item.src"
        width="16"
      >

      <span v-if="item.icon" class="chip-icon">
        <svg
          aria-hidden="true"
          fill="currentColor"
          height="16"
          viewBox="0 0 16 16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        ><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" /></svg>
      </span>
      {{ item.text }}
      <button
        v-if="showDismiss"
        :aria-label="removeLabel"
        class="chip-dismiss"
        :disabled="disabled || undefined"
        tabindex="-1"
        type="button"
        @click.stop="onDismiss(item.value)"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="16"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="2"
          viewBox="0 0 16 16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        ><line x1="4" x2="12" y1="4" y2="12" /><line x1="12" x2="4" y1="4" y2="12" /></svg>
      </button>
    </span>
  </template>
</template>
